import { PortfolioSection } from "@/components/PortfolioSection";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { PatternStrip } from "@/components/PatternStrip";
import { ServicesSection } from "@/components/ServicesSection";
import { SiteHeader } from "@/components/SiteHeader";
import { BlogTeaserSection } from "@/components/blog/BlogTeaserSection";
import { DiagnosticPromoSection } from "@/components/diagnostic/DiagnosticPromoSection";
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
        <ServicesSection messages={messages} />
        <PortfolioSection messages={messages} />
        <DiagnosticPromoSection locale={locale} messages={messages} />
        <ContactForm formLocation="home" />
        <BlogTeaserSection locale={locale} messages={messages} />
      </main>
      <Footer messages={messages} />
    </>
  );
}
