import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CursorAurora } from "@/components/CursorAurora";
import { SiteMessagesProvider } from "@/components/SiteMessagesProvider";
import { getMessages, isLocale } from "@/content/getMessages";

export function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}

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
    metadataBase: base,
    title: {
      default: `${m.siteMeta.name} — ${m.siteMeta.tagline}`,
      template: `%s · ${m.siteMeta.name}`,
    },
    description: m.siteMeta.description,
    alternates: {
      canonical: `${base.origin}/${locale}`,
      languages: {
        es: `${base.origin}/es`,
        en: `${base.origin}/en`,
        "x-default": `${base.origin}/`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "es" ? "es_ES" : "en_US",
      url: `${base.origin}/${locale}`,
      siteName: m.siteMeta.name,
      title: `${m.siteMeta.name} — ${m.siteMeta.tagline}`,
      description: m.siteMeta.description,
      images: [
        {
          url: "/og-aurora.png",
          alt: `${m.siteMeta.name} — ${m.siteMeta.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${m.siteMeta.name} — ${m.siteMeta.tagline}`,
      description: m.siteMeta.description,
      images: ["/og-aurora.png"],
    },
    robots: { index: true, follow: true },
    icons: {
      icon: [{ url: "/brand_assets/ICON_WHITE.svg", type: "image/svg+xml" }],
      apple: [{ url: "/brand_assets/ICON_WHITE.svg", type: "image/svg+xml" }],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);
  return (
    <SiteMessagesProvider messages={messages}>
      <CursorAurora />
      <div className="relative z-10 flex min-h-full flex-col">{children}</div>
    </SiteMessagesProvider>
  );
}
