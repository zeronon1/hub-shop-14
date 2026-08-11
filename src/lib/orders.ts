import type { Order as DbOrder, OrderItem as DbOrderItem, OrderStatus, PaymentProvider } from "@prisma/client";
import type { CartItem } from "@/lib/cart";
import { db } from "@/lib/db";

export type { OrderStatus, PaymentProvider };

export type OrderItemSnapshot = {
  id?: string;
  productId: string;
  name: string;
  image: string;
  priceBaht: number;
  quantity: number;
};

export type Order = {
  id: string;
  orderNo: string;
  items: OrderItemSnapshot[];
  totalSatang: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  note?: string | null;
  adminNote?: string | null;
  trackingNumber?: string | null;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  paidAt?: string | null;
  shippedAt?: string | null;
  paymentProvider?: PaymentProvider | null;
  ksherOrderNo?: string | null;
  lianlianOrderId?: string | null;
};

export type CreateOrderInput = {
  orderNo: string;
  items: CartItem[];
  totalSatang: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  note?: string;
  status?: OrderStatus;
  paymentProvider?: PaymentProvider;
  ksherOrderNo?: string;
  lianlianOrderId?: string;
};

type OrderWithItems = DbOrder & { items: DbOrderItem[] };

function toIso(value: Date | null | undefined): string | null {
  return value ? value.toISOString() : null;
}

export function mapOrder(row: OrderWithItems): Order {
  return {
    id: row.id,
    orderNo: row.orderNo,
    items: row.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.name,
      image: item.image,
      priceBaht: item.priceBaht,
      quantity: item.quantity,
    })),
    totalSatang: row.totalSatang,
    customerName: row.customerName,
    customerPhone: row.customerPhone,
    customerEmail: row.customerEmail,
    shippingAddress: row.shippingAddress,
    note: row.note,
    adminNote: row.adminNote,
    trackingNumber: row.trackingNumber,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    paidAt: toIso(row.paidAt),
    shippedAt: toIso(row.shippedAt),
    paymentProvider: row.paymentProvider,
    ksherOrderNo: row.ksherOrderNo,
    lianlianOrderId: row.lianlianOrderId,
  };
}

export async function saveOrder(input: CreateOrderInput): Promise<Order> {
  const row = await db.order.create({
    data: {
      orderNo: input.orderNo,
      status: input.status ?? "pending",
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerEmail: input.customerEmail,
      shippingAddress: input.shippingAddress,
      note: input.note || null,
      totalSatang: input.totalSatang,
      paymentProvider: input.paymentProvider ?? null,
      ksherOrderNo: input.ksherOrderNo ?? null,
      lianlianOrderId: input.lianlianOrderId ?? null,
      items: {
        create: input.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          image: item.image ?? "",
          priceBaht: item.priceBaht,
          quantity: item.quantity,
        })),
      },
    },
    include: { items: true },
  });

  return mapOrder(row);
}

export async function getOrder(orderNo: string): Promise<Order | null> {
  const row = await db.order.findUnique({
    where: { orderNo },
    include: { items: true },
  });
  return row ? mapOrder(row) : null;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const row = await db.order.findUnique({
    where: { id },
    include: { items: true },
  });
  return row ? mapOrder(row) : null;
}

export type UpdateOrderStatusExtra = {
  paidAt?: string | Date | null;
  shippedAt?: string | Date | null;
  ksherOrderNo?: string | null;
  lianlianOrderId?: string | null;
  paymentProvider?: PaymentProvider | null;
};

const FULFILLMENT_STATUSES: OrderStatus[] = [
  "paid",
  "processing",
  "shipped",
  "completed",
];

export async function updateOrderStatus(
  orderNo: string,
  status: OrderStatus,
  extra?: UpdateOrderStatusExtra,
): Promise<Order | null> {
  const existing = await db.order.findUnique({ where: { orderNo } });
  if (!existing) return null;

  // Payment webhooks must not downgrade an order that is already being fulfilled.
  let nextStatus = status;
  if (
    (status === "paid" || status === "failed") &&
    FULFILLMENT_STATUSES.includes(existing.status) &&
    existing.status !== "paid"
  ) {
    nextStatus = existing.status;
  } else if (status === "failed" && existing.status === "paid") {
    nextStatus = existing.status;
  }

  const paidAt =
    extra?.paidAt !== undefined
      ? extra.paidAt
        ? new Date(extra.paidAt)
        : null
      : (nextStatus === "paid" || status === "paid") && !existing.paidAt
        ? new Date()
        : undefined;

  const shippedAt =
    extra?.shippedAt !== undefined
      ? extra.shippedAt
        ? new Date(extra.shippedAt)
        : null
      : nextStatus === "shipped" && !existing.shippedAt
        ? new Date()
        : undefined;

  const row = await db.order.update({
    where: { orderNo },
    data: {
      status: nextStatus,
      ...(paidAt !== undefined ? { paidAt } : {}),
      ...(shippedAt !== undefined ? { shippedAt } : {}),
      ...(extra?.ksherOrderNo !== undefined ? { ksherOrderNo: extra.ksherOrderNo } : {}),
      ...(extra?.lianlianOrderId !== undefined
        ? { lianlianOrderId: extra.lianlianOrderId }
        : {}),
      ...(extra?.paymentProvider !== undefined
        ? { paymentProvider: extra.paymentProvider }
        : {}),
    },
    include: { items: true },
  });

  return mapOrder(row);
}

export async function patchOrderPaymentIds(
  orderNo: string,
  data: { lianlianOrderId?: string; ksherOrderNo?: string; paymentProvider?: PaymentProvider },
): Promise<void> {
  await db.order.update({
    where: { orderNo },
    data: {
      ...(data.lianlianOrderId !== undefined ? { lianlianOrderId: data.lianlianOrderId } : {}),
      ...(data.ksherOrderNo !== undefined ? { ksherOrderNo: data.ksherOrderNo } : {}),
      ...(data.paymentProvider !== undefined ? { paymentProvider: data.paymentProvider } : {}),
    },
  });
}
