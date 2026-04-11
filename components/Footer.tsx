import Image from "next/image";
import Link from "next/link";
import { siInstagram } from "simple-icons";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { SiteMessages } from "@/content/messages/types";

/** Simple Icons no exporta LinkedIn en esta versión; path oficial 24×24 (marca LinkedIn). */
const linkedInPath =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

function fillFooterTemplate(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? "");
}

function resolveNavHref(href: string, locale: string) {
  if (href.startsWith("#")) return `/${locale}${href}`;
  return href;
}

export function Footer({ messages }: { messages: SiteMessages }) {
  const { navLinks, siteMeta, socialLinks, footer, siteHeader } = messages;
  const localePrefix = `/${messages.locale}`;
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 bg-surface-900 py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
        <div className="space-y-4">
          <Link
            href={`${localePrefix}#inicio`}
            className="relative block h-14 w-14 shrink-0 sm:h-16 sm:w-16"
            aria-label={fillFooterTemplate(footer.homeLinkAria, {
              name: siteMeta.name,
              tagline: siteMeta.tagline,
            })}
          >
            <Image
              src="/brand_assets/ICON_WHITE.svg"
              alt=""
              fill
              className="object-contain object-center"
              sizes="64px"
              unoptimized
            />
          </Link>
          <p className="max-w-sm text-sm text-foreground-muted">{siteMeta.description}</p>
          <ul className="flex flex-wrap items-center gap-3">
            {socialLinks.map((item) => {
              const aria =
                item.label === "Instagram" && "handle" in item
                  ? fillFooterTemplate(footer.socialAriaInstagram, {
                      handle: item.handle,
                    })
                  : fillFooterTemplate(footer.socialAriaLinkedIn, {
                      brand: siteMeta.name,
                    });
              const path = item.label === "Instagram" ? siInstagram.path : linkedInPath;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-foreground-muted transition-colors hover:border-white/25 hover:bg-white/10 hover:text-foreground"
                    aria-label={aria}
                  >
                    <svg
                      role="img"
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d={path} />
                    </svg>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <nav aria-label={footer.navAria} className="flex flex-wrap gap-x-6 gap-y-2">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={resolveNavHref(item.href, messages.locale)}
              className="text-sm text-foreground-muted hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-center text-xs text-foreground-muted sm:text-left">
          © {year} {siteMeta.name}. {siteMeta.tagline}.
        </p>
        <LanguageSwitcher
          variant="footer"
          ariaLabel={siteHeader.languageSwitcherAria}
          labelEs={siteHeader.languageEs}
          labelEn={siteHeader.languageEn}
        />
      </div>
    </footer>
  );
}
