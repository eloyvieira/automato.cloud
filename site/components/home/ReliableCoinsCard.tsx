import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { CoinRank } from '@/lib/home-types';

export function ReliableCoinsCard({ coins }: { coins: CoinRank[] }) {
  return <div className="rounded-xl border border-white/[0.08] bg-[#121923] p-5"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">7 day view</p><h2 className="mt-2 text-xl font-semibold text-white">Most reliable coins</h2></div><Link href="/rankings" className="text-xs text-slate-500 hover:text-white">Full rankings <ArrowRight className="ml-1 inline" size={13} /></Link></div><div className="mt-6 space-y-4">{coins.length === 0 ? <p className="text-sm text-slate-500">No ranked markets in the last 7 days.</p> : coins.map((coin, index) => <div key={coin.symbol} className="grid grid-cols-[22px_1fr_120px_36px] items-center gap-3 text-sm"><span className="text-slate-600">{String(index + 1).padStart(2, '0')}</span><span className="text-slate-200">{coin.symbol}</span><div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full rounded-full bg-emerald-400" style={{ width: `${coin.score}%` }} /></div><span className="text-right text-emerald-400">{coin.score}%</span></div>)}</div></div>;
}
