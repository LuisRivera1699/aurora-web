import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { SiteMessages } from "@/content/messages/types";

export function SiteHeader({ messages }: { messages: SiteMessages }) {
  const { navLinks, siteMeta, siteHeader } = messages;
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface-900/75 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-3 sm:px-6 lg:px-8">
        <Link
          href="#inicio"
          className="relative block h-9 w-9 shrink-0 opacity-90 transition-opacity hover:opacity-100 focus-visible:opacity-100 sm:h-10 sm:w-10"
          aria-label={`${siteMeta.name} — ${siteMeta.tagline}, ir al inicio`}
        >
          <Image
            src="/brand_assets/ICON_WHITE.svg"
            alt=""
            fill
            className="object-contain object-center"
            sizes="40px"
            priority
            unoptimized
          />
        </Link>
        <nav
          aria-label="Principal"
          className="-mx-1 hidden max-w-[52%] gap-0.5 overflow-x-auto overflow-y-hidden py-1 md:flex md:max-w-none md:items-center md:gap-1 md:overflow-visible"
        >
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-lg px-2.5 py-2 text-sm font-medium text-foreground-muted transition-colors hover:bg-white/5 hover:text-foreground lg:px-3"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LanguageSwitcher
            ariaLabel={siteHeader.languageSwitcherAria}
            labelEs={siteHeader.languageEs}
            labelEn={siteHeader.languageEn}
          />
          <a
            href={`#${messages.contact.id}`}
            className="gradient-border-mask relative inline-flex max-w-[38%] shrink-0 items-center justify-center truncate rounded-full bg-surface-card px-3 py-2 text-xs font-semibold text-foreground transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] sm:max-w-none sm:px-5 sm:text-sm"
          >
            <span className="truncate sm:whitespace-normal">{siteHeader.ctaPrimary}</span>
          </a>
        </div>
      </div>
        <nav
          aria-label={siteHeader.navMobileAria}
        className="flex gap-1 overflow-x-auto overscroll-x-contain border-t border-white/5 px-3 py-1 md:hidden [-webkit-overflow-scrolling:touch]"
      >
        {navLinks.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-foreground-muted hover:bg-white/10 hover:text-foreground"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
