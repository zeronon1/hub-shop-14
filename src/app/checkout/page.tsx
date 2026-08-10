import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CheckoutClient from "@/components/cart/CheckoutClient";

export const metadata: Metadata = {
  title: "ชำระเงิน | Momotaro Shop",
  description: "กรอกข้อมูลและชำระเงินอย่างปลอดภัย",
};

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="bg-cream/40">
        <div className="border-b border-black/5 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 lg:px-8">
            <h1 className="text-2xl font-bold sm:text-3xl">ชำระเงิน</h1>
            <p className="mt-2 text-sm text-foreground/70 sm:text-base">
              กรอกข้อมูลจัดส่งแล้วชำระเงินอย่างปลอดภัย
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:px-8">
          <CheckoutClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
