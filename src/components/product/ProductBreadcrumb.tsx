import Link from "next/link";
import { getCategoryLabel } from "@/lib/site-data";

type ProductBreadcrumbProps = {
  productName: string;
  category: string;
};

export default function ProductBreadcrumb({
  productName,
  category,
}: ProductBreadcrumbProps) {
  const categoryLabel = getCategoryLabel(category);

  return (
    <nav
      aria-label="เส้นทางนำทาง"
      className="border-b-2 border-neutral-300 bg-white px-4 py-3.5 lg:px-8"
    >
      <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-1.5 text-xs text-foreground sm:text-sm">
        <li>
          <Link href="/" className="transition-colors hover:text-red">
            หน้าแรก
          </Link>
        </li>
        <li aria-hidden="true" className="text-foreground/40">
          /
        </li>
        <li>
          <Link href="/catalog" className="transition-colors hover:text-red">
            หมวดหมู่รวม
          </Link>
        </li>
        <li aria-hidden="true" className="text-foreground/40">
          /
        </li>
        <li>
          <Link
            href={`/category/${category}`}
            className="transition-colors hover:text-red"
          >
            {categoryLabel}
          </Link>
        </li>
        <li aria-hidden="true" className="text-foreground/40">
          /
        </li>
        <li className="line-clamp-1 font-medium text-foreground">
          {productName}
        </li>
      </ol>
    </nav>
  );
}
