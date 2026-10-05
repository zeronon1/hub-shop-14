import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/lib/db";
import {
  CATALOG_PAGE_CONTENT_ID,
  defaultCatalogPageContent,
  type CatalogPageContent,
} from "@/lib/catalog-page-defaults";

function trimString(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

export function normalizeCatalogPageContent(raw: unknown): CatalogPageContent {
  const data = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const banner =
    data.banner && typeof data.banner === "object"
      ? (data.banner as Record<string, unknown>)
      : {};

  return {
    title: trimString(data.title, defaultCatalogPageContent.title),
    description: trimString(data.description, defaultCatalogPageContent.description),
    banner: {
      image: trimString(banner.image, defaultCatalogPageContent.banner.image),
      alt: trimString(banner.alt, defaultCatalogPageContent.banner.alt),
    },
  };
}

export async function getCatalogPageContent(): Promise<CatalogPageContent> {
  noStore();

  try {
    const row = await db.siteContent.findUnique({
      where: { id: CATALOG_PAGE_CONTENT_ID },
    });

    if (row) {
      return normalizeCatalogPageContent(row.content);
    }
  } catch {
    // DB unavailable — fall back to the current public copy
  }

  return defaultCatalogPageContent;
}
