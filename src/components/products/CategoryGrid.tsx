import Image from "next/image";
import Link from "next/link";
import type { CategoryRecord } from "@/lib/cms/categories";
import { getCategoryImageFallback } from "@/lib/site-data";

type CategoryGridProps = {
  categories: CategoryRecord[];
};

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {categories.map((category) => {
        const image = category.image ?? getCategoryImageFallback(category.slug);

        return (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="group flex flex-col overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red/40 hover:shadow-lg"
          >
            <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-gray-light p-6 sm:p-8">
              {image ? (
                <Image
                  src={image}
                  alt={category.label}
                  fill
                  className="object-contain object-center p-4 transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <span className="text-center text-lg font-bold text-foreground/60">
                  {category.label}
                </span>
              )}
            </div>

            <div className="flex min-h-[52px] shrink-0 items-center justify-center border-t-2 border-white/30 bg-panel-gradient px-3 py-3 sm:min-h-[56px] sm:py-3.5">
              <span className="text-center text-sm font-bold uppercase tracking-wide text-white sm:text-base">
                {category.label}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
