import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  defaultOrderGuideContent,
  ORDER_GUIDE_CONTENT_ID,
} from "@/lib/order-guide-defaults";
import { getOrderGuideContent } from "@/lib/order-guide";
import type {
  OrderGuideContent,
  OrderGuideSection,
  OrderGuideStep,
} from "@/lib/order-guide-types";
import { sanitizeHtml } from "@/lib/sanitize-html";

function normalizeContent(input: Partial<OrderGuideContent>): OrderGuideContent {
  const steps = (input.steps ?? [])
    .filter(
      (step): step is OrderGuideStep =>
        !!step &&
        typeof step.title === "string" &&
        typeof step.description === "string",
    )
    .map((step) => ({
      title: step.title.trim(),
      description: step.description.trim(),
    }))
    .filter((step) => step.title || step.description);

  const sections = (input.sections ?? [])
    .filter(
      (section): section is OrderGuideSection =>
        !!section &&
        typeof section.title === "string" &&
        typeof section.bodyHtml === "string",
    )
    .map((section) => ({
      title: section.title.trim(),
      bodyHtml: sanitizeHtml(section.bodyHtml.trim()),
    }))
    .filter((section) => section.title || section.bodyHtml);

  return {
    title: (input.title ?? "").trim() || defaultOrderGuideContent.title,
    subtitle: (input.subtitle ?? "").trim(),
    stepsHeading:
      (input.stepsHeading ?? "").trim() || defaultOrderGuideContent.stepsHeading,
    steps: steps.length > 0 ? steps : defaultOrderGuideContent.steps,
    sections: sections.length > 0 ? sections : defaultOrderGuideContent.sections,
  };
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const content = await getOrderGuideContent();
  return NextResponse.json({ content });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<OrderGuideContent>;
    const content = normalizeContent(body);

    await db.siteContent.upsert({
      where: { id: ORDER_GUIDE_CONTENT_ID },
      update: { content },
      create: { id: ORDER_GUIDE_CONTENT_ID, content },
    });

    revalidatePath("/order-guide");
    revalidatePath("/");

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Failed to save order guide:", error);
    return NextResponse.json({ error: "บันทึกไม่สำเร็จ" }, { status: 500 });
  }
}
