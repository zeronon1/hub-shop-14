import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CONTACT_PAGE_CONTENT_ID } from "@/lib/contact-page-defaults";
import {
  getContactPageContent,
  normalizeContactPageContent,
} from "@/lib/contact-page";
import type { ContactPageContent } from "@/lib/contact-page-types";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const content = await getContactPageContent();
  return NextResponse.json({ content });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<ContactPageContent>;
    const content = normalizeContactPageContent(body);

    await db.siteContent.upsert({
      where: { id: CONTACT_PAGE_CONTENT_ID },
      update: { content },
      create: { id: CONTACT_PAGE_CONTENT_ID, content },
    });

    revalidatePath("/contact");

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Failed to save contact page:", error);
    return NextResponse.json({ error: "บันทึกไม่สำเร็จ" }, { status: 500 });
  }
}
