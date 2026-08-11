import type { OrderStatus } from "@prisma/client";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "completed",
  "failed",
  "cancelled",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "รอชำระเงิน",
  paid: "ชำระแล้ว",
  processing: "กำลังจัดเตรียม",
  shipped: "จัดส่งแล้ว",
  completed: "สำเร็จ",
  failed: "ชำระไม่สำเร็จ",
  cancelled: "ยกเลิก",
};

/** Allowed next statuses from each current status (admin + payment webhooks). */
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["paid", "failed", "cancelled"],
  paid: ["processing", "shipped", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["completed"],
  completed: [],
  failed: ["pending", "cancelled"],
  cancelled: [],
};

export function getOrderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status] ?? status;
}

export function canTransitionOrderStatus(
  from: OrderStatus,
  to: OrderStatus,
): boolean {
  if (from === to) return true;
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export function getAllowedNextStatuses(from: OrderStatus): OrderStatus[] {
  return ALLOWED_TRANSITIONS[from] ?? [];
}

export function orderStatusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case "paid":
    case "completed":
      return "bg-green-50 text-green-700";
    case "processing":
    case "shipped":
      return "bg-blue-50 text-blue-700";
    case "pending":
      return "bg-amber-50 text-amber-700";
    case "failed":
    case "cancelled":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}
