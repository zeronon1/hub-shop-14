export const siteInfo = {
  name: "Momotaro Shop",
  tagline:
    "ร้านโมเดล ฟิกเกอร์ และของสะสมลิขสิทธิ์จากประเทศญี่ปุ่น คัดสรรสินค้าคุณภาพสำหรับนักสะสมทุกระดับ",
  logo: "/logo/momotaro-logo.svg",
  aboutTitle: "เกี่ยวกับ Momotaro Shop",
  aboutParagraphs: [
    "Momotaro Shop คือร้านโมเดล ฟิกเกอร์ และของสะสมลิขสิทธิ์จากประเทศญี่ปุ่น ที่ก่อตั้งขึ้นจากความชื่นชอบในอนิเมะและวัฒนธรรมการสะสม โดยมุ่งมั่นในการคัดสรรสินค้าคุณภาพสำหรับนักสะสมทุกระดับ",
    "ทางร้านจำหน่ายสินค้าหลากหลายประเภท ไม่ว่าจะเป็น Ichiban Kuji, MASTERLISE, Prize Figure, Grandista รวมถึงของสะสมจากอนิเมะชื่อดังมากมาย เช่น One Piece, Demon Slayer, Dragon Ball, Naruto, My Hero Academia, Jujutsu Kaisen และอีกหลายซีรีส์ยอดนิยม",
    "นอกจากการจำหน่ายสินค้าออนไลน์ Momotaro Shop ยังมีหน้าร้านสำหรับให้ลูกค้าเข้ามาเลือกชมสินค้า พูดคุย แลกเปลี่ยนประสบการณ์ และสัมผัสบรรยากาศที่เป็นกันเองเสมือนอยู่บ้านของตนเอง",
    "เราเชื่อว่างานสะสมไม่ได้เป็นเพียงสินค้า แต่เป็นความทรงจำ ความชื่นชอบ และแรงบันดาลใจของนักสะสมทุกคน",
    "Momotaro Shop มุ่งมั่นในการนำเสนอสินค้าลิขสิทธิ์แท้จากประเทศญี่ปุ่น พร้อมการบริการที่จริงใจและการดูแลลูกค้าทั้งก่อนและหลังการขาย เพื่อให้ทุกการสะสมเป็นประสบการณ์ที่ดีที่สุด",
  ],
} as const;

export const navItems = [
  { label: "หมวดหมู่รวม", href: "/catalog" },
  { label: "รวมสินค้า", href: "/products" },
  { label: "One Piece", href: "/category/one-piece" },
  { label: "Demon Slayer", href: "/category/demon-slayer" },
  { label: "Dragon Ball", href: "/category/dragon-ball" },
  { label: "Naruto", href: "/category/naruto" },
  { label: "วิธีสั่งซื้อ", href: "/order-guide" },
  { label: "ติดต่อเรา", href: "/contact" },
  
] as const;

export const heroBanner = {
  image: "/banner/banner-hero-sarutobi-anime-figures-storm.png",
  alt: "Momotaro Shop ร้านโมเดล ฟิกเกอร์ และของสะสมลิขสิทธิ์จากประเทศญี่ปุ่น",
} as const;

export const categoryCards = [
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
] as const;

export const brandLogos = [
  {
    image: "/brands/brand-logo-one-piece.png",
    alt: "One Piece",
  },
  {
    image: "/brands/brand-logo-demon-slayer.png",
    alt: "Demon Slayer",
  },
  {
    image: "/brands/brand-logo-naruto.gif",
    alt: "Naruto",
  },
  {
    image: "/brands/brand-logo-attack-on-titan.webp",
    alt: "Attack on Titan",
  },
  {
    image: "/brands/brand-logo-bleach.gif",
    alt: "Bleach",
  },
  {
    image: "/brands/brand-logo-frieren.png",
    alt: "Frieren",
  },
] as const;

export const collectionSection = {
  title: "ANIME FIGURE",
  titleAccent: "COLLECTION",
  description:
    "รวมโมเดลและฟิกเกอร์จากอนิเมะชื่อดัง Ichiban Kuji, MASTERLISE, Grandista และ Prize Figure จาก One Piece, Demon Slayer, Dragon Ball, Naruto, My Hero Academia, Jujutsu Kaisen และอีกมากมาย",
  image: "/about/about-sarutobi-anime-figures-promo.png",
  buttonLabel: "Shop Now",
  buttonHref: "/products",
} as const;

