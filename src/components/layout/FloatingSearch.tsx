"use client";

import Link from "next/link";

export default function FloatingSearch() {
  return (
    <Link
      href="/products"
      className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-red text-white shadow-lg transition-transform hover:scale-105 hover:bg-red-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 md:bottom-6 md:right-6 md:z-50 md:h-14 md:w-14"
      aria-label="ค้นหาสินค้า"
    >
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
    </Link>
  );
}
