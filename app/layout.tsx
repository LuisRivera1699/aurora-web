import type { Viewport, Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import { getPublicSiteUrl } from "@/lib/site-url";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const GTM_ID = "GTM-WGKHTDFR";

export const viewport: Viewport = {
  themeColor: "#030308",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(getPublicSiteUrl()),
  alternates: {
    languages: {
      es: "/es",
      en: "/en",
      "x-default": "/",
    },
  },
};

/** `lang` from middleware-injected `x-locale` on /es and /en routes; defaults for /admin. */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const lang = headersList.get("x-locale") === "en" ? "en" : "es";

  return (
    <html lang={lang} className={`${inter.variable} ${syne.variable} h-full antialiased`}>
      <Script id="google-tag-manager" strategy="beforeInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}
      </Script>
      <body className="relative min-h-full">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
