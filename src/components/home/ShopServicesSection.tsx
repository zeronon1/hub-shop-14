import type { HomepageContent } from "@/lib/homepage-types";

type ShopServicesSectionProps = {
  data: HomepageContent["services"];
};

export default function ShopServicesSection({ data }: ShopServicesSectionProps) {
  return (
    <section id="services" className="bg-surface-gradient px-4 py-12 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-6 text-center text-2xl font-extrabold text-neutral-900 sm:text-3xl">
          {data.title}
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-sm leading-relaxed text-neutral-700 sm:text-base">
          {data.intro}
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {data.sections.map((section) => (
            <div
              key={section.title}
              className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm"
            >
              <h3 className="mb-4 text-base font-bold text-neutral-900 sm:text-lg">
                {section.title}
              </h3>
              <ul className="space-y-2 text-sm text-neutral-700">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-sky-500">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-neutral-700 sm:text-base">
          {data.closing}
        </p>
      </div>
    </section>
  );
}
