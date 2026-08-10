"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import type { NavLink } from "@/lib/navigation-types";
import { siteInfo } from "@/lib/site-data";

function SearchIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

type HeaderClientProps = {
  items: NavLink[];
};

export default function HeaderClient({ items }: HeaderClientProps) {
  const { itemCount, isHydrated } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 w-full min-w-0 overflow-x-clip border-b border-black/10 bg-white shadow-sm">
      <div className="mx-auto flex w-full min-w-0 max-w-7xl items-center justify-between gap-3 px-4 py-3 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src={siteInfo.logo}
            alt={siteInfo.name}
            width={220}
            height={60}
            className="h-11 w-auto object-contain sm:h-12"
            priority
          />
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 overflow-hidden 2xl:flex">
          {items.map((item) => (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className="whitespace-nowrap px-2 py-2 text-[13px] font-semibold text-foreground transition-colors hover:text-red"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            href="/products"
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-gray-light hover:text-red"
            aria-label="ค้นหา"
          >
            <SearchIcon />
          </Link>
          <Link
            href="/account"
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-gray-light hover:text-red"
            aria-label="บัญชีผู้ใช้"
          >
            <UserIcon />
          </Link>
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-gray-light hover:text-red"
            aria-label={itemCount > 0 ? `ตะกร้าสินค้า (${itemCount} ชิ้น)` : "ตะกร้าสินค้า"}
          >
            <CartIcon />
            {isHydrated && itemCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red px-1 text-[10px] font-bold text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            ) : null}
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground 2xl:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "ปิดเมนู" : "เปิดเมนู"}
          >
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[60] bg-black/40 2xl:hidden"
            aria-label="ปิดเมนู"
            onClick={() => setMobileOpen(false)}
          />
          <nav
            className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-xs flex-col overflow-y-auto bg-white shadow-2xl 2xl:hidden"
            aria-label="เมนูหลัก"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
              <p className="text-sm font-semibold">เมนู</p>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-light"
                aria-label="ปิดเมนู"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 space-y-1 p-3">
              {items.map((item) => (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  className="block rounded-lg px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-gray-light hover:text-red"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </>
      ) : null}
    </header>
  );
}
