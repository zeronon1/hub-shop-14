"use client";

import { useEffect } from "react";
import type {
  CategoryFilterOption,
  FilterState,
  PriceRange,
  ProductTypeFilter,
  SortOption,
} from "@/lib/product-filters";
import { productTypeFilterOptions } from "@/lib/product-filters";

export type { FilterState, PriceRange, SortOption } from "@/lib/product-filters";

type FilterSidebarProps = {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onApply: () => void;
  onReset: () => void;
  categories: CategoryFilterOption[];
};

const priceRangeOptions: { value: PriceRange; label: string }[] = [
  { value: "all", label: "ทุกช่วงราคา" },
  { value: "under-1050", label: "ต่ำกว่า ฿1,050" },
  { value: "1050-1750", label: "฿1,050 – ฿1,750" },
  { value: "1750-3500", label: "฿1,750 – ฿3,500" },
  { value: "over-3500", label: "มากกว่า ฿3,500" },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "default", label: "เรียงตามค่าเริ่มต้น" },
  { value: "price-asc", label: "ราคา น้อย → มาก" },
  { value: "price-desc", label: "ราคา มาก → น้อย" },
  { value: "name-asc", label: "ชื่อสินค้า ก-ฮ" },
];

function FilterIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function FilterSidebar({
  open,
  onClose,
  filters,
  onChange,
  onApply,
  onReset,
  categories,
}: FilterSidebarProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const toggleCategory = (categoryId: string) => {
    const next = filters.categories.includes(categoryId)
      ? filters.categories.filter((id) => id !== categoryId)
      : [...filters.categories, categoryId];
    onChange({ ...filters, categories: next });
  };

  const toggleProductType = (type: ProductTypeFilter) => {
    const next = filters.productTypes.includes(type)
      ? filters.productTypes.filter((item) => item !== type)
      : [...filters.productTypes, type];
    onChange({ ...filters, productTypes: next });
  };

  return (
    <>
      <button
        type="button"
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-label="ปิดตัวกรอง"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-[61] flex w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!open}
        aria-label="ตัวกรองสินค้า"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <FilterIcon />
            <h2 className="text-base font-semibold">ตัวกรอง</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-light"
            aria-label="ปิดตัวกรอง"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto px-5 py-6">
          <section>
            <h3 className="mb-3 text-sm font-semibold text-foreground">ประเภทสินค้า</h3>
            <div className="space-y-2">
              {productTypeFilterOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-gray-light"
                >
                  <input
                    type="checkbox"
                    checked={filters.productTypes.includes(option.value)}
                    onChange={() => toggleProductType(option.value)}
                    className="h-4 w-4 rounded border-gray-300 text-red focus:ring-red"
                  />
                  <span className="text-sm text-foreground">{option.label}</span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-foreground">หมวดหมู่</h3>
            <div className="space-y-2">
              {categories.map((tab) => (
                <label
                  key={tab.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-gray-light"
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(tab.id)}
                    onChange={() => toggleCategory(tab.id)}
                    className="h-4 w-4 rounded border-gray-300 text-red focus:ring-red"
                  />
                  <span className="text-sm text-foreground">{tab.label}</span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-foreground">ช่วงราคา</h3>
            <div className="space-y-2">
              {priceRangeOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-gray-light"
                >
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange === option.value}
                    onChange={() => onChange({ ...filters, priceRange: option.value })}
                    className="h-4 w-4 border-gray-300 text-red focus:ring-red"
                  />
                  <span className="text-sm text-foreground">{option.label}</span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-foreground">เรียงตาม</h3>
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-gray-light"
                >
                  <input
                    type="radio"
                    name="sort"
                    checked={filters.sort === option.value}
                    onChange={() => onChange({ ...filters, sort: option.value })}
                    className="h-4 w-4 border-gray-300 text-red focus:ring-red"
                  />
                  <span className="text-sm text-foreground">{option.label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="flex gap-3 border-t border-gray-100 px-5 py-4">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-gray-light"
          >
            ล้างทั้งหมด
          </button>
          <button
            type="button"
            onClick={onApply}
            className="flex-1 rounded-lg bg-red px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-dark"
          >
            แสดงผล
          </button>
        </div>
      </aside>
    </>
  );
}
