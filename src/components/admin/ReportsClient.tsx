"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getOrderStatusLabel,
  orderStatusBadgeClass,
} from "@/lib/admin/order-status";
import { formatBaht } from "@/lib/cart";
import type { OrderStatus } from "@/lib/orders";

type MoneyCount = { count: number; totalSatang: number };

type ReportPayload = {
  generatedAt: string;
  catalog: {
    productTotal: number;
    productActive: number;
    productInactive: number;
    productNew: number;
    productRecommend: number;
    categoryTotal: number;
    categoryActive: number;
    productsByCategory: Array<{
      id: string;
      slug: string;
      label: string;
      isActive: boolean;
      productCount: number;
      activeProductCount: number;
      inactiveProductCount: number;
    }>;
  };
  orders: {
    orderTotal: number;
    pendingActionCount: number;
    byStatus: Array<{
      status: OrderStatus;
      count: number;
      totalSatang: number;
    }>;
    revenue: {
      all: MoneyCount;
      today: MoneyCount;
      last7Days: MoneyCount;
      thisMonth: MoneyCount;
    };
    recent: Array<{
      id: string;
      orderNo: string;
      customerName: string;
      status: OrderStatus;
      totalSatang: number;
      createdAt: string;
    }>;
    topProducts: Array<{
      productId: string;
      name: string;
      quantitySold: number;
      orderCount: number;
    }>;
  };
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function StatBox({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
    </div>
  );
}

export default function ReportsClient() {
  const [report, setReport] = useState<ReportPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReport = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/reports");
      const data = (await response.json()) as ReportPayload & { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "โหลดรายงานไม่สำเร็จ");
      }
      setReport(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "โหลดรายงานไม่สำเร็จ");
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadReport();
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">กำลังโหลดรายงาน...</p>;
  }

  if (!report) {
    return (
      <div>
        <p className="mb-4 text-sm text-red">{error || "โหลดรายงานไม่สำเร็จ"}</p>
        <button
          type="button"
          onClick={() => void loadReport()}
          className="rounded-lg bg-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-dark"
        >
          ลองใหม่
        </button>
      </div>
    );
  }

  const { catalog, orders } = report;
  const maxStatusCount = Math.max(...orders.byStatus.map((row) => row.count), 1);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">รายงานและภาพรวม</h1>
          <p className="mt-1 text-sm text-gray-500">
            สรุปยอดสั่งซื้อ สถานะออเดอร์ และภาพรวมสินค้าในระบบ
          </p>
          <p className="mt-1 text-xs text-gray-400">
            อัปเดตล่าสุด {formatDateTime(report.generatedAt)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadReport()}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-red hover:text-red"
        >
          รีเฟรช
        </button>
      </div>

      {error ? <p className="mb-4 text-sm text-red">{error}</p> : null}

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">ภาพรวมยอดขาย</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatBox
            label="ยอดขายทั้งหมด"
            value={formatBaht(orders.revenue.all.totalSatang / 100)}
            hint={`${orders.revenue.all.count} ออเดอร์ที่ชำระแล้วขึ้นไป`}
          />
          <StatBox
            label="วันนี้"
            value={formatBaht(orders.revenue.today.totalSatang / 100)}
            hint={`${orders.revenue.today.count} ออเดอร์`}
          />
          <StatBox
            label="7 วันล่าสุด"
            value={formatBaht(orders.revenue.last7Days.totalSatang / 100)}
            hint={`${orders.revenue.last7Days.count} ออเดอร์`}
          />
          <StatBox
            label="เดือนนี้"
            value={formatBaht(orders.revenue.thisMonth.totalSatang / 100)}
            hint={`${orders.revenue.thisMonth.count} ออเดอร์`}
          />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">ภาพรวมระบบ</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatBox
            label="สินค้าทั้งหมด"
            value={catalog.productTotal}
            hint={`เปิดขาย ${catalog.productActive} / ปิด ${catalog.productInactive}`}
          />
          <StatBox
            label="หมวดหมู่"
            value={catalog.categoryTotal}
            hint={`ใช้งาน ${catalog.categoryActive} หมวด`}
          />
          <StatBox
            label="ออเดอร์ทั้งหมด"
            value={orders.orderTotal}
            hint={`รอดำเนินการ ${orders.pendingActionCount}`}
          />
          <StatBox
            label="สินค้าเด่น"
            value={catalog.productRecommend}
            hint={`สินค้าใหม่ ${catalog.productNew}`}
          />
        </div>
      </section>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-gray-900">สถานะคำสั่งซื้อ</h2>
            <Link href="/admin/orders" className="text-sm text-red hover:underline">
              ดูทั้งหมด
            </Link>
          </div>
          <div className="space-y-3">
            {orders.byStatus.map((row) => (
              <div key={row.status}>
                <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${orderStatusBadgeClass(row.status)}`}
                    >
                      {getOrderStatusLabel(row.status)}
                    </span>
                    <span className="text-gray-600">{row.count} รายการ</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {formatBaht(row.totalSatang / 100)}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-red/80"
                    style={{ width: `${(row.count / maxStatusCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-gray-900">สินค้าขายดี</h2>
            <Link href="/admin/products" className="text-sm text-red hover:underline">
              จัดการสินค้า
            </Link>
          </div>
          {orders.topProducts.length === 0 ? (
            <p className="text-sm text-gray-500">ยังไม่มีข้อมูลการขาย</p>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="text-left text-gray-500">
                <tr>
                  <th className="pb-2 font-medium">สินค้า</th>
                  <th className="pb-2 text-right font-medium">จำนวนขาย</th>
                </tr>
              </thead>
              <tbody>
                {orders.topProducts.map((product, index) => (
                  <tr key={`${product.productId}-${product.name}`} className="border-t border-gray-100">
                    <td className="py-2.5">
                      <p className="font-medium text-gray-900">
                        {index + 1}. {product.name}
                      </p>
                      <p className="text-xs text-gray-400">{product.productId}</p>
                    </td>
                    <td className="py-2.5 text-right font-semibold text-gray-900">
                      {product.quantitySold}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      <section className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">จำนวนสินค้าแต่ละหมวดหมู่</h2>
          <Link href="/admin/categories" className="text-sm text-red hover:underline">
            จัดการหมวดหมู่
          </Link>
        </div>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">หมวดหมู่</th>
              <th className="px-4 py-3 font-medium">สถานะ</th>
              <th className="px-4 py-3 font-medium text-right">ทั้งหมด</th>
              <th className="px-4 py-3 font-medium text-right">เปิดขาย</th>
              <th className="px-4 py-3 font-medium text-right">ปิดขาย</th>
            </tr>
          </thead>
          <tbody>
            {catalog.productsByCategory.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  ยังไม่มีหมวดหมู่
                </td>
              </tr>
            ) : (
              catalog.productsByCategory.map((category) => (
                <tr key={category.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{category.label}</p>
                    <p className="text-xs text-gray-400">{category.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        category.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {category.isActive ? "ใช้งาน" : "ปิด"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{category.productCount}</td>
                  <td className="px-4 py-3 text-right">{category.activeProductCount}</td>
                  <td className="px-4 py-3 text-right text-gray-500">
                    {category.inactiveProductCount}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">ออเดอร์ล่าสุด</h2>
          <Link href="/admin/orders" className="text-sm text-red hover:underline">
            ดูทั้งหมด
          </Link>
        </div>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">เลขออเดอร์</th>
              <th className="px-4 py-3 font-medium">ลูกค้า</th>
              <th className="px-4 py-3 font-medium">สถานะ</th>
              <th className="px-4 py-3 font-medium">ยอด</th>
              <th className="px-4 py-3 font-medium">วันเวลา</th>
            </tr>
          </thead>
          <tbody>
            {orders.recent.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  ยังไม่มีคำสั่งซื้อ
                </td>
              </tr>
            ) : (
              orders.recent.map((order) => (
                <tr key={order.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-red hover:underline"
                    >
                      {order.orderNo}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${orderStatusBadgeClass(order.status)}`}
                    >
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatBaht(order.totalSatang / 100)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatDateTime(order.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
