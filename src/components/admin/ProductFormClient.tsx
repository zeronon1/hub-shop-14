"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/admin/ImageUpload";
import MultiImageUpload from "@/components/admin/MultiImageUpload";
import { IMAGE_UPLOAD_SPECS } from "@/lib/admin/image-upload-specs";

type CategoryOption = {
  id: string;
  slug: string;
  label: string;
};

type ProductFormState = {
  id: string;
  name: string;
  price: number;
  salePrice: number | null;
  image: string;
  images: string[];
  sku: string;
  stock: number;
  prepDays: number;
  description: string;
  shippingInfo: string;
  howToOrder: string;
  categoryId: string;
  sortOrder: number;
  isActive: boolean;
  isNew: boolean;
  isRecommend: boolean;
};

const defaultForm: ProductFormState = {
  id: "",
  name: "",
  price: 0,
  salePrice: null,
  image: "",
  images: [],
  sku: "",
  stock: 0,
  prepDays: 2,
  description: "",
  shippingInfo:
    "จัดส่งทั่วประเทศผ่าน Kerry Express, Flash Express หรือไปรษณีย์ไทย\nค่าจัดส่งเริ่มต้น 50 บาท (กรุงเทพฯ และปริมณฑล) / 80 บาท (ต่างจังหวัด)",
  howToOrder:
    '1. เลือกสินค้าและจำนวนที่ต้องการ\n2. กดปุ่ม "สั่งซื้อเลย"\n3. ชำระเงินและรอรับสินค้า',
  categoryId: "",
  sortOrder: 0,
  isActive: true,
  isNew: false,
  isRecommend: false,
};

type ProductFormClientProps = {
  productId?: string;
};

