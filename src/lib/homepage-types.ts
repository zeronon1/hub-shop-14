export type HomeBanner = {
  image: string;
  alt: string;
};

export type HomeCategoryCard = {
  title: string;
  image: string;
  href: string;
};

export type HomeBrandLogo = {
  image: string;
  alt: string;
};

export type HomeStat = {
  value: string;
  label: string;
  sublabel: string;
};

export type HomeServiceSection = {
  title: string;
  items: string[];
};

export type HomeServiceFeatureIcon = "box" | "calendar" | "truck" | "store";

export type HomeServiceFeature = {
  title: string;
  description: string;
  icon: HomeServiceFeatureIcon;
};

export type HomeGalleryImage = {
  src: string;
  alt: string;
};

export type HomepageContent = {
  heroBanner: HomeBanner;
  categoryCards: HomeCategoryCard[];
  brandLogos: HomeBrandLogo[];
  collectionSection: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    description: string;
    image: string;
    buttonLabel: string;
    buttonHref: string;
  };
  productSections: {
    newArrival: { title: string };
    recommend: { title: string; banner: HomeBanner };
  };
  about: {
    title: string;
    paragraphs: string[];
  };
  whyChooseUs: {
    title: string;
    description: string;
    stats: HomeStat[];
  };
  services: {
    title: string;
    intro: string;
    sections: HomeServiceSection[];
    closing: string;
  };
  marquee: { text: string };
  serviceFeatures: HomeServiceFeature[];
  galleryImages: HomeGalleryImage[];
};
