import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { SectionTitle } from "@/components/SectionTitle";
import { BlogCard } from "@/components/blog/BlogCard";
import { getMessages, isLocale } from "@/content/getMessages";
import { listArticles } from "@/lib/articles/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 120;

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
    title: m.blog.pageTitle,
    description: m.blog.pageDescription,
    alternates: {
      canonical: `${base.origin}/${locale}/blog`,
      languages: {
        es: `${base.origin}/es/blog`,
        en: `${base.origin}/en/blog`,
        "x-default": `${base.origin}/en/blog`,
      },
    },
    openGraph: {
      title: `${m.blog.pageTitle} · ${m.siteMeta.name}`,
      description: m.blog.pageDescription,
      url: `${base.origin}/${locale}/blog`,
      locale: locale === "es" ? "es_ES" : "en_US",
      type: "website",
    },
  };
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);
  const articles = await listArticles();

  return (
    <>
      <SiteHeader messages={messages} />
      <main className="flex-1">
        <div className="border-b border-white/10 bg-gradient-to-b from-surface-850/50 to-transparent">
          <div className="mx-auto max-w-6xl space-y-6 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <SectionTitle as="h1" id="blog-heading">
              {messages.blog.pageTitle}
            </SectionTitle>
            <p className="max-w-2xl text-base leading-relaxed text-foreground-muted md:text-lg">
              {messages.blog.pageDescription}
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          {articles.length === 0 ? (
            <p className="text-center text-foreground-muted">{messages.blog.emptyList}</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, i) => (
                <BlogCard
                  key={article.id}
                  article={article}
                  locale={locale}
                  messages={messages}
                  priorityImage={i < 2}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer messages={messages} />
    </>
  );
}
