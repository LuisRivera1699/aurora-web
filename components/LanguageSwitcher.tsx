"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent } from "react";

type LanguageSwitcherProps = {
  ariaLabel: string;
  labelEs: string;
  labelEn: string;
  variant?: "header" | "footer";
};

export function LanguageSwitcher({
  ariaLabel,
  labelEs,
  labelEn,
  variant = "header",
}: LanguageSwitcherProps) {
  const pathname = usePathname() ?? "/es";
  const router = useRouter();
  const locale = pathname.startsWith("/en") ? "en" : "es";
  const rest = pathname.replace(/^\/(es|en)/, "") || "";

  const navigate = (target: "es" | "en", e: MouseEvent<HTMLAnchorElement>) => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (hash) {
      e.preventDefault();
      router.push(`/${target}${rest}${hash}`);
    }
  };

  const segment =
    variant === "header"
      ? "min-w-[2rem] px-2 py-1 text-[11px] font-semibold tracking-wide sm:min-w-[2.35rem] sm:px-2.5 sm:text-xs"
      : "min-w-[1.75rem] px-1.5 py-0.5 text-[11px] font-semibold sm:text-xs";

  const active = "bg-white/12 text-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.08)]";
  const inactive =
    "text-foreground-muted hover:bg-white/[0.06] hover:text-foreground focus-visible:text-foreground";

  const wrap =
    variant === "header"
      ? "inline-flex shrink-0 items-center rounded-full border border-white/15 bg-white/[0.04] p-0.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
      : "inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] p-0.5";

  return (
    <div className={wrap} role="group" aria-label={ariaLabel}>
      <Link
        href={`/es${rest}`}
        prefetch
        scroll={false}
        aria-current={locale === "es" ? "page" : undefined}
        title="Español"
        onClick={(e) => navigate("es", e)}
        className={`rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 ${segment} ${
          locale === "es" ? active : inactive
        }`}
      >
        {labelEs}
      </Link>
      <Link
        href={`/en${rest}`}
        prefetch
        scroll={false}
        aria-current={locale === "en" ? "page" : undefined}
        title="English"
        onClick={(e) => navigate("en", e)}
        className={`rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 ${segment} ${
          locale === "en" ? active : inactive
        }`}
      >
        {labelEn}
      </Link>
    </div>
  );
}
