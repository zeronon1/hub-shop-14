const cards = [
  {
    title: "คุณภาพมาตรฐานสากล",
    description:
      "ได้รับการรับรอง ISO/IEC 17025:2017 มั่นใจในคุณภาพการสอบเทียบทุกครั้ง",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
      />
    ),
  },
  {
    title: "ความแม่นยำสูง",
    description:
      "ใช้มาตรฉานอ้างอิงที่มีการสอบเทียบ traceable ถึง SI unit",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
      />
    ),
  },
  {
    title: "ทีมผู้เชี่ยวชาญ",
    description:
      "วิศวกรและช่างเทคนิคที่มีประสบการณ์ด้านการสอบเทียบมากกว่า 10 ปี",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zm12.75 0a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
      />
    ),
  },
  {
    title: "บริการครบวงจร",
    description:
      "สอบเทียบ ซ่อมบำรุง และให้คำปรึกษา ตอบโจทย์ทุกความต้องการ",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      />
    ),
  },
];

export default function ValueCards() {
  return (
    <section className="relative z-10 -mt-8 px-4 pb-6 sm:-mt-16 sm:pb-8 lg:-mt-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl bg-white p-4 shadow-lg transition-shadow hover:shadow-xl sm:p-6"
          >
            <svg
              className="mb-4 h-10 w-10 text-purple"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              {card.icon}
            </svg>
            <h3 className="mb-2 font-semibold text-purple">{card.title}</h3>
            <p className="text-sm leading-relaxed text-gray-600">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
