import type { SiteContactInfo } from "@/lib/site-contact-types";

export function formatContactAddress(contact: SiteContactInfo): string {
  if (!contact.address) return "";
  return [contact.address.line1, contact.address.line2].filter(Boolean).join("\n");
}
