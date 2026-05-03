"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { SiteMessages } from "@/content/messages/types";
import { pushClickCtaEvent } from "@/lib/gtm-events";

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

const navListVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.055, delayChildren: 0.14 },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, x: 18 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, damping: 28, stiffness: 380 },
  },
};

type MobileDrawerProps = {
  menuOpen: boolean;
  onClose: () => void;
  messages: SiteMessages;
  panelTitleId: string;
  localePrefix: string;
};

function resolveNavHref(href: string, localePrefix: string) {
  if (href.startsWith("#")) return `${localePrefix}${href}`;
  return href;
}

function isServicesNavItem(href: string) {
  return href === "#servicios" || href === "#services";
}

function isContactNavItem(href: string) {
  return href === "#contacto" || href === "#contact";
}

function resolveServiceHref(localePrefix: string, slug: string) {
  return `${localePrefix}/services/${slug}`;
}

function MobileDrawer({ menuOpen, onClose, messages, panelTitleId, localePrefix }: MobileDrawerProps) {
  const { navLinks, services, siteMeta, siteHeader } = messages;
  const homeHref = `${localePrefix}#inicio`;
  const reduceMotion = useReducedMotion();

  const backdropTransition = reduceMotion ? { duration: 0.15 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };
  const panelTransition = reduceMotion
    ? { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const }
    : { type: "spring" as const, damping: 32, stiffness: 400, mass: 0.85 };

  const listVariants = reduceMotion
    ? { hidden: { opacity: 1 }, show: { opacity: 1, transition: { staggerChildren: 0 } } }
    : navListVariants;
  const itemVariantsResolved = reduceMotion
    ? { hidden: { opacity: 1, x: 0 }, show: { opacity: 1, x: 0 } }
    : navItemVariants;

  return (
    <AnimatePresence>
      {menuOpen && (
        <>
          <motion.button
            key="mobile-nav-backdrop"
            type="button"
            className="fixed inset-0 z-[100] bg-[#030308]/65 backdrop-blur-md md:hidden"
            aria-label={siteHeader.menuCloseAria}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
          />

          <motion.aside
            key="mobile-nav-panel"
            id="site-mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby={panelTitleId}
            className="fixed inset-y-0 right-0 z-[101] flex w-[min(100%,22rem)] flex-col overflow-hidden border-l border-white/15 shadow-[0_0_0_1px_rgba(255,255,255,0.06),-24px_0_80px_rgba(0,0,0,0.55)] md:hidden"
            initial={reduceMotion ? { x: "100%" } : { x: "104%" }}
            animate={{ x: 0 }}
            exit={reduceMotion ? { x: "100%" } : { x: "104%" }}
            transition={panelTransition}
          >
            <div className="pointer-events-none absolute inset-0 bg-surface-900/92 backdrop-blur-2xl" />
            <div className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-aurora-purple/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-20 h-56 w-56 rounded-full bg-aurora-blue/20 blur-3xl" />
            <div className="pointer-events-none absolute top-1/3 right-0 h-32 w-32 rounded-full bg-aurora-purple/15 blur-2xl" />

            <div className="relative border-b border-white/10 bg-gradient-to-b from-white/[0.09] to-transparent px-4 pb-4 pt-5">
              <div className="flex items-start justify-between gap-3">
                <Link
                  href={homeHref}
                  id={panelTitleId}
                  className="relative block w-[min(100%,11rem)] shrink-0 pt-0.5 opacity-95 transition-opacity hover:opacity-100 focus-visible:opacity-100"
                  onClick={onClose}
                >
                  <Image
                    src="/brand_assets/LOGO_WHITE.svg"
                    alt={siteMeta.name}
                    width={176}
                    height={44}
                    className="h-8 w-auto max-w-[11rem] object-contain object-left sm:h-9"
                    unoptimized
                    priority
                  />
                </Link>
                <motion.button
                  type="button"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors hover:border-white/30 hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aurora-blue/60"
                  aria-label={siteHeader.menuCloseAria}
                  onClick={onClose}
                  whileTap={{ scale: 0.94 }}
                >
                  <CloseIcon className="h-5 w-5" />
                </motion.button>
              </div>
              <p className="mt-3 max-w-[14rem] text-xs leading-relaxed text-foreground-muted/90">
                {siteMeta.tagline}
              </p>
            </div>

            <motion.nav
              className="relative flex flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-3 py-5"
              aria-label={siteHeader.navMobileAria}
              variants={listVariants}
              initial="hidden"
              animate="show"
            >
              {navLinks.map((item) =>
                isServicesNavItem(item.href) ? (
                  <motion.div key={item.href} variants={itemVariantsResolved} className="space-y-1.5">
                    <a
                      href={resolveNavHref(item.href, localePrefix)}
                      className="group relative flex items-center justify-between gap-3 overflow-hidden rounded-xl border border-transparent px-3 py-3.5 text-[15px] font-medium tracking-wide text-foreground-muted transition-[color,background-color,border-color,transform] hover:border-white/10 hover:bg-white/[0.06] hover:text-foreground active:scale-[0.985]"
                      onClick={onClose}
                    >
                      <span className="pointer-events-none absolute inset-y-2 left-0 w-0.5 rounded-full bg-gradient-to-b from-aurora-purple to-aurora-blue opacity-0 transition-opacity group-hover:opacity-100" />
                      <span className="pl-1">{item.label}</span>
                      <ChevronIcon className="h-[18px] w-[18px] shrink-0 rotate-90 text-foreground-muted/50 transition-all group-hover:text-aurora-blue/90" />
                    </a>
                    <div className="ml-3 space-y-1 border-l border-white/10 pl-3">
                      {services.items.map((service) => (
                        <a
                          key={service.slug}
                          href={resolveServiceHref(localePrefix, service.slug)}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground-muted/85 transition-colors hover:bg-white/[0.06] hover:text-foreground"
                          onClick={onClose}
                        >
                          {service.title}
                        </a>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.a
                    key={item.href}
                    href={resolveNavHref(item.href, localePrefix)}
                    variants={itemVariantsResolved}
                    className="group relative flex items-center justify-between gap-3 overflow-hidden rounded-xl border border-transparent px-3 py-3.5 text-[15px] font-medium tracking-wide text-foreground-muted transition-[color,background-color,border-color,transform] hover:border-white/10 hover:bg-white/[0.06] hover:text-foreground active:scale-[0.985]"
                    onClick={() => {
                      if (isContactNavItem(item.href)) pushClickCtaEvent("header");
                      onClose();
                    }}
                  >
                    <span className="pointer-events-none absolute inset-y-2 left-0 w-0.5 rounded-full bg-gradient-to-b from-aurora-purple to-aurora-blue opacity-0 transition-opacity group-hover:opacity-100" />
                    <span className="pl-1">{item.label}</span>
                    <ChevronIcon className="h-[18px] w-[18px] shrink-0 text-foreground-muted/50 transition-all group-hover:translate-x-0.5 group-hover:text-aurora-blue/90" />
                  </motion.a>
                ),
              )}
            </motion.nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function SiteHeader({ messages }: { messages: SiteMessages }) {
  const { services, siteMeta, siteHeader } = messages;
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelTitleId = useId();

  useEffect(() => setMounted(true), []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, closeMenu]);

  const localePrefix = `/${messages.locale}`;
  const homeHref = `${localePrefix}#inicio`;
  const ctaHref = `${localePrefix}/diagnostic`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface-900/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-3 py-2 sm:px-6 md:flex-row md:items-center md:gap-3 md:py-0 lg:px-8">
        <div className="flex h-12 min-h-12 w-full items-center justify-between gap-2 sm:h-14 sm:gap-3 md:h-16 md:min-h-0 md:flex-1">
          <Link
            href={homeHref}
            className="relative block h-9 w-9 shrink-0 opacity-90 transition-opacity hover:opacity-100 focus-visible:opacity-100 sm:h-10 sm:w-10"
            aria-label={`${siteMeta.name} — ${siteMeta.tagline}, ir al inicio`}
            onClick={closeMenu}
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
            className="ml-auto hidden min-w-0 justify-end gap-0.5 overflow-visible py-1 md:flex md:items-center md:gap-1"
          >
            {messages.navLinks.map((item) =>
              isServicesNavItem(item.href) ? (
                <div key={item.href} className="group relative shrink-0">
                  <a
                    href={resolveNavHref(item.href, localePrefix)}
                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-medium text-foreground-muted transition-colors hover:bg-white/5 hover:text-foreground focus-visible:bg-white/5 focus-visible:text-foreground lg:px-3"
                  >
                    {item.label}
                    <ChevronIcon className="h-3.5 w-3.5 rotate-90 text-foreground-muted/60 transition-colors group-hover:text-aurora-blue/90" />
                  </a>
                  <div className="invisible absolute left-1/2 top-full z-50 mt-3 w-80 -translate-x-1/2 rounded-2xl border border-white/10 bg-surface-900/95 p-2 opacity-0 shadow-2xl shadow-black/40 backdrop-blur-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    <div
                      className="pointer-events-none absolute inset-x-6 -top-px h-px bg-gradient-to-r from-transparent via-aurora-blue/70 to-transparent"
                      aria-hidden
                    />
                    {services.items.map((service) => (
                      <a
                        key={service.slug}
                        href={resolveServiceHref(localePrefix, service.slug)}
                        className="group/item block rounded-xl px-3 py-3 transition-colors hover:bg-white/[0.06] focus-visible:bg-white/[0.06]"
                      >
                        <span className="block text-sm font-semibold text-foreground transition-colors group-hover/item:text-aurora-blue">
                          {service.title}
                        </span>
                        <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-foreground-muted">
                          {service.description}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <a
                  key={item.href}
                  href={resolveNavHref(item.href, localePrefix)}
                  onClick={() => {
                    if (isContactNavItem(item.href)) pushClickCtaEvent("header");
                  }}
                  className="shrink-0 rounded-lg px-2.5 py-2 text-sm font-medium text-foreground-muted transition-colors hover:bg-white/5 hover:text-foreground lg:px-3"
                >
                  {item.label}
                </a>
              ),
            )}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <LanguageSwitcher
              ariaLabel={siteHeader.languageSwitcherAria}
              labelEs={siteHeader.languageEs}
              labelEn={siteHeader.languageEn}
            />
            <button
              ref={menuButtonRef}
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-foreground transition-colors hover:bg-white/10 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
              aria-expanded={menuOpen}
              aria-controls="site-mobile-drawer"
              aria-label={menuOpen ? siteHeader.menuCloseAria : siteHeader.menuOpenAria}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
            <a
              href={ctaHref}
              className="gradient-border-mask relative hidden min-w-0 max-w-[min(100%,14rem)] shrink-0 items-center justify-center truncate rounded-full bg-surface-card px-4 py-2 text-sm font-semibold text-foreground transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] md:inline-flex lg:max-w-none lg:px-5"
            >
              <span className="truncate">{siteHeader.ctaPrimary}</span>
            </a>
          </div>
        </div>

        <a
          href={ctaHref}
          className="gradient-border-mask relative flex w-full shrink-0 items-center justify-center rounded-full bg-surface-card px-4 py-2.5 text-center text-sm font-semibold text-foreground transition-transform duration-300 active:scale-[0.99] md:hidden"
        >
          {siteHeader.ctaPrimary}
        </a>
      </div>

      {mounted
        ? createPortal(
            <MobileDrawer
              menuOpen={menuOpen}
              onClose={closeMenu}
              messages={messages}
              panelTitleId={panelTitleId}
              localePrefix={localePrefix}
            />,
            document.body,
          )
        : null}
    </header>
  );
}
