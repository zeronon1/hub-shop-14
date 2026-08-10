import { NextResponse } from "next/server";
import { normalizeSalePrice, validateSalePrice } from "@/lib/site-data";

export function resolveProductPricing(price: number, salePrice?: number | null) {
  const normalizedSalePrice = normalizeSalePrice(price, salePrice ?? null);
  const saleError = validateSalePrice(price, salePrice ?? null);

  if (saleError) {
    return {
      error: NextResponse.json({ error: saleError }, { status: 400 }),
    } as const;
  }

  return {
    price,
    salePrice: normalizedSalePrice,
  } as const;
}
