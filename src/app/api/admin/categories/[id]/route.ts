import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function PUT(request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const body = (await request.json()) as {
      label?: string;
      slug?: string;
      image?: string | null;
      bannerImage?: string | null;
      bannerAlt?: string | null;
      sortOrder?: number;
      isActive?: boolean;
    };

    const category = await db.category.findUnique({ where: { id } });
    if (!category) {
      return NextResponse.json({ error: "ไม่พบหมวดหมู่" }, { status: 404 });
    }

    const nextSlug = body.slug !== undefined ? slugify(body.slug) : category.slug;
    if (!nextSlug) {
      return NextResponse.json({ error: "slug ไม่ถูกต้อง" }, { status: 400 });
    }

    if (nextSlug !== category.slug) {
      const duplicate = await db.category.findUnique({ where: { slug: nextSlug } });
      if (duplicate) {
        return NextResponse.json({ error: "slug นี้มีอยู่แล้ว" }, { status: 409 });
      }
    }

    const updated = await db.category.update({
      where: { id },
      data: {
        ...(body.label !== undefined ? { label: body.label.trim() } : {}),
        ...(body.slug !== undefined ? { slug: nextSlug } : {}),
        ...(body.image !== undefined ? { image: body.image } : {}),
        ...(body.bannerImage !== undefined ? { bannerImage: body.bannerImage } : {}),
        ...(body.bannerAlt !== undefined ? { bannerAlt: body.bannerAlt } : {}),
        ...(body.sortOrder !== undefined ? { sortOrder: body.sortOrder } : {}),
        ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
      },
    });

    revalidatePath("/");
    revalidatePath("/catalog");
    revalidatePath("/products");
    revalidatePath(`/category/${category.slug}`);
    if (nextSlug !== category.slug) {
      revalidatePath(`/category/${nextSlug}`);
    }

    return NextResponse.json({ category: updated });
  } catch {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const category = await db.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!category) {
      return NextResponse.json({ error: "ไม่พบหมวดหมู่" }, { status: 404 });
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        { error: "ไม่สามารถลบหมวดหมู่ที่มีสินค้าอยู่ได้" },
        { status: 400 },
      );
    }

    await db.category.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/catalog");
    revalidatePath("/products");
    revalidatePath(`/category/${category.slug}`);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
