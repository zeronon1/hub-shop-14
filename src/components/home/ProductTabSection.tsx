"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import ProductCard from "@/components/home/ProductCard";
import type { HomeBanner } from "@/lib/homepage-types";
import type { Product } from "@/lib/site-data";

const NEW_ARRIVAL_BG = "/bg/bg-new-arrival-washi-seigaiha-clouds.png";

type TabOption = {
  id: string;
  label: string;
};

type ProductTabSectionProps = {
  title: string;
  variant?: "default" | "recommend";
  darkBg?: boolean;
  tabs: TabOption[];
  products: Product[];
  recommendBanner?: HomeBanner;
};

export default function ProductTabSection({
  title,
  variant = "default",
  darkBg = false,
  tabs,
  products,
  recommendBanner,
}: ProductTabSectionProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "");
  const isRecommend = variant === "recommend";

  const sectionProducts = useMemo(() => {
    const typeFiltered = isRecommend
      ? products.filter((product) => product.isRecommend)
      : products.filter((product) => product.isNew);

    // ถ้ายังไม่มีสินค้าที่ติ๊กประเภทไว้ ให้แสดงสินค้าทั้งหมดแทน (ไม่ให้หน้าแรกว่าง)
    return typeFiltered.length > 0 ? typeFiltered : products;
  }, [products, isRecommend]);

  const visibleProducts = useMemo(() => {
    const filtered = sectionProducts.filter((product) => product.category === activeTab);
    return filtered.length > 0 ? filtered.slice(0, 4) : sectionProducts.slice(0, 4);
  }, [sectionProducts, activeTab]);

  if (tabs.length === 0 || products.length === 0) return null;

  const sectionBg = !isRecommend && darkBg ? NEW_ARRIVAL_BG : null;

  return (
    <section
      className={`px-4 py-12 sm:py-16 lg:px-8 lg:py-20 ${
        isRecommend
          ? "bg-black"
          : sectionBg
            ? "bg-cover bg-center bg-no-repeat"
            : "bg-white"
      }`}
      style={sectionBg ? { backgroundImage: `url(${sectionBg})` } : undefined}
    >
      <div className="mx-auto max-w-7xl">
        <h2
          className={`mb-8 text-center text-2xl font-bold sm:text-3xl ${
            isRecommend ? "text-white" : ""
          }`}
        >
          {title}
        </h2>

        {isRecommend && recommendBanner ? (
          <div className="relative mb-10 aspect-[21/7] overflow-hidden rounded-sm sm:aspect-[21/6]">
            <Image
              src={recommendBanner.image}
              alt={recommendBanner.alt}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        ) : null}

        <div className="-mx-4 mb-8 flex gap-x-4 gap-y-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:gap-x-6 sm:overflow-visible sm:px-0 sm:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 text-xs font-medium transition-colors sm:text-sm ${
                activeTab === tab.id
                  ? isRecommend
                    ? "text-white underline decoration-2 underline-offset-4 decoration-white"
                    : "text-red underline decoration-2 underline-offset-4 decoration-red"
                  : isRecommend
                    ? "text-white/85 hover:text-white"
                    : "text-foreground hover:text-red"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
