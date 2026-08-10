import Image from "next/image";
import type { HomeBanner } from "@/lib/homepage-types";

type HeroCarouselProps = {
  banner: HomeBanner;
};

export default function HeroCarousel({ banner }: HeroCarouselProps) {
  return (
    <section className="relative w-full max-w-full overflow-hidden bg-black">
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
        <Image
          src={banner.image}
          alt={banner.alt}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </div>
    </section>
  );
}
