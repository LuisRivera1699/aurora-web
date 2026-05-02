import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutSection } from "@/components/AboutSection";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { getMessages, isLocale } from "@/content/getMessages";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);
  const base = new URL(messages.siteMeta.url);

  return {
    title: messages.about.title,
    description: messages.about.mission,
    alternates: {
      canonical: `${base.origin}/${locale}/about`,
      languages: {
        es: `${base.origin}/es/about`,
        en: `${base.origin}/en/about`,
        "x-default": `${base.origin}/about`,
      },
    },
    openGraph: {
      title: `${messages.about.title} · ${messages.siteMeta.name}`,
      description: messages.about.mission,
      url: `${base.origin}/${locale}/about`,
      locale: locale === "es" ? "es_ES" : "en_US",
      type: "website",
    },
  };
}

export default async function AboutPage({
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
        <AboutSection messages={messages} titleAs="h1" />
      </main>
      <Footer messages={messages} />
    </>
  );
}
