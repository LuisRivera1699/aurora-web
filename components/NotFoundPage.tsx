import Link from "next/link";
import type { SiteMessages } from "@/content/messages/types";

export function NotFoundPage({ messages }: { messages: SiteMessages }) {
  const copy = messages.notFound;
  const localePrefix = `/${messages.locale}`;

  return (
    <>
      <main className="flex-1 overflow-hidden">
        <section className="relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden border-b border-white/10 bg-surface-900 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(133,67,154,0.28),transparent_34%),radial-gradient(circle_at_80%_18%,rgba(0,110,160,0.24),transparent_30%),linear-gradient(180deg,rgba(12,12,20,0.68),rgba(3,3,8,1))]"
            aria-hidden
          />
          <div className="absolute -left-24 top-1/3 h-64 w-64 rounded-full bg-aurora-purple/20 blur-3xl" aria-hidden />
          <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-aurora-blue/20 blur-3xl" aria-hidden />

          <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl">
              <p className="mb-4 font-display text-7xl font-bold leading-none tracking-tight text-white/10 sm:text-8xl md:text-9xl">
                404
              </p>
              <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                <span className="gradient-text" aria-hidden>
                  &gt;{" "}
                </span>
                {copy.title}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground-muted sm:text-xl">
                {copy.description}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href={localePrefix}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-aurora-purple to-aurora-blue px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-aurora-blue/20 transition-[transform,box-shadow] duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-aurora-purple/25"
                >
                  {copy.homeCta}
                </Link>
                <Link
                  href={`${localePrefix}#${messages.contact.id}`}
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-base font-medium text-foreground backdrop-blur-sm transition-colors hover:border-white/35 hover:bg-white/10"
                >
                  {copy.contactCta}
                </Link>
              </div>
            </div>

            <aside className="gradient-border-mask relative rounded-[2rem] bg-surface-card/80 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.35)] backdrop-blur sm:p-8">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/[0.08] to-transparent" aria-hidden />
              <div className="relative space-y-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-foreground-muted">
                  {copy.panelEyebrow}
                </p>
                <p className="font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                  {copy.panelTitle}
                </p>
                <p className="text-sm leading-relaxed text-foreground-muted">{copy.panelDescription}</p>
                <div className="grid gap-3">
                  <Link
                    href={`${localePrefix}/diagnostic`}
                    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-white/20 hover:bg-white/[0.08]"
                  >
                    <span>{copy.diagnosticLink}</span>
                    <span className="text-aurora-blue transition-transform group-hover:translate-x-1" aria-hidden>
                      -&gt;
                    </span>
                  </Link>
                  <Link
                    href={`${localePrefix}/blog`}
                    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-white/20 hover:bg-white/[0.08]"
                  >
                    <span>{copy.blogLink}</span>
                    <span className="text-aurora-blue transition-transform group-hover:translate-x-1" aria-hidden>
                      -&gt;
                    </span>
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
