import { listCategories } from "@/lib/cms/categories";
import { listProducts } from "@/lib/cms/products";
import ProductTabSection from "@/components/home/ProductTabSection";
import type { HomeBanner } from "@/lib/homepage-types";

type ProductTabSectionLoaderProps = {
  title: string;
  variant?: "default" | "recommend";
  darkBg?: boolean;
  recommendBanner?: HomeBanner;
};

export default async function ProductTabSectionLoader({
  title,
  variant,
  darkBg,
  recommendBanner,
}: ProductTabSectionLoaderProps) {
  const [categories, products] = await Promise.all([listCategories(), listProducts()]);
  const tabs = categories.map((category) => ({
    id: category.slug,
    label: category.label,
  }));

  return (
    <ProductTabSection
      title={title}
      variant={variant}
      darkBg={darkBg}
      tabs={tabs}
      products={products}
      recommendBanner={recommendBanner}
    />
  );
}
