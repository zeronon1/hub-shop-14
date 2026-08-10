import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "สมาชิก | Momotaro Shop",
  description: "เข้าสู่ระบบหรือสมัครสมาชิก Momotaro Shop เพื่อติดตามออเดอร์และรับสิทธิพิเศษ",
};

export default function AccountPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-cream/40">
        <div className="mx-auto max-w-lg px-4 py-10 sm:py-14 lg:px-8">
          <h1 className="mb-2 text-center text-2xl font-bold sm:text-3xl">สมาชิก</h1>
          <p className="mb-8 text-center text-sm text-foreground/70 sm:text-base">
            เข้าสู่ระบบเพื่อติดตามออเดอร์และรับสิทธิพิเศษจาก Momotaro Shop
          </p>

          <div className="space-y-4 rounded-xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">
                อีเมล
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-black/15 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-foreground/40 focus:border-red focus:ring-2 focus:ring-red/20"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold">
                รหัสผ่าน
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-black/15 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-foreground/40 focus:border-red focus:ring-2 focus:ring-red/20"
              />
            </div>
            <button
              type="button"
              className="w-full rounded-full bg-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-dark"
            >
              เข้าสู่ระบบ
            </button>
            <p className="text-center text-xs text-foreground/60 sm:text-sm">
              ระบบสมาชิกกำลังเตรียมเปิดให้บริการเร็วๆ นี้
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 text-sm">
            <Link href="/products" className="font-semibold text-red transition-colors hover:text-red-dark">
              ไปหน้ารวมสินค้า
            </Link>
            <Link href="/cart" className="text-foreground/70 transition-colors hover:text-red">
              ดูตะกร้าสินค้า
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
