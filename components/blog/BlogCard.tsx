import Image from "next/image";
import Link from "next/link";
import type { SiteMessages } from "@/content/messages/types";
import type { ArticleDoc } from "@/lib/articles/types";
import { formatArticleDate, formatReadingMinutesLabel } from "@/lib/articles/format";
import { estimateReadingMinutes } from "@/lib/articles/reading-time";

type BlogCardProps = {
  article: ArticleDoc;
  locale: "es" | "en";
  messages: SiteMessages;
  priorityImage?: boolean;
};

export function BlogCard({ article, locale, messages, priorityImage }: BlogCardProps) {
  const title = locale === "es" ? article.title_es : article.title_en;
  const summary = locale === "es" ? article.summary_es : article.summary_en;
  const body = locale === "es" ? article.body_markdown_es : article.body_markdown_en;
  const minutes = estimateReadingMinutes(body);
  const href = `/${locale}/blog/${encodeURIComponent(article.slug)}`;
  const dateStr = formatArticleDate(article.createdAt, locale);
  const readLabel = formatReadingMinutesLabel(messages.blog.readingTimeMinutes, minutes);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface-card/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-colors hover:border-white/18 hover:bg-surface-card/60">
      <Link href={href} className="relative block aspect-[16/9] w-full overflow-hidden bg-surface-800">
        {article.image_url ? (
          <Image
            src={article.image_url}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={priorityImage}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-aurora-purple/25 to-aurora-blue/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-900/90 via-surface-900/20 to-transparent" />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground-muted">
          {dateStr ? <time dateTime={article.createdAt?.toISOString()}>{dateStr}</time> : null}
          <span className="text-white/25">·</span>
          <span>
            {messages.blog.readingTime}: {readLabel}
          </span>
        </div>
        <h2 className="font-display text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-white">
          <Link href={href}>{title}</Link>
        </h2>
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-foreground-muted">{summary}</p>
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-semibold text-aurora-blue transition-colors hover:text-foreground"
        >
          {messages.blog.readArticle}
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
