import ProductCard from "@/components/home/ProductCard";
import type { Product } from "@/lib/site-data";

type RelatedProductsSectionProps = {
  title: string;
  products: Product[];
  columns?: 2 | 4;
};

export default function RelatedProductsSection({
  title,
  products,
  columns = 4,
}: RelatedProductsSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="border-t-2 border-neutral-300 pt-12 sm:pt-14">
      <h2 className="mb-8 text-lg font-bold sm:text-xl">{title}</h2>
      <div
        className={
          columns === 2
            ? "grid grid-cols-2 gap-5 sm:max-w-xl sm:gap-6"
            : "grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4"
        }
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
