"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ProductPrice from "@/components/product/ProductPrice";
import type { ProductTypeFilter } from "@/lib/product-filters";
import { getProductTypeLabel, productTypeFilterOptions } from "@/lib/product-filters";

type CategoryOption = {
  id: string;
  slug: string;
  label: string;
};

type ProductRecord = {
  id: string;
  name: string;
  price: number;
  salePrice: number | null;
  image: string;
  isActive: boolean;
  isNew: boolean;
  isRecommend: boolean;
  category: CategoryOption;
};

export default function ProductsClient() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [productTypes, setProductTypes] = useState<ProductTypeFilter[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());

  const loadData = async () => {
    setLoading(true);
    const [productsRes, categoriesRes] = await Promise.all([
      fetch("/api/admin/products"),
      fetch("/api/admin/categories"),
    ]);

    const productsData = (await productsRes.json()) as {
      products?: ProductRecord[];
      error?: string;
    };
    const categoriesData = (await categoriesRes.json()) as {
      categories?: CategoryOption[];
    };

    if (productsRes.ok) {
      setProducts(
        (productsData.products ?? []).map((product) => ({
          ...product,
          isNew: product.isNew ?? false,
          isRecommend: product.isRecommend ?? false,
          isActive: product.isActive ?? true,
          salePrice: product.salePrice ?? null,
        })),
      );
    } else {
      setError(productsData.error ?? "โหลดสินค้าไม่สำเร็จ");
    }

    setCategories(categoriesData.categories ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void loadData();
  }, []);

  const toggleProductType = (type: ProductTypeFilter) => {
    setProductTypes((current) =>
      current.includes(type) ? current.filter((item) => item !== type) : [...current, type],
    );
  };

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        query.length === 0 ||
        product.name.toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query) ||
        product.category.label.toLowerCase().includes(query);
      const matchesCategory =
        !categoryFilter || product.category.id === categoryFilter;
      const matchesType =
        productTypes.length === 0 ||
        productTypes.some((type) => {
          if (type === "new") return product.isNew;
          if (type === "recommend") return product.isRecommend;
          return false;
        });

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [products, search, categoryFilter, productTypes]);

  const handleToggleFlag = async (
    product: ProductRecord,
    field: "isNew" | "isRecommend",
    checked: boolean,
  ) => {
    const saveKey = `${product.id}:${field}`;
    setSavingIds((current) => new Set(current).add(saveKey));
    setError("");
    setMessage("");

    setProducts((current) =>
      current.map((item) =>
        item.id === product.id ? { ...item, [field]: checked } : item,
      ),
    );

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: checked }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "บันทึกไม่สำเร็จ");
      }
    } catch (toggleError) {
      setProducts((current) =>
        current.map((item) =>
          item.id === product.id ? { ...item, [field]: !checked } : item,
        ),
      );
      setError(toggleError instanceof Error ? toggleError.message : "บันทึกไม่สำเร็จ");
    } finally {
      setSavingIds((current) => {
        const next = new Set(current);
        next.delete(saveKey);
        return next;
      });
    }
  };

  const handleDelete = async (product: ProductRecord) => {
    if (!confirm(`ยืนยันการลบสินค้า "${product.name}"?`)) return;

    const response = await fetch(`/api/admin/products/${product.id}`, {
      method: "DELETE",
    });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(data.error ?? "ลบไม่สำเร็จ");
      return;
    }

    setMessage("ลบสินค้าเรียบร้อยแล้ว");
    await loadData();
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการสินค้า</h1>
          <p className="mt-1 text-sm text-gray-500">
            ติ๊กสินค้าใหม่ / สินค้าแนะนำได้จากตารางด้านล่าง — บันทึกอัตโนมัติทันที
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex justify-center rounded-lg bg-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-dark"
        >
          + เพิ่มสินค้า
        </Link>
      </div>

      {message ? <p className="mb-4 text-sm text-green-600">{message}</p> : null}
      {error ? <p className="mb-4 text-sm text-red">{error}</p> : null}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">ค้นหา</label>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ค้นหาชื่อสินค้า, ID หรือหมวดหมู่..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-red focus:ring-2 focus:ring-red/20"
          />
        </div>
        <div className="w-full lg:w-56">
          <label className="mb-1 block text-sm font-medium text-gray-700">หมวดหมู่</label>
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-red"
          >
            <option value="">ทุกหมวดหมู่</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="mb-1 text-sm font-medium text-gray-700">ประเภทสินค้า</p>
          <div className="flex flex-wrap gap-3">
            {productTypeFilterOptions.map((option) => (
              <label key={option.value} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={productTypes.includes(option.value)}
                  onChange={() => toggleProductType(option.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {productTypes.length > 0 ? (
        <div className="mb-4 flex flex-wrap gap-2">
          {productTypes.map((type) => (
            <span
              key={type}
              className="rounded-full bg-red-light px-3 py-1 text-xs font-medium text-red"
            >
              {getProductTypeLabel(type)}
            </span>
          ))}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">รูป</th>
              <th className="px-4 py-3 font-medium">ชื่อสินค้า</th>
              <th className="px-4 py-3 font-medium">หมวดหมู่</th>
              <th className="px-4 py-3 font-medium text-center">สินค้าใหม่</th>
              <th className="px-4 py-3 font-medium text-center">สินค้าแนะนำ</th>
              <th className="px-4 py-3 font-medium">ราคา</th>
              <th className="px-4 py-3 font-medium">สถานะ</th>
              <th className="px-4 py-3 font-medium">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  กำลังโหลด...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  ไม่พบสินค้า
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <div className="relative h-14 w-14 overflow-hidden rounded border border-gray-100 bg-gray-50">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-1"
                        unoptimized={product.image.startsWith("http")}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-gray-400">{product.id}</p>
                  </td>
                  <td className="px-4 py-3">{product.category.label}</td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={Boolean(product.isNew)}
                      disabled={savingIds.has(`${product.id}:isNew`)}
                      onChange={(event) =>
                        void handleToggleFlag(product, "isNew", event.target.checked)
                      }
                      aria-label={`ตั้ง ${product.name} เป็นสินค้าใหม่`}
                      className="h-4 w-4 rounded border-gray-300 text-red focus:ring-red disabled:opacity-50"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={Boolean(product.isRecommend)}
                      disabled={savingIds.has(`${product.id}:isRecommend`)}
                      onChange={(event) =>
                        void handleToggleFlag(product, "isRecommend", event.target.checked)
                      }
                      aria-label={`ตั้ง ${product.name} เป็นสินค้าแนะนำ`}
                      className="h-4 w-4 rounded border-gray-300 text-red focus:ring-red disabled:opacity-50"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <ProductPrice product={product} />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        product.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {product.isActive ? "ขาย" : "ปิด"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-red hover:underline"
                      >
                        แก้ไข
                      </Link>
                      <button
                        type="button"
                        onClick={() => void handleDelete(product)}
                        className="text-gray-500 hover:text-red"
                      >
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && categories.length === 0 ? (
        <p className="mt-4 text-sm text-amber-600">
          กรุณาเพิ่มหมวดหมู่ก่อนจึงจะสามารถเพิ่มสินค้าได้
        </p>
      ) : null}
    </div>
  );
}
