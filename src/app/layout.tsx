import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";
import "../../sass/main.scss";
import JsonLd from "@/src/components/marketing/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/src/lib/seo/schemas";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://xale.in"),
  title: { default: "Xale — The CRM operating system", template: "%s — Xale" },
  description:
    "Capture, nurture, and convert leads with WhatsApp, Meta Ads, and automation — one platform, every channel, built for teams that move fast.",
  applicationName: "Xale",
  generator: "Next.js",
  openGraph: {
    siteName: "Xale",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const helveticaNeue = localFont({
  src: [
    { path: "../../public/Fonts/HelveticaNeue-Thin.woff2", weight: "100", style: "normal" },
    { path: "../../public/Fonts/HelveticaNeue-ThinItalic.woff2", weight: "100", style: "italic" },
    { path: "../../public/Fonts/HelveticaNeue-UltraLight.woff2", weight: "200", style: "normal" },
    { path: "../../public/Fonts/HelveticaNeue-UltraLightItalic.woff2", weight: "200", style: "italic" },
    { path: "../../public/Fonts/HelveticaNeue-Light.woff2", weight: "300", style: "normal" },
    { path: "../../public/Fonts/HelveticaNeue-LightItalic.woff2", weight: "300", style: "italic" },
    { path: "../../public/Fonts/HelveticaNeue.woff2", weight: "400", style: "normal" },
    { path: "../../public/Fonts/HelveticaNeue-Italic.woff2", weight: "400", style: "italic" },
    { path: "../../public/Fonts/HelveticaNeue-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/Fonts/HelveticaNeue-MediumItalic.woff2", weight: "500", style: "italic" },
    { path: "../../public/Fonts/HelveticaNeue-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/Fonts/HelveticaNeue-BoldItalic.woff2", weight: "700", style: "italic" },
    { path: "../../public/Fonts/HelveticaNeue-CondensedBold.woff2", weight: "700", style: "normal" },
    { path: "../../public/Fonts/HelveticaNeue-CondensedBlack.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-helvetica-neue",
  display: "swap",
  fallback: [],
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${helveticaNeue.variable} ${instrumentSerif.variable}`}>
      <body className={helveticaNeue.className}>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        {children}
      </body>
    </html>
  );
}
