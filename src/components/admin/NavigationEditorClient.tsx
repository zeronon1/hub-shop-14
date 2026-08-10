"use client";

import { useEffect, useState } from "react";
import type { NavLink, SiteNavigation } from "@/lib/navigation-types";

const TABS = [
  {
    id: "header",
    label: "เมนู Header",
    description: "เมนูหลักด้านบนของเว็บ (เดสก์ท็อปและมือถือ)",
  },
  {
    id: "footerHome",
    label: "Footer — Home",
    description: "ลิงก์คอลัมน์ Home ในส่วนท้ายเว็บ",
  },
  {
    id: "footerMenu",
    label: "Footer — Menu",
    description: "ลิงก์คอลัมน์ Menu ในส่วนท้ายเว็บ",
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red focus:ring-2 focus:ring-red/20";

function emptyLink(): NavLink {
  return { label: "", href: "" };
}

export default function NavigationEditorClient() {
  const [form, setForm] = useState<SiteNavigation | null>(null);
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
        const response = await fetch("/api/admin/navigation");
        const data = (await response.json()) as {
          navigation?: SiteNavigation;
          error?: string;
        };
        if (!response.ok) {
          throw new Error(data.error ?? "โหลดข้อมูลไม่สำเร็จ");
        }
        if (!cancelled && data.navigation) {
          setForm(data.navigation);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error ? loadError.message : "โหลดข้อมูลไม่สำเร็จ",
          );
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

  function updateLink(tab: TabId, index: number, patch: Partial<NavLink>) {
    if (!form) return;
    setForm({
      ...form,
      [tab]: form[tab].map((link, i) => (i === index ? { ...link, ...patch } : link)),
    });
  }

  function addLink(tab: TabId) {
    if (!form) return;
    setForm({
      ...form,
      [tab]: [...form[tab], emptyLink()],
    });
  }

  function removeLink(tab: TabId, index: number) {
    if (!form) return;
    setForm({
      ...form,
      [tab]: form[tab].filter((_, i) => i !== index),
    });
  }

  function moveLink(tab: TabId, index: number, direction: -1 | 1) {
    if (!form) return;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= form[tab].length) return;
    const links = [...form[tab]];
    const [item] = links.splice(index, 1);
    links.splice(nextIndex, 0, item);
    setForm({ ...form, [tab]: links });
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!form) return;

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/navigation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as {
        navigation?: SiteNavigation;
        error?: string;
      };
      if (!response.ok) {
        throw new Error(data.error ?? "บันทึกไม่สำเร็จ");
      }
      if (data.navigation) {
        setForm(data.navigation);
      }
      setMessage("บันทึกเมนูเรียบร้อยแล้ว");
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
      <p className="text-sm text-red">
        {error || "ไม่พบข้อมูลเมนู"}
      </p>
    );
  }

  const activeMeta = TABS.find((tab) => tab.id === activeTab)!;
  const links = form[activeTab];

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการเมนู</h1>
          <p className="mt-1 text-sm text-gray-500">
            กำหนดชื่อเมนูและ URL สำหรับ Header และ Footer
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-red px-4 py-2 text-sm font-semibold text-white hover:bg-red/90 disabled:opacity-60"
        >
          {saving ? "กำลังบันทึก..." : "บันทึก"}
        </button>
      </div>

      {message ? (
        <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-lg border border-red/20 bg-red-light px-3 py-2 text-sm text-red">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {TABS.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-red-light text-red"
                  : "text-gray-600 hover:bg-gray-50 hover:text-red"
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-xs opacity-70">({form[tab.id].length})</span>
            </button>
          );
        })}
      </div>

      <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{activeMeta.label}</h2>
            <p className="mt-0.5 text-sm text-gray-500">{activeMeta.description}</p>
          </div>
          <button
            type="button"
            onClick={() => addLink(activeTab)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
          >
            + เพิ่มเมนู
          </button>
        </div>

        {links.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
            ยังไม่มีเมนู — กด &quot;+ เพิ่มเมนู&quot; เพื่อเริ่มต้น
          </p>
        ) : (
          <div className="space-y-3">
            {links.map((link, index) => (
              <div
                key={`${activeTab}-${index}`}
                className="space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-700">
                    รายการ #{index + 1}
                  </p>
                  <div className="flex flex-wrap items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveLink(activeTab, index, -1)}
                      disabled={index === 0}
                      className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                    >
                      ขึ้น
                    </button>
                    <button
                      type="button"
                      onClick={() => moveLink(activeTab, index, 1)}
                      disabled={index === links.length - 1}
                      className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                    >
                      ลง
                    </button>
                    <button
                      type="button"
                      onClick={() => removeLink(activeTab, index)}
                      className="rounded-md px-2 py-1 text-xs font-medium text-red hover:bg-red-light"
                    >
                      ลบ
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      ชื่อเมนู
                    </label>
                    <input
                      type="text"
                      value={link.label}
                      onChange={(event) =>
                        updateLink(activeTab, index, { label: event.target.value })
                      }
                      placeholder="เช่น รวมสินค้า"
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      URL
                    </label>
                    <input
                      type="text"
                      value={link.href}
                      onChange={(event) =>
                        updateLink(activeTab, index, { href: event.target.value })
                      }
                      placeholder="เช่น /products หรือ https://..."
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </form>
  );
}
