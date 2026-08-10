import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/lib/db";
import {
  defaultSiteNavigation,
  SITE_NAVIGATION_CONTENT_ID,
} from "@/lib/navigation-defaults";
import type { NavLink, SiteNavigation } from "@/lib/navigation-types";

function isNavLink(value: unknown): value is NavLink {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.label === "string" && typeof item.href === "string";
}

export function normalizeNavLinks(raw: unknown): NavLink[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(isNavLink)
    .map((item) => ({
      label: item.label.trim(),
      href: item.href.trim(),
    }))
    .filter((item) => item.label.length > 0 && item.href.length > 0);
}

export function normalizeSiteNavigation(
  raw: Partial<SiteNavigation> | null | undefined,
): SiteNavigation {
  return {
    header: normalizeNavLinks(raw?.header),
    footerHome: normalizeNavLinks(raw?.footerHome),
    footerMenu: normalizeNavLinks(raw?.footerMenu),
  };
}

function isStructuredNavigation(value: unknown): value is SiteNavigation {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return (
    Array.isArray(data.header) &&
    Array.isArray(data.footerHome) &&
    Array.isArray(data.footerMenu)
  );
}

export async function getSiteNavigation(): Promise<SiteNavigation> {
  noStore();

  try {
    const row = await db.siteContent.findUnique({
      where: { id: SITE_NAVIGATION_CONTENT_ID },
    });

    if (row && isStructuredNavigation(row.content)) {
      return normalizeSiteNavigation(row.content);
    }
  } catch {
    // DB unavailable — fall back to defaults
  }

  return defaultSiteNavigation;
}
