import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import { siteMetadata } from "@/constants/metadata";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "OnChainWin - The first fully decentralized web3 lottery",
//   description:
//     "OnChainWin special smart contracts collect funds and automatically distribute prizes to lucky winners",
//   icons: {
//     icon: "/logo.png",
//   },
// };

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    template: `%s | ${siteMetadata.title}`,
    default: siteMetadata.title,
  },
  description: siteMetadata.description,
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [siteMetadata.socialBanner],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-V0LT4HF6WF`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-V0LT4HF6WF');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <Analytics />
          <SpeedInsights />
          <Toaster />
        </Providers>
      </body>
      <GoogleAnalytics gaId="G-V0LT4HF6WF" />
      <GoogleAnalytics gaId="om6eu" />
    </html>
  );
}
