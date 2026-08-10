import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CheckoutResultClient from "@/components/cart/CheckoutResultClient";

export const metadata: Metadata = {
  title: "ชำระเงินสำเร็จ | Momotaro Shop",
  description: "ขอบคุณสำหรับการสั่งซื้อ",
};

type SuccessPageProps = {
  searchParams: Promise<{ order?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const orderNo = params.order;

  return (
    <>
      <Header />
      <main className="bg-cream/40">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:py-24 lg:px-8">
          <div className="rounded-xl border-2 border-neutral-300 bg-white p-8 text-center sm:p-10">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">ชำระเงินสำเร็จ</h1>
            <p className="mt-3 text-sm leading-relaxed text-foreground/70 sm:text-base">
              ขอบคุณสำหรับการสั่งซื้อ ทางร้านจะติดต่อยืนยันและจัดส่งสินค้าให้เร็วที่สุด
            </p>
            {orderNo ? (
              <p className="mt-4 text-sm font-semibold text-foreground">
                หมายเลขคำสั่งซื้อ: <span className="text-red">{orderNo}</span>
              </p>
            ) : null}
            <CheckoutResultClient clearOnMount />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/search"
                className="inline-flex items-center justify-center rounded-full bg-red px-6 py-3 text-sm font-bold text-white hover:bg-red-dark"
              >
                เลือกซื้อสินค้าเพิ่ม
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border-2 border-neutral-300 px-6 py-3 text-sm font-semibold hover:bg-gray-light"
              >
                กลับหน้าแรก
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
