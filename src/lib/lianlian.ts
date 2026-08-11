import crypto from "crypto";
import https from "https";
import { URL } from "url";

const GATEWAY = {
  sandbox: "https://sandbox-th.lianlianpay-inc.com/gateway",
  production: "https://api.lianlianpay.co.th/gateway",
} as const;

/** Sandbox มักช้าจากไทย — undici fetch default connect timeout ~10s ไม่พอ */
const GATEWAY_TIMEOUT_MS = 90_000;

export const LIANLIAN_SUCCESS_CODE = 200000;

/** Payment status from LianLian docs */
export const LIANLIAN_STATUS = {
  PI: "Initialized",
  WP: "Waiting for Payment",
  PS: "Payment Success",
  PF: "Payment Failed",
  PE: "Payment Expired",
} as const;

export type LianlianOrderStatus = keyof typeof LIANLIAN_STATUS;

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

function wrapPem(body: string, type: "PUBLIC KEY" | "PRIVATE KEY" | "RSA PRIVATE KEY"): string {
  const cleaned = body.replace(/-----BEGIN[\s\S]+?-----/g, "").replace(/-----END[\s\S]+?-----/g, "").replace(/\s+/g, "");
  const lines = cleaned.match(/.{1,64}/g) ?? [];
  return `-----BEGIN ${type}-----\n${lines.join("\n")}\n-----END ${type}-----`;
}

/** Accept PEM or raw base64 (as shown in LianLian docs / merchant portal). */
export function normalizePrivateKey(raw: string): string {
  const key = raw.replace(/\\n/g, "\n").trim();
  if (key.includes("BEGIN")) return key;
  // PKCS#8 usually starts with MIIE / MIIEv; PKCS#1 with MIIEog / MIIEpA
  return wrapPem(key, "PRIVATE KEY");
}

export function normalizePublicKey(raw: string): string {
  const key = raw.replace(/\\n/g, "\n").trim();
  if (key.includes("BEGIN")) return key;
  return wrapPem(key, "PUBLIC KEY");
}

/**
 * Build LianLian signature source string (SHA1withRSA).
 * Nested objects/arrays are expanded depth-first with keys sorted at each level.
 * @see https://doc.lianlianpay.co.th/docs/signature
 */
export function buildSignString(payload: JsonValue): string {
  const parts: string[] = [];

  function flatten(value: JsonValue): void {
    if (value === null || value === undefined) return;

    if (Array.isArray(value)) {
      for (const item of value) flatten(item);
      return;
    }

    if (typeof value === "object") {
      for (const key of Object.keys(value).sort()) {
        const child = value[key];
        if (child !== null && typeof child === "object") {
          flatten(child);
        } else if (child !== undefined && child !== null && child !== "") {
          parts.push(`${key}=${String(child)}`);
        }
      }
    }
  }

  flatten(payload);
  return parts.join("&");
}

export function lianlianSign(payload: JsonValue, privateKey: string): string {
  const signString = buildSignString(payload);
  const signer = crypto.createSign("RSA-SHA1");
  signer.update(signString, "utf8");
  return signer.sign(normalizePrivateKey(privateKey), "base64");
}

export function lianlianVerify(
  payload: JsonValue,
  signature: string,
  publicKey: string,
): boolean {
  if (!signature || !publicKey) return false;
  try {
    const signString = buildSignString(payload);
    const verifier = crypto.createVerify("RSA-SHA1");
    verifier.update(signString, "utf8");
    return verifier.verify(normalizePublicKey(publicKey), signature, "base64");
  } catch {
    return false;
  }
}

export function generateLianlianOrderId(): string {
  return `MTP${Date.now()}${crypto.randomBytes(3).toString("hex")}`;
}

export function formatOrderAmount(baht: number): string {
  return baht.toFixed(2);
}

export type LianlianCustomer = {
  merchant_user_id: string;
  full_name: string;
  email?: string;
  phone?: string;
};

export type LianlianProduct = {
  name: string;
  description?: string;
  quantity: string;
  unit_price: string;
  product_id?: string;
  show_url?: string;
};

export type LianlianCheckoutRequest = {
  version: "v1";
  service: "llpth.checkout.apply";
  merchant_id: string;
  store_id?: string;
  merchant_order_id: string;
  order_amount: string;
  order_currency: "THB";
  order_desc: string;
  product_code?: string;
  payment_method?: string;
  customer: LianlianCustomer;
  products?: LianlianProduct[];
  notify_url: string;
  redirect_url: string;
  cancel_url?: string;
};

export type LianlianApiResponse<T> = {
  code: number;
  message: string;
  data?: T;
  trace_id?: string;
};

export type LianlianCheckoutData = {
  merchant_id: string;
  merchant_order_id: string;
  order_id: string;
  order_status: LianlianOrderStatus | string;
  order_amount: string;
  order_currency: string;
  create_time: string;
  link_url: string;
};

export type LianlianNotifyPayload = {
  merchant_id: string;
  order_id: string;
  merchant_order_id: string;
  order_status: LianlianOrderStatus | string;
  order_amount: string;
  order_currency: string;
  complete_time: string;
};

export function getLianlianConfig() {
  const env = (process.env.LIANLIAN_ENV ?? "sandbox").toLowerCase() === "production"
    ? "production"
    : "sandbox";

  return {
    env,
    gatewayUrl: GATEWAY[env],
    merchantId: process.env.LIANLIAN_MERCHANT_ID?.trim() ?? "",
    storeId: process.env.LIANLIAN_STORE_ID?.trim() ?? "",
    privateKey: process.env.LIANLIAN_PRIVATE_KEY ?? "",
    /** LianLian platform public key — download from merchant portal */
    lianlianPublicKey: process.env.LIANLIAN_PUBLIC_KEY ?? "",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    productCode: process.env.LIANLIAN_PRODUCT_CODE?.trim() || undefined,
    paymentMethod: process.env.LIANLIAN_PAYMENT_METHOD?.trim() || undefined,
  };
}

