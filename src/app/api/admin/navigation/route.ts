import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SITE_NAVIGATION_CONTENT_ID } from "@/lib/navigation-defaults";
import {
  getSiteNavigation,
  normalizeSiteNavigation,
} from "@/lib/navigation";
import type { SiteNavigation } from "@/lib/navigation-types";

function revalidateNavigationPaths() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/catalog");
  revalidatePath("/order-guide");
  revalidatePath("/contact");
  revalidatePath("/cart");
  revalidatePath("/account");
  revalidatePath("/checkout");
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const navigation = await getSiteNavigation();
  return NextResponse.json({ navigation });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<SiteNavigation>;
    const navigation = normalizeSiteNavigation(body);

    await db.siteContent.upsert({
      where: { id: SITE_NAVIGATION_CONTENT_ID },
      update: { content: navigation },
      create: { id: SITE_NAVIGATION_CONTENT_ID, content: navigation },
    });

    revalidateNavigationPaths();

    return NextResponse.json({ navigation });
  } catch (error) {
    console.error("Failed to save site navigation:", error);
    return NextResponse.json({ error: "บันทึกไม่สำเร็จ" }, { status: 500 });
  }
}
