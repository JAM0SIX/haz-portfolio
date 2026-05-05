import type { Metadata } from "next";
import { DM_Sans, Spectral } from "next/font/google";
import Menu from "@/components/Menu/Menu";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spectral = Spectral({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Haz.",
  description: "Portfolio of Haz. — minimal, technical, instrument-like.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spectral.variable}`}>
      <body>
        <Menu />
        {children}
      </body>
    </html>
  );
}
