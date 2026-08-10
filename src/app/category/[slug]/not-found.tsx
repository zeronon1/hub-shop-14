import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function CategoryNotFound() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="mb-3 text-2xl font-bold">ไม่พบหมวดหมู่</h1>
        <p className="mb-8 text-foreground">
          หมวดหมู่ที่คุณค้นหาอาจไม่มีอยู่ในระบบ
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/catalog"
            className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-red/40 hover:text-red"
          >
            ดูหมวดหมู่รวม
          </Link>
          <Link
            href="/products"
            className="rounded-full bg-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-dark"
          >
            ดูรวมสินค้า
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
