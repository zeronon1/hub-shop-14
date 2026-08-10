"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const slides = [
  {
    src: "/banner/banner-hero-solar-calibration-industrial.png",
    alt: "ผู้นำด้านการสอบเทียบและตรวจสอบเครื่องมือวัดอุตสาหกรรม ครบวงจร ได้รับการรับรองมาตรฐาน ISO/IEC 17025:2017",
  },
  {
    src: "/banner/banner-hero-lab-calibration-technicians.png",
    alt: "ผู้นำด้านการสอบเทียบและตรวจสอบเครื่องมือวัดอุตสาหกรรม ครบวงจร ทีมช่างเทคนิคในห้องแล็บและโรงงาน",
  },
];

const INTERVAL_MS = 6000;

export default function HeroSection() {
  const [active, setActive] = useState(0);

  const goTo = useCallback((index: number) => {
    setActive((index + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => goTo(active + 1), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [active, goTo]);

  return (
    <section className="relative -mt-28">
      <div className="relative aspect-[4/3] w-full min-h-[240px] overflow-hidden sm:aspect-[16/9] sm:min-h-[360px] lg:aspect-[16/7] lg:min-h-[520px]">
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === active ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={index !== active}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={() => goTo(active - 1)}
          className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/50 sm:left-6 sm:h-10 sm:w-10 sm:text-base"
          aria-label="สไลด์ก่อนหน้า"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => goTo(active + 1)}
          className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/50 sm:right-6 sm:h-10 sm:w-10 sm:text-base"
          aria-label="สไลด์ถัดไป"
        >
          ›
        </button>

        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-4">
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => goTo(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === active
                  ? "w-8 bg-gold"
                  : "w-2.5 bg-white/60 hover:bg-white/80"
              }`}
              aria-label={`ไปสไลด์ที่ ${index + 1}`}
              aria-current={index === active ? "true" : undefined}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center px-4 py-4 sm:absolute sm:bottom-24 sm:left-8 sm:block sm:p-0 lg:bottom-28 lg:left-16">
        <Link
          href="#services"
          className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-full border-2 border-purple bg-white/95 px-6 py-3 text-sm font-medium text-purple shadow-md transition-colors hover:bg-white sm:w-auto sm:max-w-none sm:border-white sm:bg-transparent sm:text-white sm:shadow-none sm:hover:bg-white/10"
        >
          ดูบริการของเรา
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
