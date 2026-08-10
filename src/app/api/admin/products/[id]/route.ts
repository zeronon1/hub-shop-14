import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { resolveProductPricing } from "@/lib/admin/product-pricing";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const product = await db.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    return NextResponse.json({ error: "ไม่พบสินค้า" }, { status: 404 });
  }

  return NextResponse.json({
    product: {
      ...product,
      isNew: product.isNew ?? false,
      isRecommend: product.isRecommend ?? false,
      isActive: product.isActive ?? true,
      salePrice: product.salePrice ?? null,
    },
  });
}

export async function PUT(request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const body = (await request.json()) as {
      name?: string;
      price?: number;
      salePrice?: number | null;
      image?: string;
      images?: string[];
      sku?: string | null;
      stock?: number;
      prepDays?: number;
      description?: string;
      shippingInfo?: string;
      howToOrder?: string;
      categoryId?: string;
      sortOrder?: number;
      isActive?: boolean;
      isNew?: boolean;
      isRecommend?: boolean;
    };

    const existing = await db.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "ไม่พบสินค้า" }, { status: 404 });
    }

    if (body.categoryId) {
      const category = await db.category.findUnique({ where: { id: body.categoryId } });
      if (!category) {
        return NextResponse.json({ error: "ไม่พบหมวดหมู่" }, { status: 400 });
      }
    }

    const image = body.image?.trim() ?? existing.image;
    const images =
      body.images !== undefined
        ? body.images.length > 0
          ? body.images
          : [image]
        : existing.images;

    const nextPrice = body.price !== undefined ? body.price : existing.price;
    const nextSalePrice =
      body.salePrice !== undefined ? body.salePrice : existing.salePrice;
    const pricing = resolveProductPricing(nextPrice, nextSalePrice);
    if ("error" in pricing) return pricing.error;

    const product = await db.product.update({
      where: { id },
      data: {
        ...(body.name !== undefined ? { name: body.name.trim() } : {}),
        price: pricing.price,
        salePrice: pricing.salePrice,
        ...(body.image !== undefined ? { image } : {}),
        ...(body.images !== undefined ? { images } : {}),
        ...(body.sku !== undefined ? { sku: body.sku } : {}),
        ...(body.stock !== undefined ? { stock: body.stock } : {}),
        ...(body.prepDays !== undefined ? { prepDays: body.prepDays } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        ...(body.shippingInfo !== undefined ? { shippingInfo: body.shippingInfo } : {}),
        ...(body.howToOrder !== undefined ? { howToOrder: body.howToOrder } : {}),
        ...(body.categoryId !== undefined ? { categoryId: body.categoryId } : {}),
        ...(body.sortOrder !== undefined ? { sortOrder: body.sortOrder } : {}),
        ...(body.isActive !== undefined ? { isActive: body.isActive } : {}),
        ...(body.isNew !== undefined ? { isNew: body.isNew } : {}),
        ...(body.isRecommend !== undefined ? { isRecommend: body.isRecommend } : {}),
      },
      include: { category: true },
    });

    revalidatePath("/");
    revalidatePath("/catalog");
    revalidatePath("/products");
    revalidatePath(`/category/${existing.category.slug}`);
    revalidatePath(`/category/${product.category.slug}`);
    revalidatePath(`/product/${id}`);

    return NextResponse.json({ product });
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
    const product = await db.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json({ error: "ไม่พบสินค้า" }, { status: 404 });
    }

    await db.product.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/catalog");
    revalidatePath("/products");
    revalidatePath(`/category/${product.category.slug}`);
    revalidatePath(`/product/${id}`);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
