import type { OrderStatus, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { ORDER_STATUSES } from "@/lib/admin/order-status";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { mapOrder } from "@/lib/orders";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as string[]).includes(value);
}

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status")?.trim() ?? "";
  const q = searchParams.get("q")?.trim() ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number(searchParams.get("pageSize") ?? String(DEFAULT_PAGE_SIZE)) || DEFAULT_PAGE_SIZE),
  );

  const where: Prisma.OrderWhereInput = {};

  if (statusParam && isOrderStatus(statusParam)) {
    where.status = statusParam;
  }

  if (q) {
    where.OR = [
      { orderNo: { contains: q, mode: "insensitive" } },
      { customerName: { contains: q, mode: "insensitive" } },
      { customerPhone: { contains: q, mode: "insensitive" } },
      { customerEmail: { contains: q, mode: "insensitive" } },
      { trackingNumber: { contains: q, mode: "insensitive" } },
    ];
  }

  const [total, rows] = await Promise.all([
    db.order.count({ where }),
    db.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({
    orders: rows.map(mapOrder),
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  });
}
