import Link from 'next/link';
import { ArrowRight, BrainCircuit, Clock3, Code2, ShieldCheck, Target } from 'lucide-react';
import { BtcRegimeCard } from '@/components/home/BtcRegimeCard';
import { BtcRegimeTrendChart } from '@/components/home/BtcRegimeTrendChart';
import { MethodologyCard } from '@/components/home/MethodologyCard';
import { OpportunityTable } from '@/components/home/OpportunityTable';
import { PremiumPreviewProvider } from '@/components/home/PremiumPreview';
import { ReliableCoinsCard } from '@/components/home/ReliableCoinsCard';
import { SignalCard } from '@/components/home/SignalCard';
import { SiteHeader } from '@/components/home/SiteHeader';
import { getSession } from '@/lib/auth';
import { getHomeData } from '@/lib/home-data';
import { hasPremiumAccess } from '@/lib/permissions';

// Market data is cached in Redis for 5 minutes, so the page itself renders per
// request (it also reads the session cookie).
export const dynamic = 'force-dynamic';

function NeuralNetworkIcon() {
  return (
    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.025] backdrop-blur-sm">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400/[0.06] via-transparent to-cyan-400/[0.03]" />

      <svg viewBox="0 0 100 100" className="relative h-16 w-16 overflow-visible opacity-90">
        <defs>
          <filter id="neuralGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="neuralLine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.35" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
          </linearGradient>

          <radialGradient id="nodeGlow">
            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.15" />
          </radialGradient>
        </defs>

        <g stroke="url(#neuralLine)" strokeWidth="0.9" fill="none" className="text-emerald-400">
          <path d="M10 28 L28 18 L50 26 L70 16 L90 30" />
          <path d="M10 28 L26 48 L50 26 L72 50 L90 30" />
          <path d="M10 70 L26 48 L50 62 L72 50 L90 72" />
          <path d="M10 70 L30 82 L50 62 L70 84 L90 72" />
          <path d="M28 18 L26 48 L30 82" />
          <path d="M50 26 L50 62" />
          <path d="M70 16 L72 50 L70 84" />
          <path d="M26 48 L50 62 L72 50" />
          <path d="M28 18 L50 62" />
          <path d="M70 16 L50 62" />
        </g>

        <g className="text-emerald-400/70">
          {[
            [10, 28, 2.3], [10, 70, 2.3],
            [28, 18, 2.5], [26, 48, 2.8], [30, 82, 2.4],
            [50, 26, 3.2], [50, 62, 3.6],
            [70, 16, 2.5], [72, 50, 2.9], [70, 84, 2.4],
            [90, 30, 2.3], [90, 72, 2.3]
          ].map(([cx, cy, r], index) => (
            <g key={index}>
              <circle cx={cx} cy={cy} r={r + 4} fill="currentColor" opacity="0.03" />
              <circle cx={cx} cy={cy} r={r} fill="url(#nodeGlow)" />
            </g>
          ))}
        </g>

        <g fill="currentColor" className="text-emerald-300" filter="url(#neuralGlow)">
          <circle r="1.8">
            <animateMotion dur="2.8s" repeatCount="indefinite" path="M10 28 L28 18 L50 26 L70 16 L90 30" />
          </circle>

          <circle r="1.6">
            <animateMotion dur="3.4s" begin=".5s" repeatCount="indefinite" path="M10 70 L26 48 L50 62 L72 50 L90 72" />
          </circle>

          <circle r="1.5">
            <animateMotion dur="3s" begin="1.1s" repeatCount="indefinite" path="M10 28 L26 48 L50 62 L70 84" />
          </circle>

          <circle r="1.3">
            <animateMotion dur="2.6s" begin="1.7s" repeatCount="indefinite" path="M28 18 L50 62 L72 50 L90 30" />
          </circle>
        </g>

        <g className="text-cyan-300/50" filter="url(#neuralGlow)">
          <circle cx="50" cy="62" r="3">
            <animate attributeName="r" values="3;5;3" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.15;0.5" dur="2.4s" repeatCount="indefinite" />
          </circle>

          <circle cx="26" cy="48" r="2.5">
            <animate attributeName="r" values="2.5;4;2.5" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    </div>
  );
}

