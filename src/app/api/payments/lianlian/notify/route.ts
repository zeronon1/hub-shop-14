import { NextResponse } from "next/server";
import {
  getLianlianConfig,
  lianlianVerify,
  type LianlianNotifyPayload,
} from "@/lib/lianlian";
import { updateOrderStatus } from "@/lib/orders";

/** Merchant must respond with this exact body or LianLian will retry (13x). */
const ACK = { code: 200000, message: "Success" };

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("sign") ?? "";
    const payload = (await request.json()) as LianlianNotifyPayload;
    const { lianlianPublicKey, merchantId } = getLianlianConfig();

    if (lianlianPublicKey && !lianlianVerify(payload, signature, lianlianPublicKey)) {
      console.error("[lianlian/notify] invalid signature", payload.merchant_order_id);
      return NextResponse.json({ code: 400000, message: "Invalid signature" }, { status: 400 });
    }

    if (merchantId && payload.merchant_id && payload.merchant_id !== merchantId) {
      return NextResponse.json({ code: 400000, message: "Invalid merchant" }, { status: 400 });
    }

    const orderNo = payload.merchant_order_id;
    if (!orderNo) {
      return NextResponse.json({ code: 400000, message: "Missing order" }, { status: 400 });
    }

    if (payload.order_status === "PS") {
      updateOrderStatus(orderNo, "paid", {
        paidAt: payload.complete_time
          ? new Date(payload.complete_time.replace(" ", "T") + "+07:00").toISOString()
          : new Date().toISOString(),
        lianlianOrderId: payload.order_id,
      });
    } else if (payload.order_status === "PF" || payload.order_status === "PE") {
      updateOrderStatus(orderNo, "failed", {
        lianlianOrderId: payload.order_id,
      });
    }

    return NextResponse.json(ACK);
  } catch (error) {
    console.error("[lianlian/notify]", error);
    return NextResponse.json({ code: 500000, message: "Webhook error" }, { status: 500 });
  }
}
