import Image from "next/image";

const services = [
  {
    image: encodeURI("/LINE_ALBUM_7626  _260622_9.jpg"),
    alt: "ช่างเทคนิคสอบเทียบเครื่องชั่งในห้องแล็บมาตรฐาน ISO/IEC 17025",
    title: "บริการสอบเทียบ",
    titleLine2: "เครื่องมือวัดอุตสาหกรรม",
    subtitle: "",
    paragraphs: [
      "ครอบคลุมเครื่องมือวัดทางไฟฟ้าและเครื่องมือวัดทางกายภาพ ด้วยมาตรฐาน ISO/IEC 17025:2017 ในห้องแล็บที่ควบคุมสภาพแวดล้อม",
    ],
    highlights: [
      "เครื่องมือวัดทางไฟฟ้า",
      "เครื่องมือวัดทางกายภาพ",
    ],
  },
  {
    image: encodeURI("/LINE_ALBUM_23526 _260622_3.jpg"),
    alt: "ทีมงานตรวจสอบเครื่องมือวัดนอกสถานที่ที่โรงงานอุตสาหกรรม",
    title: "บริการสอบเทียบ On-site ภายใน 3 วัน",
    subtitle: "บริการนอกสถานที่ ครอบคลุมทั่วประเทศ",
    paragraphs: [
      "ทีมงาน STC เดินทางไปสอบเทียบเครื่องมือวัด ณ โรงงานหรือไซต์งานของลูกค้าโดยตรง ช่วยลดเวลาหยุดเครื่องจักรและไม่ต้องเคลื่อนย้ายอุปกรณ์ออกจากพื้นที่ผลิต",
      "เหมาะสำหรับโรงงานอุตสาหกรรม โรงไฟฟ้า โรงกลั่น และหน่วยงานที่ต้องการความรวดเร็ว พร้อมกำหนดวันนัดหมายล่วงหน้าและรายงานผลภายใน 3 วันทำการ",
    ],
    highlights: [
      "บริการทั่วประเทศไทย",
      "ลด downtime ของสายการผลิต",
      "นัดหมายและรายงานผลรวดเร็ว",
      "รองรับงานโรงงานขนาดใหญ่",
    ],
  },
  {
    image: encodeURI("/LINE_ALBUM_2342569 _260622_1.jpg"),
    alt: "วิศวกรตรวจซ่อมและบำรุงรักษาเครื่องมือวัดอุตสาหกรรม",
    title: "บริการตรวจซ่อมและบำรุงรักษา",
    subtitle: "Maintenance & Repair โดยทีมวิศวกรผู้เชี่ยวชาญ",
    paragraphs: [
      "ตรวจเช็คสภาพเครื่องมือวัดอย่างละเอียด วิเคราะห์สาเหตุของความคลาดเคลื่อน และดำเนินการซ่อมบำรุงหรือปรับแต่งให้กลับมาทำงานได้ตามสเปก",
      "บริการครบวงจรตั้งแต่การประเมินเบื้องต้น การซ่อมแซม ไปจนถึงการสอบเทียบยืนยันหลังซ่อม เพื่อให้มั่นใจว่าเครื่องมือวัดพร้อมใช้งานและมีความแม่นยำตามที่กำหนด",
    ],
    highlights: [
      "ตรวจเช็คและวินิจฉัยปัญหาอย่างเป็นระบบ",
      "ซ่อมบำรุงโดยวิศวกรและช่างผู้เชี่ยวชาญ",
      "สอบเทียบยืนยันหลังซ่อมเสร็จ",
      "ลดต้นทุนการเปลี่ยนอุปกรณ์ใหม่",
    ],
  },
];

