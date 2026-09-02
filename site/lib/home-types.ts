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

/** A coin ranking row. `score` is a percentage for reliability rankings. */
export type CoinRank = {
  symbol: string;
  score: number;
};

export type HomeData = {
  btc: BtcRegimeView;
  longSignals: Signal[];
  shortSignals: Signal[];
  reliableCoins: CoinRank[];
};
