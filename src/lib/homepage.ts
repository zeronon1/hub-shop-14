import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/lib/db";
import {
  defaultHomepageContent,
  HOMEPAGE_CONTENT_ID,
} from "@/lib/homepage-defaults";
import type {
  HomeBrandLogo,
  HomeCategoryCard,
  HomeGalleryImage,
  HomeServiceFeature,
  HomeServiceFeatureIcon,
  HomeServiceSection,
  HomeStat,
  HomepageContent,
} from "@/lib/homepage-types";

const FEATURE_ICONS: HomeServiceFeatureIcon[] = [
  "box",
  "calendar",
  "truck",
  "store",
];

function trimString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function normalizeBanner(raw: unknown, fallback: HomepageContent["heroBanner"]) {
  if (!raw || typeof raw !== "object") return fallback;
  const data = raw as Record<string, unknown>;
  return {
    image: trimString(data.image, fallback.image),
    alt: trimString(data.alt, fallback.alt),
  };
}

function normalizeCategoryCards(raw: unknown): HomeCategoryCard[] {
  if (!Array.isArray(raw)) return defaultHomepageContent.categoryCards;

  const cards = raw
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const data = item as Record<string, unknown>;
      return {
        title: trimString(data.title),
        image: trimString(data.image),
        href: trimString(data.href),
      };
    })
    .filter((item) => item.title && item.image && item.href);

  return cards.length > 0 ? cards : defaultHomepageContent.categoryCards;
}

function normalizeBrandLogos(raw: unknown): HomeBrandLogo[] {
  if (!Array.isArray(raw)) return defaultHomepageContent.brandLogos;

  const logos = raw
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const data = item as Record<string, unknown>;
      return {
        image: trimString(data.image),
        alt: trimString(data.alt),
      };
    })
    .filter((item) => item.image && item.alt);

  return logos.length > 0 ? logos : defaultHomepageContent.brandLogos;
}

function normalizeStats(raw: unknown): HomeStat[] {
  if (!Array.isArray(raw)) return defaultHomepageContent.whyChooseUs.stats;

  const stats = raw
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const data = item as Record<string, unknown>;
      return {
        value: trimString(data.value),
        label: trimString(data.label),
        sublabel: trimString(data.sublabel),
      };
    })
    .filter((item) => item.value && item.label);

  return stats.length > 0 ? stats : defaultHomepageContent.whyChooseUs.stats;
}

function normalizeServiceSections(raw: unknown): HomeServiceSection[] {
  if (!Array.isArray(raw)) return defaultHomepageContent.services.sections;

  const sections = raw
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const data = item as Record<string, unknown>;
      const items = Array.isArray(data.items)
        ? data.items
            .filter((entry): entry is string => typeof entry === "string")
            .map((entry) => entry.trim())
            .filter(Boolean)
        : [];

      return {
        title: trimString(data.title),
        items,
      };
    })
    .filter((section) => section.title && section.items.length > 0);

  return sections.length > 0 ? sections : defaultHomepageContent.services.sections;
}

function normalizeServiceFeatures(raw: unknown): HomeServiceFeature[] {
  if (!Array.isArray(raw)) return defaultHomepageContent.serviceFeatures;

  const features = raw
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const data = item as Record<string, unknown>;
      const icon = FEATURE_ICONS.includes(data.icon as HomeServiceFeatureIcon)
        ? (data.icon as HomeServiceFeatureIcon)
        : "box";

      return {
        title: trimString(data.title),
        description: trimString(data.description),
        icon,
      };
    })
    .filter((feature) => feature.title);

  return features.length > 0 ? features : defaultHomepageContent.serviceFeatures;
}

function normalizeGalleryImages(raw: unknown): HomeGalleryImage[] {
  if (!Array.isArray(raw)) return defaultHomepageContent.galleryImages;

  const images = raw
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const data = item as Record<string, unknown>;
      return {
        src: trimString(data.src),
        alt: trimString(data.alt),
      };
    })
    .filter((image) => image.src);

  return images.length > 0 ? images : defaultHomepageContent.galleryImages;
}

function normalizeParagraphs(raw: unknown): string[] {
  if (!Array.isArray(raw)) return defaultHomepageContent.about.paragraphs;

  const paragraphs = raw
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  return paragraphs.length > 0 ? paragraphs : defaultHomepageContent.about.paragraphs;
}

