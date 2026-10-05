import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { cartTotalBaht, type CartItem } from "@/lib/cart";
import { saveOrder } from "@/lib/orders";

type PlaceOrderBody = {
  items: CartItem[];
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  note?: string;
};

function generateOrderNo(): string {
  return `MTP${Date.now()}${randomBytes(3).toString("hex")}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PlaceOrderBody;

    if (!body.items?.length) {
      return NextResponse.json({ error: "ไม่มีสินค้าในตะกร้า" }, { status: 400 });
    }

    if (!body.customerName?.trim() || !body.customerPhone?.trim() || !body.shippingAddress?.trim()) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }

    const orderNo = generateOrderNo();
    const totalBaht = cartTotalBaht(body.items);

    await saveOrder({
      orderNo,
      items: body.items,
      totalSatang: Math.round(totalBaht * 100),
      customerName: body.customerName.trim(),
      customerPhone: body.customerPhone.trim(),
      customerEmail: body.customerEmail?.trim() ?? "",
      shippingAddress: body.shippingAddress.trim(),
      note: body.note?.trim(),
      status: "paid",
    });

    return NextResponse.json({ orderNo });
  } catch (error) {
    console.error("[checkout/place]", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการยืนยันคำสั่งซื้อ" },
      { status: 500 },
    );
  }
}
