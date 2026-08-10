import type { HomepageContent } from "@/lib/homepage-types";

export const HOMEPAGE_CONTENT_ID = "homepage";

export const defaultHomepageContent: HomepageContent = {
  heroBanner: {
    image: "/banner/banner-hero-sarutobi-anime-figures-storm.png",
    alt: "Momotaro Shop ร้านโมเดล ฟิกเกอร์ และของสะสมลิขสิทธิ์จากประเทศญี่ปุ่น",
  },
  categoryCards: [
    {
      title: "Demon Slayer",
      image: "/categories/category-demon-slayer-nezuko-tanjiro-bundle.webp",
      href: "/category/demon-slayer",
    },
    {
      title: "One Piece",
      image: "/categories/category-one-piece-gear5-luffy.webp",
      href: "/category/one-piece",
    },
    {
      title: "Naruto",
      image: "/categories/category-naruto-uzumaki-vibration-stars.webp",
      href: "/category/naruto",
    },
    {
      title: "Bleach",
      image: "/categories/category-bleach-kurosaki-ichigo-shfiguarts.webp",
      href: "/category/bleach",
    },
  ],
  brandLogos: [
    { image: "/brands/brand-logo-one-piece.png", alt: "One Piece" },
    { image: "/brands/brand-logo-demon-slayer.png", alt: "Demon Slayer" },
    { image: "/brands/brand-logo-naruto.gif", alt: "Naruto" },
    { image: "/brands/brand-logo-attack-on-titan.webp", alt: "Attack on Titan" },
    { image: "/brands/brand-logo-bleach.gif", alt: "Bleach" },
    { image: "/brands/brand-logo-frieren.png", alt: "Frieren" },
  ],
  collectionSection: {
    eyebrow: "Momotaro Shop",
    title: "ANIME FIGURE",
    titleAccent: "COLLECTION",
    description:
      "รวมโมเดลและฟิกเกอร์จากอนิเมะชื่อดัง Ichiban Kuji, MASTERLISE, Grandista และ Prize Figure จาก One Piece, Demon Slayer, Dragon Ball, Naruto, My Hero Academia, Jujutsu Kaisen และอีกมากมาย",
    image: "/about/about-sarutobi-anime-figures-promo.png",
    buttonLabel: "Shop Now",
    buttonHref: "/products",
  },
  productSections: {
    newArrival: { title: "New Arrival" },
    recommend: {
      title: "Our Recommend",
      banner: {
        image: "/banner/banner-recommend-sarutobi-anime-figures-collectibles.png",
        alt: "Momotaro Shop Recommended Collection",
      },
    },
  },
  about: {
    title: "เกี่ยวกับ Momotaro Shop",
    paragraphs: [
      "Momotaro Shop คือร้านโมเดล ฟิกเกอร์ และของสะสมลิขสิทธิ์จากประเทศญี่ปุ่น ที่ก่อตั้งขึ้นจากความชื่นชอบในอนิเมะและวัฒนธรรมการสะสม โดยมุ่งมั่นในการคัดสรรสินค้าคุณภาพสำหรับนักสะสมทุกระดับ",
      "ทางร้านจำหน่ายสินค้าหลากหลายประเภท ไม่ว่าจะเป็น Ichiban Kuji, MASTERLISE, Prize Figure, Grandista รวมถึงของสะสมจากอนิเมะชื่อดังมากมาย เช่น One Piece, Demon Slayer, Dragon Ball, Naruto, My Hero Academia, Jujutsu Kaisen และอีกหลายซีรีส์ยอดนิยม",
      "นอกจากการจำหน่ายสินค้าออนไลน์ Momotaro Shop ยังมีหน้าร้านสำหรับให้ลูกค้าเข้ามาเลือกชมสินค้า พูดคุย แลกเปลี่ยนประสบการณ์ และสัมผัสบรรยากาศที่เป็นกันเองเสมือนอยู่บ้านของตนเอง",
      "เราเชื่อว่างานสะสมไม่ได้เป็นเพียงสินค้า แต่เป็นความทรงจำ ความชื่นชอบ และแรงบันดาลใจของนักสะสมทุกคน",
      "Momotaro Shop มุ่งมั่นในการนำเสนอสินค้าลิขสิทธิ์แท้จากประเทศญี่ปุ่น พร้อมการบริการที่จริงใจและการดูแลลูกค้าทั้งก่อนและหลังการขาย เพื่อให้ทุกการสะสมเป็นประสบการณ์ที่ดีที่สุด",
    ],
  },
  whyChooseUs: {
    title: "ทำไมต้องเลือก Momotaro Shop?",
    description:
      "เราเชื่อว่างานสะสมไม่ได้เป็นเพียงสินค้า แต่เป็นความทรงจำ ความชื่นชอบ และแรงบันดาลใจ Momotaro Shop คัดสรรโมเดลและฟิกเกอร์ลิขสิทธิ์แท้จากญี่ปุ่น พร้อมบริการที่จริงใจทั้งก่อนและหลังการขาย",
    stats: [
      {
        value: "8+",
        label: "Official Brands",
        sublabel: "Bandai, Banpresto, SEGA, FuRyu และอื่นๆ",
      },
      {
        value: "12+",
        label: "Product Lines",
        sublabel: "Ichiban Kuji, MASTERLISE, Grandista และอื่นๆ",
      },
      {
        value: "15+",
        label: "Anime Series",
        sublabel: "One Piece, Demon Slayer, Naruto และอีกมากมาย",
      },
    ],
  },
  services: {
    title: "สินค้าและบริการ",
    intro:
      "Momotaro Shop จำหน่ายโมเดล ฟิกเกอร์ และของสะสมลิขสิทธิ์จากประเทศญี่ปุ่น โดยคัดสรรสินค้าคุณภาพสำหรับนักสะสมและแฟนอนิเมะทุกระดับ",
    sections: [
      {
        title: "ผู้ผลิตและแบรนด์ที่จัดจำหน่าย",
        items: [
          "Bandai Spirits",
          "Banpresto",
          "SEGA",
          "FuRyu",
          "Taito",
          "Good Smile Company",
          "MegaHouse",
          "Kotobukiya",
        ],
      },
      {
        title: "ไลน์สินค้าและซีรีส์ยอดนิยม",
        items: [
          "Ichiban Kuji",
          "MASTERLISE",
          "MASTERLISE EXTRA",
          "Grandista",
          "Vibration Stars",
          "Effectreme",
          "King of Artist",
          "DXF The Grandline Series",
          "Glitter & Glamours",
          "Pop Up Parade",
          "SPM Figure",
          "Luminasta",
        ],
      },
      {
        title: "อนิเมะและซีรีส์ที่มีจำหน่าย",
        items: [
          "One Piece",
          "Demon Slayer",
          "Dragon Ball",
          "Naruto",
          "My Hero Academia",
          "Jujutsu Kaisen",
          "Attack on Titan",
          "Chainsaw Man",
          "Bleach",
          "Frieren",
          "Gundam",
          "และอนิเมะยอดนิยมอีกมากมาย",
        ],
      },
    ],
    closing:
      "Momotaro Shop มุ่งมั่นในการนำเสนอสินค้าลิขสิทธิ์แท้จากประเทศญี่ปุ่น พร้อมการบริการที่เป็นกันเองสำหรับนักสะสมทุกท่าน",
  },
  marquee: { text: "Momotaro Shop" },
  serviceFeatures: [
    {
      title: "สินค้าพร้อมส่ง",
      description: "ฟิกเกอร์และของสะสมพร้อมจัดส่ง",
      icon: "box",
    },
    {
      title: "รับพรีออเดอร์",
      description: "สินค้านำเข้าจากญี่ปุ่น พร้อมใบพรีออเดอร์ทุกออเดอร์",
      icon: "calendar",
    },
    {
      title: "จัดส่งทั่วประเทศ",
      description: "บริการจัดส่งและบริการหลังการขาย",
      icon: "truck",
    },
    {
      title: "หน้าร้าน & คำแนะนำ",
      description: "เลือกชมสินค้า พักผ่อน และปรึกษาการสะสม",
      icon: "store",
    },
  ],
  galleryImages: [
    {
      src: "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/DEMONSLAYERGRANDISTA-KYOJURORENGOKU-1.jpg?v=1740461955",
      alt: "Demon Slayer Rengoku Grandista",
    },
    {
      src: "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/ONEPIECE-GRANDISTA-TRAFALGARLAW.jpg?v=1738176665",
      alt: "One Piece Trafalgar Law Grandista",
    },
    {
      src: "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/JujutsuKaisenRukappu_LookUp_-SatoruGojo_10.jpg?v=1783471279",
      alt: "Jujutsu Kaisen Gojo",
    },
    {
      src: "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/NARUTOSHIPPUDEN-GRANDISTA-UCHIHAITACHI.webp?v=1738176705",
      alt: "Naruto Itachi Grandista",
    },
    {
      src: "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/ChainsawManLuminastaFigure-Power_Pre-OrderMar2026_1.webp?v=1770087602",
      alt: "Chainsaw Man Power",
    },
  ],
};
