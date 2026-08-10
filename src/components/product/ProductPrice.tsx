import {
  formatPrice,
  getProductDiscountPercent,
  getProductEffectivePrice,
  isProductOnSale,
  type ProductPricing,
} from "@/lib/site-data";

type ProductPriceProps = {
  product: ProductPricing;
  size?: "sm" | "lg";
  className?: string;
};

export default function ProductPrice({
  product,
  size = "sm",
  className = "",
}: ProductPriceProps) {
  const onSale = isProductOnSale(product);
  const effectivePrice = getProductEffectivePrice(product);
  const discountPercent = getProductDiscountPercent(product);

  if (product.price === 0) {
    return (
      <p className={`font-bold text-foreground ${size === "lg" ? "text-3xl sm:text-4xl" : "text-sm sm:text-base"} ${className}`}>
        {formatPrice(0)}
      </p>
    );
  }

  if (!onSale) {
    return (
      <p className={`font-bold text-red ${size === "lg" ? "text-3xl sm:text-4xl" : "text-sm sm:text-base"} ${className}`}>
        {formatPrice(product.price)}
      </p>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        <p className={`font-bold text-red ${size === "lg" ? "text-3xl sm:text-4xl" : "text-sm sm:text-base"}`}>
          {formatPrice(effectivePrice)}
        </p>
        <span className="rounded-full bg-red px-2 py-0.5 text-xs font-bold text-white">
          -{discountPercent}%
        </span>
      </div>
      <p className={`text-gray-text/60 line-through ${size === "lg" ? "text-lg" : "text-xs sm:text-sm"}`}>
        {formatPrice(product.price)}
      </p>
    </div>
  );
}

export function ProductSaleBadge({ product }: { product: ProductPricing }) {
  if (!isProductOnSale(product)) return null;

  return (
    <span className="absolute left-2 top-2 z-10 rounded-full bg-red px-2.5 py-1 text-xs font-bold text-white shadow-sm">
      ลด {getProductDiscountPercent(product)}%
    </span>
  );
}
