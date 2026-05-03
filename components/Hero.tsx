import Image from "next/image";
import Link from "next/link";
import type { SiteMessages } from "@/content/messages/types";
import { Reveal } from "@/components/Reveal";

export function Hero({ messages }: { messages: SiteMessages }) {
  const { hero, services } = messages;
  const contactHref = `#${messages.contact.id}`;
  return (
    <section
      id="inicio"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-8 sm:py-10 md:py-16 lg:py-24"
      aria-labelledby="hero-heading"
    >
      <Image
        src={hero.backgroundImage.src}
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-surface-900/95 via-surface-900/88 to-surface-900"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-tr from-aurora-purple/25 via-transparent to-aurora-blue/20"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:gap-8 sm:px-6 md:gap-10 lg:px-8">
        <Reveal>
          <div className="relative mx-auto w-full max-w-2xl md:mx-0">
            <div className="relative aspect-[923/184] w-full max-w-lg md:max-w-xl">
              <Image
                src="/brand_assets/LOGO_WHITE.svg"
                alt="AURORA — logotipo"
                fill
                className="object-contain object-left"
                priority
                unoptimized
              />
            </div>
          </div>
        </Reveal>

        <div className="max-w-2xl space-y-6 lg:max-w-4xl xl:max-w-5xl">
          <Reveal delay={0.08}>
            <h1
              id="hero-heading"
              className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              {hero.headline}
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-lg leading-relaxed text-foreground-muted sm:text-xl">
              {hero.subline}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={contactHref}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-aurora-purple to-aurora-blue px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-aurora-blue/20 transition-[transform,box-shadow] duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-aurora-purple/25"
              >
                {hero.ctaPrimary}
              </Link>
              <a
                href={`#${services.id}`}
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-base font-medium text-foreground backdrop-blur-sm transition-colors hover:border-white/35 hover:bg-white/10"
              >
                {hero.ctaSecondary}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
