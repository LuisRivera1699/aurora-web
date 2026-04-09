import { AboutSection } from "@/components/AboutSection";
import { PortfolioSection } from "@/components/PortfolioSection";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { PatternStrip } from "@/components/PatternStrip";
import { ProductsSection } from "@/components/ProductsSection";
import { ServicesSection } from "@/components/ServicesSection";
import { SiteHeader } from "@/components/SiteHeader";
import { TechStackGrid } from "@/components/TechStackGrid";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <PatternStrip variant={1} />
        <AboutSection />
        <PatternStrip variant={2} />
        <ServicesSection />
        <ProductsSection />
        <TechStackGrid />
        <PortfolioSection />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
