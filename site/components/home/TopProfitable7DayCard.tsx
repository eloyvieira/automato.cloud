import type { ProfitSignal } from '@/lib/home-types';

export function TopProfitable7DayCard({
  signals,
  delayed,
}: {
  signals: ProfitSignal[];
  delayed: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#121923] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            7 day view
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">Top 10 most profitable signals</h2>
        </div>
        {delayed && (
          <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-slate-500">
            15 min delay
          </span>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {signals.length === 0 ? (
          <p className="text-sm text-slate-500">No closed signals in the last 7 days.</p>
        ) : (
          signals.map((signal, index) => (
            <div
              key={signal.id}
              className="grid grid-cols-[28px_1fr_auto] items-center gap-3 border-b border-white/[0.04] pb-3 text-sm last:border-0 last:pb-0"
            >
              <span className="text-slate-600">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <p className="font-medium text-slate-200">{signal.symbol}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {signal.strategy} · {signal.timeframe} · {signal.age}
                </p>
              </div>
              <span className={signal.result.startsWith('-') ? 'text-red-400' : 'text-emerald-400'}>
                {signal.result}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
