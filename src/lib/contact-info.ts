import type { SiteContactInfo } from "@/lib/site-contact-types";

export type { SiteContactInfo };

export function formatEmails(emails: readonly string[]) {
  return emails.join(", ");
}

export function mailtoHref(emails: readonly string[]) {
  return `mailto:${emails.join(",")}`;
}

export function getPrimaryEmail(contact: SiteContactInfo) {
  return contact.emails[0] ?? "";
}
