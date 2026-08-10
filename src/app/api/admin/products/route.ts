import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { resolveProductPricing } from "@/lib/admin/product-pricing";

function generateProductId() {
  const suffix = Math.random().toString(36).slice(2, 8);
  return `p-${Date.now().toString(36)}-${suffix}`;
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await db.product.findMany({
    include: { category: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return NextResponse.json({
    products: products.map((product) => ({
      ...product,
      isNew: product.isNew ?? false,
      isRecommend: product.isRecommend ?? false,
      isActive: product.isActive ?? true,
      salePrice: product.salePrice ?? null,
    })),
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      id?: string;
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

    const name = body.name?.trim();
    const image = body.image?.trim();
    const categoryId = body.categoryId;

    if (!name || !image || !categoryId) {
      return NextResponse.json(
        { error: "กรุณากรอกชื่อสินค้า รูปภาพ และหมวดหมู่" },
        { status: 400 },
      );
    }

    const category = await db.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      return NextResponse.json({ error: "ไม่พบหมวดหมู่" }, { status: 400 });
    }

    const id = body.id?.trim() || generateProductId();
    const images = body.images?.length ? body.images : [image];
    const listPrice = body.price ?? 0;
    const pricing = resolveProductPricing(listPrice, body.salePrice);
    if ("error" in pricing) return pricing.error;

    const product = await db.product.create({
      data: {
        id,
        name,
        price: pricing.price,
        salePrice: pricing.salePrice,
        image,
        images,
        sku: body.sku ?? null,
        stock: body.stock ?? 0,
        prepDays: body.prepDays ?? 2,
        description: body.description ?? "",
        shippingInfo: body.shippingInfo ?? "",
        howToOrder: body.howToOrder ?? "",
        categoryId,
        sortOrder: body.sortOrder ?? 0,
        isActive: body.isActive ?? true,
        isNew: body.isNew ?? false,
        isRecommend: body.isRecommend ?? false,
      },
      include: { category: true },
    });

    revalidatePath("/");
    revalidatePath("/catalog");
    revalidatePath("/products");
    revalidatePath(`/category/${category.slug}`);
    revalidatePath(`/product/${id}`);

    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
