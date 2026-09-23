import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/lib/db";
import {
  defaultSiteContactInfo,
  SITE_CONTACT_CONTENT_ID,
} from "@/lib/site-contact-defaults";
import type { SiteContactInfo } from "@/lib/site-contact-types";

function trimString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function normalizeStringList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizePhonesFromText(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function normalizeSiteContactInfo(
  input: Partial<SiteContactInfo>,
): SiteContactInfo {
  const fallback = defaultSiteContactInfo;

  const addressRaw =
    input.address && typeof input.address === "object" ? input.address : null;

  const line1 = trimString(addressRaw?.line1);
  const line2 = trimString(addressRaw?.line2);
  const address = line1 || line2 ? { line1, line2 } : null;

  const emails = normalizeStringList(input.emails);
  const phones = normalizeStringList(input.phones);

  return {
    companyName:
      trimString(input.companyName, fallback.companyName) || fallback.companyName,
    address,
    phones,
    emails: emails.length > 0 ? emails : fallback.emails,
    lineId: trimString(input.lineId, fallback.lineId) || fallback.lineId,
    lineUrl: trimString(input.lineUrl, fallback.lineUrl) || fallback.lineUrl,
    facebookUrl:
      trimString(input.facebookUrl, fallback.facebookUrl) || fallback.facebookUrl,
    facebookPageName:
      trimString(input.facebookPageName, fallback.facebookPageName) ||
      fallback.facebookPageName,
    instagramUrl: trimString(input.instagramUrl),
    youtubeUrl: trimString(input.youtubeUrl),
    tiktokUrl:
      trimString(input.tiktokUrl, fallback.tiktokUrl) || fallback.tiktokUrl,
    tiktokHandle:
      trimString(input.tiktokHandle, fallback.tiktokHandle) ||
      fallback.tiktokHandle,
    mapEmbedUrl: trimString(input.mapEmbedUrl) || null,
    businessHours:
      trimString(input.businessHours, fallback.businessHours) ||
      fallback.businessHours,
  };
}

export function phonesToText(phones: string[]) {
  return phones.join("\n");
}

export function emailsToText(emails: string[]) {
  return emails.join("\n");
}

export { normalizePhonesFromText };

function isSiteContactInfo(value: unknown): value is SiteContactInfo {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return typeof data.lineUrl === "string" && Array.isArray(data.emails);
}

export async function getSiteContactInfo(): Promise<SiteContactInfo> {
  noStore();

  try {
    const row = await db.siteContent.findUnique({
      where: { id: SITE_CONTACT_CONTENT_ID },
    });

    if (row && isSiteContactInfo(row.content)) {
      return normalizeSiteContactInfo(row.content);
    }
  } catch {
    // DB unavailable — fall back to defaults
  }

  return defaultSiteContactInfo;
}