export default async function Home() {
  const [{ btc, btcTrend, longSignals, shortSignals, reliableCoins }, session] = await Promise.all([
    getHomeData(),
    getSession(),
  ]);

  const premium = session ? await hasPremiumAccess(session.userId) : false;

  return <PremiumPreviewProvider initialPremium={premium}><div className="min-h-screen bg-[#080d14] text-slate-200">
    <SiteHeader />
    <main>
      <section className="relative overflow-hidden border-b border-white/[0.07]"><div className="absolute inset-0 grid-fade opacity-30" /><div className="relative mx-auto max-w-6xl px-5 pb-16 pt-16 lg:px-8 lg:pb-20 lg:pt-20"><div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,440px)] lg:items-center lg:gap-10"><div className="max-w-2xl"><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-xs font-medium text-emerald-400"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Market intelligence, updated every 5 minutes</div><h1 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-6xl">Real-Time Crypto<br /><span className="text-emerald-400">Trading Signals</span></h1><p className="mt-6 max-w-xl text-base leading-7 text-slate-400">Quantitative market analysis for USDT, USDC and BTC markets. See what the market is doing, without the noise.</p></div><BtcRegimeTrendChart points={btcTrend} /></div><BtcRegimeCard btc={btc} /></div></section>
      <section id="signals" className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">Specific entry moments</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Top opportunities</h2></div><p className="text-sm text-slate-500">Active signals ranked by reliability</p></div><div className="mt-7 grid gap-5 lg:grid-cols-2"><OpportunityTable title="Top long opportunities" signals={longSignals} direction="long" /><OpportunityTable title="Top short opportunities" signals={shortSignals} direction="short" /></div><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{longSignals.slice(0, 3).map((signal) => <SignalCard key={signal.id} signal={signal} direction="long" />)}</div></section>
      <section className="border-y border-white/[0.07] bg-[#0b121b]"><div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-8"><div className="flex gap-3"><Clock3 className="mt-0.5 shrink-0 text-emerald-400" size={18} /><div><h3 className="text-sm font-medium text-white">Updated every 5 minutes</h3><p className="mt-2 text-xs leading-5 text-slate-500">Fresh market data and analysis for the pairs that matter.</p></div></div><div className="flex gap-3"><BrainCircuit className="mt-0.5 shrink-0 text-emerald-400" size={18} /><div><h3 className="text-sm font-medium text-white">AI validated analysis</h3><p className="mt-2 text-xs leading-5 text-slate-500">Additional context helps separate signal from noise.</p></div></div><div className="flex gap-3"><ShieldCheck className="mt-0.5 shrink-0 text-emerald-400" size={18} /><div><h3 className="text-sm font-medium text-white">Five market regimes</h3><p className="mt-2 text-xs leading-5 text-slate-500">Simple labels make complex conditions easier to scan.</p></div></div><div className="flex gap-3"><Target className="mt-0.5 shrink-0 text-emerald-400" size={18} /><div><h3 className="text-sm font-medium text-white">Specific entry moments</h3><p className="mt-2 text-xs leading-5 text-slate-500">Know when an opportunity first appeared.</p></div></div></div></section>
      <section className="mx-auto max-w-6xl px-5 py-14 lg:px-8"><div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]"><ReliableCoinsCard coins={reliableCoins} /><MethodologyCard /></div></section>
      <section className="mx-auto max-w-6xl px-5 pb-16 lg:px-8"><div className="relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-7 sm:p-10"><div className="relative max-w-xl"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">Built for decisive traders</p><h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">Unlock the full picture.</h2><p className="mt-3 text-sm leading-6 text-slate-400">Get entry prices, risk levels, take profits, signal history and API access when you&apos;re ready to go deeper.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/pricing" className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-[#07100b] transition hover:bg-emerald-300">View plans <ArrowRight size={15} /></Link><Link href="/api-docs" className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white transition hover:border-white/25">Explore the API <Code2 size={15} /></Link></div></div></div></section>
    </main>
    <footer className="border-t border-white/[0.07]"><div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8"><Link href="/" className="flex items-center gap-2 text-sm font-semibold text-slate-300"><BrainCircuit size={16} className="text-emerald-400" /> automato.</Link><div className="flex gap-5"><Link href="/pricing" className="hover:text-white">Pricing</Link><Link href="/api-docs" className="hover:text-white">API</Link><Link href="/login" className="hover:text-white">Log in</Link></div><span>© 2026 Automato. Market intelligence, clearly.</span></div></footer>
  </div></PremiumPreviewProvider>;
}
