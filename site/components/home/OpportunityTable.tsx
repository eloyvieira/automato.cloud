import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { Direction, Signal } from '@/lib/home-types';
import { RegimeBadge } from './RegimeBadge';

export function OpportunityTable({
  title,
  signals,
  direction,
}: {
  title: string;
  signals: Signal[];
  direction: Direction;
}) {
  return <div className="rounded-xl border border-white/[0.08] bg-[#121923] p-4"><div className="mb-4 flex items-center justify-between"><h3 className={`text-sm font-semibold ${direction === 'long' ? 'text-emerald-400' : 'text-red-400'}`}>{title}</h3><Link href="/signals" className="text-xs text-slate-500 transition hover:text-white">View all <ChevronRight className="inline" size={13} /></Link></div><div className="space-y-3">{signals.length === 0 ? <p className="text-xs text-slate-500">No active signals right now.</p> : signals.map((signal, index) => <div key={signal.id} className="grid grid-cols-[18px_1fr_auto_auto] items-center gap-2 text-xs"><span className="text-slate-600">{index + 1}</span><span className="font-medium text-slate-200">{signal.symbol}</span><RegimeBadge tone={direction}>{signal.regime}</RegimeBadge><span className="text-slate-500">{signal.age}</span></div>)}</div><div className="mt-4 border-t border-white/[0.06] pt-3 text-[11px] text-slate-500">Prices and execution levels are available with Premium.</div></div>;
}
