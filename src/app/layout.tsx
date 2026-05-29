import type { Metadata } from "next";
import { Geist, Geist_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "INDUS CNC | Precision Vertical Machining Centers",
  description: "Next-generation 5-axis vertical machining centers engineered for ultimate industrial precision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Generate preload links for the first 50 frames to prevent head-of-line blocking
  const preloadLinks = Array.from({ length: 50 }, (_, i) => {
    const frameNum = String(i + 1).padStart(6, "0");
    const path = `/frames/frame_${frameNum}.webp`;
    return (
      <link
        key={path}
        rel="preload"
        as="image"
        href={path}
        type="image/webp"
      />
    );
  });

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <head>
        {preloadLinks}
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#050505] text-white">{children}</body>
    </html>
  );
}
