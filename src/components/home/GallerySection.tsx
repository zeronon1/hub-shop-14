import Image from "next/image";
import type { HomeGalleryImage } from "@/lib/homepage-types";

type GallerySectionProps = {
  images: HomeGalleryImage[];
};

export default function GallerySection({ images }: GallerySectionProps) {
  return (
    <section className="overflow-hidden bg-surface-gradient pb-12 sm:pb-16 lg:pb-20">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {images.map((image, index) => (
          <div key={`${image.src}-${index}`} className="relative aspect-square overflow-hidden">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