export const productTabs = [
  { id: "one-piece", label: "One Piece" },
  { id: "demon-slayer", label: "Demon Slayer" },
  { id: "mha", label: "My Hero Academia" },
  { id: "jjk", label: "Jujutsu Kaisen" },
  { id: "naruto", label: "Naruto" },
  { id: "dragon-ball", label: "Dragon Ball" },
  { id: "chainsaw", label: "Chainsaw Man" },
  { id: "aot", label: "Attack on Titan" },
  { id: "bleach", label: "Bleach" },
] as const;

export type ProductTabId = (typeof productTabs)[number]["id"];

export type CatalogBanner = {
  image: string;
  alt: string;
};

export const defaultCatalogBanner: CatalogBanner = {
  image: "/banner/banner-recommend-sarutobi-anime-figures-collectibles.png",
  alt: "Catalog สินค้า Momotaro Shop — โมเดล ฟิกเกอร์ และของสะสมลิขสิทธิ์จากประเทศญี่ปุ่น",
};

/** แก้ไขรูป banner แต่ละ catalog ได้ที่นี่ — หมวดที่ไม่มีจะใช้ defaultCatalogBanner */
export const catalogBanners: Partial<Record<ProductTabId, CatalogBanner>> = {
  "one-piece": {
    image: "/banner/banner-catalog-one-piece-figure-luffy-akainu-aokiji.png",
    alt: "One Piece Figure — คอลเลกชันฟิกเกอร์สะสม One Piece สายอนิเมะห้ามพลาด",
  },
};

export function getCatalogBanner(category?: ProductTabId): CatalogBanner {
  if (category && catalogBanners[category]) {
    return catalogBanners[category]!;
  }
  return defaultCatalogBanner;
}

/** รูปโลโก้/ภาพหมวด fallback เมื่อ CMS ยังไม่มี category.image */
export const categoryImageFallbacks: Partial<Record<ProductTabId, string>> = {
  "one-piece": "/brands/brand-logo-one-piece.png",
  "demon-slayer": "/brands/brand-logo-demon-slayer.png",
  naruto: "/brands/brand-logo-naruto.gif",
  bleach: "/brands/brand-logo-bleach.gif",
  aot: "/brands/brand-logo-attack-on-titan.webp",
};

export function getCategoryImageFallback(slug: string): string | null {
  return categoryImageFallbacks[slug as ProductTabId] ?? null;
}

export type Product = {
  id: string;
  name: string;
  price: number;
  salePrice: number | null;
  image: string;
  category: string;
  isNew: boolean;
  isRecommend: boolean;
};

export type ProductDetail = Product & {
  sku: string;
  stock: number;
  prepDays: number;
  description: string;
  shippingInfo: string;
  howToOrder: string;
  images?: string[];
};

