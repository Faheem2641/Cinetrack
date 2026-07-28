import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilmstripDivider from "@/components/FilmstripDivider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cinetrack | Movie & TV Tracker",
  description: "Track, rate, review, and share your cinema journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${playfair.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col cinema-bg-mesh bg-[#070d0e] text-[#E8DDD5] font-sans relative selection:bg-[#B58863]/30">
        <Navbar />
        <main className="flex-grow flex flex-col">{children}</main>
        <FilmstripDivider
          bgClass="bg-[#122123]"
          aboveColor="text-[#0f1a1b]"
          belowColor="text-[#103334]"
          reelLabel="REEL_03 // EXT. ROLL CREDITS"
        />
        <Footer />
      </body>
    </html>
  );
}
