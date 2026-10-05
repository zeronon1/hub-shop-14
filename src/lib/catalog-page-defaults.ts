import { defaultCatalogBanner } from "@/lib/site-data";

export const CATALOG_PAGE_CONTENT_ID = "catalog-page";

export type CatalogPageBanner = {
  image: string;
  alt: string;
};

export type CatalogPageContent = {
  title: string;
  description: string;
  banner: CatalogPageBanner;
};

/** ค่าเดียวกับที่หน้าหมวดหมู่รวมใช้อยู่ก่อนมีแถว CMS */
export const defaultCatalogPageContent: CatalogPageContent = {
  title: "หมวดหมู่รวม",
  description:
    "เลือกหมวดหมู่ที่สนใจเพื่อดูสินค้าเฉพาะซีรีส์ — แต่ละหมวดมี banner และสินค้าแยกตามซีรีส์",
  banner: {
    image: defaultCatalogBanner.image,
    alt: defaultCatalogBanner.alt,
  },
};
