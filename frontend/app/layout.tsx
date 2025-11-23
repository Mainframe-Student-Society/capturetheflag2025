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
  metadataBase: new URL(siteUrl),
  title: {
    default: "Capture The Flag | MainFrame Student Society",
    template: "%s | MainFrame CTF",
  },
  description:
    "Platform created by students of University of Wolverhampton for hosting Capture The Flag (CTF) mainframe technology competitions and challenges. Practice, compete, and learn IBM Z, COBOL, JCL, REXX and other enterprise technologies.",
  applicationName: "MainFrame CTF Platform",
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
    "Enterprise Technology",
    "Legacy Systems",
    "z/OS",
    "TSO",
    "ISPF",
    "DB2",
    "CICS",
    "Mainframe Skills",
    "Tech Competition",
  ],
  authors: [{ name: "MainFrame Student Society", url: siteUrl }],
  creator: "MainFrame Student Society",
  publisher: "MainFrame Student Society",
  category: "technology",
  classification: "Education",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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
        type: "image/png",
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
    site: "@your_handle",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
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
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
      },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    title: "MainFrame CTF",
    statusBarStyle: "black-translucent",
  },
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  other: {
    "msapplication-TileColor": "#0ea5e9",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MainFrame CTF Platform",
    description:
      "University of Wolverhampton Capture The Flag platform for mainframe technology competitions",
    url: siteUrl,
    publisher: {
      "@type": "Organization",
      name: "MainFrame Student Society",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/challenges?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "MainFrame Student Society",
    url: siteUrl,
    description:
      "Student society at University of Wolverhampton focused on mainframe technology education and competitions",
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: "University of Wolverhampton",
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationData),
          }}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta
          name="theme-color"
          content="#0ea5e9"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#020817"
          media="(prefers-color-scheme: dark)"
        />
        <link rel="canonical" href={siteUrl} />
      </head>
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
