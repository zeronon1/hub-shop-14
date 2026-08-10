import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/lib/db";
import type { Product, ProductDetail } from "@/lib/site-data";
import { getCategoryLabel, mockProducts } from "@/lib/site-data";

function mapProduct(row: {
  id: string;
  name: string;
  price: number;
  salePrice: number | null;
  image: string;
  isNew: boolean;
  isRecommend: boolean;
  category: { slug: string };
}): Product {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    salePrice: row.salePrice ?? null,
    image: row.image,
    category: row.category.slug,
    isNew: row.isNew ?? false,
    isRecommend: row.isRecommend ?? false,
  };
}

function mapProductDetail(row: {
  id: string;
  name: string;
  price: number;
  salePrice: number | null;
  image: string;
  images: string[];
  sku: string | null;
  stock: number;
  prepDays: number;
  description: string;
  shippingInfo: string;
  howToOrder: string;
  isNew: boolean;
  isRecommend: boolean;
  category: { slug: string };
}): ProductDetail {
  const images =
    row.images.length > 0
      ? row.images
      : [row.image];

  return {
    id: row.id,
    name: row.name,
    price: row.price,
    salePrice: row.salePrice ?? null,
    image: row.image,
    category: row.category.slug,
    sku: row.sku ?? `SKU-${row.id.replace(/-/g, "").toUpperCase().slice(0, 8)}`,
    stock: row.stock,
    prepDays: row.prepDays,
    description: row.description,
    shippingInfo: row.shippingInfo,
    howToOrder: row.howToOrder,
    isNew: row.isNew ?? false,
    isRecommend: row.isRecommend ?? false,
    images,
  };
}

export async function listProducts(options?: { includeInactive?: boolean }) {
  noStore();

  try {
    const rows = await db.product.findMany({
      where: options?.includeInactive ? undefined : { isActive: true },
      include: { category: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    if (rows.length === 0) return mockProducts;
    return rows.map(mapProduct);
  } catch {
    return mockProducts;
  }
}

export async function getProductById(id: string) {
  noStore();

  try {
    const row = await db.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!row || !row.isActive) {
      return mockProducts.find((product) => product.id === id);
    }

    return mapProduct(row);
  } catch {
    return mockProducts.find((product) => product.id === id);
  }
}

export async function getProductDetail(id: string) {
  noStore();

  try {
    const row = await db.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!row || !row.isActive) {
      const fallback = mockProducts.find((product) => product.id === id);
      if (!fallback) return undefined;

      const categoryLabel = getCategoryLabel(fallback.category);
      return {
        ...fallback,
        sku: `SKU-${id.replace(/-/g, "").toUpperCase().slice(0, 8)}`,
        stock: 99 + (fallback.name.length % 900),
        prepDays: fallback.price >= 3500 ? 3 : 2,
        description: `${fallback.name} เป็นสินค้าลิขสิทธิ์แท้จากประเทศญี่ปุ่น`,
        shippingInfo: "จัดส่งทั่วประเทศ",
        howToOrder: "ติดต่อทาง Line / Facebook",
        images: [fallback.image],
      } satisfies ProductDetail;
    }

    return mapProductDetail(row);
  } catch {
    const fallback = mockProducts.find((product) => product.id === id);
    if (!fallback) return undefined;
    return {
      ...fallback,
      sku: `SKU-${id.replace(/-/g, "").toUpperCase().slice(0, 8)}`,
      stock: 99,
      prepDays: 2,
      description: fallback.name,
      shippingInfo: "",
      howToOrder: "",
      images: [fallback.image],
    } satisfies ProductDetail;
  }
}

export async function getProductsByCategory(categorySlug: string, limit = 999) {
  noStore();

  const products = await listProducts();
  return products.filter((product) => product.category === categorySlug).slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 4) {
  const products = await listProducts();
  return products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, limit);
}

export async function getRecommendedProducts(product: Product, limit = 8) {
  const products = await listProducts();
  const sameCategory = products.filter(
    (item) => item.category === product.category && item.id !== product.id,
  );
  const others = products.filter(
    (item) => item.category !== product.category && item.id !== product.id,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export async function getRecentlyViewedProducts(product: Product, limit = 2) {
  const products = await listProducts();
  const pool = products.filter((item) => item.id !== product.id);
  const index = pool.findIndex((item) => item.category !== product.category);
  const picks =
    index >= 0 ? [pool[index], pool[(index + 3) % pool.length]] : pool.slice(0, limit);
  return picks.slice(0, limit);
}

export async function listProductIds() {
  noStore();

  try {
    const rows = await db.product.findMany({
      where: { isActive: true },
      select: { id: true },
    });
    if (rows.length === 0) {
      return mockProducts.map((product) => ({ id: product.id }));
    }
    return rows;
  } catch {
    return mockProducts.map((product) => ({ id: product.id }));
  }
}

export async function listCategorySlugs() {
  noStore();

  try {
    const rows = await db.category.findMany({
      where: { isActive: true },
      select: { slug: true },
      orderBy: [{ sortOrder: "asc" }],
    });
    if (rows.length === 0) {
      return mockProducts.map((product) => product.category);
    }
    return rows.map((row) => row.slug);
  } catch {
    return mockProducts.map((product) => product.category);
  }
}