export default function ProductFormClient({ productId }: ProductFormClientProps) {
  const router = useRouter();
  const isEdit = Boolean(productId);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [form, setForm] = useState<ProductFormState>(defaultForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const categoriesRes = await fetch("/api/admin/categories");
      const categoriesData = (await categoriesRes.json()) as {
        categories?: CategoryOption[];
      };
      const categoryList = categoriesData.categories ?? [];
      setCategories(categoryList);

      if (isEdit && productId) {
        setLoading(true);
        const productRes = await fetch(`/api/admin/products/${productId}`);
        const productData = (await productRes.json()) as {
          product?: ProductFormState & { category: CategoryOption };
          error?: string;
        };

        if (!productRes.ok || !productData.product) {
          setError(productData.error ?? "โหลดสินค้าไม่สำเร็จ");
        } else {
          const product = productData.product;
          setForm({
            id: product.id,
            name: product.name,
            price: product.price,
            salePrice: product.salePrice ?? null,
            image: product.image,
            images: product.images ?? [],
            sku: product.sku ?? "",
            stock: product.stock,
            prepDays: product.prepDays,
            description: product.description,
            shippingInfo: product.shippingInfo,
            howToOrder: product.howToOrder,
            categoryId: product.category.id,
            sortOrder: product.sortOrder,
            isActive: product.isActive ?? true,
            isNew: product.isNew ?? false,
            isRecommend: product.isRecommend ?? false,
          });
        }
        setLoading(false);
      } else if (categoryList.length > 0) {
        setForm((current) => ({ ...current, categoryId: categoryList[0].id }));
      }
    };

    void load();
  }, [isEdit, productId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        ...(isEdit ? {} : form.id ? { id: form.id } : {}),
        name: form.name,
        price: form.price,
        salePrice: form.salePrice,
        image: form.image,
        images: form.images.length > 0 ? form.images : [form.image],
        sku: form.sku || null,
        stock: form.stock,
        prepDays: form.prepDays,
        description: form.description,
        shippingInfo: form.shippingInfo,
        howToOrder: form.howToOrder,
        categoryId: form.categoryId,
        sortOrder: form.sortOrder,
        isActive: form.isActive,
        isNew: form.isNew,
        isRecommend: form.isRecommend,
      };

      const response = await fetch(
        isEdit ? `/api/admin/products/${productId}` : "/api/admin/products",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = (await response.json()) as { error?: string; product?: { id: string } };
      if (!response.ok) {
        throw new Error(data.error ?? "บันทึกไม่สำเร็จ");
      }

      setMessage("บันทึกสินค้าเรียบร้อยแล้ว");
      if (!isEdit && data.product?.id) {
        router.push(`/admin/products/${data.product.id}`);
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500">กำลังโหลด...</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
        </h1>
        {isEdit ? <p className="mt-1 text-sm text-gray-500">ID: {productId}</p> : null}
      </div>

      {message ? <p className="mb-4 text-sm text-green-600">{message}</p> : null}
      {error ? <p className="mb-4 text-sm text-red">{error}</p> : null}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-gray-200 bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">ชื่อสินค้า</label>
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red"
              required
            />
          </div>
          {!isEdit ? (
            <div>
              <label className="mb-1 block text-sm font-medium">Product ID (ไม่บังคับ)</label>
              <input
                value={form.id}
                onChange={(event) => setForm({ ...form, id: event.target.value })}
                placeholder="op-1 หรือเว้นว่างให้ระบบสร้าง"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red"
              />
            </div>
          ) : null}
          <div>
            <label className="mb-1 block text-sm font-medium">หมวดหมู่</label>
            <select
              value={form.categoryId}
              onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red"
              required
            >
              <option value="">เลือกหมวดหมู่</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">ราคาปกติ (บาท)</label>
            <input
              type="number"
              min={0}
              value={form.price}
              onChange={(event) => setForm({ ...form, price: Number(event.target.value) || 0 })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red"
            />
            <p className="mt-1 text-xs text-gray-500">ใส่ 0 สำหรับ &quot;ติดต่อสอบถาม&quot;</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">ราคาลด (บาท)</label>
            <input
              type="number"
              min={0}
              value={form.salePrice ?? ""}
              onChange={(event) => {
                const value = event.target.value;
                setForm({
                  ...form,
                  salePrice: value === "" ? null : Number(value) || null,
                });
              }}
              placeholder="เว้นว่างถ้าไม่ลดราคา"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red"
            />
            <p className="mt-1 text-xs text-gray-500">
              ต้องน้อยกว่าราคาปกติ — หน้าเว็บจะแสดงราคาเดิมขีดฆ่าและป้ายลดราคา
            </p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">SKU</label>
            <input
              value={form.sku}
              onChange={(event) => setForm({ ...form, sku: event.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">สต็อก</label>
            <input
              type="number"
              min={0}
              value={form.stock}
              onChange={(event) => setForm({ ...form, stock: Number(event.target.value) || 0 })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">วันจัดเตรียม</label>
            <input
              type="number"
              min={0}
              value={form.prepDays}
              onChange={(event) => setForm({ ...form, prepDays: Number(event.target.value) || 0 })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">ลำดับ</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(event) =>
                setForm({ ...form, sortOrder: Number(event.target.value) || 0 })
              }
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red"
            />
          </div>
          <div className="flex flex-wrap items-center gap-6 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(form.isActive)}
                onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
              />
              เปิดขาย
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(form.isNew)}
                onChange={(event) => setForm({ ...form, isNew: event.target.checked })}
              />
              สินค้าใหม่
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(form.isRecommend)}
                onChange={(event) => setForm({ ...form, isRecommend: event.target.checked })}
              />
              สินค้าแนะนำ
            </label>
          </div>
        </div>

        <ImageUpload
          label="รูปหลัก"
          value={form.image}
          onChange={(url) =>
            setForm((current) => ({
              ...current,
              image: url,
              images: current.images.length > 0 ? current.images : url ? [url] : [],
            }))
          }
          folder="shop-13/products"
          spec={IMAGE_UPLOAD_SPECS.productMain}
          previewMaxWidth="md"
        />

        <MultiImageUpload
          label="รูปเพิ่มเติม (Gallery)"
          values={form.images}
          onChange={(urls) => setForm((current) => ({ ...current, images: urls }))}
          folder="shop-13/products/gallery"
          spec={IMAGE_UPLOAD_SPECS.productGallery}
          hint="เลือกได้หลายไฟล์พร้อมกัน รองรับ JPEG, PNG, WebP, GIF สูงสุด 10MB ต่อไฟล์"
        />

        <div>
          <label className="mb-1 block text-sm font-medium">รายละเอียดสินค้า</label>
          <textarea
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            rows={5}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">ข้อมูลการจัดส่ง</label>
          <textarea
            value={form.shippingInfo}
            onChange={(event) => setForm({ ...form, shippingInfo: event.target.value })}
            rows={4}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">วิธีสั่งซื้อ</label>
          <textarea
            value={form.howToOrder}
            onChange={(event) => setForm({ ...form, howToOrder: event.target.value })}
            rows={4}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-dark disabled:opacity-60"
          >
            {saving ? "กำลังบันทึก..." : "บันทึกสินค้า"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold hover:bg-gray-50"
          >
            กลับ
          </button>
        </div>
      </form>
    </div>
  );
}
