'use client';

import Link from 'next/link';
import { BrainCircuit, ArrowRight } from 'lucide-react';

const rankingTabs = ['Most Reliable', 'Most Profitable', 'Best Long', 'Best Short', 'Best Scalping', 'Best Day Trading', 'Best Swing'];

const sampleRanking: { symbol: string; regime: string; reliability: number; strategy: string }[] = [
  { symbol: 'SOL/USDT', regime: 'LONG_STRONG', reliability: 82, strategy: 'Scalping' },
  { symbol: 'ETH/USDT', regime: 'LONG_STRONG', reliability: 79, strategy: 'Day' },
  { symbol: 'LINK/USDT', regime: 'LONG_WEAK', reliability: 77, strategy: 'Swing' },
  { symbol: 'BNB/USDT', regime: 'LONG_WEAK', reliability: 75, strategy: 'Day' },
  { symbol: 'AVAX/USDT', regime: 'LONG_WEAK', reliability: 74, strategy: 'Day' },
  { symbol: 'SUI/USDT', regime: 'LONG_WEAK', reliability: 72, strategy: 'Scalping' },
  { symbol: 'XRP/USDT', regime: 'NEUTRAL', reliability: 68, strategy: 'Swing' },
  { symbol: 'DOGE/USDT', regime: 'SHORT_STRONG', reliability: 76, strategy: 'Scalping' },
];

export default function RankingsPage() {
  return (
    <div className="min-h-screen bg-[#080d14]">
      <header className="border-b border-white/[0.07]">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-400/30 bg-emerald-400/10 text-emerald-400"><BrainCircuit size={20} /></span>
            <span className="text-lg font-semibold text-white">automato<span className="text-emerald-400">.</span></span>
          </Link>
          <Link href="/login" className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white transition hover:border-emerald-400/40">Log in</Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Rankings</h1>
        <p className="mt-2 text-sm text-slate-400">Calculated live from active signals. Cached for 5 minutes.</p>
        <div className="mt-8 flex flex-wrap gap-2">
          {rankingTabs.map((tab, i) => (
            <button key={tab} className={`rounded-lg border px-3 py-1.5 text-xs transition ${i === 0 ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-400' : 'border-white/10 text-slate-400 hover:text-white'}`}>{tab}</button>
          ))}
        </div>
        <div className="mt-8 overflow-hidden rounded-xl border border-white/[0.08] bg-[#121923]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/[0.08] text-xs uppercase tracking-wider text-slate-500">
              <tr><th className="px-4 py-3 font-medium">#</th><th className="px-4 py-3 font-medium">Symbol</th><th className="px-4 py-3 font-medium">Regime</th><th className="px-4 py-3 font-medium">Reliability</th><th className="px-4 py-3 font-medium">Strategy</th></tr>
            </thead>
            <tbody>
              {sampleRanking.map((row, i) => (
                <tr key={row.symbol} className="border-b border-white/[0.04] last:border-0">
                  <td className="px-4 py-3 text-slate-600">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-white">{row.symbol}</td>
                  <td className="px-4 py-3"><span className={`text-xs ${row.regime.includes('LONG') ? 'text-emerald-400' : row.regime.includes('SHORT') ? 'text-red-400' : 'text-amber-300'}`}>{row.regime}</span></td>
                  <td className="px-4 py-3 text-emerald-400">{row.reliability}%</td>
                  <td className="px-4 py-3 text-slate-400">{row.strategy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] p-6">
          <p className="text-sm font-medium text-white">Want full ranking history and filters?</p>
          <Link href="/pricing" className="mt-3 inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:underline">View plans <ArrowRight size={14} /></Link>
        </div>
      </main>
    </div>
  );
}
