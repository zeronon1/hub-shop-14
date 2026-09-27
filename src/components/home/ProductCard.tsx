import Image from "next/image";
import Link from "next/link";
import ProductPrice, { ProductSaleBadge } from "@/components/product/ProductPrice";
import { type Product } from "@/lib/site-data";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.16)]"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-white">
        <ProductSaleBadge product={product} />
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      <div className="flex flex-1 flex-col px-3.5 pb-4 pt-3 sm:px-4">
        <h3 className="mb-2 line-clamp-2 text-xs font-medium leading-snug text-foreground sm:text-sm">
          {product.name}
        </h3>
        <ProductPrice product={product} />
      </div>
    </Link>
  );
}
