import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./context/AppContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "HimBhasha AI — Regional Language Assistant",
  description: "Preserving and digitizing Himachal Pradesh's regional languages through AI orchestration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-full bg-[#FAFBF9] text-[#1D1D1F] font-sans flex flex-col transition-colors duration-300">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
