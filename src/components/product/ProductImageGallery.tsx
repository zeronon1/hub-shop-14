"use client";

import Image from "next/image";
import { useState } from "react";

type ProductImageGalleryProps = {
  images: string[];
  productName: string;
};

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiple = images.length > 1;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-5">
        {hasMultiple ? (
          <div
            className="flex gap-2 overflow-x-auto pb-1 lg:w-[88px] lg:shrink-0 lg:flex-col lg:overflow-visible lg:pb-0"
            role="tablist"
            aria-label="รูปสินค้า"
          >
            {images.map((img, index) => (
              <button
                key={`${img}-${index}`}
                type="button"
                role="tab"
                aria-selected={activeIndex === index}
                aria-label={`รูปที่ ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition-all sm:h-[88px] sm:w-[88px] lg:h-20 lg:w-full ${
                  activeIndex === index
                    ? "border-red ring-2 ring-red/20"
                    : "border-neutral-300 hover:border-neutral-400"
                }`}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  className="object-contain p-1.5"
                  sizes="88px"
                />
              </button>
            ))}
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <div className="overflow-hidden rounded-xl border-2 border-neutral-300 bg-white shadow-sm">
            <div className="relative aspect-square sm:aspect-[4/5] lg:aspect-[3/4]">
              <Image
                src={images[activeIndex]}
                alt={`${productName} - รูปที่ ${activeIndex + 1}`}
                fill
                className="object-contain p-5 sm:p-8 lg:p-10"
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority
              />
            </div>
          </div>
          {hasMultiple ? (
            <p className="mt-3 text-center text-xs font-medium text-foreground lg:text-left">
              {activeIndex + 1} / {images.length}
            </p>
          ) : null}
        </div>
      </div>

      {hasMultiple ? (
        <div>
          <p className="mb-3 text-sm font-semibold text-foreground">Gallery</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((img, index) => (
              <button
                key={`gallery-${img}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`group relative aspect-square overflow-hidden rounded-lg border-2 bg-white transition-all ${
                  activeIndex === index
                    ? "border-red ring-2 ring-red/20"
                    : "border-neutral-300 hover:border-neutral-400"
                }`}
              >
                <Image
                  src={img}
                  alt={`${productName} gallery ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
