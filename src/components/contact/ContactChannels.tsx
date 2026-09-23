import type { ReactNode } from "react";
import { formatEmails, mailtoHref } from "@/lib/contact-info";
import type { SiteContactInfo } from "@/lib/site-contact-types";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  );
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
      />
    </svg>
  );
}

type Channel = {
  key: string;
  label: string;
  value: string;
  description: string;
  href: string;
  cta: string;
  external?: boolean;
  recommended?: boolean;
  icon: ReactNode;
};

type ContactChannelsProps = {
  contact: SiteContactInfo;
};

export default function ContactChannels({ contact }: ContactChannelsProps) {
  const channels: Channel[] = [
    {
      key: "line",
      label: "Line",
      value: `@${contact.lineId}`,
      description:
        "ช่องทางหลัก — สอบถามสินค้า สต็อก พรีออเดอร์ และนัดรับหน้าร้าน ตอบกลับเร็วที่สุด",
      href: contact.lineUrl,
      cta: "เปิดแชท Line",
      external: true,
      recommended: true,
      icon: <LineIcon className="h-6 w-6" />,
    },
    {
      key: "facebook",
      label: "Facebook",
      value: contact.facebookPageName,
      description: "ติดตามสินค้าใหม่ โปรโมชัน และส่งข้อความสอบถามผ่านเพจได้",
      href: contact.facebookUrl,
      cta: "ไปที่เพจ Facebook",
      external: true,
      icon: <FacebookIcon className="h-6 w-6" />,
    },
    ...(contact.tiktokUrl
      ? [
          {
            key: "tiktok",
            label: "TikTok",
            value: contact.tiktokHandle,
            description: "ติดตามคลิปสินค้าใหม่ รีวิว และอัปเดตจากร้านได้ทุกวัน",
            href: contact.tiktokUrl,
            cta: "ไปที่ TikTok",
            external: true,
            icon: <TikTokIcon className="h-6 w-6" />,
          },
        ]
      : []),
    {
      key: "email",
      label: "อีเมล",
      value: formatEmails(contact.emails),
      description: "เหมาะสำหรับสอบถามรายละเอียดยาว หรือส่งข้อมูลออเดอร์เพิ่มเติม",
      href: mailtoHref(contact.emails),
      cta: "ส่งอีเมล",
      icon: <EmailIcon className="h-6 w-6" />,
    },
    ...contact.phones.map((phone) => ({
      key: `phone-${phone}`,
      label: "โทร",
      value: phone,
      description: "โทรสอบถามในช่วงเวลาทำการของร้าน",
      href: `tel:${phone.replace(/\s+/g, "")}`,
      cta: "โทรเลย",
      icon: <PhoneIcon className="h-6 w-6" />,
    })),
  ];

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {channels.map((channel) => (
        <li key={channel.key}>
          <a
            href={channel.href}
            {...(channel.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="flex h-full flex-col rounded-xl border border-black/10 bg-white p-5 transition-colors hover:border-red/40 hover:bg-red-light/30 sm:p-6"
          >
            <span className="mb-4 flex items-start justify-between gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red text-white">
                {channel.icon}
              </span>
              {channel.recommended ? (
                <span className="rounded-full bg-red px-2.5 py-1 text-[11px] font-semibold text-white">
                  แนะนำ
                </span>
              ) : null}
            </span>
            <span className="block text-xs font-semibold uppercase tracking-wide text-foreground/50">
              {channel.label}
            </span>
            <span className="mt-1 block text-lg font-semibold text-foreground">
              {channel.value}
            </span>
            <span className="mt-2 flex-1 text-sm leading-relaxed text-foreground/70">
              {channel.description}
            </span>
            <span className="mt-4 text-sm font-semibold text-red">{channel.cta} →</span>
          </a>
        </li>
      ))}
    </ul>
  );
}