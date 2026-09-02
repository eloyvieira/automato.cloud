import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'Real-Time Crypto Trading Signals & Market Analysis | Automato',
  description:
    'Live crypto trading signals and quantitative market analysis for USDT, USDC and BTC markets. Long and short opportunities updated every 5 minutes.',
  openGraph: {
    title: 'Real-Time Crypto Trading Signals | Automato',
    description:
      'Quantitative crypto market analysis for USDT, USDC and BTC markets, updated every 5 minutes.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real-Time Crypto Trading Signals | Automato',
    description:
      'Quantitative crypto market analysis for USDT, USDC and BTC markets, updated every 5 minutes.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
