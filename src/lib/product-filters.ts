import type { Product } from "@/lib/site-data";
import { getProductEffectivePrice } from "@/lib/site-data";

export type SortOption = "default" | "price-asc" | "price-desc" | "name-asc";

export type PriceRange = "all" | "under-1050" | "1050-1750" | "1750-3500" | "over-3500";

export type ProductTypeFilter = "new" | "recommend";

export type FilterState = {
  categories: string[];
  productTypes: ProductTypeFilter[];
  priceRange: PriceRange;
  sort: SortOption;
};

export type CategoryFilterOption = {
  id: string;
  label: string;
};

export const productTypeFilterOptions: { value: ProductTypeFilter; label: string }[] = [
  { value: "new", label: "สินค้าใหม่" },
  { value: "recommend", label: "สินค้าแนะนำ" },
];

export const defaultFilters: FilterState = {
  categories: [],
  productTypes: [],
  priceRange: "all",
  sort: "default",
};

export function createInitialFilters(
  categories: string[] = [],
  productTypes: ProductTypeFilter[] = [],
): FilterState {
  return {
    ...defaultFilters,
    categories,
    productTypes,
  };
}

export function matchesPriceRange(price: number, range: PriceRange) {
  if (range === "all") return true;
  if (range === "under-1050") return price > 0 && price < 1050;
  if (range === "1050-1750") return price >= 1050 && price <= 1750;
  if (range === "1750-3500") return price > 1750 && price <= 3500;
  return price > 3500;
}

export function matchesProductTypes(product: Product, types: ProductTypeFilter[]) {
  if (types.length === 0) return true;
  return types.some((type) => {
    if (type === "new") return product.isNew;
    if (type === "recommend") return product.isRecommend;
    return false;
  });
}

export function sortProducts(products: Product[], sort: SortOption) {
  const sorted = [...products];

  switch (sort) {
    case "price-asc":
      return sorted.sort(
        (a, b) => getProductEffectivePrice(a) - getProductEffectivePrice(b),
      );
    case "price-desc":
      return sorted.sort(
        (a, b) => getProductEffectivePrice(b) - getProductEffectivePrice(a),
      );
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "th"));
    default:
      return sorted;
  }
}

export function filterProducts(
  products: Product[],
  filters: FilterState,
  searchQuery = "",
  categoryLabels: Record<string, string> = {},
) {
  const query = searchQuery.trim().toLowerCase();

  const result = products.filter((product) => {
    const matchesCategory =
      filters.categories.length === 0 ||
      filters.categories.includes(product.category);
    const matchesType = matchesProductTypes(product, filters.productTypes);
    const matchesPrice = matchesPriceRange(
      getProductEffectivePrice(product),
      filters.priceRange,
    );
    const categoryLabel = categoryLabels[product.category] ?? product.category;
    const matchesSearch =
      query.length === 0 ||
      product.name.toLowerCase().includes(query) ||
      categoryLabel.toLowerCase().includes(query);

    return matchesCategory && matchesType && matchesPrice && matchesSearch;
  });

  return sortProducts(result, filters.sort);
}

export function countActiveFilters(filters: FilterState) {
  let count = 0;
  if (filters.categories.length > 0) count += 1;
  if (filters.productTypes.length > 0) count += 1;
  if (filters.priceRange !== "all") count += 1;
  if (filters.sort !== "default") count += 1;
  return count;
}

export function getProductTypeLabel(type: ProductTypeFilter) {
  return productTypeFilterOptions.find((option) => option.value === type)?.label ?? type;
}
