"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getPrimaryEmail, mailtoHref } from "@/lib/contact-info";
import type { SiteContactInfo } from "@/lib/site-contact-types";
import { useCart } from "@/contexts/CartContext";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductPrice from "@/components/product/ProductPrice";
import {
  getCategoryLabel,
  getProductEffectivePrice,
  isProductOnSale,
  type ProductDetail,
} from "@/lib/site-data";

type TabId = "details" | "shipping" | "order" | "contact";

const tabs: { id: TabId; label: string }[] = [
  { id: "details", label: "รายละเอียด" },
  { id: "shipping", label: "วิธีจัดส่ง" },
  { id: "order", label: "วิธีสั่งซื้อ" },
  { id: "contact", label: "ติดต่อเรา" },
];

type ProductDetailClientProps = {
  product: ProductDetail;
  contact: SiteContactInfo;
};

function CartIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
      />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
    </svg>
  );
}

export default function ProductDetailClient({ product, contact }: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabId>("details");
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);

  const primaryEmail = getPrimaryEmail(contact);

  const images = product.images ?? [product.image];
  const categoryLabel = getCategoryLabel(product.category);
  const isContactPrice = product.price === 0;
  const onSale = isProductOnSale(product);

  const tabContent: Record<TabId, string> = {
    details: product.description,
    shipping: product.shippingInfo,
    order: product.howToOrder,
    contact: `ติดต่อ ${contact.companyName} ได้ทุกช่องทาง\nLine: ${contact.lineId}\nFacebook: ${contact.facebookPageName}${contact.tiktokUrl ? `\nTikTok: ${contact.tiktokHandle}` : ""}\nEmail: ${primaryEmail}\n\n${contact.businessHours}`,
  };

  function decrement() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function increment() {
    setQuantity((q) => Math.min(product.stock, q + 1));
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function handleAddToCart() {
    addItem(
      {
        productId: product.id,
        name: product.name,
        image: product.image,
        priceBaht: getProductEffectivePrice(product),
      },
      quantity,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    handleAddToCart();
    router.push("/cart");
  }

  return (
    <div>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-16">
        <div className="order-1 lg:col-span-7 lg:col-start-1">
          <ProductImageGallery images={images} productName={product.name} />
        </div>

        <div className="order-2 lg:col-span-5 lg:col-start-8">
          <div className="rounded-xl border-2 border-neutral-300 bg-white p-6 shadow-sm lg:sticky lg:top-24 lg:p-7">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-red">
              {categoryLabel}
            </p>
            <h1 className="mb-4 text-xl font-bold leading-snug sm:text-2xl lg:text-[1.75rem]">
              {product.name}
            </h1>

            <div className="mb-5 space-y-2 border-b-2 border-neutral-200 pb-5">
              <p className="text-sm text-foreground">
                รหัสสินค้า: <span className="font-semibold">{product.sku}</span>
              </p>
              {onSale ? (
                <span className="inline-flex rounded-full bg-red px-3 py-1 text-xs font-bold text-white">
                  ลดราคา
                </span>
              ) : null}
              <ProductPrice product={product} size="lg" />
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              <span className="rounded-full border-2 border-neutral-300 bg-cream px-3 py-1.5 text-xs font-semibold text-foreground">
                คงเหลือ {product.stock} ชิ้น
              </span>
              <span className="rounded-full border-2 border-red/30 bg-red-light px-3 py-1.5 text-xs font-semibold text-red">
                จัดเตรียม {product.prepDays} วัน
              </span>
              <span className="rounded-full border-2 border-neutral-300 px-3 py-1.5 text-xs font-semibold text-foreground">
                ลิขสิทธิ์แท้จากญี่ปุ่น
              </span>
            </div>

            {!isContactPrice ? (
              <div className="rounded-xl border-2 border-neutral-300 bg-cream p-5">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-foreground">จำนวน</span>
                  <div className="flex items-center overflow-hidden rounded-full border-2 border-neutral-300 bg-white">
                    <button
                      type="button"
                      onClick={decrement}
                      className="flex h-10 w-10 items-center justify-center text-foreground transition-colors hover:bg-gray-light"
                      aria-label="ลดจำนวน"
                    >
                      <MinusIcon />
                    </button>
                    <span className="w-12 text-center text-sm font-bold">{quantity}</span>
                    <button
                      type="button"
                      onClick={increment}
                      className="flex h-10 w-10 items-center justify-center text-foreground transition-colors hover:bg-gray-light"
                      aria-label="เพิ่มจำนวน"
                    >
                      <PlusIcon />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-red bg-white px-6 py-3.5 text-sm font-bold text-red transition-colors hover:bg-red-light"
                  >
                    {added ? "เพิ่มแล้ว ✓" : "เพิ่มลงตะกร้า"}
                  </button>
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-red px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-red-dark"
                  >
                    <CartIcon />
                    สั่งซื้อเลย ({quantity} ชิ้น)
                  </button>
                </div>

                <p className="mt-3 text-center text-xs font-medium text-foreground">
                  ชำระเงินอย่างปลอดภัย
                </p>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-neutral-300 bg-cream p-5">
                <p className="mb-4 text-center text-sm font-medium text-foreground">
                  สินค้านี้ต้องติดต่อสอบถามราคาและสถานะก่อนสั่งซื้อ
                </p>
                <Link
                  href={contact.lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-red px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-red-dark"
                >
                  สอบถามทาง Line
                </Link>
              </div>
            )}

            <div className="mt-6 flex items-center justify-center gap-3 border-t-2 border-neutral-200 pt-6">
              <Link
                href={contact.lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#06C755] text-white transition-transform hover:scale-105"
                aria-label="ติดต่อ Line"
              >
                <span className="text-xs font-bold">LINE</span>
              </Link>
              <Link
                href={contact.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1877F2] text-white transition-transform hover:scale-105"
                aria-label="ติดต่อ Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Link>
              {contact.tiktokUrl ? (
                <Link
                  href={contact.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white transition-transform hover:scale-105"
                  aria-label="ติดต่อ TikTok"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                  </svg>
                </Link>
              ) : null}
              <a
                href={mailtoHref(contact.emails)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white transition-transform hover:scale-105"
                aria-label="ส่งอีเมล"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </a>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <div className="flex flex-1 items-center gap-2 overflow-hidden rounded-lg border-2 border-neutral-300 bg-white px-3 py-2.5">
                <span className="line-clamp-1 flex-1 text-xs font-medium text-foreground">
                  แชร์ลิงก์สินค้านี้
                </span>
                <button
                  type="button"
                  onClick={copyLink}
                  className="shrink-0 rounded-md border border-neutral-300 bg-cream px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:bg-gray-light"
                >
                  {copied ? "คัดลอกแล้ว" : "คัดลอก"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14 rounded-xl border-2 border-neutral-300 bg-white p-6 sm:mt-16 sm:p-8">
        <div className="mb-6 flex gap-2 overflow-x-auto border-b-2 border-neutral-200 pb-0 sm:gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 border-b-2 px-4 py-3 text-sm font-bold transition-colors sm:px-6 ${
                activeTab === tab.id
                  ? "-mb-[2px] border-red text-red"
                  : "border-transparent text-foreground hover:border-neutral-300 hover:text-red"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="whitespace-pre-line text-sm leading-relaxed text-foreground sm:text-base">
          {tabContent[activeTab]}
        </div>
      </div>
    </div>
  );
}
