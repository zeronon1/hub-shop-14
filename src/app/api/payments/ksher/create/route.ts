import { NextResponse } from "next/server";
import { cartTotalSatang, type CartItem } from "@/lib/cart";
import {
  createKsherPayment,
  generateOrderNo,
  getKsherConfig,
  ksherNonce,
  ksherTimestamp,
} from "@/lib/ksher";
import { saveOrder } from "@/lib/orders";

type CreatePaymentBody = {
  items: CartItem[];
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  note?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreatePaymentBody;
    const { appid, privateKey, siteUrl, channelList } = getKsherConfig();

    if (!appid || !privateKey) {
      return NextResponse.json(
        { error: "ระบบชำระเงินยังไม่ได้ตั้งค่า กรุณาติดต่อผู้ดูแลระบบ" },
        { status: 503 },
      );
    }

    if (!body.items?.length) {
      return NextResponse.json({ error: "ไม่มีสินค้าในตะกร้า" }, { status: 400 });
    }

    if (!body.customerName?.trim() || !body.customerPhone?.trim() || !body.shippingAddress?.trim()) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }

    const payableItems = body.items.filter((item) => item.priceBaht > 0);
    if (!payableItems.length) {
      return NextResponse.json(
        { error: "สินค้าในตะกร้าไม่สามารถชำระเงินออนไลน์ได้" },
        { status: 400 },
      );
    }

    const orderNo = generateOrderNo();
    const totalSatang = cartTotalSatang(payableItems);
    const productName =
      payableItems
        .map((item) => item.name.slice(0, 40))
        .join(", ")
        .slice(0, 120) || "Momotaro Shop Order";

    await saveOrder({
      orderNo,
      items: payableItems,
      totalSatang,
      customerName: body.customerName.trim(),
      customerPhone: body.customerPhone.trim(),
      customerEmail: body.customerEmail?.trim() ?? "",
      shippingAddress: body.shippingAddress.trim(),
      note: body.note?.trim(),
      status: "pending",
      paymentProvider: "ksher",
    });

    const redirectBase = `${siteUrl.replace(/\/$/, "")}/checkout`;
    const params = {
      appid,
      nonce_str: ksherNonce(),
      channel_list: channelList,
      mch_code: orderNo,
      mch_order_no: orderNo,
      mch_redirect_url: `${redirectBase}/success?order=${orderNo}`,
      mch_redirect_url_fail: `${redirectBase}/fail?order=${orderNo}`,
      mch_notify_url: `${siteUrl.replace(/\/$/, "")}/api/payments/ksher/notify`,
      product_name: productName,
      refer_url: siteUrl,
      total_fee: totalSatang,
      fee_type: "THB",
      time_stamp: ksherTimestamp(),
      lang: "th",
      color: "#2563eb",
      shop_name: "Momotaro Shop",
    };

    const result = await createKsherPayment(params, privateKey);

    if (result.code !== 0 || !result.data?.pay_content) {
      return NextResponse.json(
        { error: result.message || result.msg || "ไม่สามารถสร้างรายการชำระเงินได้" },
        { status: 502 },
      );
    }

    return NextResponse.json({
      orderNo,
      payUrl: result.data.pay_content,
    });
  } catch (error) {
    console.error("[ksher/create]", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการสร้างรายการชำระเงิน" },
      { status: 500 },
    );
  }
}
