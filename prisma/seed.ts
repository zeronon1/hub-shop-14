import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
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
import {
  catalogBanners,
  categoryCards,
  getCategoryLabel,
  mockProducts,
  productTabs,
} from "../src/lib/site-data";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("12345678", 12);

  await prisma.admin.upsert({
    where: { username: "admin" },
    update: {
      passwordHash,
      displayName: "Administrator",
      isActive: true,
    },
    create: {
      username: "admin",
      passwordHash,
      displayName: "Administrator",
      isActive: true,
    },
  });

  const categoryMap = new Map<string, string>();

  for (let i = 0; i < productTabs.length; i++) {
    const tab = productTabs[i];
    const card = categoryCards.find((c) => c.href === `/category/${tab.id}`);
    const banner = catalogBanners[tab.id];

    const category = await prisma.category.upsert({
      where: { slug: tab.id },
      update: {
        label: tab.label,
        image: card?.image ?? null,
        bannerImage: banner?.image ?? null,
        bannerAlt: banner?.alt ?? null,
        sortOrder: i,
        isActive: true,
      },
      create: {
        slug: tab.id,
        label: tab.label,
        image: card?.image ?? null,
        bannerImage: banner?.image ?? null,
        bannerAlt: banner?.alt ?? null,
        sortOrder: i,
        isActive: true,
      },
    });

    categoryMap.set(tab.id, category.id);
  }

  for (const product of mockProducts) {
    const categoryId = categoryMap.get(product.category);
    if (!categoryId) continue;

    const categoryLabel = getCategoryLabel(product.category);
    const sku = `SKU-${product.id.replace(/-/g, "").toUpperCase().slice(0, 8)}`;

    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        price: product.price,
        image: product.image,
        categoryId,
        sku,
        stock: 99 + (product.name.length % 900),
        prepDays: product.price >= 3500 ? 3 : 2,
        isNew: product.isNew,
        isRecommend: product.isRecommend,
        description: `${product.name} เป็นสินค้าลิขสิทธิ์แท้จากประเทศญี่ปุ่น ผลิตโดยแบรนด์ชั้นนำ คุณภาพสูง เหมาะสำหรับนักสะสมและแฟนอนิเมะ ${categoryLabel} ทุกท่าน\n\nสินค้ามาพร้อมกล่องบรรจุภัณฑ์ต้นฉบับ สภาพใหม่ 100% จากร้าน Momotaro Shop รับประกันความแท้ทุกชิ้น`,
        shippingInfo:
          "จัดส่งทั่วประเทศผ่าน Kerry Express, Flash Express หรือไปรษณีย์ไทย\nค่าจัดส่งเริ่มต้น 50 บาท (กรุงเทพฯ และปริมณฑล) / 80 บาท (ต่างจังหวัด)\nสินค้าพร้อมส่งจัดส่งภายใน 1-2 วันทำการหลังยืนยันการชำระเงิน\nสินค้าพรีออเดอร์จัดส่งตามระยะเวลาที่ระบุในหน้าสินค้า",
        howToOrder:
          '1. เลือกสินค้าและจำนวนที่ต้องการ\n2. กดปุ่ม "สั่งซื้อเลย" หรือติดต่อทาง Line / Facebook\n3. แจ้งที่อยู่จัดส่งและช่องทางชำระเงิน\n4. โอนเงินและส่งสลิปยืนยัน\n5. รอรับสินค้าตามระยะเวลาจัดเตรียม',
        isActive: true,
      },
      create: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        images: [product.image],
        categoryId,
        sku,
        stock: 99 + (product.name.length % 900),
        prepDays: product.price >= 3500 ? 3 : 2,
        isNew: product.isNew,
        isRecommend: product.isRecommend,
        description: `${product.name} เป็นสินค้าลิขสิทธิ์แท้จากประเทศญี่ปุ่น ผลิตโดยแบรนด์ชั้นนำ คุณภาพสูง เหมาะสำหรับนักสะสมและแฟนอนิเมะ ${categoryLabel} ทุกท่าน\n\nสินค้ามาพร้อมกล่องบรรจุภัณฑ์ต้นฉบับ สภาพใหม่ 100% จากร้าน Momotaro Shop รับประกันความแท้ทุกชิ้น`,
        shippingInfo:
          "จัดส่งทั่วประเทศผ่าน Kerry Express, Flash Express หรือไปรษณีย์ไทย\nค่าจัดส่งเริ่มต้น 50 บาท (กรุงเทพฯ และปริมณฑล) / 80 บาท (ต่างจังหวัด)\nสินค้าพร้อมส่งจัดส่งภายใน 1-2 วันทำการหลังยืนยันการชำระเงิน\nสินค้าพรีออเดอร์จัดส่งตามระยะเวลาที่ระบุในหน้าสินค้า",
        howToOrder:
          '1. เลือกสินค้าและจำนวนที่ต้องการ\n2. กดปุ่ม "สั่งซื้อเลย" หรือติดต่อทาง Line / Facebook\n3. แจ้งที่อยู่จัดส่งและช่องทางชำระเงิน\n4. โอนเงินและส่งสลิปยืนยัน\n5. รอรับสินค้าตามระยะเวลาจัดเตรียม',
        isActive: true,
      },
    });
  }

  await prisma.siteContent.upsert({
    where: { id: ORDER_GUIDE_CONTENT_ID },
    update: {
      content: defaultOrderGuideContent,
    },
    create: {
      id: ORDER_GUIDE_CONTENT_ID,
      content: defaultOrderGuideContent,
    },
  });

  await prisma.siteContent.upsert({
    where: { id: HOMEPAGE_CONTENT_ID },
    update: {
      content: defaultHomepageContent,
    },
    create: {
      id: HOMEPAGE_CONTENT_ID,
      content: defaultHomepageContent,
    },
  });

  await prisma.siteContent.upsert({
    where: { id: SITE_CONTACT_CONTENT_ID },
    update: {
      content: defaultSiteContactInfo,
    },
    create: {
      id: SITE_CONTACT_CONTENT_ID,
      content: defaultSiteContactInfo,
    },
  });

  await prisma.siteContent.upsert({
    where: { id: CONTACT_PAGE_CONTENT_ID },
    update: {
      content: defaultContactPageContent,
    },
    create: {
      id: CONTACT_PAGE_CONTENT_ID,
      content: defaultContactPageContent,
    },
  });

  await prisma.siteContent.upsert({
    where: { id: SITE_NAVIGATION_CONTENT_ID },
    update: {
      content: defaultSiteNavigation,
    },
    create: {
      id: SITE_NAVIGATION_CONTENT_ID,
      content: defaultSiteNavigation,
    },
  });

  console.log(
    "Seed completed: admin (admin/12345678), categories, products, order-guide, homepage, contact, navigation",
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
