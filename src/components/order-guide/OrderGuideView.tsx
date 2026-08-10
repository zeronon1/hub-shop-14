import Link from "next/link";
import type { OrderGuideContent } from "@/lib/order-guide-types";
import { sanitizeHtml } from "@/lib/sanitize-html";

type OrderGuideViewProps = {
  content: OrderGuideContent;
};

export default function OrderGuideView({ content }: OrderGuideViewProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:px-8">
      <section aria-labelledby="order-steps-heading">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red">
              How to order
            </p>
            <h2
              id="order-steps-heading"
              className="mt-2 text-xl font-bold sm:text-2xl"
            >
              {content.stepsHeading}
            </h2>
          </div>
        </div>

        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {content.steps.map((step, index) => (
            <li
              key={`${index}-${step.title}`}
              className="relative flex flex-col border border-black/10 bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)]"
            >
              <span className="mb-4 flex h-10 w-10 items-center justify-center bg-red text-sm font-bold text-white">
                {index + 1}
              </span>
              <h3 className="text-base font-bold leading-snug">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                {step.description}
              </p>
              {index < content.steps.length - 1 ? (
                <span
                  className="pointer-events-none absolute -right-2 top-9 hidden h-px w-4 bg-red/40 lg:block"
                  aria-hidden="true"
                />
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {content.sections.map((section) => (
          <section
            key={section.title}
            className="border border-black/10 bg-white"
          >
            <div className="border-b border-black/10 bg-black px-5 py-4 sm:px-6">
              <h2 className="text-base font-bold text-white sm:text-lg">
                {section.title}
              </h2>
            </div>
            <div
              className="rich-content px-5 py-5 sm:px-6 sm:py-6"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(section.bodyHtml),
              }}
            />
          </section>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-start justify-between gap-4 border border-black/10 bg-red-light px-5 py-6 sm:flex-row sm:items-center sm:px-8">
        <div>
          <p className="text-base font-bold">พร้อมสั่งซื้อแล้ว?</p>
          <p className="mt-1 text-sm text-foreground/70">
            เลือกสินค้าที่ชอบ หรือสอบถามทีมงานได้ทันที
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/products"
            className="inline-flex items-center justify-center bg-red px-5 py-2.5 text-sm font-bold text-white hover:bg-red-dark"
          >
            ดูสินค้าทั้งหมด
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center border border-black/15 bg-white px-5 py-2.5 text-sm font-semibold hover:bg-white/80"
          >
            ติดต่อเรา
          </Link>
        </div>
      </div>
    </div>
  );
}
