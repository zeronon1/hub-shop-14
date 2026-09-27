import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CatalogHero from "@/components/products/CatalogHero";
import CategoryGrid from "@/components/products/CategoryGrid";
import { listCategories } from "@/lib/cms/categories";
import { defaultCatalogBanner } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "หมวดหมู่รวม | One Box Shop",
  description:
    "เลือกชมหมวดหมู่สินค้า One Piece, Demon Slayer, Naruto, My Hero Academia, Jujutsu Kaisen และอีกมากมาย จากร้าน Momotaro Shop",
};

export default async function CatalogPage() {
  const categories = await listCategories();

  return (
    <>
      <Header />
      <main className="bg-cream/40">
        <CatalogHero
          title="หมวดหมู่รวม"
          description="เลือกหมวดหมู่ที่สนใจเพื่อดูสินค้าเฉพาะซีรีส์ — แต่ละหมวดมี banner และสินค้าแยกตามซีรีส์"
          banner={defaultCatalogBanner}
        />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:px-8">
          <CategoryGrid categories={categories} />
          <p className="mt-10 text-center text-sm text-gray-text/70 sm:text-base">
            ต้องการดูสินค้าทุกหมวดพร้อมกัน?{" "}
            <Link href="/products" className="font-semibold text-red transition-colors hover:text-red/80">
              ไปหน้ารวมสินค้า
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
