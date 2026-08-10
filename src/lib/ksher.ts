import crypto from "crypto";

const KSHER_GATEWAY_URL = "https://gateway.ksher.com/api/gateway_pay";
const KSHER_QUERY_URL = "https://gateway.ksher.com/api/gateway_order_query";

export const KSHER_PUBLIC_KEY = `-----BEGIN RSA PUBLIC KEY-----
MEgCQQC+/eeTgrjeCPHmDS/5osWViFyIAryFRIr5canaYhz3Di3UNkT0sf6TkabF
LvxPcM9JmEtj2O4TXNpgYATkE/sFAgMBAAE=
-----END RSA PUBLIC KEY-----`;

export const DEFAULT_CHANNEL_LIST =
  "promptpay,linepay,airpay,truemoney,card";

type SignableValue = string | number;

export function normalizePrivateKey(raw: string): string {
  return raw.replace(/\\n/g, "\n").trim();
}

export function buildSignString(params: Record<string, SignableValue>): string {
  return Object.keys(params)
    .filter((key) => key !== "sign")
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("");
}

export function ksherSign(
  params: Record<string, SignableValue>,
  privateKey: string,
): string {
  const signString = buildSignString(params);
  const signer = crypto.createSign("RSA-MD5");
  signer.update(signString, "utf8");
  return signer.sign(normalizePrivateKey(privateKey), "hex");
}

export function ksherVerify(
  params: Record<string, SignableValue>,
  signature: string,
  publicKey = KSHER_PUBLIC_KEY,
): boolean {
  const signString = buildSignString(params);
  const verifier = crypto.createVerify("RSA-MD5");
  verifier.update(signString, "utf8");
  return verifier.verify(publicKey, signature, "hex");
}

export function ksherTimestamp(): string {
  const now = new Date();
  const pad = (value: number, length = 2) => value.toString().padStart(length, "0");
  const centiseconds = pad(Math.floor(now.getMilliseconds() / 10));
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}${centiseconds}S`;
}

export function ksherNonce(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function generateOrderNo(): string {
  return `STB${Date.now()}${crypto.randomBytes(4).toString("hex")}`;
}

export type KsherGatewayPayParams = {
  appid: string;
  nonce_str: string;
  channel_list: string;
  mch_code: string;
  mch_order_no: string;
  mch_redirect_url: string;
  mch_redirect_url_fail: string;
  mch_notify_url?: string;
  product_name: string;
  refer_url: string;
  total_fee: number;
  fee_type: string;
  time_stamp: string;
  lang?: string;
  color?: string;
  shop_name?: string;
};

export type KsherGatewayPayResponse = {
  code: number;
  msg: string;
  message: string;
  sign?: string;
  data?: {
    pay_content: string;
  };
};

export async function createKsherPayment(
  params: KsherGatewayPayParams,
  privateKey: string,
): Promise<KsherGatewayPayResponse> {
  const payload: Record<string, SignableValue> = {
    ...params,
    sign: ksherSign(params, privateKey),
  };

  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(payload)) {
    body.set(key, String(value));
  }

  const response = await fetch(KSHER_GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  return response.json() as Promise<KsherGatewayPayResponse>;
}

export type KsherOrderQueryResponse = {
  code: number;
  msg: string;
  message: string;
  sign?: string;
  data?: Record<string, SignableValue>;
};

export async function queryKsherOrder(
  appid: string,
  mchOrderNo: string,
  privateKey: string,
): Promise<KsherOrderQueryResponse> {
  const params: Record<string, SignableValue> = {
    appid,
    mch_order_no: mchOrderNo,
    nonce_str: ksherNonce(),
    time_stamp: ksherTimestamp(),
  };

  const payload = {
    ...params,
    sign: ksherSign(params, privateKey),
  };

  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(payload)) {
    body.set(key, String(value));
  }

  const response = await fetch(KSHER_QUERY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  return response.json() as Promise<KsherOrderQueryResponse>;
}

export function getKsherConfig() {
  const appid = process.env.KSHER_APPID;
  const privateKey = process.env.KSHER_PRIVATE_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const channelList = process.env.KSHER_CHANNEL_LIST ?? DEFAULT_CHANNEL_LIST;

  return { appid, privateKey, siteUrl, channelList };
}
