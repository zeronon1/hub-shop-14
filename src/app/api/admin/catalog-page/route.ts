import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CATALOG_PAGE_CONTENT_ID } from "@/lib/catalog-page-defaults";
import {
  getCatalogPageContent,
  normalizeCatalogPageContent,
} from "@/lib/catalog-page";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const content = await getCatalogPageContent();
  return NextResponse.json({ content });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const content = normalizeCatalogPageContent(body);

    await db.siteContent.upsert({
      where: { id: CATALOG_PAGE_CONTENT_ID },
      update: { content },
      create: { id: CATALOG_PAGE_CONTENT_ID, content },
    });

    revalidatePath("/catalog");

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Failed to save catalog page:", error);
    return NextResponse.json({ error: "บันทึกไม่สำเร็จ" }, { status: 500 });
  }
}
