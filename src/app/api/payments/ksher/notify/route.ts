import { NextResponse } from "next/server";
import { ksherVerify } from "@/lib/ksher";
import { updateOrderStatus } from "@/lib/orders";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const payload: Record<string, string | number> = {};

    for (const [key, value] of formData.entries()) {
      if (typeof value === "string" && value !== "") {
        payload[key] = value;
      }
    }

    const signature = String(payload.sign ?? "");
    if (!signature || !ksherVerify(payload, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const orderNo = String(payload.mch_order_no ?? "");
    const result = String(payload.result ?? "");
    const ksherOrderNo = String(payload.ksher_order_no ?? "");

    if (orderNo && result === "SUCCESS") {
      updateOrderStatus(orderNo, "paid", {
        paidAt: new Date().toISOString(),
        ksherOrderNo: ksherOrderNo || undefined,
      });
    } else if (orderNo && result === "FAIL") {
      updateOrderStatus(orderNo, "failed");
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[ksher/notify]", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
