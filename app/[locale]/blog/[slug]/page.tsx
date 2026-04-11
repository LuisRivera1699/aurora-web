import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import { BlogMarkdown } from "@/components/blog/BlogMarkdown";
import { ArticleJsonLd } from "@/components/blog/ArticleJsonLd";
import { getMessages, isLocale } from "@/content/getMessages";
import { getArticleBySlug } from "@/lib/articles/server";
import { formatArticleDate, formatReadingMinutesLabel } from "@/lib/articles/format";
import { estimateReadingMinutes } from "@/lib/articles/reading-time";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const article = await getArticleBySlug(decodeURIComponent(slug));
  if (!article) notFound();
  const m = getMessages(locale);
  const base = new URL(m.siteMeta.url).origin;
  const title = locale === "es" ? article.title_es : article.title_en;
  const description = locale === "es" ? article.summary_es : article.summary_en;
  const canonical = `${base}/${locale}/blog/${article.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        es: `${base}/es/blog/${article.slug}`,
        en: `${base}/en/blog/${article.slug}`,
        "x-default": `${base}/en/blog/${article.slug}`,
      },
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      locale: locale === "es" ? "es_ES" : "en_US",
      publishedTime: article.createdAt?.toISOString(),
      images: article.image_url ? [{ url: article.image_url, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: article.image_url ? [article.image_url] : undefined,
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const article = await getArticleBySlug(decodeURIComponent(slug));
  if (!article) notFound();

  const messages = getMessages(locale);
  const title = locale === "es" ? article.title_es : article.title_en;
  const body = locale === "es" ? article.body_markdown_es : article.body_markdown_en;
  const auroraTake = locale === "es" ? article.aurora_take_es : article.aurora_take_en;
  const minutes = estimateReadingMinutes(body);
  const readLabel = formatReadingMinutesLabel(messages.blog.readingTimeMinutes, minutes);
  const dateStr = formatArticleDate(article.createdAt, locale);
  const base = new URL(messages.siteMeta.url).origin;
  const canonicalUrl = `${base}/${locale}/blog/${article.slug}`;

  const attr = article.image_attribution;
  const showAttr = attr && (attr.photographer || attr.page_url || attr.source);

  return (
    <>
      <ArticleJsonLd article={article} locale={locale} canonicalUrl={canonicalUrl} />
      <SiteHeader messages={messages} />
      <main className="flex-1">
        <article>
          <header className="relative border-b border-white/10">
            {article.image_url ? (
              <div className="relative h-[min(52vh,28rem)] w-full overflow-hidden bg-surface-800">
                <Image
                  src={article.image_url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/50 to-transparent" />
              </div>
            ) : (
              <div className="h-32 bg-gradient-to-r from-aurora-purple/30 to-aurora-blue/25 sm:h-40" />
            )}
            <div className="mx-auto max-w-3xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">
              <Link
                href={`/${locale}/blog`}
                className="inline-flex text-sm font-medium text-aurora-blue hover:text-foreground"
              >
                ← {messages.blog.pageTitle}
              </Link>
              <h1 className="mt-6 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
                {title}
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-foreground-muted">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-foreground">
                  {messages.blog.authorByline}
                </span>
                {dateStr ? (
                  <span>
                    {messages.blog.publishedLabel}:{" "}
                    <time dateTime={article.createdAt?.toISOString()}>{dateStr}</time>
                  </span>
                ) : null}
                <span>
                  {messages.blog.readingTime}: {readLabel}
                </span>
              </div>
              {showAttr ? (
                <p className="mt-4 text-xs text-foreground-muted/80">
                  {messages.blog.imageCreditPrefix}{" "}
                  {attr?.page_url ? (
                    <a
                      href={attr.page_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-aurora-blue hover:underline"
                    >
                      {attr.photographer ?? attr.source ?? "—"}
                    </a>
                  ) : (
                    <span>{attr?.photographer ?? attr?.source}</span>
                  )}
                  {attr?.source ? (
                    <span className="text-foreground-muted/60"> · {attr.source}</span>
                  ) : null}
                </p>
              ) : null}
            </div>
          </header>

          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
            <BlogMarkdown markdown={body} />

            {auroraTake?.trim() ? (
              <aside className="gradient-border-mask relative mt-12 rounded-2xl bg-surface-card/50 p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-aurora-purple/90">
                  {messages.blog.auroraTakeHeading}
                </p>
                <p className="mt-3 text-base leading-relaxed text-foreground-muted">{auroraTake}</p>
              </aside>
            ) : null}

            {article.sources && article.sources.length > 0 ? (
              <div className="mt-10 border-t border-white/10 pt-8">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">
                  {messages.blog.referencesHeading}
                </h2>
                <ul className="mt-4 space-y-2">
                  {article.sources.map((s, i) => (
                    <li key={`${s.url}-${i}`}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-aurora-blue hover:underline"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </article>
      </main>
      <Footer messages={messages} />
    </>
  );
}
