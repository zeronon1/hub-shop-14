import Image from "next/image";
import type { CatalogBanner } from "@/lib/site-data";

type CatalogHeroProps = {
  title: string;
  description: string;
  banner: CatalogBanner;
};

export default function CatalogHero({
  title,
  description,
  banner,
}: CatalogHeroProps) {
  return (
    <div className="border-b border-black/5 bg-white">
      <div className="relative w-full overflow-hidden bg-black">
        <div className="relative aspect-[21/9] w-full sm:aspect-[21/8] lg:aspect-[21/7]">
          <Image
            src={banner.image}
            alt={banner.alt}
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 lg:px-8">
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-text/70 sm:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}
