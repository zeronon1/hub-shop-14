import ValueCards from "@/components/home/ValueCards";
import AboutSection from "@/components/home/AboutSection";
import ServicesSection from "@/components/home/ServicesSection";
import { defaultHomepageContent } from "@/lib/homepage-defaults";

const BG_IMAGE = "/bg/bg-about-services-tech-abstract-purple.png";

export default function AboutServicesBlock() {
  return (
    <div
      className="bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${BG_IMAGE})` }}
    >
      <ValueCards />
      <AboutSection data={defaultHomepageContent.about} />
      <ServicesSection />
    </div>
  );
}