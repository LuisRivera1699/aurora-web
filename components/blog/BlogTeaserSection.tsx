import type { SiteMessages } from "@/content/messages/types";
import { latestArticles } from "@/lib/articles/server";
import Link from "next/link";
import { BlogCard } from "@/components/blog/BlogCard";
import { SectionTitle } from "@/components/SectionTitle";

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
        <div className="mb-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-6">
            <SectionTitle id="blog-teaser-heading">{messages.blog.sectionTitle}</SectionTitle>
            <p className="max-w-xl text-base leading-relaxed text-foreground-muted md:text-lg">
              {messages.blog.sectionSubtitle}
            </p>
          </div>
          <Link
            href={`/${locale}/blog`}
            className="gradient-border-mask inline-flex shrink-0 items-center justify-center self-start rounded-full bg-surface-card px-5 py-2.5 text-sm font-semibold text-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] sm:self-auto"
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
