"use client";

import Link from "next/link";
import { useState } from "react";
import { formatBaht } from "@/lib/cart";
import { useCart } from "@/contexts/CartContext";

type CheckoutForm = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  note: string;
};

const initialForm: CheckoutForm = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  shippingAddress: "",
  note: "",
};

export default function CheckoutClient() {
  const { items, totalBaht, isHydrated } = useCart();
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isHydrated) {
    return (
      <div className="rounded-xl border-2 border-neutral-300 bg-white p-10 text-center text-sm">
        กำลังโหลด...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border-2 border-neutral-300 bg-white p-10 text-center">
        <p className="text-lg font-bold">ไม่มีสินค้าในตะกร้า</p>
        <Link
          href="/cart"
          className="mt-6 inline-flex rounded-full bg-red px-6 py-3 text-sm font-bold text-white hover:bg-red-dark"
        >
          กลับไปตะกร้า
        </Link>
      </div>
    );
  }

  function updateField<K extends keyof CheckoutForm>(key: K, value: CheckoutForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/payments/lianlian/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          ...form,
        }),
      });

      const data = (await response.json()) as {
        payUrl?: string;
        orderNo?: string;
        error?: string;
      };

      if (!response.ok || !data.payUrl) {
        throw new Error(data.error ?? "ไม่สามารถสร้างรายการชำระเงินได้");
      }

      window.location.assign(data.payUrl);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <form onSubmit={handleSubmit} className="space-y-5 lg:col-span-7">
        <section className="rounded-xl border-2 border-neutral-300 bg-white p-6">
          <h2 className="mb-4 text-lg font-bold">ข้อมูลผู้สั่งซื้อ</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-semibold">ชื่อ-นามสกุล *</span>
              <input
                required
                value={form.customerName}
                onChange={(event) => updateField("customerName", event.target.value)}
                className="w-full rounded-lg border-2 border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-red"
                placeholder="ชื่อผู้รับสินค้า"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">เบอร์โทร *</span>
              <input
                required
                type="tel"
                value={form.customerPhone}
                onChange={(event) => updateField("customerPhone", event.target.value)}
                className="w-full rounded-lg border-2 border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-red"
                placeholder="08x-xxx-xxxx"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">อีเมล</span>
              <input
                type="email"
                value={form.customerEmail}
                onChange={(event) => updateField("customerEmail", event.target.value)}
                className="w-full rounded-lg border-2 border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-red"
                placeholder="email@example.com"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-semibold">ที่อยู่จัดส่ง *</span>
              <textarea
                required
                rows={3}
                value={form.shippingAddress}
                onChange={(event) => updateField("shippingAddress", event.target.value)}
                className="w-full rounded-lg border-2 border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-red"
                placeholder="บ้านเลขที่ ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-semibold">หมายเหตุ</span>
              <textarea
                rows={2}
                value={form.note}
                onChange={(event) => updateField("note", event.target.value)}
                className="w-full rounded-lg border-2 border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-red"
                placeholder="ข้อความถึงร้าน (ถ้ามี)"
              />
            </label>
          </div>
        </section>

        {error ? (
          <p className="rounded-lg border-2 border-red/30 bg-red-light px-4 py-3 text-sm font-medium text-red">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-full bg-red px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-red-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-56"
        >
          {loading ? "กำลังไปหน้าชำระเงิน..." : "ชำระเงินอย่างปลอดภัย"}
        </button>
      </form>

      <aside className="lg:col-span-5">
        <div className="rounded-xl border-2 border-neutral-300 bg-white p-6 lg:sticky lg:top-24">
          <h2 className="mb-4 text-lg font-bold">สรุปคำสั่งซื้อ</h2>
          <ul className="space-y-3 border-b-2 border-neutral-200 pb-4">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-3 text-sm">
                <span className="line-clamp-2 text-foreground/80">
                  {item.name} × {item.quantity}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-semibold">ยอดชำระทั้งหมด</span>
            <span className="text-2xl font-bold">{formatBaht(totalBaht)}</span>
          </div>
          <Link
            href="/cart"
            className="mt-5 inline-block text-sm font-semibold text-foreground underline-offset-2 hover:text-red hover:underline"
          >
            ← กลับไปแก้ไขตะกร้า
          </Link>
        </div>
      </aside>
    </div>
  );
}
