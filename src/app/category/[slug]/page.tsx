import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CatalogHero from "@/components/products/CatalogHero";
import ProductListClient from "@/components/products/ProductListClient";
import {
  getCatalogBannerForCategory,
  getCategoryBySlug,
  isValidCategorySlug,
  listCategories,
} from "@/lib/cms/categories";
import { getProductsByCategory, listProducts } from "@/lib/cms/products";

export const dynamic = "force-dynamic";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const categories = await listCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "ไม่พบหมวดหมู่ | One Box Shop" };
  }

  return {
    title: `${category.label} | หมวดหมู่รวม | One Box Shop`,
    description: `เลือกชมโมเดล ฟิกเกอร์ และของสะสม ${category.label} ลิขสิทธิ์แท้จากประเทศญี่ปุ่น ที่ร้าน Momotaro Shop`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  if (!(await isValidCategorySlug(slug))) {
    notFound();
  }

  const [category, products, categories, productCount, banner] = await Promise.all([
    getCategoryBySlug(slug),
    listProducts(),
    listCategories(),
    getProductsByCategory(slug, 999).then((items) => items.length),
    getCatalogBannerForCategory(slug),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="bg-cream/40">
        <CatalogHero
          title={category.label}
          description={`สินค้า ${category.label} ทั้งหมด ${productCount} รายการ — กรองตามราคา เรียงลำดับ หรือค้นหาชื่อสินค้าได้ทันที`}
          banner={banner}
        />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:px-8">
          <ProductListClient
            products={products}
            categories={categories.map((item) => ({
              id: item.slug,
              label: item.label,
            }))}
            initialCategories={[slug]}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