const mockProductsData = [
  {
    id: "op-1",
    name: "ONE PIECE - GRANDISTA - TRAFALGAR LAW",
    price: 1050,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/ONEPIECE-GRANDISTA-TRAFALGARLAW.jpg?v=1738176665",
    category: "one-piece",
  },
  {
    id: "op-2",
    name: "One Piece Grandista - Sabo",
    price: 840,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/One_Piece_Grandista_-_Sabo.jpg?v=1756168039",
    category: "one-piece",
  },
  {
    id: "op-3",
    name: "One Piece Grandista - Roronoa Zoro",
    price: 840,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/one-piece-grandista-roronoa-zoro.jpg?v=1738177713",
    category: "one-piece",
  },
  {
    id: "op-4",
    name: "One Piece Grandista - Boa Hancock",
    price: 840,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/OnePieceGrandista-BoaHancock.jpg?v=1767668038",
    category: "one-piece",
  },
  {
    id: "ds-1",
    name: "ICHIBAN KUJI Demon Slayer - Gyomei Himejima MASTERLISE EXTRA",
    price: 7560,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/ICHIBANDEMONSLAYERKIMETSUNOYAIBATHESUCCESSOR-APRIZEGYOMEIHIMEJIMAMASTERLISEEXTRAFIGURE-4.jpg?v=1741918326",
    category: "demon-slayer",
  },
  {
    id: "ds-2",
    name: "DEMON SLAYER GRANDISTA - KYOJURO RENGOKU",
    price: 1050,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/DEMONSLAYERGRANDISTA-KYOJURORENGOKU-1.jpg?v=1740461955",
    category: "demon-slayer",
  },
  {
    id: "ds-3",
    name: "Demon Slayer Grandista - Akaza",
    price: 1435,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/DemonSlayerGrandista-Akaza.jpg?v=1766447906",
    category: "demon-slayer",
  },
  {
    id: "ds-4",
    name: "Demon Slayer Grandista - Giyu Tomioka",
    price: 1050,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/Demon_Slayer_Grandista_-_Giyu_Tomioka_5.jpg?v=1752725929",
    category: "demon-slayer",
  },
  {
    id: "mha-1",
    name: "My Hero Academia Glitter & Glamours - Mirko",
    price: 1435,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/MY_HERO_ACADEMIA_GLITTER_GLAMOURS_-_MIRKO_-_3.webp?v=1741224075",
    category: "mha",
  },
  {
    id: "mha-2",
    name: "MY HERO ACADEMIA MAXIMATIC - KATSUKI BAKUGO",
    price: 2590,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/MY_HERO_ACADEMIA_MAXIMATIC_-_KATSUKI_BAKUGO.webp?v=1750998086",
    category: "mha",
  },
  {
    id: "mha-3",
    name: "My Hero Academia Maximatic - Katsuki Bakugo II",
    price: 1435,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/My_Hero_Academia_Maximatic_-_Katsuki_Bakugo_II-01.jpg?v=1771979647",
    category: "mha",
  },
  {
    id: "mha-4",
    name: "My Hero Academia Nendoroid - Midoriya Izuku UA School Uniform Ver.",
    price: 1785,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/MyHeroAcademiaNendoroid-MidoriyaIzukuUASchoolUniformVer_5.jpg?v=1782871147",
    category: "mha",
  },
  {
    id: "jjk-1",
    name: "Jujutsu Kaisen Grandista - Maki Zenin",
    price: 1225,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/rn-image_picker_lib_temp_ec56dfe2-3276-4ea7-8eb2-4f09fbe6a00a.jpg?v=1774343309",
    category: "jjk",
  },
  {
    id: "jjk-2",
    name: "Jujutsu Kaisen Rukappu (Look Up) - Satoru Gojo",
    price: 1785,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/JujutsuKaisenRukappu_LookUp_-SatoruGojo_10.jpg?v=1783471279",
    category: "jjk",
  },
  {
    id: "jjk-3",
    name: "Jujutsu Kaisen Mega Cat Project - Complete Set of 6 Types",
    price: 2065,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/JujutsuKaisenMegaCatProject-JujutsuNyankoHiddenInventoryPrematureDeathVer.CompleteSetof6Types_8.jpg?v=1783324525",
    category: "jjk",
  },
  {
    id: "jjk-4",
    name: "Jujutsu Kaisen - Foam Print T-Shirt",
    price: 1855,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/JujutsuKaisen-FoamPrintT-Shirt_2.jpg?v=1783385683",
    category: "jjk",
  },
  {
    id: "naruto-1",
    name: "Naruto Shippuden Grandista - Itachi Uchiha",
    price: 1365,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/NARUTOSHIPPUDEN-GRANDISTA-UCHIHAITACHI.webp?v=1738176705",
    category: "naruto",
  },
  {
    id: "naruto-2",
    name: "Naruto Shippuden G.E.M Series - Sasuke Uchiha Ninja World Ver.",
    price: 5635,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/NarutoShippudenG.E.MSeries-SasukeUchihaNinjaWorldVer_1.jpg?v=1782955414",
    category: "naruto",
  },
  {
    id: "naruto-3",
    name: "Naruto Shippuden STARTune Figure - Naruto Uzumaki",
    price: 4305,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/NarutoShippudenSTARTuneFigure-NarutoUzumakiTheWilltoBecomeHokage_5.webp?v=1782796698",
    category: "naruto",
  },
  {
    id: "naruto-4",
    name: "Naruto Shippuden Naruto Gals - Tsunade Ver.2",
    price: 7770,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/NarutoShippudenNarutoGals-TsunadeVer_1.jpg?v=1782960273",
    category: "naruto",
  },
  {
    id: "db-1",
    name: "Dragon Ball Z Grandista - Vegito",
    price: 840,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/Grandista_Vegito.jpg?v=1763427692",
    category: "dragon-ball",
  },
  {
    id: "db-2",
    name: "Dragon Ball Z Grandista - Majin Vegeta",
    price: 1050,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/Dragon_Ball_Z_Grandista_-_Majin_Vegeta_d55d38b8-7013-44bd-addf-1273983f094a.jpg?v=1764051104",
    category: "dragon-ball",
  },
  {
    id: "db-3",
    name: "Bleach Grandista - Kurosaki Ichigo",
    price: 1225,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/Bleach_Grandista_-_Kurosaki_Ichigo.jpg?v=1756167936",
    category: "bleach",
  },
  {
    id: "db-4",
    name: "Bleach Grandista - Aizen Sosuke",
    price: 840,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/Bleach_Grandista_-_Aizen_Sosuke.jpg?v=1782176521",
    category: "bleach",
  },
  {
    id: "csm-1",
    name: "Chainsaw Man Luminasta Figure - Power",
    price: 1050,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/ChainsawManLuminastaFigure-Power_Pre-OrderMar2026_1.webp?v=1770087602",
    category: "chainsaw",
  },
  {
    id: "csm-2",
    name: "Chainsaw Man BiCute Bunnies Figure - Reze Bunny Ver.",
    price: 2065,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/51dJunAFcVL._AC.jpg?v=1762505121",
    category: "chainsaw",
  },
  {
    id: "csm-3",
    name: "Chainsaw Man BiCute Bunnies Figure - Power",
    price: 1925,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/ChainsawManBiCuteBunniesFigure-PowerLight_2.jpg?v=1763103904",
    category: "chainsaw",
  },
  {
    id: "csm-4",
    name: "Chainsaw Man Reze Arc High Premium Figure - Angel Devil",
    price: 1645,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/ChainsawManRezeArcHighPremiumFigure-AngelDevil_6.webp?v=1771806547",
    category: "chainsaw",
  },
  {
    id: "aot-1",
    name: "Attack on Titan Grandista - Levi Ackerman",
    price: 1050,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/Attack_on_Titan_Grandista_-_Levi_Ackerman.jpg?v=1756167980",
    category: "aot",
  },
  {
    id: "aot-2",
    name: "Attack on Titan GigantiX Figure - Eren Yeager",
    price: 1050,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/AttackonTitanGigantiXFigure-ErenYeagerAttackonTitanVer_2.jpg?v=1781742695",
    category: "aot",
  },
  {
    id: "aot-3",
    name: "Attack on Titan GigantiX Figure - Reiner Braun Armored Titan Ver.",
    price: 1050,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/AttackonTitanGigantiXFigure-ReinerBraunArmoredTitanVer..jpg?v=1781742031",
    category: "aot",
  },
  {
    id: "aot-4",
    name: "Ichiban Kuji Attack on Titan - I Prize Chokonokko Figure",
    price: 0,
    image:
      "https://cdn.shopify.com/s/files/1/0657/6164/0702/files/IchibanKujiAttackonTitanTheWorldOutsidetheWalls-IPrizeChokonokkoFigure_2.jpg?v=1745507780",
    category: "aot",
  },
];

