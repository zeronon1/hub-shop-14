import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const categories = await db.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
    include: { _count: { select: { products: true } } },
  });

  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

    const label = body.label?.trim();
    if (!label) {
      return NextResponse.json({ error: "กรุณากรอกชื่อหมวดหมู่" }, { status: 400 });
    }

    const slug = slugify(body.slug?.trim() || label);
    if (!slug) {
      return NextResponse.json({ error: "slug ไม่ถูกต้อง" }, { status: 400 });
    }

    const existing = await db.category.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "slug นี้มีอยู่แล้ว" }, { status: 409 });
    }

    const category = await db.category.create({
      data: {
        label,
        slug,
        image: body.image ?? null,
        bannerImage: body.bannerImage ?? null,
        bannerAlt: body.bannerAlt ?? null,
        sortOrder: body.sortOrder ?? 0,
        isActive: body.isActive ?? true,
      },
    });

    revalidatePath("/");
    revalidatePath("/catalog");
    revalidatePath("/products");
    revalidatePath(`/category/${slug}`);

    return NextResponse.json({ category }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
