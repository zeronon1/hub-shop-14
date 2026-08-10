type MarqueeSectionProps = {
  text: string;
};

export default function MarqueeSection({ text }: MarqueeSectionProps) {
  const items = Array.from({ length: 20 }, (_, i) => (
    <span
      key={i}
      className="mx-8 shrink-0 text-base font-medium tracking-wide text-white sm:text-lg"
    >
      {text}
    </span>
  ));

  return (
    <section className="relative max-w-full overflow-x-clip py-3 sm:py-3.5">
      <div className="bg-marquee-gradient overflow-x-clip">
        <div className="momotaro-marquee-track">
          {items}
          {items}
        </div>
      </div>
    </section>
  );
}
