export type ImageUploadSpec = {
  /** ชื่อจุดใช้งานบนหน้าเว็บ */
  label: string;
  /** ความกว้าง × สูงที่แนะนำ (px) */
  width: number;
  height: number;
  /** อัตราส่วนที่แสดงบนหน้าเว็บ เช่น 21:9 */
  aspectRatio: string;
  objectFit: "cover" | "contain";
  notes?: string;
};

export const IMAGE_UPLOAD_SPECS = {
  heroBanner: {
    label: "Banner หลักหน้าแรก",
    width: 1920,
    height: 823,
    aspectRatio: "21:9",
    objectFit: "cover",
    notes: "เต็มความกว้างจอ — วาง subject กลางรูป",
  },
  categoryCard: {
    label: "การ์ดหมวดหมู่หน้าแรก",
    width: 960,
    height: 1200,
    aspectRatio: "4:5",
    objectFit: "cover",
  },
  brandLogo: {
    label: "โลโก้แบรนด์ (สไลด์)",
    width: 400,
    height: 160,
    aspectRatio: "5:2",
    objectFit: "contain",
    notes: "PNG/WebP พื้นโปร่งใสแนะนำ",
  },
  collection: {
    label: "รูปส่วนคอลเลกชัน",
    width: 900,
    height: 1200,
    aspectRatio: "3:4",
    objectFit: "cover",
  },
  recommendBanner: {
    label: "Banner สินค้าแนะนำ",
    width: 2100,
    height: 700,
    aspectRatio: "21:7",
    objectFit: "cover",
  },
  gallery: {
    label: "แกลเลอรี่หน้าแรก",
    width: 800,
    height: 800,
    aspectRatio: "1:1",
    objectFit: "cover",
  },
  contactLineQr: {
    label: "QR Code Line",
    width: 400,
    height: 400,
    aspectRatio: "1:1",
    objectFit: "contain",
    notes: "แสดงขนาด ~200px บนหน้าเว็บ",
  },
  categoryImage: {
    label: "รูปการ์ดหมวดหมู่",
    width: 960,
    height: 1200,
    aspectRatio: "4:5",
    objectFit: "cover",
  },
  categoryBanner: {
    label: "Banner หน้า Catalog/หมวดหมู่",
    width: 2100,
    height: 700,
    aspectRatio: "21:7",
    objectFit: "cover",
  },
  productMain: {
    label: "รูปหลักสินค้า",
    width: 900,
    height: 1200,
    aspectRatio: "3:4",
    objectFit: "contain",
    notes: "แสดงในการ์ดและหน้ารายละเอียด",
  },
  productGallery: {
    label: "รูป Gallery สินค้า",
    width: 1200,
    height: 1200,
    aspectRatio: "1:1",
    objectFit: "contain",
    notes: "สี่เหลี่ยมจัตุรัสหรือใกล้เคียง",
  },
} as const satisfies Record<string, ImageUploadSpec>;

export type ImageUploadSpecKey = keyof typeof IMAGE_UPLOAD_SPECS;

export function formatImageUploadSpec(spec: ImageUploadSpec) {
  return `${spec.width} × ${spec.height} px (${spec.aspectRatio})`;
}

export function aspectRatioToCss(aspectRatio: string) {
  const [w, h] = aspectRatio.split(":").map(Number);
  if (!w || !h) return "16 / 9";
  return `${w} / ${h}`;
}
