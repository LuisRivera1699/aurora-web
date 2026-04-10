import { siFigma } from "simple-icons";
import type { SiteMessages } from "@/content/messages/types";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";

function FigmaMark({ className }: { className?: string }) {
  const { path, hex } = siFigma;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill={`#${hex}`} d={path} />
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
              <SectionTitle id={`${portfolio.id}-heading`}>{portfolio.title}</SectionTitle>
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
                <div className="flex flex-col items-center gap-8 text-center">
                  <div className="rounded-2xl bg-white p-7 shadow-lg ring-1 ring-black/5">
                    <FigmaMark className="h-14 w-14 md:h-16 md:w-16" />
                  </div>
                  <p className="max-w-sm text-sm leading-relaxed text-foreground-muted">
                    {portfolio.cardLine}
                  </p>
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
