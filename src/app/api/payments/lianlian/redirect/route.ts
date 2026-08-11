import { NextResponse } from "next/server";
import { getLianlianConfig, lianlianVerify } from "@/lib/lianlian";
import { updateOrderStatus } from "@/lib/orders";

/**
 * LianLian Checkout redirects back via POST (form body + sign).
 * We verify, update local order status if possible, then send the browser to success/fail.
 */
export async function POST(request: Request) {
  const { siteUrl, lianlianPublicKey } = getLianlianConfig();
  const base = siteUrl.replace(/\/$/, "");

  try {
    const formData = await request.formData();
    const payload: Record<string, string> = {};

    for (const [key, value] of formData.entries()) {
      if (typeof value === "string" && key !== "sign" && key !== "sign_type") {
        payload[key] = value;
      }
    }

    const signature = String(formData.get("sign") ?? "");
    if (lianlianPublicKey && signature && !lianlianVerify(payload, signature, lianlianPublicKey)) {
      console.error("[lianlian/redirect] invalid signature");
      return NextResponse.redirect(`${base}/checkout/fail`, 303);
    }

    const orderNo = payload.merchant_order_id ?? "";
    const status = payload.order_status ?? "";
    const lianlianOrderId = payload.order_id;

    if (orderNo && status === "PS") {
      await updateOrderStatus(orderNo, "paid", {
        paidAt: new Date().toISOString(),
        lianlianOrderId,
        paymentProvider: "lianlian",
      });
      return NextResponse.redirect(`${base}/checkout/success?order=${encodeURIComponent(orderNo)}`, 303);
    }

    if (orderNo) {
      if (status === "PF" || status === "PE") {
        await updateOrderStatus(orderNo, "failed", {
          lianlianOrderId,
          paymentProvider: "lianlian",
        });
      }
      return NextResponse.redirect(`${base}/checkout/fail?order=${encodeURIComponent(orderNo)}`, 303);
    }

    return NextResponse.redirect(`${base}/checkout/fail`, 303);
  } catch (error) {
    console.error("[lianlian/redirect]", error);
    return NextResponse.redirect(`${base}/checkout/fail`, 303);
  }
}

/** Allow GET fallback (e.g. manual open) */
export async function GET(request: Request) {
  const { siteUrl } = getLianlianConfig();
  const base = siteUrl.replace(/\/$/, "");
  const { searchParams } = new URL(request.url);
  const orderNo = searchParams.get("merchant_order_id") ?? searchParams.get("order") ?? "";
  const status = searchParams.get("order_status") ?? "";

  if (orderNo && status === "PS") {
    return NextResponse.redirect(`${base}/checkout/success?order=${encodeURIComponent(orderNo)}`, 303);
  }
  if (orderNo) {
    return NextResponse.redirect(`${base}/checkout/fail?order=${encodeURIComponent(orderNo)}`, 303);
  }
  return NextResponse.redirect(`${base}/checkout/fail`, 303);
}
