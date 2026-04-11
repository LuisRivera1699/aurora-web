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
import { BlogTeaserSection } from "@/components/blog/BlogTeaserSection";
import { getMessages, isLocale } from "@/content/getMessages";
import { notFound } from "next/navigation";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);

  return (
    <>
      <SiteHeader messages={messages} />
      <main className="flex-1">
        <Hero messages={messages} />
        <PatternStrip variant={1} />
        <AboutSection messages={messages} />
        <PatternStrip variant={2} />
        <ServicesSection messages={messages} />
        <ProductsSection messages={messages} />
        <TechStackGrid messages={messages} />
        <PortfolioSection messages={messages} />
        <BlogTeaserSection locale={locale} messages={messages} />
        <ContactForm />
      </main>
      <Footer messages={messages} />
    </>
  );
}
