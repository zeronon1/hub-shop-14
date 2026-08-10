import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductBreadcrumb from "@/components/product/ProductBreadcrumb";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import RelatedProductsSection from "@/components/product/RelatedProductsSection";
import {
  getProductDetail,
  getRecentlyViewedProducts,
  getRecommendedProducts,
  listProductIds,
} from "@/lib/cms/products";
import { getSiteContactInfo } from "@/lib/site-contact";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return listProductIds();
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductDetail(id);

  if (!product) {
    return { title: "ไม่พบสินค้า | Momotaro Shop" };
  }

  return {
    title: `${product.name} | Momotaro Shop`,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductDetail(id);

  if (!product) {
    notFound();
  }

  const recentlyViewed = await getRecentlyViewedProducts(product);
  const recommended = await getRecommendedProducts(product);
  const contact = await getSiteContactInfo();

  return (
    <>
      <Header />
      <main className="bg-cream/40">
        <ProductBreadcrumb productName={product.name} category={product.category} />
        <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:px-8">
          <ProductDetailClient product={product} contact={contact} />
          <div className="mt-16 space-y-16 sm:mt-20">
            <RelatedProductsSection
              title="สินค้าที่เข้าดูล่าสุด"
              products={recentlyViewed}
              columns={2}
            />
            <RelatedProductsSection
              title="แนะนำสำหรับคุณ"
              products={recommended}
              columns={4}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
