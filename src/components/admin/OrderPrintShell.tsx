"use client";

import type { ReactNode } from "react";

type OrderPrintShellProps = {
  title: string;
  backHref: string;
  children: ReactNode;
};

export default function OrderPrintShell({
  title,
  backHref,
  children,
}: OrderPrintShellProps) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 print:bg-white">
      <div className="no-print sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div>
            <a href={backHref} className="text-sm text-gray-500 hover:text-red">
              ← กลับรายละเอียดออเดอร์
            </a>
            <h1 className="text-base font-semibold text-gray-900">{title}</h1>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg bg-red px-4 py-2 text-sm font-semibold text-white hover:bg-red-dark"
          >
            พิมพ์
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6 print:max-w-none print:px-0 print:py-0">
        {children}
      </div>

      <style>{`
        @media print {
          @page {
            margin: 12mm;
          }
          body {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
