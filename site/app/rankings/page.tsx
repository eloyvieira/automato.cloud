import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import type { RankingKind } from '@/lib/home-types';
import { getRankingBoard } from '@/services/ranking.service';

// Rankings are recalculated from the database and cached in Redis for a few
// minutes, so the page renders per request.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Crypto Signal Rankings | Automato',
  description:
    'Live crypto rankings built from real signals: most reliable, most profitable, best long and short opportunities, by strategy.',
};

const TABS: { kind: RankingKind; label: string; note: string }[] = [
  { kind: 'most-reliable', label: 'Most Reliable', note: 'Active signals with the highest reliability score.' },
  { kind: 'most-profitable', label: 'Most Profitable', note: 'Closed signals ranked by realized result.' },
  { kind: 'best-long', label: 'Best Long', note: 'Highest reliability among active long signals.' },
  { kind: 'best-short', label: 'Best Short', note: 'Highest reliability among active short signals.' },
  { kind: 'best-scalping', label: 'Best Scalping', note: 'Active scalping signals, most reliable first.' },
  { kind: 'best-day', label: 'Best Day Trading', note: 'Active day trading signals, most reliable first.' },
  { kind: 'best-swing', label: 'Best Swing', note: 'Active swing signals, most reliable first.' },
];

function resolveTab(value: string | string[] | undefined) {
  const requested = Array.isArray(value) ? value[0] : value;
  return TABS.find((tab) => tab.kind === requested) ?? TABS[0];
}

function regimeClass(regime: string) {
  if (regime.includes('LONG')) return 'text-emerald-400';
  if (regime.includes('SHORT')) return 'text-red-400';
  return 'text-amber-300';
}

export default async function RankingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { tab } = await searchParams;
  const active = resolveTab(tab);
  const rows = await getRankingBoard(active.kind, 20);
  const showResult = active.kind === 'most-profitable';

  return (
    <div className="min-h-screen bg-[#080d14] text-slate-200">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Rankings</h1>
        <p className="mt-2 text-sm text-slate-400">
          Calculated live from real signals. Cached for a few minutes.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {TABS.map((item) => (
            <Link
              key={item.kind}
              href={`/rankings?tab=${item.kind}`}
              scroll={false}
              className={`rounded-lg border px-3 py-1.5 text-xs transition ${
                item.kind === active.kind
                  ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-400'
                  : 'border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <p className="mt-4 text-xs text-slate-500">{active.note}</p>

        <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.08] bg-[#121923]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/[0.08] text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Symbol</th>
                <th className="px-4 py-3 font-medium">Regime</th>
                <th className="px-4 py-3 font-medium">Reliability</th>
                <th className="px-4 py-3 font-medium">Strategy</th>
                <th className="px-4 py-3 font-medium">Timeframe</th>
                {showResult && <th className="px-4 py-3 font-medium">Result</th>}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={showResult ? 7 : 6} className="px-4 py-8 text-center text-sm text-slate-500">
                    No data for this ranking yet.
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr key={row.id} className="border-b border-white/[0.04] last:border-0">
                    <td className="px-4 py-3 text-slate-600">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-white">{row.symbol}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs ${regimeClass(row.regime)}`}>{row.regime}</span>
                    </td>
                    <td className="px-4 py-3 text-emerald-400">{row.reliability}%</td>
                    <td className="px-4 py-3 text-slate-400">{row.strategy}</td>
                    <td className="px-4 py-3 text-slate-400">{row.timeframe}</td>
                    {showResult && (
                      <td className={`px-4 py-3 ${row.result?.startsWith('-') ? 'text-red-400' : 'text-emerald-400'}`}>
                        {row.result ?? '--'}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] p-6">
          <p className="text-sm font-medium text-white">Want full ranking history and filters?</p>
          <Link href="/pricing" className="mt-3 inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:underline">
            View plans <ArrowRight size={14} />
          </Link>
        </div>
      </main>

      <SiteFooter showPreviewToggle />
    </div>
  );
}
