"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RichTextEditor from "@/components/admin/RichTextEditor";
import type {
  OrderGuideContent,
  OrderGuideSection,
  OrderGuideStep,
} from "@/lib/order-guide-types";

const TABS = [
  { id: "header", label: "หัวข้อหน้า" },
  { id: "steps", label: "ขั้นตอน 1-2-3" },
  { id: "sections", label: "หัวข้อรายละเอียด" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function OrderGuideEditorClient() {
  const [form, setForm] = useState<OrderGuideContent | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("header");
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
        const response = await fetch("/api/admin/order-guide");
        const data = (await response.json()) as {
          content?: OrderGuideContent;
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

  function updateStep(index: number, patch: Partial<OrderGuideStep>) {
    if (!form) return;
    setForm({
      ...form,
      steps: form.steps.map((step, i) => (i === index ? { ...step, ...patch } : step)),
    });
  }

  function addStep() {
    if (!form) return;
    setForm({
      ...form,
      steps: [...form.steps, { title: "", description: "" }],
    });
  }

  function removeStep(index: number) {
    if (!form || form.steps.length <= 1) return;
    setForm({
      ...form,
      steps: form.steps.filter((_, i) => i !== index),
    });
  }

  function updateSection(index: number, patch: Partial<OrderGuideSection>) {
    if (!form) return;
    setForm({
      ...form,
      sections: form.sections.map((section, i) =>
        i === index ? { ...section, ...patch } : section,
      ),
    });
  }

  function addSection() {
    if (!form) return;
    setForm({
      ...form,
      sections: [...form.sections, { title: "", bodyHtml: "<p></p>" }],
    });
  }

  function removeSection(index: number) {
    if (!form || form.sections.length <= 1) return;
    setForm({
      ...form,
      sections: form.sections.filter((_, i) => i !== index),
    });
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!form) return;

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/order-guide", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as {
        content?: OrderGuideContent;
        error?: string;
      };
      if (!response.ok) {
        throw new Error(data.error ?? "บันทึกไม่สำเร็จ");
      }
      if (data.content) setForm(data.content);
      setMessage("บันทึกหน้าวิธีสั่งซื้อเรียบร้อยแล้ว");
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
    return (
      <p className="text-sm text-red-600">{error || "ไม่พบข้อมูลหน้ารายละเอียดการสั่งซื้อ"}</p>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">แก้ไขหน้าวิธีสั่งซื้อ</h1>
          <p className="mt-1 text-sm text-gray-500">
            แก้ไขหัวข้อ ขั้นตอนการสั่งซื้อ และรายละเอียดชำระเงิน/จัดส่ง
          </p>
        </div>
        <Link
          href="/order-guide"
          target="_blank"
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          ดูหน้าเว็บ
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200 pb-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-red text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {message ? (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p>
        ) : null}
        {error ? (
          <p className="rounded-lg bg-red-light px-3 py-2 text-sm text-red">{error}</p>
        ) : null}

        {activeTab === "header" ? (
      <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold">หัวข้อหน้า</h2>
        <div>
          <label className="mb-1 block text-sm font-medium">หัวข้อหน้า</label>
          <input
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">คำอธิบายสั้นๆ</label>
          <textarea
            value={form.subtitle}
            onChange={(event) => setForm({ ...form, subtitle: event.target.value })}
            rows={2}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red"
          />
        </div>
      </section>
        ) : null}

        {activeTab === "steps" ? (
      <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">ขั้นตอน 1-2-3</h2>
          <button
            type="button"
            onClick={addStep}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
          >
            + เพิ่มขั้นตอน
          </button>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">หัวข้อส่วนขั้นตอน</label>
          <input
            value={form.stepsHeading}
            onChange={(event) =>
              setForm({ ...form, stepsHeading: event.target.value })
            }
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red"
          />
        </div>

        <div className="space-y-4">
          {form.steps.map((step, index) => (
            <div
              key={`step-${index}`}
              className="rounded-lg border border-gray-100 bg-gray-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-red">ขั้นตอนที่ {index + 1}</p>
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  disabled={form.steps.length <= 1}
                  className="text-xs text-gray-500 hover:text-red disabled:opacity-40"
                >
                  ลบ
                </button>
              </div>
              <div className="space-y-3">
                <input
                  value={step.title}
                  onChange={(event) =>
                    updateStep(index, { title: event.target.value })
                  }
                  placeholder="ชื่อขั้นตอน เช่น เลือกสินค้า"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-red"
                />
                <textarea
                  value={step.description}
                  onChange={(event) =>
                    updateStep(index, { description: event.target.value })
                  }
                  rows={2}
                  placeholder="คำอธิบายสั้นๆ ของขั้นตอนนี้"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-red"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
        ) : null}

        {activeTab === "sections" ? (
      <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">หัวข้อรายละเอียด</h2>
          <button
            type="button"
            onClick={addSection}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
          >
            + เพิ่มหัวข้อ
          </button>
        </div>

        <div className="space-y-6">
          {form.sections.map((section, index) => (
            <div
              key={`section-${index}`}
              className="space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">หัวข้อที่ {index + 1}</p>
                <button
                  type="button"
                  onClick={() => removeSection(index)}
                  disabled={form.sections.length <= 1}
                  className="text-xs text-gray-500 hover:text-red disabled:opacity-40"
                >
                  ลบ
                </button>
              </div>
              <input
                value={section.title}
                onChange={(event) =>
                  updateSection(index, { title: event.target.value })
                }
                placeholder="ชื่อหัวข้อ เช่น ช่องทางชำระเงิน"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-red"
              />
              <RichTextEditor
                value={section.bodyHtml}
                onChange={(bodyHtml) => updateSection(index, { bodyHtml })}
                placeholder="เขียนรายละเอียดของหัวข้อนี้..."
                minHeightClassName="min-h-[180px]"
              />
            </div>
          ))}
        </div>
      </section>
        ) : null}

        <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 py-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-dark disabled:opacity-60"
          >
            {saving ? "กำลังบันทึก..." : "บันทึกหน้าวิธีสั่งซื้อ"}
          </button>
        </div>
      </form>
    </div>
  );
}
