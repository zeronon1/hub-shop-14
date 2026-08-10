"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";
import { IMAGE_UPLOAD_SPECS } from "@/lib/admin/image-upload-specs";
import type { ContactPageContent, ContactPageTopic } from "@/lib/contact-page-types";
import type { SiteContactInfo } from "@/lib/site-contact-types";
import {
  emailsToText,
  normalizePhonesFromText,
  phonesToText,
} from "@/lib/site-contact";

const TABS = [
  { id: "shared", label: "ข้อมูลติดต่อทั่วไป" },
  { id: "hero", label: "หัวข้อหน้า" },
  { id: "topics", label: "หัวข้อสอบถาม" },
  { id: "channels", label: "ช่องทาง & QR" },
  { id: "tips", label: "เคล็ดลับ & เวลา" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red focus:ring-2 focus:ring-red/20";

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {children}
      {hint ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
    </div>
  );
}

export default function ContactEditorClient() {
  const [contact, setContact] = useState<SiteContactInfo | null>(null);
  const [page, setPage] = useState<ContactPageContent | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("shared");
  const [loading, setLoading] = useState(true);
  const [savingShared, setSavingShared] = useState(false);
  const [savingPage, setSavingPage] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [contactRes, pageRes] = await Promise.all([
          fetch("/api/admin/site-contact"),
          fetch("/api/admin/contact-page"),
        ]);

        const contactData = (await contactRes.json()) as {
          contact?: SiteContactInfo;
          error?: string;
        };
        const pageData = (await pageRes.json()) as {
          content?: ContactPageContent;
          error?: string;
        };

        if (!contactRes.ok) {
          throw new Error(contactData.error ?? "โหลดข้อมูลติดต่อไม่สำเร็จ");
        }
        if (!pageRes.ok) {
          throw new Error(pageData.error ?? "โหลดเนื้อหาหน้าไม่สำเร็จ");
        }

        if (!cancelled) {
          if (contactData.contact) setContact(contactData.contact);
          if (pageData.content) setPage(pageData.content);
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

  async function saveShared(event: React.FormEvent) {
    event.preventDefault();
    if (!contact) return;

    setSavingShared(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/site-contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });
      const data = (await response.json()) as {
        contact?: SiteContactInfo;
        error?: string;
      };
      if (!response.ok) {
        throw new Error(data.error ?? "บันทึกไม่สำเร็จ");
      }
      if (data.contact) setContact(data.contact);
      setMessage("บันทึกข้อมูลติดต่อทั่วไปแล้ว — อัปเดต Footer และปุ่มติดต่อทั่วเว็บ");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "บันทึกไม่สำเร็จ");
    } finally {
      setSavingShared(false);
    }
  }

  async function savePage(event: React.FormEvent) {
    event.preventDefault();
    if (!page) return;

    setSavingPage(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/contact-page", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(page),
      });
      const data = (await response.json()) as {
        content?: ContactPageContent;
        error?: string;
      };
      if (!response.ok) {
        throw new Error(data.error ?? "บันทึกไม่สำเร็จ");
      }
      if (data.content) setPage(data.content);
      setMessage("บันทึกเนื้อหาหน้าติดต่อเราแล้ว");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "บันทึกไม่สำเร็จ");
    } finally {
      setSavingPage(false);
    }
  }

  function updateTopic(index: number, patch: Partial<ContactPageTopic>) {
    if (!page) return;
    setPage({
      ...page,
      topics: page.topics.map((topic, i) =>
        i === index ? { ...topic, ...patch } : topic,
      ),
    });
  }

  function addTopic() {
    if (!page) return;
    setPage({
      ...page,
      topics: [...page.topics, { title: "", description: "" }],
    });
  }

  function removeTopic(index: number) {
    if (!page || page.topics.length <= 1) return;
    setPage({
      ...page,
      topics: page.topics.filter((_, i) => i !== index),
    });
  }

  function updateTip(index: number, value: string) {
    if (!page) return;
    setPage({
      ...page,
      tips: page.tips.map((tip, i) => (i === index ? value : tip)),
    });
  }

  function addTip() {
    if (!page) return;
    setPage({ ...page, tips: [...page.tips, ""] });
  }

  function removeTip(index: number) {
    if (!page || page.tips.length <= 1) return;
    setPage({
      ...page,
      tips: page.tips.filter((_, i) => i !== index),
    });
  }

  if (loading) {
    return <p className="text-sm text-gray-500">กำลังโหลด...</p>;
  }

  if (!contact || !page) {
    return <p className="text-sm text-red">โหลดข้อมูลติดต่อเราไม่สำเร็จ</p>;
  }

  const isSharedTab = activeTab === "shared";

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">แก้ไขหน้าติดต่อเรา</h1>
          <p className="mt-1 text-sm text-gray-500">
            ข้อมูลติดต่อทั่วไปใช้ร่วมกับ Footer ปุ่ม Line/Facebook และหน้ารายละเอียดสินค้า
          </p>
        </div>
        <Link
          href="/contact"
          target="_blank"
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          ดูหน้าเว็บ
        </Link>
      </div>

      <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        แท็บ <strong>ข้อมูลติดต่อทั่วไป</strong> บันทึกแยก — จะอัปเดตทุกจุดบนเว็บ (Footer, ปุ่มติดต่อ, อีเมล, โทร)
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

      {message ? (
        <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p>
      ) : null}
      {error ? (
        <p className="mb-4 rounded-lg bg-red-light px-3 py-2 text-sm text-red">{error}</p>
      ) : null}

      {isSharedTab ? (
        <form onSubmit={saveShared} className="space-y-6">
          <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold">ข้อมูลติดต่อทั่วไป (ใช้ทั้งเว็บ)</h2>

            <Field label="ชื่อร้าน / บริษัท">
              <input
                type="text"
                value={contact.companyName}
                onChange={(event) =>
                  setContact({ ...contact, companyName: event.target.value })
                }
                className={inputClass}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Line ID (แสดงผล)">
                <input
                  type="text"
                  value={contact.lineId}
                  onChange={(event) =>
                    setContact({ ...contact, lineId: event.target.value })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Line URL">
                <input
                  type="url"
                  value={contact.lineUrl}
                  onChange={(event) =>
                    setContact({ ...contact, lineUrl: event.target.value })
                  }
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="ชื่อเพจ Facebook">
                <input
                  type="text"
                  value={contact.facebookPageName}
                  onChange={(event) =>
                    setContact({ ...contact, facebookPageName: event.target.value })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Facebook URL">
                <input
                  type="url"
                  value={contact.facebookUrl}
                  onChange={(event) =>
                    setContact({ ...contact, facebookUrl: event.target.value })
                  }
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="อีเมล (หนึ่งบรรทัดต่อหนึ่งอีเมล)">
              <textarea
                value={emailsToText(contact.emails)}
                onChange={(event) =>
                  setContact({
                    ...contact,
                    emails: event.target.value
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean),
                  })
                }
                rows={3}
                className={inputClass}
              />
            </Field>

            <Field label="เบอร์โทร (หนึ่งบรรทัดต่อหนึ่งเบอร์)">
              <textarea
                value={phonesToText(contact.phones)}
                onChange={(event) =>
                  setContact({
                    ...contact,
                    phones: normalizePhonesFromText(event.target.value),
                  })
                }
                rows={3}
                className={inputClass}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="ที่อยู่ บรรทัด 1">
                <input
                  type="text"
                  value={contact.address?.line1 ?? ""}
                  onChange={(event) => {
                    const line1 = event.target.value;
                    const line2 = contact.address?.line2 ?? "";
                    setContact({
                      ...contact,
                      address: line1 || line2 ? { line1, line2 } : null,
                    });
                  }}
                  className={inputClass}
                />
              </Field>
              <Field label="ที่อยู่ บรรทัด 2">
                <input
                  type="text"
                  value={contact.address?.line2 ?? ""}
                  onChange={(event) => {
                    const line2 = event.target.value;
                    const line1 = contact.address?.line1 ?? "";
                    setContact({
                      ...contact,
                      address: line1 || line2 ? { line1, line2 } : null,
                    });
                  }}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="เวลาทำการ">
              <textarea
                value={contact.businessHours}
                onChange={(event) =>
                  setContact({ ...contact, businessHours: event.target.value })
                }
                rows={2}
                className={inputClass}
              />
            </Field>

            <Field label="Google Maps Embed URL" hint="วาง iframe src ของ Google Maps">
              <input
                type="url"
                value={contact.mapEmbedUrl ?? ""}
                onChange={(event) =>
                  setContact({
                    ...contact,
                    mapEmbedUrl: event.target.value.trim() || null,
                  })
                }
                className={inputClass}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Instagram URL">
                <input
                  type="url"
                  value={contact.instagramUrl}
                  onChange={(event) =>
                    setContact({ ...contact, instagramUrl: event.target.value })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="YouTube URL">
                <input
                  type="url"
                  value={contact.youtubeUrl}
                  onChange={(event) =>
                    setContact({ ...contact, youtubeUrl: event.target.value })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="TikTok URL">
                <input
                  type="url"
                  value={contact.tiktokUrl}
                  onChange={(event) =>
                    setContact({ ...contact, tiktokUrl: event.target.value })
                  }
                  className={inputClass}
                />
              </Field>
            </div>
          </section>

          <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 py-4">
            <button
              type="submit"
              disabled={savingShared}
              className="rounded-lg bg-red px-6 py-3 text-sm font-semibold text-white hover:bg-red-dark disabled:opacity-60"
            >
              {savingShared ? "กำลังบันทึก..." : "บันทึกข้อมูลติดต่อทั่วไป"}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={savePage} className="space-y-6">
          {activeTab === "hero" ? (
            <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold">หัวข้อหน้า</h2>
              <Field label="หัวข้อหลัก">
                <input
                  type="text"
                  value={page.title}
                  onChange={(event) => setPage({ ...page, title: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="คำบรรยายเล็กด้านบน">
                <input
                  type="text"
                  value={page.subtitle}
                  onChange={(event) => setPage({ ...page, subtitle: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="บทนำ">
                <textarea
                  value={page.intro}
                  onChange={(event) => setPage({ ...page, intro: event.target.value })}
                  rows={3}
                  className={inputClass}
                />
              </Field>
              <Field label="เกี่ยวกับร้าน (ในหน้านี้)">
                <textarea
                  value={page.about}
                  onChange={(event) => setPage({ ...page, about: event.target.value })}
                  rows={4}
                  className={inputClass}
                />
              </Field>
            </section>
          ) : null}

          {activeTab === "topics" ? (
            <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">หัวข้อสอบถาม</h2>
                <button
                  type="button"
                  onClick={addTopic}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
                >
                  + เพิ่มหัวข้อ
                </button>
              </div>
              <Field label="หัวข้อส่วน">
                <input
                  type="text"
                  value={page.topicsTitle}
                  onChange={(event) =>
                    setPage({ ...page, topicsTitle: event.target.value })
                  }
                  className={inputClass}
                />
              </Field>
              {page.topics.map((topic, index) => (
                <div
                  key={`topic-${index}`}
                  className="space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">หัวข้อ #{index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeTopic(index)}
                      className="text-sm text-red hover:underline"
                    >
                      ลบ
                    </button>
                  </div>
                  <input
                    type="text"
                    value={topic.title}
                    onChange={(event) =>
                      updateTopic(index, { title: event.target.value })
                    }
                    placeholder="ชื่อหัวข้อ"
                    className={inputClass}
                  />
                  <textarea
                    value={topic.description}
                    onChange={(event) =>
                      updateTopic(index, { description: event.target.value })
                    }
                    rows={2}
                    placeholder="คำอธิบาย"
                    className={inputClass}
                  />
                </div>
              ))}
            </section>
          ) : null}

          {activeTab === "channels" ? (
            <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold">ช่องทางติดต่อ & QR Line</h2>
              <Field label="หัวข้อส่วนช่องทาง">
                <input
                  type="text"
                  value={page.channelsTitle}
                  onChange={(event) =>
                    setPage({ ...page, channelsTitle: event.target.value })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="คำอธิบายช่องทาง">
                <textarea
                  value={page.channelsIntro}
                  onChange={(event) =>
                    setPage({ ...page, channelsIntro: event.target.value })
                  }
                  rows={2}
                  className={inputClass}
                />
              </Field>
              <ImageUpload
                label="รูป QR Line"
                value={page.lineQr.src}
                onChange={(url) =>
                  setPage({
                    ...page,
                    lineQr: { ...page.lineQr, src: url },
                  })
                }
                folder="shop-13/contact"
                spec={IMAGE_UPLOAD_SPECS.contactLineQr}
              />
              <Field label="Alt รูป QR">
                <input
                  type="text"
                  value={page.lineQr.alt}
                  onChange={(event) =>
                    setPage({
                      ...page,
                      lineQr: { ...page.lineQr, alt: event.target.value },
                    })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="คำบรรยายใต้ QR">
                <input
                  type="text"
                  value={page.lineQr.caption}
                  onChange={(event) =>
                    setPage({
                      ...page,
                      lineQr: { ...page.lineQr, caption: event.target.value },
                    })
                  }
                  className={inputClass}
                />
              </Field>
            </section>
          ) : null}

          {activeTab === "tips" ? (
            <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold">เคล็ดลับ & เวลา</h2>
              <Field
                label="หมายเหตุเวลาทำการ (เฉพาะหน้านี้)"
                hint="ถ้าเว้นว่างจะใช้เวลาทำการจากข้อมูลติดต่อทั่วไป"
              >
                <textarea
                  value={page.hoursNote}
                  onChange={(event) =>
                    setPage({ ...page, hoursNote: event.target.value })
                  }
                  rows={2}
                  className={inputClass}
                />
              </Field>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm font-medium text-gray-700">หัวข้อเคล็ดลับ</label>
                  <button
                    type="button"
                    onClick={addTip}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
                  >
                    + เพิ่มข้อความ
                  </button>
                </div>
                <input
                  type="text"
                  value={page.tipsTitle}
                  onChange={(event) =>
                    setPage({ ...page, tipsTitle: event.target.value })
                  }
                  className={inputClass}
                />
                {page.tips.map((tip, index) => (
                  <div key={`tip-${index}`} className="flex gap-2">
                    <textarea
                      value={tip}
                      onChange={(event) => updateTip(index, event.target.value)}
                      rows={2}
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => removeTip(index)}
                      className="shrink-0 self-start text-sm text-red hover:underline"
                    >
                      ลบ
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 py-4">
            <button
              type="submit"
              disabled={savingPage}
              className="rounded-lg bg-red px-6 py-3 text-sm font-semibold text-white hover:bg-red-dark disabled:opacity-60"
            >
              {savingPage ? "กำลังบันทึก..." : "บันทึกเนื้อหาหน้าติดต่อเรา"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
