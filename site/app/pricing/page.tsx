import Link from 'next/link';
import type { Metadata } from 'next';
import { Check, ArrowRight } from 'lucide-react';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';

export const metadata: Metadata = {
  title: 'Pricing | Automato',
  description: 'Free, Premium and API plans for real-time crypto signals and market analysis.',
};

const plans = [
  { name: 'Free', price: '$0', period: 'forever', features: ['Public signals', 'BTC market regime', 'Top opportunities', 'Rankings'], cta: 'Current plan', highlight: false },
  { name: 'Premium Weekly', price: '$9.90', period: '/week', features: ['Entry, stop loss & take profits', 'Signal status & history', 'All market regimes', 'No ads'], cta: 'Upgrade to Premium', highlight: true },
  { name: 'API Starter', price: '$29', period: '/month', features: ['10,000 requests/day', 'All active signals', 'Market regime endpoint', 'API key access'], cta: 'Get API access', highlight: false },
  { name: 'API Professional', price: '$79', period: '/month', features: ['100,000 requests/day', 'All endpoints', 'Per-symbol history', 'Priority support'], cta: 'Get API access', highlight: false },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#080d14] text-slate-200">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Simple, transparent pricing</h1>
          <p className="mt-3 text-sm text-slate-400">Start free. Upgrade when you need more.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-xl border p-6 ${plan.highlight ? 'border-emerald-400/30 bg-emerald-400/[0.06]' : 'border-white/[0.08] bg-[#121923]'}`}>
              {plan.highlight && <span className="mb-3 inline-block rounded-full bg-emerald-400 px-2 py-0.5 text-[10px] font-semibold text-[#07100b]">Most popular</span>}
              <h3 className="text-sm font-semibold text-white">{plan.name}</h3>
              <p className="mt-3"><span className="text-3xl font-semibold text-white">{plan.price}</span><span className="text-sm text-slate-500"> {plan.period}</span></p>
              <ul className="mt-5 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-slate-400"><Check size={14} className="mt-0.5 shrink-0 text-emerald-400" /> {f}</li>
                ))}
              </ul>
              <Link href="/register" className={`mt-6 flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-semibold transition ${plan.highlight ? 'bg-emerald-400 text-[#07100b] hover:bg-emerald-300' : 'border border-white/10 text-white hover:border-white/25'}`}>{plan.cta} <ArrowRight size={14} /></Link>
            </div>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
