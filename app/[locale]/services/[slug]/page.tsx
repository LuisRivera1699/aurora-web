import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Footer } from "@/components/Footer";
import { SectionTitle } from "@/components/SectionTitle";
import { SiteHeader } from "@/components/SiteHeader";
import { getMessages, isLocale } from "@/content/getMessages";

const SERVICE_SLUG_ALIASES: Record<string, string> = {
  "automatizacion-procesos": "process-automation",
  "software-empresarial": "custom-business-software",
  "productos-digitales-mvps": "digital-products-mvps",
};

function resolveService(messages: ReturnType<typeof getMessages>, slug: string) {
  const canonicalSlug = SERVICE_SLUG_ALIASES[slug] ?? slug;
  const service = messages.services.items.find((item) => item.slug === canonicalSlug);
  return service ? { canonicalSlug, service } : null;
}

export function generateStaticParams() {
  return (["es", "en"] as const).flatMap((locale) => {
    const messages = getMessages(locale);
    return messages.services.items.map((service) => ({
      locale,
      slug: service.slug,
    }));
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);
  const resolved = resolveService(messages, slug);
  if (!resolved) notFound();
  const { service } = resolved;
  const base = new URL(messages.siteMeta.url);

  return {
    title: service.title,
    description: service.description,
    alternates: {
      canonical: `${base.origin}/${locale}/services/${service.slug}`,
      languages: {
        es: `${base.origin}/es/services/${service.slug}`,
        en: `${base.origin}/en/services/${service.slug}`,
        "x-default": `${base.origin}/en/services/${service.slug}`,
      },
    },
    openGraph: {
      title: `${service.title} · ${messages.siteMeta.name}`,
      description: service.description,
      url: `${base.origin}/${locale}/services/${service.slug}`,
      locale: locale === "es" ? "es_ES" : "en_US",
      type: "website",
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);
  const resolved = resolveService(messages, slug);
  if (!resolved) notFound();
  const { canonicalSlug, service } = resolved;
  if (slug !== canonicalSlug) redirect(`/${locale}/services/${canonicalSlug}`);

  return (
    <>
      <SiteHeader messages={messages} />
      <main className="flex-1">
        <section className="border-b border-white/10 bg-gradient-to-b from-surface-850/50 to-transparent">
          <div className="mx-auto max-w-6xl space-y-6 px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <p className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-aurora-blue/90">
              {messages.services.eyebrow}
            </p>
            <SectionTitle as="h1" id="service-heading">
              {service.title}
            </SectionTitle>
            <p className="max-w-2xl text-base leading-relaxed text-foreground-muted md:text-lg">
              {service.description}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="gradient-border-mask relative overflow-hidden rounded-3xl bg-surface-card p-6 shadow-xl shadow-black/20 md:p-8">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-aurora-blue/15 blur-3xl"
              aria-hidden
            />
            <div className="relative space-y-6">
              <p className="text-sm uppercase tracking-[0.24em] text-foreground-muted">
                {messages.locale === "es" ? "Contenido inicial" : "Initial content"}
              </p>
              <ul className="flex flex-wrap gap-2">
                {service.focus.map((focus) => (
                  <li
                    key={focus}
                    className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-medium text-foreground-muted"
                  >
                    {focus}
                  </li>
                ))}
              </ul>
              <p className="max-w-3xl text-base leading-relaxed text-foreground-muted">
                {messages.locale === "es"
                  ? "Esta página será desarrollada con más detalle en la siguiente etapa. Por ahora, dejamos el servicio publicado con su mensaje base, enfoque y rutas SEO listas."
                  : "This page will be expanded in the next stage. For now, the service is published with its base message, focus areas, and SEO-ready routes."}
              </p>
              <a
                href={`/${messages.locale}#${messages.contact.id}`}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-aurora-purple to-aurora-blue px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-aurora-blue/20 transition-[transform,box-shadow] duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-aurora-purple/25"
              >
                {service.contactCtaLabel}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer messages={messages} />
    </>
  );
}
