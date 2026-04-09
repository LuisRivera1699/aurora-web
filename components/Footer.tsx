import Image from "next/image";
import Link from "next/link";
import { navLinks, siteMeta } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 bg-surface-900 py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
        <div className="space-y-3">
          <Link
            href="#inicio"
            className="relative block h-14 w-14 shrink-0 sm:h-16 sm:w-16"
            aria-label={`${siteMeta.name} — ${siteMeta.tagline}, ir al inicio`}
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
        </div>
        <nav aria-label="Pie de página" className="flex flex-wrap gap-x-6 gap-y-2">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-foreground-muted hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <p className="mx-auto mt-10 max-w-6xl px-4 text-center text-xs text-foreground-muted sm:px-6 sm:text-left lg:px-8">
        © {year} {siteMeta.name}. {siteMeta.tagline}.
      </p>
    </footer>
  );
}
