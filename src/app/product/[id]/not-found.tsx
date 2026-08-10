import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ProductNotFound() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="mb-3 text-2xl font-bold">ไม่พบสินค้า</h1>
        <p className="mb-8 text-foreground">
          สินค้าที่คุณค้นหาอาจถูกลบหรือไม่มีอยู่ในระบบ
        </p>
        <Link
          href="/products"
          className="rounded-full bg-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-dark"
        >
          ดูรวมสินค้า
        </Link>
      </main>
      <Footer />
    </>
  );
}
