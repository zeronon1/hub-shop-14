import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/lib/db";
import type { CatalogBanner, ProductTabId } from "@/lib/site-data";
import { catalogBanners, defaultCatalogBanner, productTabs } from "@/lib/site-data";

export type CategoryRecord = {
  id: string;
  slug: string;
  label: string;
  image: string | null;
  bannerImage: string | null;
  bannerAlt: string | null;
  sortOrder: number;
  isActive: boolean;
};

function mapCategory(row: {
  id: string;
  slug: string;
  label: string;
  image: string | null;
  bannerImage: string | null;
  bannerAlt: string | null;
  sortOrder: number;
  isActive: boolean;
}): CategoryRecord {
  return {
    id: row.id,
    slug: row.slug,
    label: row.label,
    image: row.image,
    bannerImage: row.bannerImage,
    bannerAlt: row.bannerAlt,
    sortOrder: row.sortOrder,
    isActive: row.isActive,
  };
}

export async function listCategories(options?: { includeInactive?: boolean }) {
  noStore();

  try {
    const rows = await db.category.findMany({
      where: options?.includeInactive ? undefined : { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
    });

    if (rows.length === 0) {
      return productTabs.map((tab, index) => ({
        id: tab.id,
        slug: tab.id,
        label: tab.label,
        image: null,
        bannerImage: null,
        bannerAlt: null,
        sortOrder: index,
        isActive: true,
      }));
    }

    return rows.map(mapCategory);
  } catch {
    return productTabs.map((tab, index) => ({
      id: tab.id,
      slug: tab.id,
      label: tab.label,
      image: null,
      bannerImage: null,
      bannerAlt: null,
      sortOrder: index,
      isActive: true,
    }));
  }
}

export async function getCategoryBySlug(slug: string) {
  noStore();

  try {
    const row = await db.category.findUnique({ where: { slug } });
    if (!row || !row.isActive) {
      const fallback = productTabs.find((tab) => tab.id === slug);
      if (!fallback) return null;
      return {
        id: fallback.id,
        slug: fallback.id,
        label: fallback.label,
        image: null,
        bannerImage: null,
        bannerAlt: null,
        sortOrder: 0,
        isActive: true,
      };
    }
    return mapCategory(row);
  } catch {
    const fallback = productTabs.find((tab) => tab.id === slug);
    if (!fallback) return null;
    return {
      id: fallback.id,
      slug: fallback.id,
      label: fallback.label,
      image: null,
      bannerImage: null,
      bannerAlt: null,
      sortOrder: 0,
      isActive: true,
    };
  }
}

export async function getCatalogBannerForCategory(slug?: string): Promise<CatalogBanner> {
  if (!slug) return defaultCatalogBanner;

  const category = await getCategoryBySlug(slug);
  if (category?.bannerImage) {
    return {
      image: category.bannerImage,
      alt: category.bannerAlt ?? category.label,
    };
  }

  const staticBanner = catalogBanners[slug as ProductTabId];
  if (staticBanner) return staticBanner;

  return defaultCatalogBanner;
}

export async function isValidCategorySlug(slug: string) {
  const category = await getCategoryBySlug(slug);
  return category !== null;
}

export async function getCategoryLabelFromSlug(slug: string) {
  const category = await getCategoryBySlug(slug);
  return category?.label ?? slug;
}
