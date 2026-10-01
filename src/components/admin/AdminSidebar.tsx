"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const pageEditItems = [
  { href: "/admin/homepage", label: "หน้าแรก" },
  { href: "/admin/products-page", label: "รวมสินค้า" },
  { href: "/admin/order-guide", label: "วิธีสั่งซื้อ" },
  { href: "/admin/contact", label: "ติดต่อเรา" },
] as const;

const navItems = [
  { href: "/admin/reports", label: "รายงานและภาพรวม" },
  { href: "/admin/orders", label: "จัดการคำสั่งซื้อ" },
  { href: "/admin/navigation", label: "จัดการเมนู" },
  { href: "/admin/products", label: "จัดการสินค้า" },
  { href: "/admin/categories", label: "จัดการหมวดหมู่" },
  { href: "/admin/admins", label: "จัดการ Admin" },
  { href: "/admin/change-password", label: "เปลี่ยนรหัสผ่าน" },
] as const;

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

type AdminSidebarProps = {
  adminName?: string | null;
};

export default function AdminSidebar({ adminName }: AdminSidebarProps) {
  const pathname = usePathname();
  const pageEditActive = pageEditItems.some((item) => isActivePath(pathname, item.href));
  const [pageEditOpen, setPageEditOpen] = useState(pageEditActive);

  useEffect(() => {
    if (pageEditActive) setPageEditOpen(true);
  }, [pageEditActive]);

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-red">One Box Shop Admin</p>
        <p className="mt-1 text-sm text-gray-600">{adminName ?? "Administrator"}</p>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        <div>
          <button
            type="button"
            onClick={() => setPageEditOpen((open) => !open)}
            aria-expanded={pageEditOpen}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              pageEditActive
                ? "bg-red-light text-red"
                : "text-gray-700 hover:bg-gray-50 hover:text-red"
            }`}
          >
            <span>แก้ไขหน้า</span>
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`h-4 w-4 shrink-0 transition-transform ${pageEditOpen ? "rotate-180" : ""}`}
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {pageEditOpen ? (
            <div className="mt-1 space-y-0.5 border-l-2 border-red/20 pl-2 ml-3">
              {pageEditItems.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-red-light font-medium text-red"
                        : "text-gray-600 hover:bg-gray-50 hover:text-red"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>

        {navItems.map((item) => {
          const active = isActivePath(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-red-light text-red"
                  : "text-gray-700 hover:bg-gray-50 hover:text-red"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-2 border-t border-gray-100 p-3">
        <Link
          href="/"
          target="_blank"
          className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          ดูหน้าเว็บ
        </Link>
        <button
          type="button"
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/admin/login";
          }}
          className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50"
        >
          ออกจากระบบ
        </button>
      </div>
    </aside>
  );
}
