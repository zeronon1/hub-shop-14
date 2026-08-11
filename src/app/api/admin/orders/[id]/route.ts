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
    };

    const data: {
      status?: OrderStatus;
      trackingNumber?: string | null;
      adminNote?: string | null;
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
      if (body.trackingNumber !== null && typeof body.trackingNumber !== "string") {
        return NextResponse.json({ error: "เลขพัสดุไม่ถูกต้อง" }, { status: 400 });
      }
      const tracking =
        typeof body.trackingNumber === "string" ? body.trackingNumber.trim() : "";
      data.trackingNumber = tracking || null;
    }

    if (body.adminNote !== undefined) {
      if (body.adminNote !== null && typeof body.adminNote !== "string") {
        return NextResponse.json({ error: "หมายเหตุแอดมินไม่ถูกต้อง" }, { status: 400 });
      }
      const note = typeof body.adminNote === "string" ? body.adminNote.trim() : "";
      data.adminNote = note || null;
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
