import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/lib/db";
import {
  CONTACT_PAGE_CONTENT_ID,
  defaultContactPageContent,
} from "@/lib/contact-page-defaults";
import type {
  ContactPageContent,
  ContactPageTopic,
} from "@/lib/contact-page-types";

function trimString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function normalizeTopics(raw: unknown): ContactPageTopic[] {
  if (!Array.isArray(raw)) return defaultContactPageContent.topics;

  const topics = raw
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const data = item as Record<string, unknown>;
      return {
        title: trimString(data.title),
        description: trimString(data.description),
      };
    })
    .filter((topic) => topic.title && topic.description);

  return topics.length > 0 ? topics : defaultContactPageContent.topics;
}

function normalizeTips(raw: unknown): string[] {
  if (!Array.isArray(raw)) return defaultContactPageContent.tips;

  const tips = raw
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  return tips.length > 0 ? tips : defaultContactPageContent.tips;
}

export function normalizeContactPageContent(
  input: Partial<ContactPageContent>,
): ContactPageContent {
  const fallback = defaultContactPageContent;
  const lineQrRaw: Partial<ContactPageContent["lineQr"]> =
    input.lineQr && typeof input.lineQr === "object" ? input.lineQr : {};

  return {
    title: trimString(input.title, fallback.title) || fallback.title,
    subtitle: trimString(input.subtitle, fallback.subtitle) || fallback.subtitle,
    intro: trimString(input.intro, fallback.intro) || fallback.intro,
    about: trimString(input.about, fallback.about) || fallback.about,
    hoursNote: trimString(input.hoursNote, fallback.hoursNote) || fallback.hoursNote,
    topicsTitle:
      trimString(input.topicsTitle, fallback.topicsTitle) || fallback.topicsTitle,
    topics: normalizeTopics(input.topics),
    channelsTitle:
      trimString(input.channelsTitle, fallback.channelsTitle) ||
      fallback.channelsTitle,
    channelsIntro:
      trimString(input.channelsIntro, fallback.channelsIntro) ||
      fallback.channelsIntro,
    lineQr: {
      src: trimString(lineQrRaw.src, fallback.lineQr.src) || fallback.lineQr.src,
      alt: trimString(lineQrRaw.alt, fallback.lineQr.alt) || fallback.lineQr.alt,
      caption:
        trimString(lineQrRaw.caption, fallback.lineQr.caption) ||
        fallback.lineQr.caption,
    },
    tipsTitle: trimString(input.tipsTitle, fallback.tipsTitle) || fallback.tipsTitle,
    tips: normalizeTips(input.tips),
  };
}

function isContactPageContent(value: unknown): value is ContactPageContent {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return typeof data.title === "string" && Array.isArray(data.topics);
}

export async function getContactPageContent(): Promise<ContactPageContent> {
  noStore();

  try {
    const row = await db.siteContent.findUnique({
      where: { id: CONTACT_PAGE_CONTENT_ID },
    });

    if (row && isContactPageContent(row.content)) {
      return normalizeContactPageContent(row.content);
    }
  } catch {
    // DB unavailable — fall back to defaults
  }

  return defaultContactPageContent;
}