export const mockProducts: Product[] = mockProductsData.map((product, index) => ({
  ...product,
  salePrice: null,
  isNew: index < 8,
  isRecommend: index >= 4 && index < 20,
}));

export const recommendBanner = {
  image: "/banner/banner-recommend-sarutobi-anime-figures-collectibles.png",
  alt: "Momotaro Shop Recommended Collection",
} as const;

export const whyChooseUs = {
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
} as const;

export const servicesData = {
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
} as const;

export const serviceFeatures = [
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
] as const;

export const galleryImages = [
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
] as const;

export const footerLinks = {
  menu: [
    { label: "ติดต่อเรา", href: "/contact" },
    { label: "รายละเอียดการสั่งซื้อ", href: "/order-guide" },
    { label: "เกี่ยวกับเรา", href: "/#about" },
    { label: "สินค้าและบริการ", href: "/#services" },
  ],
  home: [
    { label: "หมวดหมู่รวม", href: "/catalog" },
    { label: "รวมสินค้า", href: "/products" },
    { label: "One Piece", href: "/category/one-piece" },
    { label: "Demon Slayer", href: "/category/demon-slayer" },
    { label: "My Hero Academia", href: "/category/mha" },
    { label: "Jujutsu Kaisen", href: "/category/jjk" },
  ],
} as const;

export function formatPrice(price: number) {
  if (price === 0) return "ติดต่อสอบถาม";
  return `฿${price.toLocaleString("th-TH")}`;
}

export type ProductPricing = Pick<Product, "price" | "salePrice">;

export function isProductOnSale(product: ProductPricing) {
  return (
    product.price > 0 &&
    product.salePrice != null &&
    product.salePrice > 0 &&
    product.salePrice < product.price
  );
}

export function getProductEffectivePrice(product: ProductPricing) {
  if (product.price === 0) return 0;
  if (isProductOnSale(product)) return product.salePrice!;
  return product.price;
}

