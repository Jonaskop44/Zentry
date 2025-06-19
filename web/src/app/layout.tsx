import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StyleProvider from "@/context/StyleProvider";
import SessionProvider from "@/context/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zentry",
  description:
    "A modern time tracking app for teams with tap-based pause and shift logging",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        suppressHydrationWarning
      >
        <StyleProvider>
          <SessionProvider>{children}</SessionProvider>
        </StyleProvider>
      </body>
    </html>
  );
}
