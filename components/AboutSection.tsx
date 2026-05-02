import type { SiteMessages } from "@/content/messages/types";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";

function PrincipleIcon({ index }: { index: number }) {
  const common = "stroke-current";

  if (index === 0) {
    return (
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" aria-hidden>
        <rect className={common} x="9" y="14" width="30" height="22" rx="5" strokeWidth="2.5" />
        <path className={common} d="M16 22h16M16 28h9" strokeWidth="2.5" strokeLinecap="round" />
        <path
          className={common}
          d="M18 10v4M30 10v4M18 36v4M30 36v4"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" aria-hidden>
        <path
          className={common}
          d="M25 5 12 27h10l-2 16 16-25H25l0-13Z"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          className={common}
          d="M34 25v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10v-2"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" aria-hidden>
      <circle className={common} cx="24" cy="24" r="8" strokeWidth="2.5" />
      <path
        className={common}
        d="M24 6v6M24 36v6M6 24h6M36 24h6M11.5 11.5l4.2 4.2M32.3 32.3l4.2 4.2M36.5 11.5l-4.2 4.2M15.7 32.3l-4.2 4.2"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path className={common} d="M20 24h8M24 20v8" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function AboutSection({
  messages,
  titleAs = "h2",
}: {
  messages: SiteMessages;
  titleAs?: "h1" | "h2";
}) {
  const { about } = messages;
  const servicesHref = `/${messages.locale}#${messages.services.id}`;
  const contactHref = `/${messages.locale}#${messages.contact.id}`;
  const HeroTitle = titleAs;

  return (
    <section
      id={about.id}
      className="scroll-mt-24 border-t border-white/5 bg-surface-850 pb-20 md:pb-28"
      aria-labelledby={`${about.id}-heading`}
    >
      <div className="relative flex min-h-[58svh] items-center overflow-hidden border-b border-white/5 py-24 md:py-28">
        <Image
          src={about.image.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          priority={titleAs === "h1"}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-surface-900/92 via-surface-900/82 to-surface-850"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-tr from-aurora-purple/25 via-transparent to-aurora-blue/20"
          aria-hidden
        />
        <div
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-surface-850 to-transparent"
          aria-hidden
        />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="max-w-4xl space-y-6">
              <div className="relative w-full max-w-xs sm:max-w-sm">
                <div className="relative aspect-[923/184]">
                  <Image
                    src="/brand_assets/LOGO_WHITE.svg"
                    alt="AURORA - logotipo"
                    fill
                    className="object-contain object-left"
                    priority={titleAs === "h1"}
                    unoptimized
                  />
                </div>
              </div>
              <HeroTitle
                id={`${about.id}-heading`}
                className="max-w-3xl font-display text-3xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-4xl md:text-5xl"
              >
                {about.title}
              </HeroTitle>
              <p className="max-w-2xl text-lg leading-relaxed text-foreground-muted sm:text-xl">
                {about.subtitle}
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-16 px-4 pt-16 sm:px-6 md:pt-20 lg:px-8">
        <div className="space-y-8">
          <Reveal delay={0.08}>
            <div className="max-w-2xl space-y-4">
              <SectionTitle>{about.principles.title}</SectionTitle>
              <p className="text-base leading-relaxed text-foreground-muted md:text-lg">
                {about.principles.subtitle}
              </p>
            </div>
          </Reveal>

          <ul className="grid gap-5 lg:grid-cols-3">
            {about.principles.items.map((item, i) => (
              <li key={item.title}>
                <Reveal delay={0.1 + i * 0.05} className="h-full">
                  <div className="gradient-border-mask relative h-full overflow-hidden rounded-3xl bg-surface-card p-6 shadow-xl shadow-black/20 glow-hover md:p-7">
                    <div
                      className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-aurora-blue/10 blur-3xl"
                      aria-hidden
                    />
                    <div className="relative space-y-5">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-aurora-blue shadow-inner">
                        <PrincipleIcon index={i} />
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-display text-xl font-bold leading-tight text-foreground">
                          {item.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-foreground-muted md:text-base">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-8">
          <Reveal delay={0.12}>
            <div className="max-w-2xl space-y-4">
              <SectionTitle>{about.differentiators.title}</SectionTitle>
              <p className="text-base leading-relaxed text-foreground-muted md:text-lg">
                {about.differentiators.subtitle}
              </p>
            </div>
          </Reveal>

          <ul className="grid gap-4 md:grid-cols-2">
            {about.differentiators.items.map((item, i) => (
              <li key={item.title}>
                <Reveal delay={0.14 + i * 0.04} className="h-full">
                  <div className="gradient-border-mask relative h-full overflow-hidden rounded-3xl bg-surface-card p-6 shadow-xl shadow-black/20 glow-hover md:p-7">
                    <div
                      className="pointer-events-none absolute -right-20 top-0 h-40 w-40 rounded-full bg-aurora-purple/10 blur-3xl"
                      aria-hidden
                    />
                    <div className="relative flex gap-4">
                      <span className="mt-1 font-display text-sm font-bold text-aurora-blue/80">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="space-y-3">
                        <h3 className="font-display text-xl font-bold leading-tight text-foreground">
                          {item.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-foreground-muted md:text-base">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal delay={0.18}>
            <p className="gradient-border-mask rounded-3xl bg-surface-card px-6 py-5 text-center font-display text-lg font-normal leading-snug text-foreground shadow-xl shadow-black/20 md:px-8 md:text-[1.375rem]">
              {about.differentiators.closingLine}
            </p>
          </Reveal>
        </div>

        <div className="space-y-8">
          <Reveal>
            <SectionTitle>{about.experienceTitle}</SectionTitle>
          </Reveal>
          <ul className="grid gap-5 md:grid-cols-2">
            {about.stats.map((s, i) => (
              <li key={s.label}>
                <Reveal delay={0.12 + i * 0.05} className="h-full">
                  <div className="gradient-border-mask relative h-full overflow-hidden rounded-3xl bg-surface-card p-6 shadow-xl shadow-black/20 glow-hover md:p-8">
                    <span
                      className="pointer-events-none absolute -right-3 -top-8 font-display text-9xl font-bold text-aurora-blue/[0.06]"
                      aria-hidden
                    >
                      &gt;
                    </span>
                    <div className="relative space-y-5">
                      <p className="font-display text-5xl font-bold tracking-tight text-foreground md:text-6xl">
                        {s.prefix ? (
                          <span className="gradient-text" aria-hidden>
                            {s.prefix}
                          </span>
                        ) : null}
                        {s.value}
                      </p>
                      <div className="space-y-3">
                        <h3 className="font-display text-xl font-bold leading-tight text-foreground md:text-2xl">
                          {s.label}
                        </h3>
                        <p className="text-sm leading-relaxed text-foreground-muted md:text-base">
                          {s.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <Reveal delay={0.14}>
          <div className="gradient-border-mask relative overflow-hidden rounded-3xl bg-surface-card p-6 shadow-2xl shadow-black/25 md:p-8">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-aurora-blue/15 blur-3xl"
              aria-hidden
            />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl space-y-3">
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  <span className="gradient-text" aria-hidden>
                    &gt;{" "}
                  </span>
                  {about.closing.title}
                </h2>
                <p className="text-base leading-relaxed text-foreground-muted">{about.closing.description}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
                <Link
                  href={servicesHref}
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-white/25 hover:bg-white/10"
                >
                  {about.closing.servicesCta}
                </Link>
                <Link
                  href={contactHref}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-aurora-purple to-aurora-blue px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-aurora-blue/20 transition-[transform,box-shadow] duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-aurora-purple/25"
                >
                  {about.closing.contactCta}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
