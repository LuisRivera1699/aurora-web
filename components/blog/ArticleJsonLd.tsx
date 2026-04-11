import type { ArticleDoc } from "@/lib/articles/types";

type ArticleJsonLdProps = {
  article: ArticleDoc;
  locale: "es" | "en";
  canonicalUrl: string;
};

export function ArticleJsonLd({ article, locale, canonicalUrl }: ArticleJsonLdProps) {
  const headline = locale === "es" ? article.title_es : article.title_en;
  const description = locale === "es" ? article.summary_es : article.summary_en;
  const datePublished = article.createdAt?.toISOString() ?? undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    description,
    datePublished,
    dateModified: datePublished,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    url: canonicalUrl,
    image: article.image_url ? [article.image_url] : undefined,
    author: {
      "@type": "Organization",
      name: "AURORA",
    },
    publisher: {
      "@type": "Organization",
      name: "AURORA",
    },
    inLanguage: locale === "es" ? "es-ES" : "en-US",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
