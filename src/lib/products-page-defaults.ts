import { defaultCatalogBanner } from "@/lib/site-data";

export const PRODUCTS_PAGE_CONTENT_ID = "products-page";

export type ProductsPageBanner = {
  image: string;
  alt: string;
};

export type ProductsPageContent = {
  title: string;
  description: string;
  banner: ProductsPageBanner;
};

/** ค่าเดียวกับที่หน้ารวมสินค้าใช้อยู่ก่อนมีแถว CMS */
export const defaultProductsPageContent: ProductsPageContent = {
  title: "รวมสินค้า",
  description:
    "รวมโมเดล ฟิกเกอร์ และของสะสมลิขสิทธิ์ทุกหมวดหมู่ — กรองตามซีรีส์ ราคา เรียงลำดับ หรือค้นหาชื่อสินค้าได้ทันที",
  banner: {
    image: defaultCatalogBanner.image,
    alt: defaultCatalogBanner.alt,
  },
};