export function getProductDiscountPercent(product: ProductPricing) {
  if (!isProductOnSale(product)) return 0;
  return Math.round((1 - product.salePrice! / product.price) * 100);
}

export function normalizeSalePrice(
  price: number,
  salePrice: number | null | undefined,
): number | null {
  if (salePrice == null || salePrice <= 0) return null;
  if (price <= 0) return null;
  if (salePrice >= price) return null;
  return salePrice;
}

export function validateSalePrice(
  price: number,
  salePrice: number | null | undefined,
): string | null {
  if (salePrice == null || salePrice <= 0) return null;
  if (price <= 0) {
    return "ไม่สามารถตั้งราคาลดได้เมื่อราคาปกติเป็นติดต่อสอบถาม";
  }
  if (salePrice >= price) {
    return "ราคาลดต้องน้อยกว่าราคาปกติ";
  }
  return null;
}

export function getCategoryLabel(category: string) {
  return productTabs.find((tab) => tab.id === category)?.label ?? category;
}

export function isValidCategorySlug(slug: string): slug is ProductTabId {
  return productTabs.some((tab) => tab.id === slug);
}

export function getCategoryBySlug(slug: string) {
  return productTabs.find((tab) => tab.id === slug);
}

export function getProductById(id: string) {
  return mockProducts.find((product) => product.id === id);
}

function getProductGalleryImages(product: Product): string[] {
  const extras = mockProducts
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 3)
    .map((item) => item.image);

  return Array.from(new Set([product.image, ...extras])).slice(0, 4);
}

export function getProductDetail(id: string): ProductDetail | undefined {
  const product = getProductById(id);
  if (!product) return undefined;

  const categoryLabel = getCategoryLabel(product.category);
  const sku = `SKU-${id.replace(/-/g, "").toUpperCase().slice(0, 8)}`;

  return {
    ...product,
    sku,
    stock: 99 + (product.name.length % 900),
    prepDays: product.price >= 3500 ? 3 : 2,
    description: `${product.name} เป็นสินค้าลิขสิทธิ์แท้จากประเทศญี่ปุ่น ผลิตโดยแบรนด์ชั้นนำ คุณภาพสูง เหมาะสำหรับนักสะสมและแฟนอนิเมะ ${categoryLabel} ทุกท่าน\n\nสินค้ามาพร้อมกล่องบรรจุภัณฑ์ต้นฉบับ สภาพใหม่ 100% จากร้าน Momotaro Shop รับประกันความแท้ทุกชิ้น`,
    shippingInfo:
      "จัดส่งทั่วประเทศผ่าน Kerry Express, Flash Express หรือไปรษณีย์ไทย\nค่าจัดส่งเริ่มต้น 50 บาท (กรุงเทพฯ และปริมณฑล) / 80 บาท (ต่างจังหวัด)\nสินค้าพร้อมส่งจัดส่งภายใน 1-2 วันทำการหลังยืนยันการชำระเงิน\nสินค้าพรีออเดอร์จัดส่งตามระยะเวลาที่ระบุในหน้าสินค้า",
    howToOrder:
      "1. เลือกสินค้าและจำนวนที่ต้องการ\n2. กดปุ่ม \"สั่งซื้อเลย\" หรือติดต่อทาง Line / Facebook\n3. แจ้งที่อยู่จัดส่งและช่องทางชำระเงิน\n4. โอนเงินและส่งสลิปยืนยัน\n5. รอรับสินค้าตามระยะเวลาจัดเตรียม",
    images: getProductGalleryImages(product),
  };
}

export function getRelatedProducts(product: Product, limit = 4) {
  return mockProducts
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, limit);
}

export function getRecommendedProducts(product: Product, limit = 8) {
  const sameCategory = mockProducts.filter(
    (item) => item.category === product.category && item.id !== product.id,
  );
  const others = mockProducts.filter(
    (item) => item.category !== product.category && item.id !== product.id,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function getRecentlyViewedProducts(product: Product, limit = 2) {
  const pool = mockProducts.filter((item) => item.id !== product.id);
  const index = pool.findIndex((item) => item.category !== product.category);
  const picks = index >= 0 ? [pool[index], pool[(index + 3) % pool.length]] : pool.slice(0, limit);
  return picks.slice(0, limit);
}

export function getProductsByCategory(category: ProductTabId, limit = 4) {
  return mockProducts.filter((p) => p.category === category).slice(0, limit);
}