export function isLianlianConfigured(): boolean {
  const { merchantId, privateKey } = getLianlianConfig();
  return Boolean(merchantId && privateKey);
}

type GatewayHttpResponse = {
  status: number;
  text: string;
};

function requestGateway(
  method: "GET" | "POST",
  gatewayUrl: string,
  headers: Record<string, string>,
  bodyJson?: string,
  timeoutMs = GATEWAY_TIMEOUT_MS,
): Promise<GatewayHttpResponse> {
  const url = new URL(gatewayUrl);
  const body = bodyJson ? Buffer.from(bodyJson, "utf8") : undefined;

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || 443,
        path: `${url.pathname}${url.search}`,
        method,
        headers: {
          ...headers,
          ...(body ? { "Content-Length": body.byteLength } : {}),
        },
        timeout: timeoutMs,
        servername: url.hostname,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => {
          resolve({
            status: res.statusCode ?? 0,
            text: Buffer.concat(chunks).toString("utf8"),
          });
        });
      },
    );

    req.on("timeout", () => {
      req.destroy(
        Object.assign(new Error(`LianLian gateway timeout after ${timeoutMs}ms`), {
          code: "LIANLIAN_TIMEOUT",
        }),
      );
    });
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

async function callGateway<T>(
  method: "GET" | "POST",
  bodyOrQuery: JsonObject,
  privateKey: string,
  gatewayUrl: string,
): Promise<LianlianApiResponse<T>> {
  const sign = lianlianSign(bodyOrQuery, privateKey);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "sign-type": "RSA",
    sign,
  };

  let requestUrl = gatewayUrl;
  let bodyJson: string | undefined;

  if (method === "GET") {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(bodyOrQuery)) {
      if (value !== undefined && value !== null && value !== "") {
        qs.set(key, String(value));
      }
    }
    requestUrl = `${gatewayUrl}?${qs.toString()}`;
  } else {
    bodyJson = JSON.stringify(bodyOrQuery);
  }

  let response: GatewayHttpResponse;
  try {
    response = await requestGateway(method, requestUrl, headers, bodyJson);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    console.error("[lianlian/gateway] network error", {
      url: requestUrl,
      code: err.code,
      message: err.message,
    });
    return {
      code: -1,
      message:
        err.code === "LIANLIAN_TIMEOUT" || err.code === "ETIMEDOUT"
          ? "เชื่อมต่อ LianLian ช้า/หมดเวลา — กรุณาลองใหม่อีกครั้ง"
          : `เชื่อมต่อ LianLian ไม่สำเร็จ (${err.code ?? err.message})`,
    };
  }

  try {
    return JSON.parse(response.text) as LianlianApiResponse<T>;
  } catch {
    console.error("[lianlian/gateway] response (non-JSON)", {
      httpStatus: response.status,
      body: response.text,
    });
    return {
      code: -1,
      message: `LianLian ตอบกลับไม่ใช่ JSON (HTTP ${response.status})`,
    };
  }
}

export async function createLianlianCheckout(
  params: Omit<LianlianCheckoutRequest, "version" | "service" | "merchant_id" | "order_currency"> & {
    merchant_id?: string;
  },
): Promise<LianlianApiResponse<LianlianCheckoutData>> {
  const config = getLianlianConfig();
  if (!config.merchantId || !config.privateKey) {
    throw new Error("LianLian credentials are not configured");
  }

  const payload: LianlianCheckoutRequest = {
    version: "v1",
    service: "llpth.checkout.apply",
    merchant_id: params.merchant_id ?? config.merchantId,
    order_currency: "THB",
    ...params,
  };

  if (config.storeId && !payload.store_id) {
    payload.store_id = config.storeId;
  }
  if (config.productCode && !payload.product_code) {
    payload.product_code = config.productCode;
  }
  if (config.paymentMethod && !payload.payment_method) {
    payload.payment_method = config.paymentMethod;
  }

  // Remove empty optional fields so they are not signed
  const cleaned = JSON.parse(JSON.stringify(payload)) as LianlianCheckoutRequest;
  if (!cleaned.store_id) delete cleaned.store_id;
  if (!cleaned.product_code) delete cleaned.product_code;
  if (!cleaned.payment_method) delete cleaned.payment_method;
  if (!cleaned.cancel_url) delete cleaned.cancel_url;

  return callGateway<LianlianCheckoutData>(
    "POST",
    cleaned as unknown as JsonObject,
    config.privateKey,
    config.gatewayUrl,
  );
}

export async function queryLianlianPayment(
  merchantOrderId: string,
): Promise<LianlianApiResponse<Record<string, unknown>>> {
  const config = getLianlianConfig();
  if (!config.merchantId || !config.privateKey) {
    throw new Error("LianLian credentials are not configured");
  }

  return callGateway(
    "GET",
    {
      version: "v1",
      service: "llpth.payment.query",
      merchant_id: config.merchantId,
      merchant_order_id: merchantOrderId,
    },
    config.privateKey,
    config.gatewayUrl,
  );
}

/** Format Thai phone for LianLian: +66-8xxxxxxxx */
export function formatLianlianPhone(phone: string): string | undefined {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return undefined;
  if (digits.startsWith("66") && digits.length >= 11) {
    return `+66-${digits.slice(2)}`;
  }
  if (digits.startsWith("0") && digits.length >= 9) {
    return `+66-${digits.slice(1)}`;
  }
  return `+66-${digits}`;
}
