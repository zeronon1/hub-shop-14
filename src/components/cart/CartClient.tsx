"use client";

import Image from "next/image";
import Link from "next/link";
import { formatBaht, lineTotalBaht } from "@/lib/cart";
import { useCart } from "@/contexts/CartContext";

function MinusIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
}

export default function CartClient() {
  const { items, totalBaht, isHydrated, updateQuantity, removeItem, clearCart } = useCart();

  if (!isHydrated) {
    return (
      <div className="rounded-xl border-2 border-neutral-300 bg-white p-10 text-center text-sm text-foreground">
        กำลังโหลดตะกร้า...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border-2 border-neutral-300 bg-white p-10 text-center">
        <p className="text-lg font-bold text-foreground">ตะกร้าว่าง</p>
        <p className="mt-2 text-sm text-foreground/70">
          ยังไม่มีสินค้าในตะกร้า เลือกชมสินค้าและเพิ่มลงตะกร้าได้เลย
        </p>
        <Link
          href="/search"
          className="mt-6 inline-flex rounded-full bg-red px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-red-dark"
        >
          เลือกชมสินค้า
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-8">
        {items.map((item) => (
          <article
            key={item.productId}
            className="flex gap-4 rounded-xl border-2 border-neutral-300 bg-white p-4 sm:gap-6 sm:p-5"
          >
            <Link
              href={`/product/${item.productId}`}
              className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-cream sm:h-28 sm:w-24"
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-contain p-1"
                sizes="96px"
              />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col">
              <Link
                href={`/product/${item.productId}`}
                className="line-clamp-2 text-sm font-bold text-foreground hover:text-red sm:text-base"
              >
                {item.name}
              </Link>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {formatBaht(item.priceBaht)} / ชิ้น
              </p>

              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                <div className="flex items-center overflow-hidden rounded-full border-2 border-neutral-300 bg-white">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="flex h-9 w-9 items-center justify-center hover:bg-gray-light"
                    aria-label="ลดจำนวน"
                  >
                    <MinusIcon />
                  </button>
                  <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="flex h-9 w-9 items-center justify-center hover:bg-gray-light"
                    aria-label="เพิ่มจำนวน"
                  >
                    <PlusIcon />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-sm font-bold text-foreground sm:text-base">
                    {formatBaht(lineTotalBaht(item.priceBaht, item.quantity))}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-red-light hover:text-red"
                    aria-label="ลบสินค้า"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}

        <button
          type="button"
          onClick={clearCart}
          className="text-sm font-semibold text-foreground underline-offset-2 hover:text-red hover:underline"
        >
          ล้างตะกร้าทั้งหมด
        </button>
      </div>

      <aside className="lg:col-span-4">
        <div className="rounded-xl border-2 border-neutral-300 bg-white p-6 lg:sticky lg:top-24">
          <h2 className="mb-4 text-lg font-bold">สรุปคำสั่งซื้อ</h2>
          <div className="space-y-2 border-b-2 border-neutral-200 pb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/70">จำนวนสินค้า</span>
              <span className="font-semibold">{items.reduce((sum, item) => sum + item.quantity, 0)} ชิ้น</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">ยอดรวม</span>
              <span className="text-xl font-bold">{formatBaht(totalBaht)}</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-foreground/70">
            ชำระเงินอย่างปลอดภัย
          </p>
          <Link
            href="/checkout"
            className="mt-5 flex w-full items-center justify-center rounded-full bg-red px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-red-dark"
          >
            ดำเนินการชำระเงิน
          </Link>
          <Link
            href="/search"
            className="mt-3 flex w-full items-center justify-center rounded-full border-2 border-neutral-300 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-gray-light"
          >
            เลือกซื้อสินค้าเพิ่ม
          </Link>
        </div>
      </aside>
    </div>
  );
}
