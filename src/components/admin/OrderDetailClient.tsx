"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getAllowedNextStatuses,
  getOrderStatusLabel,
  orderStatusBadgeClass,
} from "@/lib/admin/order-status";
import { formatBaht, lineTotalBaht } from "@/lib/cart";
import type { Order, OrderStatus } from "@/lib/orders";

type OrderDetailClientProps = {
  orderId: string;
};

function formatDateTime(iso: string | null | undefined) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const inputClassName =
  "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-red focus:ring-2 focus:ring-red/20";

export default function OrderDetailClient({ orderId }: OrderDetailClientProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<OrderStatus>("pending");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [note, setNote] = useState("");

  const syncForm = (next: Order) => {
    setOrder(next);
    setStatus(next.status);
    setTrackingNumber(next.trackingNumber ?? "");
    setAdminNote(next.adminNote ?? "");
    setCustomerName(next.customerName);
    setCustomerPhone(next.customerPhone);
    setCustomerEmail(next.customerEmail ?? "");
    setShippingAddress(next.shippingAddress);
    setNote(next.note ?? "");
  };

  const loadOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`);
      const data = (await response.json()) as { order?: Order; error?: string };
      if (!response.ok || !data.order) {
        throw new Error(data.error ?? "โหลดคำสั่งซื้อไม่สำเร็จ");
      }
      syncForm(data.order);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "โหลดไม่สำเร็จ");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once per orderId
  }, [orderId]);

  const statusOptions = useMemo(() => {
    if (!order) return [];
    const next = getAllowedNextStatuses(order.status);
    return [order.status, ...next.filter((item) => item !== order.status)];
  }, [order]);

  const handleSave = async () => {
    if (!order) return;

    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      setError("กรุณากรอกชื่อ เบอร์โทร และที่อยู่จัดส่ง");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          trackingNumber,
          adminNote,
          customerName,
          customerPhone,
          customerEmail,
          shippingAddress,
          note,
        }),
      });
      const data = (await response.json()) as { order?: Order; error?: string };
      if (!response.ok || !data.order) {
        throw new Error(data.error ?? "บันทึกไม่สำเร็จ");
      }
      syncForm(data.order);
      setMessage("บันทึกเรียบร้อยแล้ว");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500">กำลังโหลด...</p>;
  }

  if (!order) {
    return (
      <div>
        <p className="mb-4 text-sm text-red">{error || "ไม่พบคำสั่งซื้อ"}</p>
        <Link href="/admin/orders" className="text-sm text-red hover:underline">
          ← กลับรายการคำสั่งซื้อ
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href="/admin/orders" className="text-sm text-gray-500 hover:text-red">
            ← กลับรายการคำสั่งซื้อ
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-gray-900">{order.orderNo}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${orderStatusBadgeClass(order.status)}`}
            >
              {getOrderStatusLabel(order.status)}
            </span>
            <span className="text-sm text-gray-500">
              สั่งเมื่อ {formatDateTime(order.createdAt)}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={`/admin/orders/${order.id}/receipt`}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-red hover:text-red"
          >
            พิมพ์ใบเสร็จ
          </a>
          <a
            href={`/admin/orders/${order.id}/packing-slip`}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-red hover:text-red"
          >
            พิมพ์ใบปะหน้า
          </a>
        </div>
      </div>

      {message ? <p className="mb-4 text-sm text-green-600">{message}</p> : null}
      {error ? <p className="mb-4 text-sm text-red">{error}</p> : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-gray-900">ข้อมูลลูกค้า</h2>
          <div className="mt-3 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                ชื่อ <span className="text-red">*</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                className={inputClassName}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                โทรศัพท์ <span className="text-red">*</span>
              </label>
              <input
                type="text"
                value={customerPhone}
                onChange={(event) => setCustomerPhone(event.target.value)}
                className={inputClassName}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">อีเมล</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(event) => setCustomerEmail(event.target.value)}
                className={inputClassName}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                ที่อยู่จัดส่ง <span className="text-red">*</span>
              </label>
              <textarea
                value={shippingAddress}
                onChange={(event) => setShippingAddress(event.target.value)}
                rows={4}
                className={inputClassName}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                หมายเหตุลูกค้า
              </label>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={3}
                className={inputClassName}
              />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-gray-900">อัปเดตออเดอร์</h2>
          <div className="mt-3 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">สถานะ</label>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as OrderStatus)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-red"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {getOrderStatusLabel(option)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                เลขพัสดุ
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(event) => setTrackingNumber(event.target.value)}
                placeholder="เช่น EMS / Kerry tracking"
                className={inputClassName}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                หมายเหตุแอดมิน
              </label>
              <textarea
                value={adminNote}
                onChange={(event) => setAdminNote(event.target.value)}
                rows={3}
                className={inputClassName}
              />
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={() => void handleSave()}
              className="rounded-lg bg-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-dark disabled:opacity-50"
            >
              {saving ? "กำลังบันทึก..." : "บันทึกทั้งหมด"}
            </button>
          </div>

          <dl className="mt-6 space-y-2 border-t border-gray-100 pt-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">ชำระเมื่อ</dt>
              <dd>{formatDateTime(order.paidAt)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">จัดส่งเมื่อ</dt>
              <dd>{formatDateTime(order.shippedAt)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">ช่องทางชำระ</dt>
              <dd>{order.paymentProvider ?? "-"}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">รายการสินค้า</h2>
        </div>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">สินค้า</th>
              <th className="px-4 py-3 font-medium">ราคา</th>
              <th className="px-4 py-3 font-medium">จำนวน</th>
              <th className="px-4 py-3 font-medium text-right">รวม</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id ?? `${item.productId}-${item.name}`} className="border-t border-gray-100">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded border border-gray-100 bg-gray-50">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                          unoptimized={item.image.startsWith("http")}
                        />
                      ) : null}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.productId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{formatBaht(item.priceBaht)}</td>
                <td className="px-4 py-3">{item.quantity}</td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatBaht(lineTotalBaht(item.priceBaht, item.quantity))}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200 bg-gray-50">
              <td colSpan={3} className="px-4 py-3 text-right font-medium text-gray-700">
                ยอดรวม
              </td>
              <td className="px-4 py-3 text-right text-base font-bold text-gray-900">
                {formatBaht(order.totalSatang / 100)}
              </td>
            </tr>
          </tfoot>
        </table>
      </section>
    </div>
  );
}
