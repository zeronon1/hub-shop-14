"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";
import { IMAGE_UPLOAD_SPECS } from "@/lib/admin/image-upload-specs";
import type {
  HomeCategoryCard,
  HomeGalleryImage,
  HomeServiceFeature,
  HomeServiceFeatureIcon,
  HomeServiceSection,
  HomeStat,
  HomepageContent,
} from "@/lib/homepage-types";

const TABS = [
  { id: "hero", label: "Banner หลัก" },
  { id: "categories", label: "การ์ดหมวดหมู่" },
  { id: "brands", label: "โลโก้แบรนด์" },
  { id: "collection", label: "คอลเลกชัน" },
  { id: "products", label: "ส่วนสินค้า" },
  { id: "about", label: "เกี่ยวกับเรา" },
  { id: "why", label: "ทำไมต้องเลือกเรา" },
  { id: "services", label: "สินค้าและบริการ" },
  { id: "marquee", label: "Marquee" },
  { id: "features", label: "จุดเด่นบริการ" },
  { id: "gallery", label: "แกลเลอรี่" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const FEATURE_ICON_OPTIONS: { value: HomeServiceFeatureIcon; label: string }[] = [
  { value: "box", label: "กล่อง (พร้อมส่ง)" },
  { value: "calendar", label: "ปฏิทิน (พรีออเดอร์)" },
  { value: "truck", label: "รถส่ง (จัดส่ง)" },
  { value: "store", label: "ร้าน (หน้าร้าน)" },
];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red focus:ring-2 focus:ring-red/20";

export default function HomepageEditorClient() {
  const [form, setForm] = useState<HomepageContent | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("hero");
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
        const response = await fetch("/api/admin/homepage");
        const data = (await response.json()) as {
          content?: HomepageContent;
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
      const response = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as {
        content?: HomepageContent;
        error?: string;
      };
      if (!response.ok) {
        throw new Error(data.error ?? "บันทึกไม่สำเร็จ");
      }
      if (data.content) setForm(data.content);
      setMessage("บันทึกหน้าแรกเรียบร้อยแล้ว");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  function updateCategoryCard(index: number, patch: Partial<HomeCategoryCard>) {
    if (!form) return;
    setForm({
      ...form,
      categoryCards: form.categoryCards.map((card, i) =>
        i === index ? { ...card, ...patch } : card,
      ),
    });
  }

  function addCategoryCard() {
    if (!form) return;
    setForm({
      ...form,
      categoryCards: [
        ...form.categoryCards,
        { title: "", image: "", href: "/category/" },
      ],
    });
  }

  function removeCategoryCard(index: number) {
    if (!form || form.categoryCards.length <= 1) return;
    setForm({
      ...form,
      categoryCards: form.categoryCards.filter((_, i) => i !== index),
    });
  }

  function updateBrandLogo(
    index: number,
    patch: Partial<HomepageContent["brandLogos"][number]>,
  ) {
    if (!form) return;
    setForm({
      ...form,
      brandLogos: form.brandLogos.map((logo, i) =>
        i === index ? { ...logo, ...patch } : logo,
      ),
    });
  }

  function addBrandLogo() {
    if (!form) return;
    setForm({
      ...form,
      brandLogos: [...form.brandLogos, { image: "", alt: "" }],
    });
  }

  function removeBrandLogo(index: number) {
    if (!form || form.brandLogos.length <= 1) return;
    setForm({
      ...form,
      brandLogos: form.brandLogos.filter((_, i) => i !== index),
    });
  }

  function updateStat(index: number, patch: Partial<HomeStat>) {
    if (!form) return;
    setForm({
      ...form,
      whyChooseUs: {
        ...form.whyChooseUs,
        stats: form.whyChooseUs.stats.map((stat, i) =>
          i === index ? { ...stat, ...patch } : stat,
        ),
      },
    });
  }

  function addStat() {
    if (!form) return;
    setForm({
      ...form,
      whyChooseUs: {
        ...form.whyChooseUs,
        stats: [...form.whyChooseUs.stats, { value: "", label: "", sublabel: "" }],
      },
    });
  }

  function removeStat(index: number) {
    if (!form || form.whyChooseUs.stats.length <= 1) return;
    setForm({
      ...form,
      whyChooseUs: {
        ...form.whyChooseUs,
        stats: form.whyChooseUs.stats.filter((_, i) => i !== index),
      },
    });
  }

  function updateServiceSection(index: number, patch: Partial<HomeServiceSection>) {
    if (!form) return;
    setForm({
      ...form,
      services: {
        ...form.services,
        sections: form.services.sections.map((section, i) =>
          i === index ? { ...section, ...patch } : section,
        ),
      },
    });
  }

  function updateServiceSectionItems(index: number, itemsText: string) {
    updateServiceSection(index, {
      items: itemsText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    });
  }

  function addServiceSection() {
    if (!form) return;
    setForm({
      ...form,
      services: {
        ...form.services,
        sections: [...form.services.sections, { title: "", items: [] }],
      },
    });
  }

  function removeServiceSection(index: number) {
    if (!form || form.services.sections.length <= 1) return;
    setForm({
      ...form,
      services: {
        ...form.services,
        sections: form.services.sections.filter((_, i) => i !== index),
      },
    });
  }

  function updateServiceFeature(index: number, patch: Partial<HomeServiceFeature>) {
    if (!form) return;
    setForm({
      ...form,
      serviceFeatures: form.serviceFeatures.map((feature, i) =>
        i === index ? { ...feature, ...patch } : feature,
      ),
    });
  }

  function addServiceFeature() {
    if (!form) return;
    setForm({
      ...form,
      serviceFeatures: [
        ...form.serviceFeatures,
        { title: "", description: "", icon: "box" },
      ],
    });
  }

  function removeServiceFeature(index: number) {
    if (!form || form.serviceFeatures.length <= 1) return;
    setForm({
      ...form,
      serviceFeatures: form.serviceFeatures.filter((_, i) => i !== index),
    });
  }

  function updateGalleryImage(index: number, patch: Partial<HomeGalleryImage>) {
    if (!form) return;
    setForm({
      ...form,
      galleryImages: form.galleryImages.map((image, i) =>
        i === index ? { ...image, ...patch } : image,
      ),
    });
  }

  function addGalleryImage() {
    if (!form) return;
    setForm({
      ...form,
      galleryImages: [...form.galleryImages, { src: "", alt: "" }],
    });
  }

  function removeGalleryImage(index: number) {
    if (!form || form.galleryImages.length <= 1) return;
    setForm({
      ...form,
      galleryImages: form.galleryImages.filter((_, i) => i !== index),
    });
  }

  function updateAboutParagraph(index: number, value: string) {
    if (!form) return;
    setForm({
      ...form,
      about: {
        ...form.about,
        paragraphs: form.about.paragraphs.map((paragraph, i) =>
          i === index ? value : paragraph,
        ),
      },
    });
  }

  function addAboutParagraph() {
    if (!form) return;
    setForm({
      ...form,
      about: {
        ...form.about,
        paragraphs: [...form.about.paragraphs, ""],
      },
    });
  }

  function removeAboutParagraph(index: number) {
    if (!form || form.about.paragraphs.length <= 1) return;
    setForm({
      ...form,
      about: {
        ...form.about,
        paragraphs: form.about.paragraphs.filter((_, i) => i !== index),
      },
    });
  }

  if (loading) {
    return <p className="text-sm text-gray-500">กำลังโหลด...</p>;
  }

  if (!form) {
    return <p className="text-sm text-red">โหลดข้อมูลหน้าแรกไม่สำเร็จ</p>;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">แก้ไขหน้าแรก</h1>
          <p className="mt-1 text-sm text-gray-500">
            แก้ไข Banner ข้อความ และรูปภาพทุกส่วนของหน้าแรก
          </p>
        </div>
        <Link
          href="/"
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
        {activeTab === "hero" ? (
          <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Banner หลัก (Hero)</h2>
            <ImageUpload
              label="รูป Banner"
              value={form.heroBanner.image}
              onChange={(url) =>
                setForm({ ...form, heroBanner: { ...form.heroBanner, image: url } })
              }
              folder="shop-13/homepage/hero"
              spec={IMAGE_UPLOAD_SPECS.heroBanner}
              previewMaxWidth="full"
            />
            <Field label="คำอธิบายรูป (Alt)">
              <input
                type="text"
                value={form.heroBanner.alt}
                onChange={(event) =>
                  setForm({
                    ...form,
                    heroBanner: { ...form.heroBanner, alt: event.target.value },
                  })
                }
                className={inputClass}
              />
            </Field>
          </section>
        ) : null}

        {activeTab === "categories" ? (
          <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">การ์ดหมวดหมู่</h2>
              <button
                type="button"
                onClick={addCategoryCard}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
              >
                + เพิ่มการ์ด
              </button>
            </div>
            {form.categoryCards.map((card, index) => (
              <div
                key={`category-${index}`}
                className="space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700">การ์ด #{index + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeCategoryCard(index)}
                    className="text-sm text-red hover:underline"
                  >
                    ลบ
                  </button>
                </div>
                <Field label="ชื่อหมวด">
                  <input
                    type="text"
                    value={card.title}
                    onChange={(event) =>
                      updateCategoryCard(index, { title: event.target.value })
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="ลิงก์ (href)">
                  <input
                    type="text"
                    value={card.href}
                    onChange={(event) =>
                      updateCategoryCard(index, { href: event.target.value })
                    }
                    className={inputClass}
                    placeholder="/category/one-piece"
                  />
                </Field>
                <ImageUpload
                  label="รูปการ์ด"
                  value={card.image}
                  onChange={(url) => updateCategoryCard(index, { image: url })}
                  folder="shop-13/homepage/categories"
                  spec={IMAGE_UPLOAD_SPECS.categoryCard}
                />
              </div>
            ))}
          </section>
        ) : null}

        {activeTab === "brands" ? (
          <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">โลโก้แบรนด์ (สไลด์)</h2>
              <button
                type="button"
                onClick={addBrandLogo}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
              >
                + เพิ่มโลโก้
              </button>
            </div>
            {form.brandLogos.map((logo, index) => (
              <div
                key={`brand-${index}`}
                className="space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700">โลโก้ #{index + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeBrandLogo(index)}
                    className="text-sm text-red hover:underline"
                  >
                    ลบ
                  </button>
                </div>
                <Field label="ชื่อแบรนด์ (Alt)">
                  <input
                    type="text"
                    value={logo.alt}
                    onChange={(event) =>
                      updateBrandLogo(index, { alt: event.target.value })
                    }
                    className={inputClass}
                  />
                </Field>
                <ImageUpload
                  label="รูปโลโก้"
                  value={logo.image}
                  onChange={(url) => updateBrandLogo(index, { image: url })}
                  folder="shop-13/homepage/brands"
                  spec={IMAGE_UPLOAD_SPECS.brandLogo}
                />
              </div>
            ))}
          </section>
        ) : null}

        {activeTab === "collection" ? (
          <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold">ส่วนคอลเลกชัน</h2>
            <Field label="ข้อความเล็กด้านบน (Eyebrow)">
              <input
                type="text"
                value={form.collectionSection.eyebrow}
                onChange={(event) =>
                  setForm({
                    ...form,
                    collectionSection: {
                      ...form.collectionSection,
                      eyebrow: event.target.value,
                    },
                  })
                }
                className={inputClass}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="หัวข้อหลัก">
                <input
                  type="text"
                  value={form.collectionSection.title}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      collectionSection: {
                        ...form.collectionSection,
                        title: event.target.value,
                      },
                    })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="หัวข้อเน้น (สีแดง)">
                <input
                  type="text"
                  value={form.collectionSection.titleAccent}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      collectionSection: {
                        ...form.collectionSection,
                        titleAccent: event.target.value,
                      },
                    })
                  }
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="คำอธิบาย">
              <textarea
                value={form.collectionSection.description}
                onChange={(event) =>
                  setForm({
                    ...form,
                    collectionSection: {
                      ...form.collectionSection,
                      description: event.target.value,
                    },
                  })
                }
                rows={4}
                className={inputClass}
              />
            </Field>
            <ImageUpload
              label="รูปคอลเลกชัน"
              value={form.collectionSection.image}
              onChange={(url) =>
                setForm({
                  ...form,
                  collectionSection: { ...form.collectionSection, image: url },
                })
              }
              folder="shop-13/homepage/collection"
              spec={IMAGE_UPLOAD_SPECS.collection}
              previewMaxWidth="md"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="ข้อความปุ่ม">
                <input
                  type="text"
                  value={form.collectionSection.buttonLabel}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      collectionSection: {
                        ...form.collectionSection,
                        buttonLabel: event.target.value,
                      },
                    })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="ลิงก์ปุ่ม">
                <input
                  type="text"
                  value={form.collectionSection.buttonHref}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      collectionSection: {
                        ...form.collectionSection,
                        buttonHref: event.target.value,
                      },
                    })
                  }
                  className={inputClass}
                />
              </Field>
            </div>
          </section>
        ) : null}

        {activeTab === "products" ? (
          <section className="space-y-6 rounded-xl border border-gray-200 bg-white p-6">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">New Arrival</h2>
              <Field label="หัวข้อส่วน">
                <input
                  type="text"
                  value={form.productSections.newArrival.title}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      productSections: {
                        ...form.productSections,
                        newArrival: { title: event.target.value },
                      },
                    })
                  }
                  className={inputClass}
                />
              </Field>
              <p className="text-xs text-gray-500">
                สินค้าในส่วนนี้ดึงจากสินค้าที่ติ๊ก &quot;สินค้าใหม่&quot; ในเมนูจัดการสินค้า
              </p>
            </div>
            <div className="space-y-3 border-t border-gray-100 pt-6">
              <h2 className="text-lg font-semibold">Our Recommend</h2>
              <Field label="หัวข้อส่วน">
                <input
                  type="text"
                  value={form.productSections.recommend.title}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      productSections: {
                        ...form.productSections,
                        recommend: {
                          ...form.productSections.recommend,
                          title: event.target.value,
                        },
                      },
                    })
                  }
                  className={inputClass}
                />
              </Field>
              <ImageUpload
                label="Banner แนะนำ"
                value={form.productSections.recommend.banner.image}
                onChange={(url) =>
                  setForm({
                    ...form,
                    productSections: {
                      ...form.productSections,
                      recommend: {
                        ...form.productSections.recommend,
                        banner: {
                          ...form.productSections.recommend.banner,
                          image: url,
                        },
                      },
                    },
                  })
                }
                folder="shop-13/homepage/recommend"
                spec={IMAGE_UPLOAD_SPECS.recommendBanner}
                previewMaxWidth="full"
              />
              <Field label="Alt Banner">
                <input
                  type="text"
                  value={form.productSections.recommend.banner.alt}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      productSections: {
                        ...form.productSections,
                        recommend: {
                          ...form.productSections.recommend,
                          banner: {
                            ...form.productSections.recommend.banner,
                            alt: event.target.value,
                          },
                        },
                      },
                    })
                  }
                  className={inputClass}
                />
              </Field>
              <p className="text-xs text-gray-500">
                สินค้าในส่วนนี้ดึงจากสินค้าที่ติ๊ก &quot;สินค้าแนะนำ&quot; ในเมนูจัดการสินค้า
              </p>
            </div>
          </section>
        ) : null}

        {activeTab === "about" ? (
          <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold">เกี่ยวกับเรา</h2>
            <Field label="หัวข้อ">
              <input
                type="text"
                value={form.about.title}
                onChange={(event) =>
                  setForm({
                    ...form,
                    about: { ...form.about, title: event.target.value },
                  })
                }
                className={inputClass}
              />
            </Field>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">ย่อหน้า</p>
                <button
                  type="button"
                  onClick={addAboutParagraph}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
                >
                  + เพิ่มย่อหน้า
                </button>
              </div>
              {form.about.paragraphs.map((paragraph, index) => (
                <div key={`about-p-${index}`} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">ย่อหน้า #{index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeAboutParagraph(index)}
                      className="text-xs text-red hover:underline"
                    >
                      ลบ
                    </button>
                  </div>
                  <textarea
                    value={paragraph}
                    onChange={(event) => updateAboutParagraph(index, event.target.value)}
                    rows={3}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === "why" ? (
          <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold">ทำไมต้องเลือกเรา</h2>
            <Field label="หัวข้อ">
              <input
                type="text"
                value={form.whyChooseUs.title}
                onChange={(event) =>
                  setForm({
                    ...form,
                    whyChooseUs: { ...form.whyChooseUs, title: event.target.value },
                  })
                }
                className={inputClass}
              />
            </Field>
            <Field label="คำอธิบาย">
              <textarea
                value={form.whyChooseUs.description}
                onChange={(event) =>
                  setForm({
                    ...form,
                    whyChooseUs: {
                      ...form.whyChooseUs,
                      description: event.target.value,
                    },
                  })
                }
                rows={3}
                className={inputClass}
              />
            </Field>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">สถิติ</p>
                <button
                  type="button"
                  onClick={addStat}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
                >
                  + เพิ่มสถิติ
                </button>
              </div>
              {form.whyChooseUs.stats.map((stat, index) => (
                <div
                  key={`stat-${index}`}
                  className="grid gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4 sm:grid-cols-3"
                >
                  <Field label="ตัวเลข">
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(event) =>
                        updateStat(index, { value: event.target.value })
                      }
                      className={inputClass}
                    />
                  </Field>
                  <Field label="หัวข้อ">
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(event) =>
                        updateStat(index, { label: event.target.value })
                      }
                      className={inputClass}
                    />
                  </Field>
                  <Field label="คำอธิบายย่อย">
                    <input
                      type="text"
                      value={stat.sublabel}
                      onChange={(event) =>
                        updateStat(index, { sublabel: event.target.value })
                      }
                      className={inputClass}
                    />
                  </Field>
                  <button
                    type="button"
                    onClick={() => removeStat(index)}
                    className="text-sm text-red hover:underline sm:col-span-3"
                  >
                    ลบสถิตินี้
                  </button>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === "services" ? (
          <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold">สินค้าและบริการ</h2>
            <Field label="หัวข้อ">
              <input
                type="text"
                value={form.services.title}
                onChange={(event) =>
                  setForm({
                    ...form,
                    services: { ...form.services, title: event.target.value },
                  })
                }
                className={inputClass}
              />
            </Field>
            <Field label="บทนำ">
              <textarea
                value={form.services.intro}
                onChange={(event) =>
                  setForm({
                    ...form,
                    services: { ...form.services, intro: event.target.value },
                  })
                }
                rows={3}
                className={inputClass}
              />
            </Field>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">หมวดย่อย</p>
                <button
                  type="button"
                  onClick={addServiceSection}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
                >
                  + เพิ่มหมวด
                </button>
              </div>
              {form.services.sections.map((section, index) => (
                <div
                  key={`service-section-${index}`}
                  className="space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">หมวด #{index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeServiceSection(index)}
                      className="text-sm text-red hover:underline"
                    >
                      ลบ
                    </button>
                  </div>
                  <Field label="หัวข้อหมวด">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(event) =>
                        updateServiceSection(index, { title: event.target.value })
                      }
                      className={inputClass}
                    />
                  </Field>
                  <Field label="รายการ (หนึ่งบรรทัดต่อหนึ่งรายการ)">
                    <textarea
                      value={section.items.join("\n")}
                      onChange={(event) =>
                        updateServiceSectionItems(index, event.target.value)
                      }
                      rows={6}
                      className={inputClass}
                    />
                  </Field>
                </div>
              ))}
            </div>
            <Field label="ข้อความปิดท้าย">
              <textarea
                value={form.services.closing}
                onChange={(event) =>
                  setForm({
                    ...form,
                    services: { ...form.services, closing: event.target.value },
                  })
                }
                rows={3}
                className={inputClass}
              />
            </Field>
          </section>
        ) : null}

        {activeTab === "marquee" ? (
          <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Marquee (แถบวิ่ง)</h2>
            <Field label="ข้อความที่วิ่ง">
              <input
                type="text"
                value={form.marquee.text}
                onChange={(event) =>
                  setForm({
                    ...form,
                    marquee: { text: event.target.value },
                  })
                }
                className={inputClass}
              />
            </Field>
          </section>
        ) : null}

        {activeTab === "features" ? (
          <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">จุดเด่นบริการ (ไอคอน 4 ช่อง)</h2>
              <button
                type="button"
                onClick={addServiceFeature}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
              >
                + เพิ่มจุดเด่น
              </button>
            </div>
            {form.serviceFeatures.map((feature, index) => (
              <div
                key={`feature-${index}`}
                className="space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">จุดเด่น #{index + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeServiceFeature(index)}
                    className="text-sm text-red hover:underline"
                  >
                    ลบ
                  </button>
                </div>
                <Field label="หัวข้อ">
                  <input
                    type="text"
                    value={feature.title}
                    onChange={(event) =>
                      updateServiceFeature(index, { title: event.target.value })
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="คำอธิบาย">
                  <input
                    type="text"
                    value={feature.description}
                    onChange={(event) =>
                      updateServiceFeature(index, { description: event.target.value })
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="ไอคอน">
                  <select
                    value={feature.icon}
                    onChange={(event) =>
                      updateServiceFeature(index, {
                        icon: event.target.value as HomeServiceFeatureIcon,
                      })
                    }
                    className={inputClass}
                  >
                    {FEATURE_ICON_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            ))}
          </section>
        ) : null}

        {activeTab === "gallery" ? (
          <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">แกลเลอรี่รูปภาพ</h2>
              <button
                type="button"
                onClick={addGalleryImage}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
              >
                + เพิ่มรูป
              </button>
            </div>
            {form.galleryImages.map((image, index) => (
              <div
                key={`gallery-${index}`}
                className="space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">รูป #{index + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="text-sm text-red hover:underline"
                  >
                    ลบ
                  </button>
                </div>
                <Field label="Alt">
                  <input
                    type="text"
                    value={image.alt}
                    onChange={(event) =>
                      updateGalleryImage(index, { alt: event.target.value })
                    }
                    className={inputClass}
                  />
                </Field>
                <ImageUpload
                  label="รูปแกลเลอรี่"
                  value={image.src}
                  onChange={(url) => updateGalleryImage(index, { src: url })}
                  folder="shop-13/homepage/gallery"
                  spec={IMAGE_UPLOAD_SPECS.gallery}
                />
              </div>
            ))}
          </section>
        ) : null}

        {error ? <p className="text-sm text-red">{error}</p> : null}
        {message ? <p className="text-sm text-green-600">{message}</p> : null}

        <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 py-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-dark disabled:opacity-60"
          >
            {saving ? "กำลังบันทึก..." : "บันทึกหน้าแรก"}
          </button>
        </div>
      </form>
    </div>
  );
}
