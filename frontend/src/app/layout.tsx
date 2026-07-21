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
