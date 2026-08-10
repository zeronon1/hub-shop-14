import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SITE_CONTACT_CONTENT_ID } from "@/lib/site-contact-defaults";
import { getSiteContactInfo, normalizeSiteContactInfo } from "@/lib/site-contact";
import type { SiteContactInfo } from "@/lib/site-contact-types";

function revalidateSiteContactPaths() {
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/products");
  revalidatePath("/catalog");
  revalidatePath("/order-guide");
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contact = await getSiteContactInfo();
  return NextResponse.json({ contact });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<SiteContactInfo>;
    const contact = normalizeSiteContactInfo(body);

    await db.siteContent.upsert({
      where: { id: SITE_CONTACT_CONTENT_ID },
      update: { content: contact },
      create: { id: SITE_CONTACT_CONTENT_ID, content: contact },
    });

    revalidateSiteContactPaths();

    return NextResponse.json({ contact });
  } catch (error) {
    console.error("Failed to save site contact:", error);
    return NextResponse.json({ error: "บันทึกไม่สำเร็จ" }, { status: 500 });
  }
}
