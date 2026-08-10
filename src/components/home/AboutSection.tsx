import type { HomepageContent } from "@/lib/homepage-types";

type AboutSectionProps = {
  data: HomepageContent["about"];
};

export default function AboutSection({ data }: AboutSectionProps) {
  return (
    <section
      id="about"
      className="bg-panel-gradient px-4 py-12 sm:py-16 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-3xl rounded-2xl bg-white px-6 py-10 shadow-[0_12px_40px_rgba(8,47,73,0.25)] sm:px-10 sm:py-12">
        <h2 className="mb-3 text-center text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
          {data.title}
        </h2>
        <div
          className="mx-auto mb-8 h-1 w-14 rounded-full bg-sky-500"
          aria-hidden="true"
        />
        <div className="space-y-5 text-sm leading-7 text-neutral-700 sm:text-base sm:leading-8">
          {data.paragraphs.map((paragraph, index) => (
            <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
