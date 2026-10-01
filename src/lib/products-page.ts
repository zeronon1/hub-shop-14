import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/lib/db";
import {
  defaultProductsPageContent,
  PRODUCTS_PAGE_CONTENT_ID,
  type ProductsPageContent,
} from "@/lib/products-page-defaults";

function trimString(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

export function normalizeProductsPageContent(raw: unknown): ProductsPageContent {
  const data = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const banner =
    data.banner && typeof data.banner === "object"
      ? (data.banner as Record<string, unknown>)
      : {};

  return {
    title: trimString(data.title, defaultProductsPageContent.title),
    description: trimString(data.description, defaultProductsPageContent.description),
    banner: {
      image: trimString(banner.image, defaultProductsPageContent.banner.image),
      alt: trimString(banner.alt, defaultProductsPageContent.banner.alt),
    },
  };
}

export async function getProductsPageContent(): Promise<ProductsPageContent> {
  noStore();

  try {
    const row = await db.siteContent.findUnique({
      where: { id: PRODUCTS_PAGE_CONTENT_ID },
    });

    if (row) {
      return normalizeProductsPageContent(row.content);
    }
  } catch {
    // DB unavailable — fall back to the current public copy
  }

  return defaultProductsPageContent;
}
