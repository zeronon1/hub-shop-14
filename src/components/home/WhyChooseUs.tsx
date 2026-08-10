import type { HomepageContent } from "@/lib/homepage-types";

type WhyChooseUsProps = {
  data: HomepageContent["whyChooseUs"];
};

export default function WhyChooseUs({ data }: WhyChooseUsProps) {
  return (
    <section className="bg-surface-gradient px-4 py-12 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white px-6 py-10 text-center shadow-[0_8px_30px_rgba(12,74,110,0.08)] sm:px-10 sm:py-12">
        <h2 className="mb-4 text-2xl font-extrabold text-neutral-900 sm:text-3xl">
          {data.title}
        </h2>
        <p className="mb-12 text-sm leading-relaxed text-neutral-700 sm:text-base">
          {data.description}
        </p>

        <div className="grid gap-8 sm:grid-cols-3">
          {data.stats.map((stat) => (
            <div key={stat.label}>
              <p className="mb-2 text-3xl font-bold text-sky-600 sm:text-4xl lg:text-5xl">
                {stat.value}
              </p>
              <p className="mb-1 text-sm font-bold text-neutral-900 sm:text-base">
                {stat.label}
              </p>
              <p className="text-xs text-neutral-600 sm:text-sm">{stat.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
