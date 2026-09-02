import type { BtcRegimeView, TimeframeLabel } from '@/lib/home-types';
import { regimeLabel, regimeTone } from '@/lib/format';

const TIMEFRAME_ORDER: TimeframeLabel[] = ['15m', '1h', '4h', '1d'];

const HEADLINE_CLASS = {
  long: 'text-emerald-400',
  short: 'text-red-400',
  neutral: 'text-amber-300',
} as const;

const BADGE_CLASS = {
  long: 'bg-emerald-500/10 text-emerald-400',
  short: 'bg-red-500/10 text-red-400',
  neutral: 'bg-amber-400/10 text-amber-300',
} as const;

const BADGE_LABEL_CLASS = {
  long: 'text-emerald-300/60',
  short: 'text-red-300/60',
  neutral: 'text-amber-200/60',
} as const;

export function BtcRegimeCard({ btc }: { btc: BtcRegimeView }) {
  const tone = regimeTone(btc.regime);
  const timeframes = TIMEFRAME_ORDER.filter((timeframe) => btc.timeframes[timeframe]);

  return <div className="mt-12 rounded-2xl border border-white/[0.09] bg-[#0f1721] p-5 shadow-2xl shadow-black/20 sm:p-6"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-lg font-bold text-amber-950">₿</div><div><p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Bitcoin market regime</p><p className={`mt-1 text-xl font-semibold ${HEADLINE_CLASS[tone]}`}>{btc.regime ?? 'NO DATA'}</p></div></div><div className="mt-5 flex flex-wrap gap-2">{timeframes.map((timeframe) => {
    const timeframeRegime = btc.timeframes[timeframe] ?? null;
    const timeframeTone = regimeTone(timeframeRegime);
    return <span key={timeframe} className={`rounded-md px-3 py-1.5 text-xs ${BADGE_CLASS[timeframeTone]}`}>{timeframe} <span className={`ml-1 ${BADGE_LABEL_CLASS[timeframeTone]}`}>{regimeLabel(timeframeRegime)}</span></span>;
  })}</div></div><div className="flex gap-8 border-t border-white/[0.07] pt-4 text-xs sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0"><div><p className="text-slate-500">Last update</p><p className="mt-1 font-medium text-white">{btc.updatedAgo ?? '--'}</p><p className="mt-1 text-slate-500">Every 5 minutes</p></div><div><p className="text-slate-500">Markets</p><p className="mt-1 font-medium text-white">USDT, USDC &amp; BTC</p><p className="mt-1 text-slate-500">Live coverage</p></div></div></div></div>;
}
