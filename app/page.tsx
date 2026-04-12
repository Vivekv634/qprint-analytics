import type { Metadata } from "next";
import LandingPage from "@/components/landing/LandingPage";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://q-print.vercel.app";

export const metadata: Metadata = {
  alternates: {
    canonical: siteUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "QPrint",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: siteUrl,
  description:
    "Real-time print analytics dashboard for campus print shops. Track print jobs, revenue, peak hours, and success rates across multiple campus locations.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  featureList: [
    "Real-time print job monitoring",
    "Revenue analytics",
    "Peak hour analysis",
    "Multi-campus dashboard",
    "Print success rate tracking",
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPage />
    </>
  );
}
