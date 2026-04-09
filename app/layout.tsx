import type { Metadata, Viewport } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import { CursorAurora } from "@/components/CursorAurora";
import { siteMeta } from "@/content/site";

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
  metadataBase: new URL(siteMeta.url),
  icons: {
    icon: [{ url: "/brand_assets/ICON_WHITE.svg", type: "image/svg+xml" }],
    apple: [{ url: "/brand_assets/ICON_WHITE.svg", type: "image/svg+xml" }],
  },
  title: {
    default: `${siteMeta.name} — ${siteMeta.tagline}`,
    template: `%s · ${siteMeta.name}`,
  },
  description: siteMeta.description,
  openGraph: {
    type: "website",
    locale: "es",
    url: siteMeta.url,
    siteName: siteMeta.name,
    title: `${siteMeta.name} — ${siteMeta.tagline}`,
    description: siteMeta.description,
    images: [
      {
        url: "/og-aurora.png",
        alt: `${siteMeta.name} — ${siteMeta.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteMeta.name} — ${siteMeta.tagline}`,
    description: siteMeta.description,
    images: ["/og-aurora.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${syne.variable} h-full antialiased`}>
      <body className="relative min-h-full">
        <div className="relative z-10 flex min-h-full flex-col">
          <CursorAurora />
          {children}
        </div>
      </body>
    </html>
  );
}
