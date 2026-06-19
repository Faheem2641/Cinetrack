import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#09090b] text-zinc-100 font-sans">
        <Navbar />
        <main className="flex-grow flex flex-col">{children}</main>
        <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-500">
          <div className="mx-auto max-w-7xl px-4">
            &copy; {new Date().getFullYear()} Cinetrack. Created as your ultimate movie portfolio.
          </div>
        </footer>
      </body>
    </html>
  );
}
