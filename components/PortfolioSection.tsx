import type { SiteMessages } from "@/content/messages/types";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";

function PortfolioMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <rect x="7" y="10" width="34" height="28" rx="8" stroke="currentColor" strokeWidth="2.5" />
      <path d="M15 20h18M15 27h11M31 27h2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M34 34l5-5M39 29v5M39 29h-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PortfolioSection({ messages }: { messages: SiteMessages }) {
  const { portfolio } = messages;
  return (
    <section
      id={portfolio.id}
      className="scroll-mt-24 border-t border-white/5 bg-surface-850 py-20 md:py-28"
      aria-labelledby={`${portfolio.id}-heading`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
            <Reveal>
              <div className="space-y-5">
                <SectionTitle id={`${portfolio.id}-heading`}>
                  {portfolio.title}
                </SectionTitle>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="max-w-xl text-base leading-relaxed text-foreground-muted md:text-lg">
                {portfolio.description}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-sm text-foreground-muted/85">
                {portfolio.hint}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.08}>
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-aurora-purple/20 via-transparent to-aurora-blue/20 blur-2xl"
                aria-hidden
              />
              <div className="gradient-border-mask relative overflow-hidden rounded-3xl bg-surface-card p-8 shadow-2xl shadow-black/30 md:p-10">
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-aurora-blue/15 blur-3xl"
                  aria-hidden
                />
                <div className="relative flex flex-col gap-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-aurora-blue shadow-inner">
                      <PortfolioMark className="h-9 w-9" />
                    </div>
                    <p className="text-base font-semibold leading-snug text-foreground md:text-lg">
                      {portfolio.cardLine}
                    </p>
                  </div>

                  <ul className="grid gap-3">
                    {portfolio.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-foreground-muted"
                      >
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={portfolio.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-aurora-purple to-aurora-blue px-8 py-4 text-base font-semibold text-white shadow-lg shadow-aurora-blue/25 transition-[transform,box-shadow] duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-aurora-purple/20 sm:w-auto"
                  >
                    {portfolio.ctaLabel}
                    <span className="ml-2 inline-block translate-y-px" aria-hidden>
                      ↗
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
