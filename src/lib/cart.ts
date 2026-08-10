export type CartItem = {
  productId: string;
  name: string;
  image: string;
  priceBaht: number;
  quantity: number;
};

export function bahtToSatang(baht: number): number {
  return baht * 100;
}

export function lineTotalBaht(priceBaht: number, quantity: number): number {
  return priceBaht * quantity;
}

export function lineTotalSatang(priceBaht: number, quantity: number): number {
  return bahtToSatang(priceBaht) * quantity;
}

export function cartTotalBaht(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + lineTotalBaht(item.priceBaht, item.quantity), 0);
}

export function cartTotalSatang(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + lineTotalSatang(item.priceBaht, item.quantity), 0);
}

export function formatBaht(amount: number): string {
  return `฿${amount.toLocaleString("th-TH")}`;
}

export const CART_STORAGE_KEY = "Momotaro Shop-cart";

type LegacyCartItem = CartItem & { priceUsd?: number };

export function normalizeCartItem(raw: LegacyCartItem): CartItem | null {
  if (!raw.productId || !raw.name) return null;

  let priceBaht = raw.priceBaht;
  if (priceBaht == null && raw.priceUsd != null) {
    priceBaht = raw.priceUsd <= 300 ? Math.round(raw.priceUsd * 35) : raw.priceUsd;
  }

  if (priceBaht == null || priceBaht < 0) return null;

  return {
    productId: raw.productId,
    name: raw.name,
    image: raw.image,
    priceBaht,
    quantity: Math.max(1, raw.quantity ?? 1),
  };
}
