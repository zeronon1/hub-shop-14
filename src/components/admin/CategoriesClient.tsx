"use client";

import { useEffect, useState } from "react";
import ImageUpload from "@/components/admin/ImageUpload";
import { IMAGE_UPLOAD_SPECS } from "@/lib/admin/image-upload-specs";

type CategoryRecord = {
  id: string;
  slug: string;
  label: string;
  image: string | null;
  bannerImage: string | null;
  bannerAlt: string | null;
  sortOrder: number;
  isActive: boolean;
  _count?: { products: number };
};

type FormMode = "create" | "edit" | null;

const emptyForm = {
  label: "",
  slug: "",
  image: "",
  bannerImage: "",
  bannerAlt: "",
  sortOrder: 0,
  isActive: true,
};

export default function CategoriesClient() {
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [mode, setMode] = useState<FormMode>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadCategories = async () => {
    setLoading(true);
    const response = await fetch("/api/admin/categories");
    const data = (await response.json()) as {
      categories?: CategoryRecord[];
      error?: string;
    };
    if (response.ok) {
      setCategories(data.categories ?? []);
    } else {
      setError(data.error ?? "โหลดข้อมูลไม่สำเร็จ");
    }
    setLoading(false);
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  const openCreate = () => {
    setMode("create");
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setMessage("");
  };

  const openEdit = (category: CategoryRecord) => {
    setMode("edit");
    setEditingId(category.id);
    setForm({
      label: category.label,
      slug: category.slug,
      image: category.image ?? "",
      bannerImage: category.bannerImage ?? "",
      bannerAlt: category.bannerAlt ?? "",
      sortOrder: category.sortOrder,
      isActive: category.isActive,
    });
    setError("");
    setMessage("");
  };

  const closeForm = () => {
    setMode(null);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const isCreate = mode === "create";
      const response = await fetch(
        isCreate ? "/api/admin/categories" : `/api/admin/categories/${editingId}`,
        {
          method: isCreate ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            label: form.label,
            slug: form.slug,
            image: form.image || null,
            bannerImage: form.bannerImage || null,
            bannerAlt: form.bannerAlt || null,
            sortOrder: form.sortOrder,
            isActive: form.isActive,
          }),
        },
      );

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "บันทึกไม่สำเร็จ");
      }

      setMessage(isCreate ? "เพิ่มหมวดหมู่เรียบร้อยแล้ว" : "อัปเดตหมวดหมู่เรียบร้อยแล้ว");
      closeForm();
      await loadCategories();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category: CategoryRecord) => {
    if (!confirm(`ยืนยันการลบหมวดหมู่ "${category.label}"?`)) return;

    const response = await fetch(`/api/admin/categories/${category.id}`, {
      method: "DELETE",
    });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(data.error ?? "ลบไม่สำเร็จ");
      return;
    }

    setMessage("ลบหมวดหมู่เรียบร้อยแล้ว");
    await loadCategories();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการหมวดหมู่</h1>
          <p className="mt-1 text-sm text-gray-500">เพิ่ม แก้ไข และลบหมวดหมู่สินค้า</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-dark"
        >
          + เพิ่มหมวดหมู่
        </button>
      </div>

      {message ? <p className="mb-4 text-sm text-green-600">{message}</p> : null}
      {error ? <p className="mb-4 text-sm text-red">{error}</p> : null}

      {mode ? (
        <form
          onSubmit={handleSubmit}
          className="mb-8 space-y-5 rounded-xl border border-gray-200 bg-white p-6"
        >
          <h2 className="text-lg font-semibold">
            {mode === "create" ? "เพิ่มหมวดหมู่ใหม่" : "แก้ไขหมวดหมู่"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">ชื่อหมวดหมู่</label>
              <input
                value={form.label}
                onChange={(event) => setForm({ ...form, label: event.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Slug (URL)</label>
              <input
                value={form.slug}
                onChange={(event) => setForm({ ...form, slug: event.target.value })}
                placeholder="one-piece"
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
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
                />
                เปิดใช้งาน
              </label>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ImageUpload
              label="รูปหมวดหมู่ (การ์ดหน้าแรก)"
              value={form.image}
              onChange={(url) => setForm({ ...form, image: url })}
              folder="shop-13/categories"
              spec={IMAGE_UPLOAD_SPECS.categoryImage}
            />
            <ImageUpload
              label="รูป Banner (หน้า Catalog)"
              value={form.bannerImage}
              onChange={(url) => setForm({ ...form, bannerImage: url })}
              folder="shop-13/categories/banners"
              spec={IMAGE_UPLOAD_SPECS.categoryBanner}
              previewMaxWidth="full"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">คำอธิบาย Banner (alt)</label>
            <input
              value={form.bannerAlt}
              onChange={(event) => setForm({ ...form, bannerAlt: event.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-red px-4 py-2 text-sm font-semibold text-white hover:bg-red-dark disabled:opacity-60"
            >
              {saving ? "กำลังบันทึก..." : "บันทึก"}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">ชื่อ</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">สินค้า</th>
              <th className="px-4 py-3 font-medium">สถานะ</th>
              <th className="px-4 py-3 font-medium">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  กำลังโหลด...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  ยังไม่มีหมวดหมู่
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium">{category.label}</td>
                  <td className="px-4 py-3 text-gray-500">{category.slug}</td>
                  <td className="px-4 py-3">{category._count?.products ?? 0}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        category.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {category.isActive ? "ใช้งาน" : "ปิด"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(category)}
                        className="text-red hover:underline"
                      >
                        แก้ไข
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(category)}
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
    </div>
  );
}
