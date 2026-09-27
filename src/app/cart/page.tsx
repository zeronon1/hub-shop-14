import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartClient from "@/components/cart/CartClient";

export const metadata: Metadata = {
  title: "ตะกร้าสินค้า | One Box Shop",
  description: "ตะกร้าสินค้าของคุณ — โมเดล ฟิกเกอร์ และของสะสมลิขสิทธิ์จาก Momotaro Shop",
};

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="bg-cream/40">
        <div className="border-b border-black/5 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 lg:px-8">
            <h1 className="text-2xl font-bold sm:text-3xl">ตะกร้าสินค้า</h1>
            <p className="mt-2 text-sm text-foreground/70 sm:text-base">
              ตรวจสอบรายการสินค้าก่อนดำเนินการชำระเงิน
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:px-8">
          <CartClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
