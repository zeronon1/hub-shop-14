import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/lib/db";
import {
  defaultOrderGuideContent,
  ORDER_GUIDE_CONTENT_ID,
} from "@/lib/order-guide-defaults";
import type {
  OrderGuideContent,
  OrderGuideSection,
  OrderGuideStep,
} from "@/lib/order-guide-types";

function isStep(value: unknown): value is OrderGuideStep {
  if (!value || typeof value !== "object") return false;
  const step = value as Record<string, unknown>;
  return typeof step.title === "string" && typeof step.description === "string";
}

function isSection(value: unknown): value is OrderGuideSection {
  if (!value || typeof value !== "object") return false;
  const section = value as Record<string, unknown>;
  return typeof section.title === "string" && typeof section.bodyHtml === "string";
}

function normalizeContent(raw: Partial<OrderGuideContent>): OrderGuideContent {
  const steps = Array.isArray(raw.steps)
    ? raw.steps.filter(isStep).map((step) => ({
        title: step.title.trim(),
        description: step.description.trim(),
      }))
    : [];

  const sections = Array.isArray(raw.sections)
    ? raw.sections.filter(isSection).map((section) => ({
        title: section.title.trim(),
        bodyHtml: section.bodyHtml.trim(),
      }))
    : [];

  return {
    title: (raw.title ?? "").trim() || defaultOrderGuideContent.title,
    subtitle: (raw.subtitle ?? "").trim() || defaultOrderGuideContent.subtitle,
    stepsHeading:
      (raw.stepsHeading ?? "").trim() || defaultOrderGuideContent.stepsHeading,
    steps: steps.length > 0 ? steps : defaultOrderGuideContent.steps,
    sections: sections.length > 0 ? sections : defaultOrderGuideContent.sections,
  };
}

function isStructuredContent(value: unknown): value is OrderGuideContent {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return (
    typeof data.title === "string" &&
    typeof data.subtitle === "string" &&
    Array.isArray(data.steps) &&
    Array.isArray(data.sections)
  );
}

export async function getOrderGuideContent(): Promise<OrderGuideContent> {
  noStore();

  try {
    const row = await db.siteContent.findUnique({
      where: { id: ORDER_GUIDE_CONTENT_ID },
    });

    if (row && isStructuredContent(row.content)) {
      return normalizeContent(row.content);
    }
  } catch {
    // DB unavailable — fall back to defaults
  }

  return defaultOrderGuideContent;
}