export const SECTION_BG = "/bg/bg-services-power-towers-purple-waves.png";

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="bg-cover bg-center bg-no-repeat pt-6 pb-12 sm:pb-16 lg:bg-fixed lg:pt-8 lg:pb-24"
      style={{ backgroundImage: `url(${SECTION_BG})` }}
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-8 max-w-3xl sm:mb-12">
          <h2 className="mb-3 text-xl font-bold text-white sm:text-2xl lg:text-3xl">
            บริการของเรา
          </h2>
          <p className="text-sm leading-relaxed text-white/80 lg:text-base">
            STC ให้บริการครบวงจรด้านการสอบเทียบ ตรวจสอบ และบำรุงรักษาเครื่องมือวัด
            ด้วยมาตรฐาน ISO/IEC 17025:2017 ตอบโจทย์ทั้งงานในห้องแล็บและงานนอกสถานที่
            สำหรับอุตสาหกรรมทุกประเภท
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8 lg:space-y-12">
          {services.map((service, index) => {
            const imageRight = index % 2 === 1;

            return (
              <article
                key={service.title}
                className="grid items-center gap-5 overflow-hidden rounded-xl bg-white p-4 shadow-lg sm:gap-8 sm:rounded-2xl sm:p-6 lg:grid-cols-2 lg:gap-12 lg:p-8"
              >
                <div
                  className={`relative aspect-[4/3] overflow-hidden rounded-xl ${
                    imageRight ? "lg:order-2" : ""
                  }`}
                >
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>

                <div className={imageRight ? "lg:order-1" : ""}>
                  <p className="font-display mb-2 text-sm font-semibold uppercase tracking-wider text-purple">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mb-2 text-lg font-bold leading-snug text-purple sm:text-xl lg:text-2xl">
                    {service.title}
                    {service.titleLine2 ? (
                      <>
                        <br />
                        {service.titleLine2}
                      </>
                    ) : null}
                  </h3>
                  {service.subtitle ? (
                    <p className="mb-4 text-sm font-medium text-gold">
                      {service.subtitle}
                    </p>
                  ) : null}
                  <div className="mb-6 space-y-3 text-sm leading-relaxed text-gray-600 lg:text-base">
                    {service.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                    ))}
                  </div>
                  <ul className="space-y-2">
                    {service.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <svg
                          className="mt-0.5 h-5 w-5 shrink-0 text-purple"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm text-gray-700 lg:text-base">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const PORTFOLIO_BG = "/bg/bg-about-services-tech-abstract-purple.png";

const galleryPath = (filename: string) => encodeURI(`/gellary/${filename}`);

const portfolioImages = [
  { src: galleryPath("LINE_ALBUM__230121_022.jpg"), alt: "ผลงานสอบเทียบเครื่องมือวัด STC" },
  { src: galleryPath("LINE_ALBUM_19569 _260.jpg"), alt: "ผลงานสอบเทียบเครื่องมือวัด STC" },
  { src: galleryPath("LINE_ALBUM_7626  _260622_8.jpg"), alt: "ผลงานสอบเทียบเครื่องมือวัด STC" },
  { src: galleryPath("LINE_ALBUM_00_230323.jpg"), alt: "ผลงานสอบเทียบเครื่องมือวัด STC" },
  { src: galleryPath("LINE_ALBUM__230323.jpg"), alt: "ผลงานสอบเทียบเครื่องมือวัด STC" },
  { src: galleryPath("LINE_ALBUM_291126.jpg"), alt: "ผลงานสอบเทียบเครื่องมือวัด STC" },
  { src: galleryPath("LINE_ALBUM_Infinity Solor_230121_1.jpg"), alt: "ผลงานสอบเทียบเครื่องมือวัด STC" },
  { src: galleryPath("LINE_ALBUM_18526 _260622_2.jpg"), alt: "ผลงานสอบเทียบเครื่องมือวัด STC" },
  { src: galleryPath("LINE_ALBUM_271124  _4.jpg"), alt: "ผลงานสอบเทียบเครื่องมือวัด STC" },
  { src: galleryPath("LINE_ALBUM_18526 _260622_1.jpg"), alt: "ผลงานสอบเทียบเครื่องมือวัด STC" },
  { src: galleryPath("LINE_ALBUM_271126.jpg"), alt: "ผลงานสอบเทียบเครื่องมือวัด STC" },
  { src: galleryPath("LINE_ALBUM_ 1426_260622_1.jpg"), alt: "ผลงานสอบเทียบเครื่องมือวัด STC" },
  { src: galleryPath("LINE_ALBUM_ 5224_240818_1.jpg"), alt: "ผลงานสอบเทียบเครื่องมือวัด STC" },
  { src: galleryPath("LINE_ALBUM_23526_260622_2.jpg"), alt: "ผลงานสอบเทียบเครื่องมือวัด STC" },
  { src: galleryPath("LINE_ALBUM_2342569 _260622_5.jpg"), alt: "ผลงานสอบเทียบเครื่องมือวัด STC" },
];

export function PortfolioSection() {
  const marqueeItems = [...portfolioImages, ...portfolioImages];

  return (
    <section
      id="portfolio"
      className="bg-cover bg-center bg-no-repeat pt-6 pb-12 lg:pt-8 lg:pb-16"
      style={{ backgroundImage: `url(${PORTFOLIO_BG})` }}
    >

      <div className="overflow-hidden" aria-label="แกลเลอรีผลงาน">
        <div className="portfolio-marquee-track gap-4">
          {marqueeItems.map((item, index) => (
            <div
              key={`${item.src}-${index}`}
              className="relative h-36 w-52 shrink-0 overflow-hidden rounded-xl sm:h-52 sm:w-72 sm:rounded-2xl lg:h-60 lg:w-80"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover object-center"
                sizes="320px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyChooseUs() {
  const reasons = [
    { label: "มาตรฐาน ISO", icon: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" },
    { label: "ความแม่นยำ", icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" },
    { label: "ทีมมืออาชีพ", icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" },
    { label: "บริการรวดเร็ว", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "ราคายุติธรรม", icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" },
    { label: "On-site Service", icon: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a49.902 49.902 0 00-2.659-.814m-9.78-2.106a75.277 75.277 0 00-1.955-1.955 1.125 1.125 0 00-1.66.066L6.75 12.75m9.78-2.106a49.902 49.902 0 012.659.814 1.125 1.125 0 001.09-1.124V9.375c0-.621-.504-1.125-1.125-1.125H15.75" },
  ];

  return (
    <section id="standards" className="py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="mb-8 text-center text-xl font-bold text-purple sm:mb-12 sm:text-2xl lg:text-3xl">
          ทำไมลูกค้าจึงเลือก STC
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-6">
          {reasons.map((reason) => (
            <div key={reason.label} className="text-center">
              <svg
                className="mx-auto mb-2 h-8 w-8 text-purple sm:mb-3 sm:h-10 sm:w-10"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={reason.icon}
                />
              </svg>
              <p className="text-xs font-medium text-gray-700 sm:text-sm">
                {reason.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
