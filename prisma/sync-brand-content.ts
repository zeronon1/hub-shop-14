/**
 * Upsert CMS site content only (homepage, contact, contact-page, order-guide, navigation).
 * Does not touch admin accounts or products.
 */
import { PrismaClient } from "@prisma/client";
import {
  defaultOrderGuideContent,
  ORDER_GUIDE_CONTENT_ID,
} from "../src/lib/order-guide-defaults";
import {
  defaultHomepageContent,
  HOMEPAGE_CONTENT_ID,
} from "../src/lib/homepage-defaults";
import {
  defaultContactPageContent,
  CONTACT_PAGE_CONTENT_ID,
} from "../src/lib/contact-page-defaults";
import {
  defaultSiteContactInfo,
  SITE_CONTACT_CONTENT_ID,
} from "../src/lib/site-contact-defaults";
import {
  defaultSiteNavigation,
  SITE_NAVIGATION_CONTENT_ID,
} from "../src/lib/navigation-defaults";

const prisma = new PrismaClient();

async function main() {
  const rows = [
    { id: HOMEPAGE_CONTENT_ID, content: defaultHomepageContent },
    { id: SITE_CONTACT_CONTENT_ID, content: defaultSiteContactInfo },
    { id: CONTACT_PAGE_CONTENT_ID, content: defaultContactPageContent },
    { id: ORDER_GUIDE_CONTENT_ID, content: defaultOrderGuideContent },
    { id: SITE_NAVIGATION_CONTENT_ID, content: defaultSiteNavigation },
  ] as const;

  for (const row of rows) {
    await prisma.siteContent.upsert({
      where: { id: row.id },
      update: { content: row.content },
      create: { id: row.id, content: row.content },
    });
    console.log(`Updated ${row.id}`);
  }

  console.log("CMS brand/contact content synced to Momotaro Shop");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
