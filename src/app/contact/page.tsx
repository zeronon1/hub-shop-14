import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ContactChannels from "@/components/contact/ContactChannels";
import { getContactPageContent } from "@/lib/contact-page";
import { getPrimaryEmail, mailtoHref } from "@/lib/contact-info";
import { getSiteContactInfo } from "@/lib/site-contact";
import { serviceFeatures, siteInfo } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContactPageContent();
  return {
    title: `${content.title} | Momotaro Shop`,
    description: content.subtitle || content.intro,
  };
}

export default async function ContactPage() {
  const [contact, content] = await Promise.all([
    getSiteContactInfo(),
    getContactPageContent(),
  ]);

  const hoursNote = content.hoursNote.trim() || contact.businessHours;
  const primaryEmail = getPrimaryEmail(contact);
  const { lineQr } = content;

  return (
    <>
      <Header />
      <main className="bg-cream/40">
        <section className="border-b border-black/5 bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-12 lg:px-8 lg:py-16">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-red">
                {content.subtitle}
              </p>
              <h1 className="text-3xl font-bold sm:text-4xl">{content.title}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground/75 sm:text-base">
                {content.intro}
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground/75 sm:text-base">
                {content.about}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={contact.lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-dark"
                >
                  แชท Line เลย
                </a>
                <a
                  href={contact.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-red/40 hover:text-red"
                >
                  ไปที่ Facebook
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-cream/60 p-6 text-center sm:p-8">
              <p className="mb-4 text-sm font-semibold text-foreground">Line Official</p>
              <div className="mx-auto w-full max-w-[200px] overflow-hidden rounded-xl bg-white p-3 shadow-sm">
                <Image
                  src={lineQr.src}
                  alt={lineQr.alt}
                  width={400}
                  height={400}
                  className="h-auto w-full"
                />
              </div>
              <p className="mt-4 text-sm text-foreground/70">{lineQr.caption}</p>
              <p className="mt-1 text-base font-semibold text-foreground">@{contact.lineId}</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:px-8">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-xl font-bold sm:text-2xl">{content.channelsTitle}</h2>
            <p className="mt-2 text-sm text-foreground/70 sm:text-base">
              {content.channelsIntro}
            </p>
          </div>
          <ContactChannels contact={contact} />
        </section>

        <section className="border-y border-black/5 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:px-8">
            <h2 className="mb-8 text-xl font-bold sm:text-2xl">{content.topicsTitle}</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {content.topics.map((topic) => (
                <li
                  key={topic.title}
                  className="rounded-xl border border-black/10 bg-cream/40 p-5 sm:p-6"
                >
                  <h3 className="text-base font-semibold text-foreground">{topic.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                    {topic.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">ข้อมูลร้าน</h2>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-foreground/80 sm:text-base">
                <p>
                  <span className="font-semibold text-foreground">ร้าน: </span>
                  {contact.companyName || siteInfo.name}
                </p>
                {contact.address ? (
                  <address className="not-italic">
                    <span className="font-semibold text-foreground">ที่อยู่: </span>
                    {contact.address.line1}
                    <br />
                    {contact.address.line2}
                  </address>
                ) : (
                  <p>
                    <span className="font-semibold text-foreground">ที่อยู่: </span>
                    มีหน้าร้านให้เลือกชมสินค้า — สอบถามที่ตั้งและนัดรับทาง Line หรือ Facebook
                  </p>
                )}
                <p>
                  <span className="font-semibold text-foreground">เวลาทำการ: </span>
                  {hoursNote}
                </p>
                {primaryEmail ? (
                  <p>
                    <span className="font-semibold text-foreground">อีเมล: </span>
                    <a href={mailtoHref(contact.emails)} className="text-red hover:underline">
                      {primaryEmail}
                    </a>
                  </p>
                ) : null}
              </div>

              <div className="mt-8">
                <h3 className="mb-3 text-base font-semibold">{content.tipsTitle}</h3>
                <ul className="space-y-2 text-sm leading-relaxed text-foreground/75 sm:text-base">
                  {content.tips.map((tip) => (
                    <li key={tip} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red" aria-hidden />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold sm:text-2xl">บริการที่ช่วยได้</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {serviceFeatures.map((feature) => (
                  <li
                    key={feature.title}
                    className="rounded-xl border border-black/10 bg-white p-4 sm:p-5"
                  >
                    <p className="font-semibold text-foreground">{feature.title}</p>
                    <p className="mt-1 text-sm text-foreground/70">{feature.description}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-foreground/70">
                อยากดูสินค้าก่อนติดต่อ?{" "}
                <Link href="/products" className="font-semibold text-red hover:underline">
                  ไปหน้ารวมสินค้า
                </Link>{" "}
                หรือ{" "}
                <Link href="/catalog" className="font-semibold text-red hover:underline">
                  หมวดหมู่รวม
                </Link>
              </p>
            </div>
          </div>

          {contact.mapEmbedUrl ? (
            <div className="mt-10 overflow-hidden rounded-xl border border-black/10">
              <iframe
                title={`แผนที่ ${contact.companyName}`}
                src={contact.mapEmbedUrl}
                className="h-64 w-full border-0 sm:h-80"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : null}
        </section>
      </main>
      <Footer />
    </>
  );
}
