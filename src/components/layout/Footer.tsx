import Image from "next/image";
import Link from "next/link";
import { formatEmails, mailtoHref } from "@/lib/contact-info";
import { getSiteNavigation } from "@/lib/navigation";
import { getSiteContactInfo } from "@/lib/site-contact";
import type { SiteContactInfo } from "@/lib/site-contact-types";
import { siteInfo } from "@/lib/site-data";

function SocialLinks({ contact }: { contact: SiteContactInfo }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={contact.facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-red hover:text-white"
        aria-label="Facebook"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </a>
      <a
        href={contact.lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-red hover:text-white"
        aria-label="Line"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
        </svg>
      </a>
      <a
        href={mailtoHref(contact.emails)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-red hover:text-white"
        aria-label="Email"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      </a>
    </div>
  );
}

export default async function Footer() {
  const [contact, navigation] = await Promise.all([
    getSiteContactInfo(),
    getSiteNavigation(),
  ]);

  return (
    <footer id="contact" className="w-full min-w-0 overflow-x-clip bg-footer-gradient text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Image
              src={siteInfo.logo}
              alt={siteInfo.name}
              width={240}
              height={60}
              className="mb-4 h-11 w-auto object-contain brightness-0 invert"
            />
            <p className="mb-4 max-w-xs text-sm leading-relaxed text-white">
              {siteInfo.tagline}
            </p>
            <address className="space-y-2 text-sm not-italic text-white">
              {contact.address ? (
                <>
                  <p>{contact.address.line1}</p>
                  <p>{contact.address.line2}</p>
                </>
              ) : null}
              <p>
                อีเมล:{" "}
                <a href={mailtoHref(contact.emails)} className="hover:text-red">
                  {formatEmails(contact.emails)}
                </a>
              </p>
              {contact.phones.length > 0 ? (
                <p>โทร: {contact.phones.join(", ")}</p>
              ) : null}
              <p>
                Facebook:{" "}
                <a
                  href={contact.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red"
                >
                  {contact.facebookPageName}
                </a>
              </p>
              <p>
                Line:{" "}
                <a
                  href={contact.lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red"
                >
                  {contact.lineId}
                </a>
              </p>
              <p>{contact.businessHours}</p>
            </address>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">Home</h3>
            <ul className="space-y-2 text-sm text-white">
              {navigation.footerHome.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link href={link.href} className="transition-colors hover:text-red">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">Menu</h3>
            <ul className="space-y-2 text-sm text-white">
              {navigation.footerMenu.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link href={link.href} className="transition-colors hover:text-red">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">ติดต่อเรา</h3>
            <SocialLinks contact={contact} />
          </div>
        </div>
      </div>

      {contact.mapEmbedUrl ? (
        <div className="h-64 w-full border-t border-white/10">
          <iframe
            title={`แผนที่ ${contact.companyName}`}
            src={contact.mapEmbedUrl}
            className="h-full w-full border-0 grayscale"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ) : null}

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-white lg:px-8">
          <p>
            © {new Date().getFullYear()} {siteInfo.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
