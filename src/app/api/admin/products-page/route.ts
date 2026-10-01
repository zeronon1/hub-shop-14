import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PRODUCTS_PAGE_CONTENT_ID } from "@/lib/products-page-defaults";
import {
  getProductsPageContent,
  normalizeProductsPageContent,
} from "@/lib/products-page";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const content = await getProductsPageContent();
  return NextResponse.json({ content });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const content = normalizeProductsPageContent(body);

    await db.siteContent.upsert({
      where: { id: PRODUCTS_PAGE_CONTENT_ID },
      update: { content },
      create: { id: PRODUCTS_PAGE_CONTENT_ID, content },
    });

    revalidatePath("/products");

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Failed to save products page:", error);
    return NextResponse.json({ error: "บันทึกไม่สำเร็จ" }, { status: 500 });
  }
}
