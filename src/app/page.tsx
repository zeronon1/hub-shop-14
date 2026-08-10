import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroCarousel from "@/components/home/HeroCarousel";
import CategoryCards from "@/components/home/CategoryCards";
import BrandSlider from "@/components/home/BrandSlider";
import CollectionSection from "@/components/home/CollectionSection";
import ProductTabSectionLoader from "@/components/home/ProductTabSectionLoader";
import AboutSection from "@/components/home/AboutSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import ShopServicesSection from "@/components/home/ShopServicesSection";
import MarqueeSection from "@/components/home/MarqueeSection";
import ServiceFeatures from "@/components/home/ServiceFeatures";
import GallerySection from "@/components/home/GallerySection";
import { getHomepageContent } from "@/lib/homepage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getHomepageContent();

  return (
    <>
      <Header />
      <main>
        <HeroCarousel banner={content.heroBanner} />
        <CategoryCards cards={content.categoryCards} />
        <BrandSlider logos={content.brandLogos} />
        <CollectionSection data={content.collectionSection} />
        <ProductTabSectionLoader
          title={content.productSections.newArrival.title}
          darkBg
        />
        <ProductTabSectionLoader
          title={content.productSections.recommend.title}
          variant="recommend"
          recommendBanner={content.productSections.recommend.banner}
        />
        <AboutSection data={content.about} />
        <WhyChooseUs data={content.whyChooseUs} />
        <ShopServicesSection data={content.services} />
        <MarqueeSection text={content.marquee.text} />
        <ServiceFeatures features={content.serviceFeatures} />
        <GallerySection images={content.galleryImages} />
      </main>
      <Footer />
    </>
  );
}
