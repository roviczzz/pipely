import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "CRM Dashboard",
  description:
    "A production-ready CRM template for managing contacts, companies, and deals.",
  applicationName: "CRM Dashboard",
  openGraph: {
    title: "CRM Dashboard",
    description:
      "A production-ready CRM template for managing contacts, companies, and deals.",
    type: "website",
    siteName: "CRM Dashboard",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: "hsl(240 10% 3.9%)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}