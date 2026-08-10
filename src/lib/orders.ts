import type { CartItem } from "@/lib/cart";

export type OrderStatus = "pending" | "paid" | "failed" | "cancelled";

export type Order = {
  orderNo: string;
  items: CartItem[];
  totalSatang: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  note?: string;
  status: OrderStatus;
  createdAt: string;
  paidAt?: string;
  paymentProvider?: "ksher" | "lianlian";
  ksherOrderNo?: string;
  lianlianOrderId?: string;
};

const globalForOrders = globalThis as typeof globalThis & {
  momotaroOrders?: Map<string, Order>;
};

function getOrderStore(): Map<string, Order> {
  if (!globalForOrders.momotaroOrders) {
    globalForOrders.momotaroOrders = new Map();
  }
  return globalForOrders.momotaroOrders;
}

export function saveOrder(order: Order): void {
  getOrderStore().set(order.orderNo, order);
}

export function getOrder(orderNo: string): Order | undefined {
  return getOrderStore().get(orderNo);
}

export function updateOrderStatus(
  orderNo: string,
  status: OrderStatus,
  extra?: Partial<Pick<Order, "paidAt" | "ksherOrderNo" | "lianlianOrderId">>,
): Order | undefined {
  const order = getOrder(orderNo);
  if (!order) return undefined;

  const updated: Order = {
    ...order,
    ...extra,
    status,
  };
  saveOrder(updated);
  return updated;
}
