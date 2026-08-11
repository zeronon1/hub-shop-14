import type { OrderStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import {
  canTransitionOrderStatus,
  ORDER_STATUSES,
} from "@/lib/admin/order-status";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { mapOrder } from "@/lib/orders";

type RouteContext = { params: Promise<{ id: string }> };

function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && (ORDER_STATUSES as string[]).includes(value);
}

function readOptionalString(
  value: unknown,
  fieldLabel: string,
): { ok: true; value: string | null } | { ok: false; error: string } {
  if (value === null) return { ok: true, value: null };
  if (typeof value !== "string") {
    return { ok: false, error: `${fieldLabel}ไม่ถูกต้อง` };
  }
  return { ok: true, value: value.trim() };
}

export async function GET(_request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const row = await db.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!row) {
    return NextResponse.json({ error: "ไม่พบคำสั่งซื้อ" }, { status: 404 });
  }

  return NextResponse.json({ order: mapOrder(row) });
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const existing = await db.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "ไม่พบคำสั่งซื้อ" }, { status: 404 });
  }

  try {
    const body = (await request.json()) as {
      status?: unknown;
      trackingNumber?: unknown;
      adminNote?: unknown;
      customerName?: unknown;
      customerPhone?: unknown;
      customerEmail?: unknown;
      shippingAddress?: unknown;
      note?: unknown;
    };

    const data: {
      status?: OrderStatus;
      trackingNumber?: string | null;
      adminNote?: string | null;
      customerName?: string;
      customerPhone?: string;
      customerEmail?: string;
      shippingAddress?: string;
      note?: string | null;
      shippedAt?: Date;
      paidAt?: Date;
    } = {};

    if (body.status !== undefined) {
      if (!isOrderStatus(body.status)) {
        return NextResponse.json({ error: "สถานะไม่ถูกต้อง" }, { status: 400 });
      }
      if (!canTransitionOrderStatus(existing.status, body.status)) {
        return NextResponse.json(
          { error: `ไม่สามารถเปลี่ยนสถานะจาก ${existing.status} เป็น ${body.status} ได้` },
          { status: 400 },
        );
      }
      data.status = body.status;
      if (body.status === "shipped" && !existing.shippedAt) {
        data.shippedAt = new Date();
      }
      if (body.status === "paid" && !existing.paidAt) {
        data.paidAt = new Date();
      }
    }

    if (body.trackingNumber !== undefined) {
      const parsed = readOptionalString(body.trackingNumber, "เลขพัสดุ");
      if (!parsed.ok) {
        return NextResponse.json({ error: parsed.error }, { status: 400 });
      }
      data.trackingNumber = parsed.value || null;
    }

    if (body.adminNote !== undefined) {
      const parsed = readOptionalString(body.adminNote, "หมายเหตุแอดมิน");
      if (!parsed.ok) {
        return NextResponse.json({ error: parsed.error }, { status: 400 });
      }
      data.adminNote = parsed.value || null;
    }

    if (body.customerName !== undefined) {
      const parsed = readOptionalString(body.customerName, "ชื่อลูกค้า");
      if (!parsed.ok) {
        return NextResponse.json({ error: parsed.error }, { status: 400 });
      }
      if (!parsed.value) {
        return NextResponse.json({ error: "กรุณากรอกชื่อลูกค้า" }, { status: 400 });
      }
      data.customerName = parsed.value;
    }

    if (body.customerPhone !== undefined) {
      const parsed = readOptionalString(body.customerPhone, "เบอร์โทร");
      if (!parsed.ok) {
        return NextResponse.json({ error: parsed.error }, { status: 400 });
      }
      if (!parsed.value) {
        return NextResponse.json({ error: "กรุณากรอกเบอร์โทร" }, { status: 400 });
      }
      data.customerPhone = parsed.value;
    }

    if (body.customerEmail !== undefined) {
      const parsed = readOptionalString(body.customerEmail, "อีเมล");
      if (!parsed.ok) {
        return NextResponse.json({ error: parsed.error }, { status: 400 });
      }
      data.customerEmail = parsed.value ?? "";
    }

    if (body.shippingAddress !== undefined) {
      const parsed = readOptionalString(body.shippingAddress, "ที่อยู่จัดส่ง");
      if (!parsed.ok) {
        return NextResponse.json({ error: parsed.error }, { status: 400 });
      }
      if (!parsed.value) {
        return NextResponse.json({ error: "กรุณากรอกที่อยู่จัดส่ง" }, { status: 400 });
      }
      data.shippingAddress = parsed.value;
    }

    if (body.note !== undefined) {
      const parsed = readOptionalString(body.note, "หมายเหตุลูกค้า");
      if (!parsed.ok) {
        return NextResponse.json({ error: parsed.error }, { status: 400 });
      }
      data.note = parsed.value || null;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "ไม่มีข้อมูลที่จะอัปเดต" }, { status: 400 });
    }

    const row = await db.order.update({
      where: { id },
      data,
      include: { items: true },
    });

    return NextResponse.json({ order: mapOrder(row) });
  } catch (error) {
    console.error("[admin/orders/PATCH]", error);
    return NextResponse.json({ error: "บันทึกไม่สำเร็จ" }, { status: 500 });
  }
}
