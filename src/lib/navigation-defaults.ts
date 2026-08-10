import { footerLinks, navItems } from "@/lib/site-data";
import type { NavLink, SiteNavigation } from "@/lib/navigation-types";

export const SITE_NAVIGATION_CONTENT_ID = "site-navigation";

function toNavLinks(
  items: readonly { label: string; href: string }[],
): NavLink[] {
  return items.map((item) => ({
    label: item.label,
    href: item.href,
  }));
}

export const defaultSiteNavigation: SiteNavigation = {
  header: toNavLinks(navItems),
  footerHome: toNavLinks(footerLinks.home),
  footerMenu: toNavLinks(footerLinks.menu),
};
