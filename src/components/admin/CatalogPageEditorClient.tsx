"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";
import { IMAGE_UPLOAD_SPECS } from "@/lib/admin/image-upload-specs";
import type { CatalogPageContent } from "@/lib/catalog-page-defaults";

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red";

export default function CatalogPageEditorClient() {
  const [form, setForm] = useState<CatalogPageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/admin/catalog-page");
        const data = (await response.json()) as {
          content?: CatalogPageContent;
          error?: string;
        };
        if (!response.ok) {
          throw new Error(data.error ?? "โหลดข้อมูลไม่สำเร็จ");
        }
        if (!cancelled && data.content) {
          setForm(data.content);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "โหลดข้อมูลไม่สำเร็จ");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!form) return;

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/catalog-page", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as {
        content?: CatalogPageContent;
        error?: string;
      };
      if (!response.ok) {
        throw new Error(data.error ?? "บันทึกไม่สำเร็จ");
      }
      if (data.content) setForm(data.content);
      setMessage("บันทึกแล้ว หน้าหมวดหมู่รวมจะใช้ค่านี้ทันที");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-500">กำลังโหลด...</p>;
  }

  if (!form) {
    return <p className="text-sm text-red-600">{error || "ไม่พบข้อมูลหน้าหมวดหมู่รวม"}</p>;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">แก้ไขหน้าหมวดหมู่รวม</h1>
          <p className="mt-1 text-sm text-gray-500">
            แก้หัวข้อ คำอธิบาย และรูป Banner ส่วน Hero ของหน้า /catalog
          </p>
        </div>
        <Link
          href="/catalog"
          target="_blank"
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          ดูหน้าเว็บ
        </Link>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {message ? (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p>
        ) : null}
        {error ? (
          <p className="rounded-lg bg-red-light px-3 py-2 text-sm text-red">{error}</p>
        ) : null}

        <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Banner ส่วน Hero</h2>
          <p className="text-sm text-gray-500">
            ใช้เฉพาะหน้าหมวดหมู่รวม Banner ของแต่ละซีรีส์แก้ที่เมนูจัดการหมวดหมู่
            และ Banner หน้ารวมสินค้าแก้ที่เมนูรวมสินค้า
          </p>
          <ImageUpload
            label="รูป Banner"
            value={form.banner.image}
            onChange={(url) => setForm({ ...form, banner: { ...form.banner, image: url } })}
            folder="shop-13/catalog-page/hero"
            spec={IMAGE_UPLOAD_SPECS.catalogPageBanner}
            previewMaxWidth="full"
          />
          <div>
            <label className="mb-1 block text-sm font-medium">คำอธิบายรูป (Alt)</label>
            <input
              type="text"
              value={form.banner.alt}
              onChange={(event) =>
                setForm({
                  ...form,
                  banner: { ...form.banner, alt: event.target.value },
                })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">หัวข้อ</label>
            <input
              type="text"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">คำอธิบายใต้หัวข้อ</label>
            <textarea
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              rows={3}
              className={inputClass}
              required
            />
          </div>
        </section>

        <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 py-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-dark disabled:opacity-60"
          >
            {saving ? "กำลังบันทึก..." : "บันทึกหน้าหมวดหมู่รวม"}
          </button>
        </div>
      </form>
    </div>
  );
}
