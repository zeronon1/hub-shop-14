import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { HOMEPAGE_CONTENT_ID } from "@/lib/homepage-defaults";
import { getHomepageContent, normalizeHomepageContent } from "@/lib/homepage";
import type { HomepageContent } from "@/lib/homepage-types";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const content = await getHomepageContent();
  return NextResponse.json({ content });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<HomepageContent>;
    const content = normalizeHomepageContent(body);

    await db.siteContent.upsert({
      where: { id: HOMEPAGE_CONTENT_ID },
      update: { content },
      create: { id: HOMEPAGE_CONTENT_ID, content },
    });

    revalidatePath("/");

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Failed to save homepage:", error);
    return NextResponse.json({ error: "บันทึกไม่สำเร็จ" }, { status: 500 });
  }
}
