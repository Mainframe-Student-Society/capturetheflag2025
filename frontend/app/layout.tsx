import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "http://localhost:3000";

export const metadata: Metadata = {
  title: "Capture The Flag | MainFrame Student Society",
  description:
    "Platform created by students of University of Wolverhampton for hosting Capture The Flag (CTF) mainframe technology competitions and challenges. Practice, compete, and learn IBM Z, COBOL, JCL, REXX and other enterprise technologies.",
  keywords: [
    "CTF",
    "Capture The Flag",
    "Mainframe",
    "IBM Z",
    "COBOL",
    "JCL",
    "REXX",
    "University of Wolverhampton",
    "Student Society",
    "Cybersecurity",
    "Challenges",
    "Competition",
  ],
  authors: [{ name: "MainFrame Student Society" }],
  creator: "MainFrame Student Society",
  publisher: "MainFrame Student Society",
  category: "technology",
  openGraph: {
    title: "Capture The Flag | MainFrame Student Society",
    description:
      "Join the University of Wolverhampton mainframe CTF platform: learn, practice and compete in enterprise technology challenges.",
    type: "website",
    locale: "en_GB",
    siteName: "MainFrame CTF",
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/og-banner.png`,
        width: 1200,
        height: 630,
        alt: "MainFrame CTF Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Capture The Flag | MainFrame Student Society",
    description:
      "University of Wolverhampton mainframe technology CTF platform.",
    images: [`${siteUrl}/og-banner.png`],
    creator: "@your_handle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
