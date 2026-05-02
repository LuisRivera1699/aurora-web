import type { SiteMessages } from "@/content/messages/types";
import { MotionCard } from "@/components/MotionCard";
import { Reveal } from "@/components/Reveal";

export function ServicesSection({ messages }: { messages: SiteMessages }) {
  const { services } = messages;
  const diagnosticHref = `/${messages.locale}/diagnostic`;
  const contactHref = `/${messages.locale}`;

  return (
    <section
      id={services.id}
      className="scroll-mt-24 bg-surface-900 py-20 md:py-28"
      aria-labelledby={`${services.id}-heading`}
    >
      <div className="mx-auto max-w-6xl space-y-10 px-4 sm:space-y-12 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-4xl space-y-5 text-center">
            <p className="mx-auto inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-aurora-blue/90">
              {services.eyebrow}
            </p>
            <h2
              id={`${services.id}-heading`}
              className="mx-auto max-w-4xl font-display text-3xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-4xl md:text-5xl"
            >
              {services.title}
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-foreground-muted md:text-lg">
              {services.subtitle}
            </p>
          </div>
        </Reveal>

        <ul className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-8 xl:grid-cols-3 xl:gap-8">
          {services.items.map((item, i) => (
            <li key={item.title} className="flex min-w-0">
              <Reveal delay={0.05 * i} className="h-auto w-full lg:h-full">
                <MotionCard className="gradient-border-mask relative flex h-auto w-full flex-col overflow-hidden rounded-3xl bg-surface-card p-5 shadow-xl shadow-black/20 md:p-6 lg:h-full lg:min-h-[24rem] glow-hover">
                  <div
                    className="pointer-events-none absolute bottom-0 left-0 top-0 w-1 rounded-l-3xl bg-gradient-to-b from-aurora-purple/80 to-aurora-blue/80"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-aurora-blue/10 blur-3xl"
                    aria-hidden
                  />
                  <div className="relative flex h-full flex-col gap-5 pl-2 md:pl-3 lg:min-h-0 lg:flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-aurora-blue/70">
                      {messages.locale === "es" ? "Servicio" : "Service"}{" "}
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="font-display text-lg font-bold leading-tight text-foreground md:min-h-[3.6rem] md:text-[1.35rem]">
                      {item.title}
                    </h3>
                    <p className="text-pretty text-sm leading-relaxed text-foreground-muted md:text-base lg:flex-1">
                      {item.description}
                    </p>
                    <ul className="mt-auto flex flex-col items-start gap-2 pt-2">
                      {item.focus.map((focus) => (
                        <li
                          key={focus}
                          className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-medium text-foreground-muted"
                        >
                          {focus}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                      <a
                        href={`/${messages.locale}/services/${item.slug}`}
                        className="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-full border border-white/15 bg-white/[0.06] px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-white/25 hover:bg-white/10"
                      >
                        {item.detailsCtaLabel}
                      </a>
                      <a
                        href={`${contactHref}?service=${item.slug}#${messages.contact.id}`}
                        className="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-full bg-gradient-to-r from-aurora-purple to-aurora-blue px-3 py-2.5 text-sm font-semibold text-white shadow-lg shadow-aurora-blue/15 transition-[transform,box-shadow] duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-aurora-purple/20"
                      >
                        {item.contactCtaLabel}
                      </a>
                    </div>
                  </div>
                </MotionCard>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={0.18}>
          <div className="gradient-border-mask relative overflow-hidden rounded-3xl bg-surface-card p-6 shadow-xl shadow-black/20 md:flex md:items-center md:justify-between md:gap-8 md:p-8">
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-aurora-blue/15 to-transparent"
              aria-hidden
            />
            <p className="relative max-w-2xl text-lg font-semibold leading-snug text-foreground md:text-xl">
              {services.ctaText}
            </p>
            <a
              href={diagnosticHref}
              className="relative mt-5 inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-aurora-purple to-aurora-blue px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-aurora-blue/20 transition-[transform,box-shadow] duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-aurora-purple/25 md:mt-0"
            >
              {services.ctaLabel}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
