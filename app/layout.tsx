import type { Viewport, Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import { headers } from "next/headers";
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

export const viewport: Viewport = {
  themeColor: "#030308",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://teamaurora.pe"),
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
      <body className="relative min-h-full">{children}</body>
    </html>
  );
}
