'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { RegimeTrendPoint } from '@/lib/home-types';
import { REGIME_SCORE_MAX, REGIME_SCORE_MIN, regimeByScore, regimeLabel } from '@/lib/format';

const Y_TICKS = [REGIME_SCORE_MAX, 1, 0, -1, REGIME_SCORE_MIN];

/** Rótulo acima de cada ponto, como no exemplo "Customized Label Line Chart". */
function CustomizedLabel({ x, y, value }: { x?: number; y?: number; value?: number }) {
  if (x === undefined || y === undefined || value === undefined) return null;
  if (value === 1 || value === 2 || value === 0 || value === -1 || value === -2) return null;

  return (
    <text x={x} y={y} dy={-10} fill="#34d399" fontSize={10} textAnchor="middle">
      {value > 0 ? `+${value}` : value}
    </text>
  );
}

function CustomizedDot(props: any) {
  const { cx, cy, payload } = props;

  const color =
    payload.score > 0
      ? '#34d399'
      : payload.score < 0
        ? '#ef4444'
        : '#facc15';

  return <circle cx={cx} cy={cy} r={3.5} fill={color} />;
}

/** Tick rotacionado no eixo X, como no exemplo da Recharts. */
function CustomizedAxisTick({
  x,
  y,
  payload,
}: {
  x?: number;
  y?: number;
  payload?: { value: string };
}) {
  if (x === undefined || y === undefined || !payload) return null;

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={12} fontSize={10} fill="#64748b" textAnchor="end" transform="rotate(-35)">
        {payload.value}
      </text>
    </g>
  );
}

function RegimeTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: RegimeTrendPoint }[];
}) {
  const point = active ? payload?.[0]?.payload : undefined;
  if (!point) return null;

  return (
    <div className="rounded-lg border border-white/10 bg-[#0f1721] px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-white">{point.label}</p>
      <p className="mt-0.5 text-slate-500">
        {point.regime} · {point.time}
      </p>
    </div>
  );
}

export function BtcRegimeTrendChart({ points }: { points: RegimeTrendPoint[] }) {
  return (
    <div className="rounded-2xl border border-white/[0.09] bg-[#0f1721] p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">
          Bitcoin regime trend
        </p>
        <p className="text-[10px] text-slate-500">15m · last {points.length || 7} readings</p>
      </div>

      <div className="mt-3 h-[220px] w-full">
        {points.length < 2 ? (
          <div className="flex h-full items-center justify-center px-4 text-center text-xs leading-5 text-slate-500">
            Not enough 15m readings stored yet to draw a trend.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points} margin={{ top: 18, right: 12, left: 0, bottom: 8 }}>
              <defs>
                <linearGradient id="regimeLineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="49%" stopColor="#34d399" />
                  <stop offset="50%" stopColor="#facc15" />
                  <stop offset="51%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" />

              <XAxis
                dataKey="time"
                height={40}
                tick={<CustomizedAxisTick />}
                stroke="rgba(255,255,255,.1)"
                interval={0}
              />

              <YAxis
                domain={[REGIME_SCORE_MIN, REGIME_SCORE_MAX]}
                ticks={Y_TICKS}
                tickFormatter={(value: number) => regimeLabel(regimeByScore(value))}
                tick={{ fontSize: 9, fill: '#64748b' }}
                width={84}
                axisLine={false}
                tickLine={false}
              />

              <ReferenceLine
                y={0}
                stroke="rgba(255,255,255,.18)"
                strokeDasharray="4 4"
              />

              <Tooltip
                content={<RegimeTooltip />}
                cursor={{ stroke: 'rgba(255,255,255,.12)' }}
              />

              <Line
                type="monotone"
                dataKey="score"
                stroke="url(#regimeLineGradient)"
                strokeWidth={2}
                dot={<CustomizedDot />}
                activeDot={{ r: 5 }}
                label={<CustomizedLabel />}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
