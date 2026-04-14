import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { DiagnosticWizard } from "@/components/diagnostic/DiagnosticWizard";
import { SectionTitle } from "@/components/SectionTitle";
import { getMessages, isLocale } from "@/content/getMessages";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);
  const base = new URL(m.siteMeta.url);
  return {
    title: m.diagnostic.pageTitle,
    description: m.diagnostic.pageSubtitle,
    alternates: {
      canonical: `${base.origin}/${locale}/diagnostic`,
      languages: {
        es: `${base.origin}/es/diagnostic`,
        en: `${base.origin}/en/diagnostic`,
        "x-default": `${base.origin}/en/diagnostic`,
      },
    },
  };
}

export default async function DiagnosticPage({
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
        <div className="border-b border-white/10 bg-gradient-to-b from-surface-850/40 to-transparent">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
            <SectionTitle as="h1" id="diagnostic-page-heading">
              {messages.diagnostic.pageTitle}
            </SectionTitle>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground-muted md:text-lg">
              {messages.diagnostic.pageSubtitle}
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <DiagnosticWizard messages={messages} />
        </div>
      </main>
      <Footer messages={messages} />
    </>
  );
}