export function normalizeHomepageContent(
  input: Partial<HomepageContent>,
): HomepageContent {
  const fallback = defaultHomepageContent;

  const collectionRaw: Partial<HomepageContent["collectionSection"]> =
    input.collectionSection && typeof input.collectionSection === "object"
      ? input.collectionSection
      : {};

  const productSectionsRaw: Partial<HomepageContent["productSections"]> =
    input.productSections && typeof input.productSections === "object"
      ? input.productSections
      : {};

  const aboutRaw: Partial<HomepageContent["about"]> =
    input.about && typeof input.about === "object" ? input.about : {};

  const whyRaw: Partial<HomepageContent["whyChooseUs"]> =
    input.whyChooseUs && typeof input.whyChooseUs === "object"
      ? input.whyChooseUs
      : {};

  const servicesRaw: Partial<HomepageContent["services"]> =
    input.services && typeof input.services === "object" ? input.services : {};

  const marqueeRaw: Partial<HomepageContent["marquee"]> =
    input.marquee && typeof input.marquee === "object" ? input.marquee : {};

  const newArrivalRaw: Partial<HomepageContent["productSections"]["newArrival"]> =
    productSectionsRaw.newArrival &&
    typeof productSectionsRaw.newArrival === "object"
      ? productSectionsRaw.newArrival
      : {};

  const recommendRaw: Partial<HomepageContent["productSections"]["recommend"]> =
    productSectionsRaw.recommend &&
    typeof productSectionsRaw.recommend === "object"
      ? productSectionsRaw.recommend
      : {};

  return {
    heroBanner: normalizeBanner(input.heroBanner, fallback.heroBanner),
    categoryCards: normalizeCategoryCards(input.categoryCards),
    brandLogos: normalizeBrandLogos(input.brandLogos),
    collectionSection: {
      eyebrow:
        trimString(collectionRaw.eyebrow, fallback.collectionSection.eyebrow) ||
        fallback.collectionSection.eyebrow,
      title:
        trimString(collectionRaw.title, fallback.collectionSection.title) ||
        fallback.collectionSection.title,
      titleAccent:
        trimString(
          collectionRaw.titleAccent,
          fallback.collectionSection.titleAccent,
        ) || fallback.collectionSection.titleAccent,
      description:
        trimString(
          collectionRaw.description,
          fallback.collectionSection.description,
        ) || fallback.collectionSection.description,
      image:
        trimString(collectionRaw.image, fallback.collectionSection.image) ||
        fallback.collectionSection.image,
      buttonLabel:
        trimString(
          collectionRaw.buttonLabel,
          fallback.collectionSection.buttonLabel,
        ) || fallback.collectionSection.buttonLabel,
      buttonHref:
        trimString(
          collectionRaw.buttonHref,
          fallback.collectionSection.buttonHref,
        ) || fallback.collectionSection.buttonHref,
    },
    productSections: {
      newArrival: {
        title:
          trimString(newArrivalRaw.title, fallback.productSections.newArrival.title) ||
          fallback.productSections.newArrival.title,
      },
      recommend: {
        title:
          trimString(recommendRaw.title, fallback.productSections.recommend.title) ||
          fallback.productSections.recommend.title,
        banner: normalizeBanner(
          recommendRaw.banner,
          fallback.productSections.recommend.banner,
        ),
      },
    },
    about: {
      title:
        trimString(aboutRaw.title, fallback.about.title) || fallback.about.title,
      paragraphs: normalizeParagraphs(aboutRaw.paragraphs),
    },
    whyChooseUs: {
      title:
        trimString(whyRaw.title, fallback.whyChooseUs.title) ||
        fallback.whyChooseUs.title,
      description:
        trimString(whyRaw.description, fallback.whyChooseUs.description) ||
        fallback.whyChooseUs.description,
      stats: normalizeStats(whyRaw.stats),
    },
    services: {
      title:
        trimString(servicesRaw.title, fallback.services.title) ||
        fallback.services.title,
      intro:
        trimString(servicesRaw.intro, fallback.services.intro) ||
        fallback.services.intro,
      sections: normalizeServiceSections(servicesRaw.sections),
      closing:
        trimString(servicesRaw.closing, fallback.services.closing) ||
        fallback.services.closing,
    },
    marquee: {
      text:
        trimString(marqueeRaw.text, fallback.marquee.text) ||
        fallback.marquee.text,
    },
    serviceFeatures: normalizeServiceFeatures(input.serviceFeatures),
    galleryImages: normalizeGalleryImages(input.galleryImages),
  };
}

function isHomepageContent(value: unknown): value is HomepageContent {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return (
    typeof data.heroBanner === "object" &&
    Array.isArray(data.categoryCards) &&
    Array.isArray(data.brandLogos)
  );
}

export async function getHomepageContent(): Promise<HomepageContent> {
  noStore();

  try {
    const row = await db.siteContent.findUnique({
      where: { id: HOMEPAGE_CONTENT_ID },
    });

    if (row && isHomepageContent(row.content)) {
      return normalizeHomepageContent(row.content);
    }
  } catch {
    // DB unavailable — fall back to defaults
  }

  return defaultHomepageContent;
}
