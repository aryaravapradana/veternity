import type { Metadata } from "next";
import { Nunito, Playfair_Display, Geist } from "next/font/google";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"], weight: ["400", "500", "700", "800", "900"], variable: "--font-nunito" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Pranata",
  description: "Friendly farm tracking and inventory management",
};

import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { PageTransition } from "@/components/layout/page-transition";
import { LoadingProvider } from "@/components/shared/loading-context";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(nunito.variable, playfair.variable, "font-sans", geist.variable)}>
      <head>
        {/* ── Critical image preloads ─────────────────────────────────────────
            These are fetched at highest priority alongside the HTML, so they
            are ready the instant the browser paints them (no first-load flash). */}
        {/* Hero illustration */}
        <link rel="preload" href="/images/hero_section.webp" as="image" type="image/webp" fetchPriority="high" />
        {/* Feature card logos — black (base) + white (overlay) for all 3 features */}
        <link rel="preload" href="/logos/intelligence/intelligence-black.png" as="image" />
        <link rel="preload" href="/logos/intelligence/intelligence-white.png" as="image" />
        <link rel="preload" href="/logos/market/market-black.png" as="image" />
        <link rel="preload" href="/logos/market/market-white.png" as="image" />
        <link rel="preload" href="/logos/hub/hub-black.png" as="image" />
        <link rel="preload" href="/logos/hub/hub-white.png" as="image" />
        {/* Feature illustrations */}
        <link rel="preload" href="/images/PRANATA_INTELLIGENCE.webp" as="image" type="image/webp" />
        <link rel="preload" href="/images/PRANATA_MARKET.webp" as="image" type="image/webp" />
        <link rel="preload" href="/images/PRANATA_HUB.webp" as="image" type="image/webp" />
      </head>
      <body className={`${nunito.className} bg-forest text-white selection:bg-vibrant selection:text-white min-h-screen`}>
        <SmoothScroll>
          <LoadingProvider>
            <PageTransition>
              {children}
            </PageTransition>
          </LoadingProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
