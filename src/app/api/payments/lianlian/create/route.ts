import { NextResponse } from "next/server";
import { cartTotalBaht, type CartItem } from "@/lib/cart";
import {
  createLianlianCheckout,
  formatLianlianPhone,
  formatOrderAmount,
  generateLianlianOrderId,
  getLianlianConfig,
  isLianlianConfigured,
  LIANLIAN_SUCCESS_CODE,
} from "@/lib/lianlian";
import { patchOrderPaymentIds, saveOrder } from "@/lib/orders";
import { siteInfo } from "@/lib/site-data";

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
    if (!isLianlianConfigured()) {
      return NextResponse.json(
        { error: "ระบบชำระเงินยังไม่ได้ตั้งค่า กรุณาติดต่อผู้ดูแลระบบ" },
        { status: 503 },
      );
    }

    const body = (await request.json()) as CreatePaymentBody;

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

    const { siteUrl } = getLianlianConfig();
    const base = siteUrl.replace(/\/$/, "");
    const orderNo = generateLianlianOrderId();
    const totalBaht = cartTotalBaht(payableItems);
    const orderDesc =
      payableItems
        .map((item) => item.name.slice(0, 40))
        .join(", ")
        .slice(0, 200) || `${siteInfo.name} Order`;

    await saveOrder({
      orderNo,
      items: payableItems,
      totalSatang: Math.round(totalBaht * 100),
      customerName: body.customerName.trim(),
      customerPhone: body.customerPhone.trim(),
      customerEmail: body.customerEmail?.trim() ?? "",
      shippingAddress: body.shippingAddress.trim(),
      note: body.note?.trim(),
      status: "pending",
      paymentProvider: "lianlian",
    });

    const result = await createLianlianCheckout({
      merchant_order_id: orderNo,
      order_amount: formatOrderAmount(totalBaht),
      order_desc: orderDesc,
      customer: {
        merchant_user_id: body.customerPhone.trim().replace(/\D/g, "") || orderNo,
        full_name: body.customerName.trim(),
        email: body.customerEmail?.trim() || undefined,
        phone: formatLianlianPhone(body.customerPhone),
      },
      products: payableItems.map((item) => ({
        name: item.name.slice(0, 128),
        quantity: String(item.quantity),
        unit_price: formatOrderAmount(item.priceBaht),
        product_id: item.productId,
        show_url: `${base}/product/${item.productId}`,
      })),
      notify_url: `${base}/api/payments/lianlian/notify`,
      redirect_url: `${base}/api/payments/lianlian/redirect`,
      cancel_url: `${base}/checkout/fail?order=${orderNo}`,
    });

    if (result.code !== LIANLIAN_SUCCESS_CODE || !result.data?.link_url) {
      console.error("[lianlian/create] gateway error", result);
      return NextResponse.json(
        { error: result.message || "ไม่สามารถสร้างรายการชำระเงินได้" },
        { status: 502 },
      );
    }

    if (result.data.order_id) {
      try {
        await patchOrderPaymentIds(orderNo, {
          lianlianOrderId: result.data.order_id,
          paymentProvider: "lianlian",
        });
      } catch (persistError) {
        console.error("[lianlian/create] failed to persist lianlianOrderId", persistError);
      }
    }

    return NextResponse.json({
      orderNo,
      payUrl: result.data.link_url,
      lianlianOrderId: result.data.order_id,
    });
  } catch (error) {
    console.error("[lianlian/create]", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการสร้างรายการชำระเงิน" },
      { status: 500 },
    );
  }
}
