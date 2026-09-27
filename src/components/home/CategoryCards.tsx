import Image from "next/image";
import Link from "next/link";
import type { HomeCategoryCard } from "@/lib/homepage-types";

type CategoryCardsProps = {
  cards: HomeCategoryCard[];
};

export default function CategoryCards({ cards }: CategoryCardsProps) {
  return (
    <section className="bg-surface-gradient px-4 py-10 sm:py-14 lg:px-8 lg:py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {cards.map((card) => (
          <Link
            key={`${card.href}-${card.title}`}
            href={card.href}
            className="group flex h-full flex-col overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red/40 hover:shadow-lg"
          >
            <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-gray-light">
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            <div className="flex min-h-[52px] shrink-0 items-center justify-center border-t-2 border-white/30 bg-panel-gradient px-3 py-3 sm:min-h-[56px] sm:py-3.5">
              <span className="text-center text-sm font-bold uppercase tracking-wide text-white sm:text-base">
                {card.title}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
