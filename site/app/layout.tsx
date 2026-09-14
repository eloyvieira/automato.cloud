import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),

  title: {
    default: 'Crypto Trading Signals & Market Analysis | Automato',
    template: '%s | Automato',
  },

  description:
    'Real-time crypto trading signals and quantitative market analysis for USDT, USDC and BTC markets. Long and short opportunities updated every 5 minutes.',

  alternates: {
    canonical: '/',
  },

  icons: {
    icon: [
      { url: '/images/favicon.ico' },
      { url: '/images/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      {
        url: '/images/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    other: [
      {
        rel: 'icon',
        url: '/images/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: '/images/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },

  openGraph: {
    title: 'Real-Time Crypto Trading Signals | Automato',
    description:
      'Quantitative crypto market analysis for USDT, USDC and BTC markets, updated every 5 minutes.',
    type: 'website',
    url: '/',
    siteName: 'Automato',
    locale: 'en_US',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Automato Crypto Trading Signals',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Real-Time Crypto Trading Signals | Automato',
    description:
      'Quantitative crypto market analysis for USDT, USDC and BTC markets, updated every 5 minutes.',
    images: ['/images/og-image.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-HYN6FQHWZG"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HYN6FQHWZG');
          `}
        </Script>

      </body>
    </html>
  );
}