/**
 * Shared view-model types for the Home page.
 *
 * This module is intentionally free of Prisma/Redis imports so that Client
 * Components can import the types without pulling server code into the browser
 * bundle.
 */

export type Direction = 'long' | 'short';

export type RegimeCode =
  | 'LONG_STRONG'
  | 'LONG_WEAK'
  | 'NEUTRAL'
  | 'SHORT_WEAK'
  | 'SHORT_STRONG';

export type TimeframeLabel = '15m' | '1h' | '4h' | '1d';

/** One tradable signal, already formatted for display. */
export type Signal = {
  id: string;
  symbol: string;
  regime: string;
  reliability: number;
  strategy: string;
  timeframe: string;
  age: string;
  entry: string;
  stop: string;
  tp1: string;
  tp2: string;
};

/** Structured Bitcoin regime data - the UI decides how to label it. */
export type BtcRegimeView = {
  regime: RegimeCode | null;
  /** ISO timestamp of the most recent BTC analysis, or null if none exists. */
  updatedAt: string | null;
  /** Relative label derived from `updatedAt` at request time. */
  updatedAgo: string | null;
  timeframes: Partial<Record<TimeframeLabel, RegimeCode>>;
};

/** One point of the Bitcoin regime trend chart. */
export type RegimeTrendPoint = {
  /** Eixo X: hora da análise ("14:35"). */
  time: string;
  /** Eixo Y: -2 (short strong) .. +2 (long strong). */
  score: number;
  regime: RegimeCode;
  /** Rótulo pronto para o usuário ("Strong Bullish"). */
  label: string;
};

/** A coin ranking row. `score` is a percentage for reliability rankings. */
export type CoinRank = {
  symbol: string;
  score: number;
};

/** The seven boards available on /rankings. */
export type RankingKind =
  | 'most-reliable'
  | 'most-profitable'
  | 'best-long'
  | 'best-short'
  | 'best-scalping'
  | 'best-day'
  | 'best-swing';

/** One row of the /rankings table, already formatted for display. */
export type RankingEntry = {
  id: string;
  symbol: string;
  regime: string;
  reliability: number;
  strategy: string;
  timeframe: string;
  /** Realized result of a closed signal ("+4.20%"), null while it is open. */
  result: string | null;
};

export type HomeData = {
  btc: BtcRegimeView;
  btcTrend: RegimeTrendPoint[];
  longSignals: Signal[];
  shortSignals: Signal[];
  reliableCoins: CoinRank[];
};
