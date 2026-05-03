import type { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { SectionTitle } from "@/components/SectionTitle";
import { SiteHeader } from "@/components/SiteHeader";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/components/seo/StructuredData";
import { getMessages, isLocale } from "@/content/getMessages";

type ServicePageContent = {
  title: string;
  subtitle: string;
  primaryCta: string;
  seoDescription: string;
  problem: {
    title: string;
    body: string;
    bullets: string[];
  };
  solution: {
    title: string;
    body: string;
  };
  capabilities: {
    title: string;
    items: { title: string; description: string }[];
  };
  process: {
    title: string;
    steps: string[];
  };
  differentiator: {
    title: string;
    items: string[];
  };
  results?: {
    title: string;
    items: string[];
  };
  contact: {
    title: string;
    body: string;
    messageLabel: string;
    messagePlaceholder: string;
  };
};

const SERVICE_SLUG_ALIASES: Record<string, string> = {
  "automatizacion-procesos": "process-automation",
  "software-empresarial": "custom-business-software",
  "productos-digitales-mvps": "digital-products-mvps",
};

const PROCESS_AUTOMATION_HERO_IMAGE =
  "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=2400&q=80";

const CUSTOM_BUSINESS_SOFTWARE_HERO_IMAGE =
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2400&q=80";

const DIGITAL_PRODUCTS_MVPS_HERO_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=2400&q=80";

const SERVICE_HERO_IMAGES: Record<string, string> = {
  "process-automation": PROCESS_AUTOMATION_HERO_IMAGE,
  "custom-business-software": CUSTOM_BUSINESS_SOFTWARE_HERO_IMAGE,
  "digital-products-mvps": DIGITAL_PRODUCTS_MVPS_HERO_IMAGE,
};

const SERVICE_PAGE_CONTENT: Record<string, Record<"es" | "en", ServicePageContent>> = {
  "process-automation": {
  es: {
    title: "Automatiza procesos y elimina trabajo manual en tu empresa",
    subtitle:
      "Diseñamos e implementamos automatizaciones que conectan tus sistemas, reducen carga operativa y eliminan tareas repetitivas sin fricción.",
    primaryCta: "Evaluar automatización",
    seoDescription:
      "Automatiza procesos manuales, conecta herramientas y elimina tareas repetitivas con sistemas listos para operar en producción.",
    problem: {
      title: "El problema no es tu equipo. Son los procesos manuales.",
      body: "Muchas empresas pierden tiempo en tareas repetitivas, herramientas desconectadas y flujos operativos que dependen de intervención humana constante.",
      bullets: [
        "Excel como sistema central",
        "Procesos manuales repetidos cada día",
        "Herramientas que no se comunican entre sí",
        "Errores por trabajo manual",
      ],
    },
    solution: {
      title: "Convertimos procesos manuales en sistemas automáticos",
      body: "Diseñamos automatizaciones que conectan tus herramientas, eliminan trabajo manual y permiten que tu operación funcione de forma más eficiente y controlada.",
    },
    capabilities: {
      title: "¿Qué hacemos?",
      items: [
        {
          title: "Automatizamos tareas repetitivas",
          description: "Eliminamos procesos manuales que consumen tiempo diario.",
        },
        {
          title: "Conectamos tus sistemas",
          description: "Integramos herramientas como CRM, bases de datos y APIs.",
        },
        {
          title: "Incorporamos IA cuando aporta valor",
          description: "Usamos inteligencia artificial solo donde mejora eficiencia real.",
        },
      ],
    },
    process: {
      title: "¿Cómo implementamos automatización?",
      steps: [
        "Analizamos tus procesos actuales",
        "Detectamos puntos de fricción y trabajo manual",
        "Diseñamos automatización a medida",
        "Implementamos y conectamos sistemas",
        "Entregamos flujo operativo funcionando",
      ],
    },
    differentiator: {
      title: "¿Por qué Aurora?",
      items: [
        "No hacemos scripts aislados, construimos sistemas",
        "Enfocados en impacto operativo real",
        "Implementación rápida sin procesos largos",
        "Pensado para producción desde el día uno",
      ],
    },
    results: {
      title: "¿Qué obtienes al automatizar?",
      items: [
        "Menos carga operativa diaria",
        "Procesos que funcionan solos",
        "Menos errores humanos",
        "Más velocidad en ejecución",
      ],
    },
    contact: {
      title: "¿Tienes procesos que podrían automatizarse?",
      body: "Cuéntanos qué proceso quieres mejorar y te respondemos con una propuesta clara para automatizarlo.",
      messageLabel: "Proceso a automatizar",
      messagePlaceholder:
        "Describe el proceso actual, qué herramientas usas, qué tareas se repiten y dónde sientes más fricción.",
    },
  },
  en: {
    title: "Automate processes and eliminate manual work in your company",
    subtitle:
      "We design and implement automations that connect your systems, reduce operational load, and eliminate repetitive tasks without friction.",
    primaryCta: "Evaluate automation",
    seoDescription:
      "Automate manual processes, connect tools, and eliminate repetitive tasks with systems ready to operate in production.",
    problem: {
      title: "The problem is not your team. It is manual processes.",
      body: "Many companies lose time on repetitive tasks, disconnected tools, and operational flows that depend on constant human intervention.",
      bullets: [
        "Excel as the central system",
        "Manual processes repeated every day",
        "Tools that do not communicate with each other",
        "Errors caused by manual work",
      ],
    },
    solution: {
      title: "We turn manual processes into automated systems",
      body: "We design automations that connect your tools, eliminate manual work, and allow your operation to run with more efficiency and control.",
    },
    capabilities: {
      title: "What do we do?",
      items: [
        {
          title: "We automate repetitive tasks",
          description: "We eliminate manual processes that consume daily time.",
        },
        {
          title: "We connect your systems",
          description: "We integrate tools such as CRMs, databases, and APIs.",
        },
        {
          title: "We add AI when it creates value",
          description: "We use artificial intelligence only where it improves real efficiency.",
        },
      ],
    },
    process: {
      title: "How do we implement automation?",
      steps: [
        "We analyze your current processes",
        "We detect friction points and manual work",
        "We design custom automation",
        "We implement and connect systems",
        "We deliver a working operational flow",
      ],
    },
    differentiator: {
      title: "Why Aurora?",
      items: [
        "We do not build isolated scripts, we build systems",
        "Focused on real operational impact",
        "Fast implementation without long processes",
        "Designed for production from day one",
      ],
    },
    results: {
      title: "What do you get by automating?",
      items: [
        "Less daily operational load",
        "Processes that run on their own",
        "Fewer human errors",
        "More execution speed",
      ],
    },
    contact: {
      title: "Do you have processes that could be automated?",
      body: "Tell us which process you want to improve and we will reply with a clear proposal to automate it.",
      messageLabel: "Process to automate",
      messagePlaceholder:
        "Describe the current process, the tools you use, the tasks that repeat, and where you feel the most friction.",
    },
  },
  },
  "custom-business-software": {
    es: {
      title: "Construimos sistemas empresariales a medida listos para operar",
      subtitle:
        "Diseñamos y desarrollamos software que reemplaza herramientas dispersas por un sistema centralizado, con control total de tu operación y listo para producción en semanas.",
      primaryCta: "Evaluar proyecto",
      seoDescription:
        "Construimos software empresarial a medida para centralizar procesos, datos y operaciones en sistemas listos para producción.",
      problem: {
        title: "Tu operación no debería depender de herramientas desconectadas",
        body: "Muchas empresas operan con múltiples herramientas, Excel y procesos manuales que no escalan y generan pérdida de control.",
        bullets: [
          "Información dispersa en múltiples sistemas",
          "Procesos que dependen de intervención manual",
          "Falta de visibilidad en tiempo real",
          "Dificultad para escalar operación",
        ],
      },
      solution: {
        title: "Un solo sistema para controlar tu operación",
        body: "Diseñamos y construimos sistemas empresariales a medida que centralizan procesos, datos y operaciones en una sola plataforma.",
      },
      capabilities: {
        title: "¿Qué construimos?",
        items: [
          {
            title: "Sistemas internos de gestión",
            description: "Plataformas para controlar operaciones, equipos, flujos y procesos clave del negocio.",
          },
          {
            title: "Dashboards y control de datos",
            description: "Visibilidad en tiempo real sobre métricas, estados, actividad y desempeño operativo.",
          },
          {
            title: "Integraciones con herramientas existentes",
            description: "Conectamos CRM, APIs, bases de datos, sistemas externos y herramientas que ya usas.",
          },
          {
            title: "Automatización dentro del sistema",
            description: "Flujos automáticos que reducen trabajo manual y evitan tareas repetitivas.",
          },
          {
            title: "Webs informativas y ecommerce",
            description:
              "Experiencias web listas para comunicar, vender y operar con una base técnica sólida.",
          },
          {
            title: "Aplicaciones móviles a medida",
            description:
              "Apps internas o comerciales conectadas a tu operación, diseñadas para uso real en campo o clientes.",
          },
        ],
      },
      process: {
        title: "¿Cómo construimos tu sistema?",
        steps: [
          "Entendemos tu operación y necesidades",
          "Diseñamos la arquitectura del sistema",
          "Desarrollamos el sistema completo",
          "Integramos herramientas existentes",
          "Desplegamos en producción",
        ],
      },
      differentiator: {
        title: "¿Por qué Aurora?",
        items: [
          "Construimos sistemas completos, no módulos aislados",
          "Entregas en semanas, no ciclos largos",
          "Arquitectura pensada para escalar",
          "Sistemas listos para producción desde el inicio",
        ],
      },
      results: {
        title: "¿Qué cambia cuando tienes tu propio sistema?",
        items: [
          "Control total de la operación",
          "Reducción de dependencia de herramientas externas",
          "Visibilidad en tiempo real",
          "Capacidad de escalar sin fricción",
        ],
      },
      contact: {
        title: "¿Necesitas un sistema para tu operación?",
        body: "Cuéntanos qué estás construyendo o qué problema necesitas resolver. Te respondemos con una propuesta clara de sistema, alcance y tiempos.",
        messageLabel: "Sistema o problema a resolver",
        messagePlaceholder:
          "Describe qué operación quieres centralizar, qué herramientas usas hoy y qué resultado esperas del sistema.",
      },
    },
    en: {
      title: "We build custom business systems ready to operate",
      subtitle:
        "We design and develop software that replaces scattered tools with one centralized system, giving you full operational control and production-ready delivery in weeks.",
      primaryCta: "Evaluate project",
      seoDescription:
        "We build custom business software to centralize processes, data, and operations in production-ready systems.",
      problem: {
        title: "Your operation should not depend on disconnected tools",
        body: "Many companies run on multiple tools, spreadsheets, and manual processes that do not scale and create loss of control.",
        bullets: [
          "Information scattered across multiple systems",
          "Processes that depend on manual intervention",
          "Lack of real-time visibility",
          "Difficulty scaling operations",
        ],
      },
      solution: {
        title: "One system to control your operation",
        body: "We design and build custom business systems that centralize processes, data, and operations in a single platform.",
      },
      capabilities: {
        title: "What do we build?",
        items: [
          {
            title: "Internal management systems",
            description: "Platforms to control operations, teams, workflows, and key business processes.",
          },
          {
            title: "Dashboards and data control",
            description: "Real-time visibility into metrics, statuses, activity, and operational performance.",
          },
          {
            title: "Integrations with existing tools",
            description: "We connect CRMs, APIs, databases, external systems, and tools you already use.",
          },
          {
            title: "Automation inside the system",
            description: "Automated flows that reduce manual work and avoid repetitive tasks.",
          },
          {
            title: "Informational websites and ecommerce",
            description: "Web experiences ready to communicate, sell, and operate on a solid technical base.",
          },
          {
            title: "Custom mobile applications",
            description:
              "Internal or commercial apps connected to your operation, designed for real use by teams or customers.",
          },
        ],
      },
      process: {
        title: "How do we build your system?",
        steps: [
          "We understand your operation and needs",
          "We design the system architecture",
          "We develop the complete system",
          "We integrate existing tools",
          "We deploy to production",
        ],
      },
      differentiator: {
        title: "Why Aurora?",
        items: [
          "We build complete systems, not isolated modules",
          "Delivery in weeks, not long cycles",
          "Architecture designed to scale",
          "Systems ready for production from the start",
        ],
      },
      results: {
        title: "What changes when you have your own system?",
        items: [
          "Full control of the operation",
          "Less dependency on external tools",
          "Real-time visibility",
          "Ability to scale without friction",
        ],
      },
      contact: {
        title: "Do you need a system for your operation?",
        body: "Tell us what you are building or what problem you need to solve. We will reply with a clear proposal for the system, scope, and timeline.",
        messageLabel: "System or problem to solve",
        messagePlaceholder:
          "Describe what operation you want to centralize, what tools you use today, and what outcome you expect from the system.",
      },
    },
  },
  "digital-products-mvps": {
    es: {
      title: "Convierte tu idea en un producto funcional en semanas",
      subtitle:
        "Diseñamos y desarrollamos MVPs listos para producción que te permiten validar tu producto, iterar rápido y tomar decisiones con datos reales.",
      primaryCta: "Evaluar mi idea",
      seoDescription:
        "Construimos MVPs y productos digitales listos para producción para validar ideas rápido, reducir riesgo e iterar con usuarios reales.",
      problem: {
        title: "Construir un producto no debería tomar meses sin validación",
        body: "Muchas ideas se quedan estancadas por procesos largos, desarrollo innecesario o falta de claridad sobre qué construir primero.",
        bullets: [
          "Meses de desarrollo sin feedback real",
          "Sobreconstrucción de funcionalidades",
          "Incertidumbre sobre el mercado",
          "Falta de una primera versión usable",
        ],
      },
      solution: {
        title: "Construimos la primera versión que realmente necesitas",
        body: "Diseñamos y desarrollamos MVPs enfocados en lo esencial: una versión funcional lista para usuarios reales que permite validar el producto rápidamente.",
      },
      capabilities: {
        title: "¿Qué incluye un MVP?",
        items: [
          {
            title: "Producto funcional completo",
            description: "No entregamos un prototipo vacío, sino un sistema usable por usuarios reales.",
          },
          {
            title: "Enfoque en funcionalidades clave",
            description: "Construimos solo lo necesario para validar la propuesta y aprender rápido.",
          },
          {
            title: "Desarrollo rápido",
            description: "Priorizamos entregas en semanas con alcance claro y ejecución enfocada.",
          },
          {
            title: "Base para iterar y escalar",
            description: "Dejamos una base técnica preparada para evolucionar el producto después de validar.",
          },
        ],
      },
      process: {
        title: "¿Cómo construimos tu MVP?",
        steps: [
          "Definimos el alcance mínimo necesario",
          "Diseñamos el producto",
          "Desarrollamos el MVP",
          "Lo llevamos a producción",
          "Iteramos según feedback",
        ],
      },
      differentiator: {
        title: "¿Por qué Aurora?",
        items: [
          "No construimos prototipos vacíos, entregamos productos funcionales",
          "Priorizamos velocidad sin perder calidad",
          "Enfoque en validación real, no en features",
          "Sistemas listos para evolucionar",
        ],
      },
      results: {
        title: "¿Qué obtienes con tu MVP?",
        items: [
          "Un producto funcional listo para usuarios",
          "Validación real del mercado",
          "Reducción de riesgo antes de escalar",
          "Base para crecer el producto",
        ],
      },
      contact: {
        title: "¿Tienes una idea que quieres validar?",
        body: "Cuéntanos qué estás construyendo y te ayudamos a convertirlo en un producto funcional en el menor tiempo posible.",
        messageLabel: "Idea o producto a validar",
        messagePlaceholder:
          "Describe tu idea, para quién es, qué problema resuelve y qué necesitas validar primero.",
      },
    },
    en: {
      title: "Turn your idea into a functional product in weeks",
      subtitle:
        "We design and develop production-ready MVPs that help you validate your product, iterate fast, and make decisions with real data.",
      primaryCta: "Evaluate my idea",
      seoDescription:
        "We build MVPs and digital products ready for production so you can validate ideas fast, reduce risk, and iterate with real users.",
      problem: {
        title: "Building a product should not take months without validation",
        body: "Many ideas get stuck because of long processes, unnecessary development, or lack of clarity about what to build first.",
        bullets: [
          "Months of development without real feedback",
          "Overbuilding unnecessary features",
          "Uncertainty about the market",
          "No usable first version",
        ],
      },
      solution: {
        title: "We build the first version you actually need",
        body: "We design and develop MVPs focused on what matters: a functional version ready for real users that lets you validate the product quickly.",
      },
      capabilities: {
        title: "What does an MVP include?",
        items: [
          {
            title: "Complete functional product",
            description: "We do not deliver an empty prototype, but a system real users can actually use.",
          },
          {
            title: "Focus on key functionality",
            description: "We build only what is needed to validate the proposal and learn fast.",
          },
          {
            title: "Fast development",
            description: "We prioritize delivery in weeks with clear scope and focused execution.",
          },
          {
            title: "Foundation to iterate and scale",
            description: "We leave a technical base ready to evolve the product after validation.",
          },
        ],
      },
      process: {
        title: "How do we build your MVP?",
        steps: [
          "We define the minimum necessary scope",
          "We design the product",
          "We develop the MVP",
          "We ship it to production",
          "We iterate based on feedback",
        ],
      },
      differentiator: {
        title: "Why Aurora?",
        items: [
          "We do not build empty prototypes, we deliver functional products",
          "We prioritize speed without losing quality",
          "Focused on real validation, not features",
          "Systems ready to evolve",
        ],
      },
      results: {
        title: "What do you get with your MVP?",
        items: [
          "A functional product ready for users",
          "Real market validation",
          "Reduced risk before scaling",
          "A foundation to grow the product",
        ],
      },
      contact: {
        title: "Do you have an idea you want to validate?",
        body: "Tell us what you are building and we will help you turn it into a functional product as quickly as possible.",
        messageLabel: "Idea or product to validate",
        messagePlaceholder:
          "Describe your idea, who it is for, what problem it solves, and what you need to validate first.",
      },
    },
  },
};

function resolveService(messages: ReturnType<typeof getMessages>, slug: string) {
  const canonicalSlug = SERVICE_SLUG_ALIASES[slug] ?? slug;
  const service = messages.services.items.find((item) => item.slug === canonicalSlug);
  return service ? { canonicalSlug, service } : null;
}

function getServicePageContent(locale: "es" | "en", slug: string) {
  return SERVICE_PAGE_CONTENT[slug]?.[locale] ?? null;
}

function CapabilityIcon({ index }: { index: number }) {
  const common = "stroke-current";

  if (index === 0) {
    return (
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" aria-hidden>
        <path className={common} d="M15 24h18M24 15v18" strokeWidth="2.5" strokeLinecap="round" />
        <circle className={common} cx="24" cy="24" r="13" strokeWidth="2.5" />
        <path className={common} d="M24 5v5M24 38v5M5 24h5M38 24h5" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" aria-hidden>
        <rect className={common} x="7" y="10" width="13" height="13" rx="4" strokeWidth="2.5" />
        <rect className={common} x="28" y="25" width="13" height="13" rx="4" strokeWidth="2.5" />
        <path className={common} d="M20 17h6c5 0 8 3 8 8" strokeWidth="2.5" strokeLinecap="round" />
        <path className={common} d="M28 32h-6c-5 0-8-3-8-8" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" aria-hidden>
      <circle className={common} cx="24" cy="24" r="8" strokeWidth="2.5" />
      <path
        className={common}
        d="M24 6v6M24 36v6M6 24h6M36 24h6M12 12l4 4M32 32l4 4M36 12l-4 4M16 32l-4 4"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
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
  const { canonicalSlug, service } = resolved;
  const pageContent = getServicePageContent(locale, canonicalSlug);
  const base = new URL(messages.siteMeta.url);

  return {
    title: pageContent?.title ?? service.title,
    description: pageContent?.seoDescription ?? service.description,
    alternates: {
      canonical: `${base.origin}/${locale}/services/${service.slug}`,
      languages: {
        es: `${base.origin}/es/services/${service.slug}`,
        en: `${base.origin}/en/services/${service.slug}`,
        "x-default": `${base.origin}/en/services/${service.slug}`,
      },
    },
    openGraph: {
      title: `${pageContent?.title ?? service.title} · ${messages.siteMeta.name}`,
      description: pageContent?.seoDescription ?? service.description,
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
  const pageContent = getServicePageContent(locale, canonicalSlug);
  const contactHref = `/${locale}?service=${service.slug}#${messages.contact.id}`;
  const localContactHref = `#${messages.contact.id}`;
  const heroImage = SERVICE_HERO_IMAGES[canonicalSlug] ?? PROCESS_AUTOMATION_HERO_IMAGE;
  const origin = new URL(messages.siteMeta.url).origin;
  const serviceUrl = `${origin}/${locale}/services/${service.slug}`;
  const serviceDescription = pageContent?.seoDescription ?? service.description;

  return (
    <>
      <ServiceJsonLd
        messages={messages}
        name={pageContent?.title ?? service.title}
        description={serviceDescription}
        url={serviceUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: messages.siteMeta.name, url: `${origin}/${locale}` },
          { name: messages.services.eyebrow, url: `${origin}/${locale}#${messages.services.id}` },
          { name: service.title, url: serviceUrl },
        ]}
      />
      <SiteHeader messages={messages} />
      <main className="flex-1">
        {pageContent ? (
          <>
            <section className="relative overflow-hidden border-b border-white/5 bg-surface-900 py-20 md:py-28">
              <Image
                src={heroImage}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
                priority
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-surface-900/92 via-surface-900/84 to-surface-900"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-aurora-blue/15 blur-3xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-aurora-purple/25 via-transparent to-aurora-blue/20"
                aria-hidden
              />
              <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl space-y-7">
                  <h1
                    id="service-heading"
                    className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl"
                  >
                    {pageContent.title}
                  </h1>
                  <p className="max-w-2xl text-lg leading-relaxed text-foreground-muted md:text-xl">
                    {pageContent.subtitle}
                  </p>
                  <a
                    href={localContactHref}
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-aurora-purple to-aurora-blue px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-aurora-blue/20 transition-[transform,box-shadow] duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-aurora-purple/25"
                  >
                    {pageContent.primaryCta}
                  </a>
                </div>
              </div>
            </section>

            <section className="mx-auto max-w-6xl space-y-16 px-4 py-16 sm:px-6 md:py-20 lg:px-8">
              <div className="gradient-border-mask relative overflow-hidden rounded-3xl bg-surface-card p-6 shadow-xl shadow-black/20 md:p-8 lg:p-10">
                <div
                  className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-aurora-purple/10 blur-3xl"
                  aria-hidden
                />
                <div className="relative grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                  <div className="space-y-5">
                    <h2 className="max-w-2xl font-display text-3xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-4xl">
                      <span className="gradient-text" aria-hidden>
                        &gt;{" "}
                      </span>
                      {pageContent.problem.title}
                    </h2>
                    <p className="max-w-2xl text-base leading-relaxed text-foreground-muted md:text-lg">
                      {pageContent.problem.body}
                    </p>
                  </div>
                  <ul className="grid gap-3">
                    {pageContent.problem.bullets.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium leading-relaxed text-foreground-muted"
                      >
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-aurora-purple to-aurora-blue" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="gradient-border-mask relative overflow-hidden rounded-3xl bg-surface-card p-6 shadow-2xl shadow-black/25 md:p-8">
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-aurora-blue/15 blur-3xl"
                  aria-hidden
                />
                <div className="relative max-w-3xl space-y-4">
                  <SectionTitle>{pageContent.solution.title}</SectionTitle>
                  <p className="text-base leading-relaxed text-foreground-muted md:text-lg">
                    {pageContent.solution.body}
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <SectionTitle>{pageContent.capabilities.title}</SectionTitle>
                <ul className="grid gap-5 lg:grid-cols-3">
                  {pageContent.capabilities.items.map((item, i) => (
                    <li key={item.title}>
                      <div className="gradient-border-mask h-full rounded-3xl bg-surface-card p-6 shadow-xl shadow-black/20 glow-hover md:p-7">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-aurora-blue shadow-inner">
                          <CapabilityIcon index={i} />
                        </div>
                        <h2 className="mt-5 font-display text-xl font-bold leading-tight text-foreground">
                          {item.title}
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-foreground-muted md:text-base">
                          {item.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-8">
                <SectionTitle>{pageContent.process.title}</SectionTitle>
                <ol className="grid gap-4">
                  {pageContent.process.steps.map((step, i) => (
                    <li key={step} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-aurora-purple to-aurora-blue font-display text-sm font-bold text-white">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="self-center text-sm font-medium text-foreground-muted md:text-base">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="gradient-border-mask rounded-3xl bg-surface-card p-6 shadow-xl shadow-black/20 md:p-8">
                <SectionTitle>{pageContent.differentiator.title}</SectionTitle>
                <ul className="mt-8 grid gap-3 md:grid-cols-2">
                  {pageContent.differentiator.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-foreground-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {pageContent.results ? (
                <div className="space-y-8">
                  <SectionTitle>{pageContent.results.title}</SectionTitle>
                  <ul className="grid gap-4 md:grid-cols-2">
                    {pageContent.results.items.map((item) => (
                      <li
                        key={item}
                        className="gradient-border-mask rounded-2xl bg-surface-card px-5 py-4 text-sm font-medium text-foreground-muted shadow-lg shadow-black/15"
                      >
                        <span className="gradient-text font-display font-bold" aria-hidden>
                          &gt;{" "}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
            <ContactForm
              title={pageContent.contact.title}
              description={pageContent.contact.body}
              requirementTypeValue={service.slug}
              hideRequirementType
              messageLabel={pageContent.contact.messageLabel}
              messagePlaceholder={pageContent.contact.messagePlaceholder}
            />
          </>
        ) : (
          <>
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
                    href={contactHref}
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-aurora-purple to-aurora-blue px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-aurora-blue/20 transition-[transform,box-shadow] duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-aurora-purple/25"
                  >
                    {service.contactCtaLabel}
                  </a>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer messages={messages} />
    </>
  );
}
