import type { SiteMessages } from "@/content/messages/types";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonValue[]
  | { [key: string]: JsonValue };

type BreadcrumbItem = {
  name: string;
  url: string;
};

function JsonLdScript({ data }: { data: JsonValue }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function OrganizationJsonLd({ messages }: { messages: SiteMessages }) {
  const origin = new URL(messages.siteMeta.url).origin;
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: messages.siteMeta.name,
        url: origin,
        logo: `${origin}/brand_assets/LOGO_WHITE_WITH_SOFTWARE_FACTORY.svg`,
        sameAs: messages.socialLinks.map((link) => link.href),
      }}
    />
  );
}

export function WebSiteJsonLd({ messages }: { messages: SiteMessages }) {
  const origin = new URL(messages.siteMeta.url).origin;
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: messages.siteMeta.name,
        url: origin,
        description: messages.siteMeta.description,
        inLanguage: messages.locale === "es" ? "es-PE" : "en-US",
        publisher: {
          "@type": "Organization",
          name: messages.siteMeta.name,
        },
      }}
    />
  );
}

export function ServiceJsonLd({
  messages,
  name,
  description,
  url,
}: {
  messages: SiteMessages;
  name: string;
  description: string;
  url: string;
}) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name,
        description,
        url,
        serviceType: name,
        provider: {
          "@type": "Organization",
          name: messages.siteMeta.name,
          url: new URL(messages.siteMeta.url).origin,
        },
        areaServed: {
          "@type": "Country",
          name: "Peru",
        },
        inLanguage: messages.locale === "es" ? "es-PE" : "en-US",
      }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}
