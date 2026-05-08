import type { Metadata } from "next";
import localFont from "next/font/local";
import Menu from "@/components/Menu/Menu";
import SiteLogo from "@/components/SpinningLogo/SiteLogo";
import "./globals.css";

const sora = localFont({
  variable: "--font-sans",
  src: [
    { path: "../../public/projects/fonts/Sora-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/projects/fonts/Sora-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/projects/fonts/Sora-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../../public/projects/fonts/Sora-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/projects/fonts/Sora-Italic.woff2", weight: "400", style: "italic" },
    { path: "../../public/projects/fonts/Sora-MediumItalic.woff2", weight: "500", style: "italic" },
    { path: "../../public/projects/fonts/Sora-SemiBoldItalic.woff2", weight: "600", style: "italic" },
    { path: "../../public/projects/fonts/Sora-BoldItalic.woff2", weight: "700", style: "italic" },
  ],
  display: "swap",
});

const appleGaramondHeading = localFont({
  variable: "--font-heading",
  src: [{ path: "../../public/projects/fonts/AppleGaramond-Bold.woff", weight: "700", style: "normal" }],
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
    <html lang="en" className={`${sora.variable} ${appleGaramondHeading.variable}`}>
      <body>
        <SiteLogo />
        <Menu />
        {children}
      </body>
    </html>
  );
}
