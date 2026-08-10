"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/home/ProductCard";
import FilterSidebar from "@/components/products/FilterSidebar";
import {
  countActiveFilters,
  createInitialFilters,
  filterProducts,
  getProductTypeLabel,
  type CategoryFilterOption,
  type FilterState,
  type ProductTypeFilter,
} from "@/lib/product-filters";
import type { Product } from "@/lib/site-data";

type ProductListClientProps = {
  products: Product[];
  categories: CategoryFilterOption[];
  initialCategories?: string[];
  initialProductTypes?: ProductTypeFilter[];
};

function FilterButtonIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="h-5 w-5 text-gray-text/50" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

export default function ProductListClient({
  products,
  categories,
  initialCategories = [],
  initialProductTypes = [],
}: ProductListClientProps) {
  const categoryLabels = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.id, category.label])),
    [categories],
  );
  const initialFilters = createInitialFilters(initialCategories, initialProductTypes);
  const [filterOpen, setFilterOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<FilterState>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(initialFilters);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(
    () => filterProducts(products, appliedFilters, searchQuery, categoryLabels),
    [products, appliedFilters, searchQuery, categoryLabels],
  );

  const activeFilterCount = countActiveFilters(appliedFilters);

  const handleOpenFilter = () => {
    setDraftFilters(appliedFilters);
    setFilterOpen(true);
  };

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
    setFilterOpen(false);
  };

  const handleResetFilters = () => {
    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  const removeCategory = (categoryId: string) => {
    const next = {
      ...appliedFilters,
      categories: appliedFilters.categories.filter((id) => id !== categoryId),
    };
    setAppliedFilters(next);
    setDraftFilters(next);
  };

  const removeProductType = (type: ProductTypeFilter) => {
    const next = {
      ...appliedFilters,
      productTypes: appliedFilters.productTypes.filter((item) => item !== type),
    };
    setAppliedFilters(next);
    setDraftFilters(next);
  };

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="ค้นหาสินค้า..."
            className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-shadow focus:border-red focus:ring-2 focus:ring-red/20"
            aria-label="ค้นหาสินค้า"
          />
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
            <SearchIcon />
          </span>
        </div>

        <button
          type="button"
          onClick={handleOpenFilter}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-red hover:text-red"
        >
          <FilterButtonIcon />
          ตัวกรอง
          {activeFilterCount > 0 ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red px-1.5 text-xs font-bold text-white">
              {activeFilterCount}
            </span>
          ) : null}
        </button>
      </div>

      {activeFilterCount > 0 ? (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {appliedFilters.productTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => removeProductType(type)}
              className="inline-flex items-center gap-1.5 rounded-full bg-red-light px-3 py-1.5 text-xs font-medium text-red transition-colors hover:bg-red/10"
            >
              {getProductTypeLabel(type)}
              <span aria-hidden="true">×</span>
            </button>
          ))}
          {appliedFilters.categories.map((categoryId) => (
            <button
              key={categoryId}
              type="button"
              onClick={() => removeCategory(categoryId)}
              className="inline-flex items-center gap-1.5 rounded-full bg-red-light px-3 py-1.5 text-xs font-medium text-red transition-colors hover:bg-red/10"
            >
              {categoryLabels[categoryId] ?? categoryId}
              <span aria-hidden="true">×</span>
            </button>
          ))}
          {appliedFilters.priceRange !== "all" ? (
            <span className="rounded-full bg-gray-light px-3 py-1.5 text-xs font-medium text-foreground">
              {appliedFilters.priceRange === "under-1050" && "ต่ำกว่า ฿1,050"}
              {appliedFilters.priceRange === "1050-1750" && "฿1,050 – ฿1,750"}
              {appliedFilters.priceRange === "1750-3500" && "฿1,750 – ฿3,500"}
              {appliedFilters.priceRange === "over-3500" && "มากกว่า ฿3,500"}
            </span>
          ) : null}
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs font-semibold text-red underline-offset-2 hover:underline"
          >
            ล้างตัวกรองทั้งหมด
          </button>
        </div>
      ) : null}

      <p className="mb-6 text-sm text-gray-text/70">
        แสดง {filteredProducts.length} จาก {products.length} สินค้า
      </p>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
          <p className="mb-2 text-lg font-semibold text-foreground">ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>
          <p className="mb-6 text-sm text-gray-text/70">
            ลองปรับตัวกรองหรือคำค้นหาใหม่
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              handleResetFilters();
            }}
            className="rounded-lg bg-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-dark"
          >
            ล้างตัวกรองและค้นหา
          </button>
        </div>
      )}

      <FilterSidebar
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={draftFilters}
        onChange={setDraftFilters}
        onApply={handleApplyFilters}
        onReset={() => setDraftFilters(initialFilters)}
        categories={categories}
      />
    </>
  );
}
