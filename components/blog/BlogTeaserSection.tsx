import type { SiteMessages } from "@/content/messages/types";
import { latestArticles } from "@/lib/articles/server";
import Link from "next/link";
import { BlogCard } from "@/components/blog/BlogCard";

type BlogTeaserSectionProps = {
  locale: "es" | "en";
  messages: SiteMessages;
};

export async function BlogTeaserSection({ locale, messages }: BlogTeaserSectionProps) {
  const posts = await latestArticles(3);
  if (posts.length === 0) return null;

  return (
    <section
      className="border-y border-white/10 bg-surface-850/30 py-16 sm:py-20"
      aria-labelledby="blog-teaser-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-aurora-purple/90">
              {messages.blog.navLabel}
            </p>
            <h2
              id="blog-teaser-heading"
              className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              {messages.blog.sectionTitle}
            </h2>
            <p className="max-w-xl text-foreground-muted">{messages.blog.sectionSubtitle}</p>
          </div>
          <Link
            href={`/${locale}/blog`}
            className="gradient-border-mask inline-flex shrink-0 items-center justify-center rounded-full bg-surface-card px-5 py-2.5 text-sm font-semibold text-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {messages.blog.viewAll}
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((article, i) => (
            <BlogCard
              key={article.id}
              article={article}
              locale={locale}
              messages={messages}
              priorityImage={i === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
