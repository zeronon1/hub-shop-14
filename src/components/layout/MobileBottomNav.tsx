"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    href: "/",
    label: "Home",
    match: (pathname: string) => pathname === "/",
    icon: HomeIcon,
  },
  {
    href: "/products",
    label: "Product",
    match: (pathname: string) =>
      pathname === "/products" || pathname.startsWith("/product/"),
    icon: ProductIcon,
  },
  {
    href: "/catalog",
    label: "Catalog",
    match: (pathname: string) =>
      pathname === "/catalog" || pathname.startsWith("/category/"),
    icon: CatalogIcon,
  },
  {
    href: "/account",
    label: "สมาชิก",
    match: (pathname: string) => pathname.startsWith("/account"),
    icon: MemberIcon,
  },
] as const;

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="h-5 w-5"
      fill={active ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    </svg>
  );
}

function ProductIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="h-5 w-5"
      fill={active ? "currentColor" : "none"}
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

function CatalogIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="h-5 w-5"
      fill={active ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
      />
    </svg>
  );
}

function MemberIcon({ active }: { active: boolean }) {
  return (
    <svg
      className="h-5 w-5"
      fill={active ? "currentColor" : "none"}
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}

export default function MobileBottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      {/* สำรองพื้นที่ด้านล่างไม่ให้เนื้อหาถูกแถบเมนูบัง */}
      <div
        className="h-[calc(4rem+env(safe-area-inset-bottom))] shrink-0 md:hidden"
        aria-hidden="true"
      />
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white/95 backdrop-blur-md md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="เมนูด่วนมือถือ"
      >
        <ul className="mx-auto grid h-16 max-w-lg grid-cols-4">
          {items.map((item) => {
            const active = item.match(pathname);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex h-full flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors ${
                    active ? "text-red" : "text-foreground/70 hover:text-red"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon active={active} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
