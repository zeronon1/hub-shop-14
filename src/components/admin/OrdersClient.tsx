"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  getOrderStatusLabel,
  ORDER_STATUSES,
  orderStatusBadgeClass,
} from "@/lib/admin/order-status";
import { formatBaht } from "@/lib/cart";
import type { Order, OrderStatus } from "@/lib/orders";

type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function OrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 1,
  });
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async (page = 1) => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("pageSize", "20");
    if (statusFilter) params.set("status", statusFilter);
    if (search.trim()) params.set("q", search.trim());

    try {
      const response = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = (await response.json()) as {
        orders?: Order[];
        pagination?: Pagination;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "โหลดคำสั่งซื้อไม่สำเร็จ");
      }

      setOrders(data.orders ?? []);
      if (data.pagination) setPagination(data.pagination);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "โหลดคำสั่งซื้อไม่สำเร็จ");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    void loadOrders(1);
  }, [loadOrders]);

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSearch(searchInput.trim());
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">จัดการคำสั่งซื้อ</h1>
        <p className="mt-1 text-sm text-gray-500">
          ดูรายการออเดอร์ อัปเดตสถานะ และพิมพ์ใบเสร็จ / ใบปะหน้า
        </p>
      </div>

      {error ? <p className="mb-4 text-sm text-red">{error}</p> : null}

      <form
        onSubmit={handleSearchSubmit}
        className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end"
      >
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">ค้นหา</label>
          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="เลขออเดอร์, ชื่อ, เบอร์โทร, เลขพัสดุ..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-red focus:ring-2 focus:ring-red/20"
          />
        </div>
        <div className="w-full lg:w-56">
          <label className="mb-1 block text-sm font-medium text-gray-700">สถานะ</label>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-red"
          >
            <option value="">ทุกสถานะ</option>
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {getOrderStatusLabel(status)}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-dark"
        >
          ค้นหา
        </button>
      </form>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">เลขออเดอร์</th>
              <th className="px-4 py-3 font-medium">ลูกค้า</th>
              <th className="px-4 py-3 font-medium">ยอดรวม</th>
              <th className="px-4 py-3 font-medium">สถานะ</th>
              <th className="px-4 py-3 font-medium">วันเวลา</th>
              <th className="px-4 py-3 font-medium">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  กำลังโหลด...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  ไม่พบคำสั่งซื้อ
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{order.orderNo}</p>
                    <p className="text-xs text-gray-400">
                      {order.items.length} รายการ
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-xs text-gray-500">{order.customerPhone}</p>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatBaht(order.totalSatang / 100)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${orderStatusBadgeClass(order.status as OrderStatus)}`}
                    >
                      {getOrderStatusLabel(order.status as OrderStatus)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDateTime(order.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-red hover:underline"
                    >
                      ดูรายละเอียด
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && pagination.total > 0 ? (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            ทั้งหมด {pagination.total} รายการ — หน้า {pagination.page}/
            {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => void loadOrders(pagination.page - 1)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-40"
            >
              ก่อนหน้า
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => void loadOrders(pagination.page + 1)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm disabled:opacity-40"
            >
              ถัดไป
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
