import type { Metadata } from "next";
import {
  DM_Sans,
  Plus_Jakarta_Sans,
  Space_Grotesk,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://q-print.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "QPrint — Real-Time Campus Print Intelligence",
    template: "%s | QPrint",
  },
  description:
    "QPrint gives print-shop operators and campus administrators live visibility into print jobs, revenue, peak hours, and success rates across every campus location.",
  keywords: [
    "print analytics",
    "campus printing",
    "print shop management",
    "print job tracking",
    "printing dashboard",
    "campus print intelligence",
  ],
  authors: [{ name: "Vivek Vaish" }],
  creator: "Vivek Vaish",
  publisher: "Vivek Vaish",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "QPrint",
    title: "QPrint — Real-Time Campus Print Intelligence",
    description:
      "Live print job tracking, revenue analytics, and peak-hour insights across every campus location.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "QPrint Analytics dashboard showing live print metrics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QPrint — Real-Time Campus Print Intelligence",
    description:
      "Live print job tracking, revenue analytics, and peak-hour insights across every campus location.",
    images: ["/og-image.png"],
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
    <html
      lang="en"
      className={`${dmSans.variable} ${jakarta.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
