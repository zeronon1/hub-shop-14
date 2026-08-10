"use client";

import Image from "next/image";
import type { HomeBrandLogo } from "@/lib/homepage-types";

type BrandSliderProps = {
  logos: HomeBrandLogo[];
};

export default function BrandSlider({ logos }: BrandSliderProps) {
  const doubled = [...logos, ...logos];

  return (
    <section className="max-w-full overflow-x-clip border-y border-black/5 bg-surface-gradient px-4 py-8 lg:px-8 lg:py-10">
      <div className="relative mx-auto max-w-7xl overflow-x-clip">
        <div className="overflow-x-clip">
          <div className="brand-scroll-track items-center gap-10 py-3 sm:gap-14">
            {doubled.map((logo, index) => (
              <div
                key={`${logo.alt}-${index}`}
                className="flex h-14 w-32 shrink-0 items-center justify-center sm:h-16 sm:w-40"
              >
                <Image
                  src={logo.image}
                  alt={logo.alt}
                  width={160}
                  height={64}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
