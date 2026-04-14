import Link from "next/link";
import type { SiteMessages } from "@/content/messages/types";

type DiagnosticPromoSectionProps = {
  locale: "es" | "en";
  messages: SiteMessages;
};

export function DiagnosticPromoSection({ locale, messages }: DiagnosticPromoSectionProps) {
  const { diagnosticPromo } = messages;
  return (
    <section
      className="border-y border-white/10 bg-gradient-to-br from-surface-850/80 via-surface-900/40 to-surface-850/80 py-10 sm:py-12"
      aria-labelledby="diagnostic-promo-heading"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="space-y-2">
          <h2
            id="diagnostic-promo-heading"
            className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl"
          >
            {diagnosticPromo.title}
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-foreground-muted sm:text-base">
            {diagnosticPromo.description}
          </p>
        </div>
        <Link
          href={`/${locale}/diagnostic`}
          className="gradient-border-mask inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-surface-card px-6 py-3 text-sm font-semibold text-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] sm:px-8"
        >
          {diagnosticPromo.cta}
        </Link>
      </div>
    </section>
  );
}
