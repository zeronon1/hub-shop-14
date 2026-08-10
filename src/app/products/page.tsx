import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CatalogHero from "@/components/products/CatalogHero";
import ProductListClient from "@/components/products/ProductListClient";
import { listCategories } from "@/lib/cms/categories";
import { listProducts } from "@/lib/cms/products";
import { defaultCatalogBanner } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "รวมสินค้า | Momotaro Shop",
  description:
    "เลือกชมโมเดล ฟิกเกอร์ และของสะสมลิขสิทธิ์จากประเทศญี่ปุ่น ทุกซีรีส์ยอดนิยมจากร้าน Momotaro Shop",
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([listProducts(), listCategories()]);

  return (
    <>
      <Header />
      <main className="bg-cream/40">
        <CatalogHero
          title="รวมสินค้า"
          description="รวมโมเดล ฟิกเกอร์ และของสะสมลิขสิทธิ์ทุกหมวดหมู่ — กรองตามซีรีส์ ราคา เรียงลำดับ หรือค้นหาชื่อสินค้าได้ทันที"
          banner={defaultCatalogBanner}
        />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:px-8">
          <ProductListClient
            products={products}
            categories={categories.map((category) => ({
              id: category.slug,
              label: category.label,
            }))}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
