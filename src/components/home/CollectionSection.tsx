import Image from "next/image";
import Link from "next/link";
import type { HomepageContent } from "@/lib/homepage-types";

type CollectionSectionProps = {
  data: HomepageContent["collectionSection"];
};

export default function CollectionSection({ data }: CollectionSectionProps) {
  return (
    <section className="relative overflow-hidden bg-panel-gradient px-4 py-14 sm:py-16 lg:px-8 lg:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.28),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.08),transparent_50%)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5 lg:col-start-1">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <div
              aria-hidden="true"
              className="absolute -right-3 -top-3 h-full w-full border-2 border-red sm:-right-4 sm:-top-4"
            />
            <div className="relative border border-white/20 bg-white/5 p-2 shadow-[0_24px_60px_rgba(0,0,0,0.45)] sm:p-3">
              <div className="relative aspect-[3/4] overflow-hidden bg-black">
                <Image
                  src={data.image}
                  alt={data.title}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 90vw, 40vw"
                />
              </div>
            </div>
            <div
              aria-hidden="true"
              className="absolute -bottom-3 -left-3 hidden h-16 w-16 border-b-2 border-l-2 border-red sm:block"
            />
          </div>
        </div>

        <div className="text-center lg:col-span-6 lg:col-start-7 lg:text-left">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-white sm:text-sm">
            {data.eyebrow}
          </p>
          <h2 className="mb-5 text-3xl font-bold uppercase leading-tight tracking-wide text-white sm:text-4xl lg:text-5xl">
            {data.title}{" "}
            <span className="text-white">{data.titleAccent}</span>
          </h2>
          <div className="mx-auto mb-6 h-px w-16 bg-white lg:mx-0" />
          <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base lg:mx-0">
            {data.description}
          </p>
          <Link
            href={data.buttonHref}
            className="inline-flex items-center justify-center rounded-full border-2 border-neutral-900 bg-white px-8 py-3 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-900 hover:text-white"
          >
            {data.buttonLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
