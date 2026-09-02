/**
 * Server-side data layer for the Home page.
 *
 * Request -> Redis (5 min) -> on miss: Prisma/MySQL -> store in Redis -> return.
 * MySQL is the source of truth; Redis is only a cache and is optional.
 *
 * Never import this module from a Client Component.
 */
import { prisma } from './prisma';
import { CACHE_KEYS, CACHE_TTL, getCached } from './redis';
import { formatAge, formatPrice } from './format';
import type {
  BtcRegimeView,
  CoinRank,
  HomeData,
  RegimeCode,
  Signal,
  TimeframeLabel,
} from './home-types';

const BTC_SYMBOL = 'BTC';
const BTC_QUOTE_ASSET = 'USDT';

/**
 * `market_regimes` stores one row per timeframe and has no aggregate column,
 * so the headline regime shown in the hero is the 1h row (falling back to the
 * most recently analyzed timeframe when 1h is missing).
 */
const HEADLINE_TIMEFRAME: TimeframeLabel = '1h';

/** Window used by the "7 day view" rankings. */
const RANKING_WINDOW_DAYS = 7;

const TIMEFRAME_LABEL = {
  fifteen_m: '15m',
  one_h: '1h',
  four_h: '4h',
  one_d: '1d',
} as const;

const STRATEGY_LABEL = {
  scalping: 'Scalping',
  day: 'Day',
  swing: 'Swing',
} as const;

type PrismaTimeframe = keyof typeof TIMEFRAME_LABEL;
type PrismaStrategy = keyof typeof STRATEGY_LABEL;

/** Cached row shapes: plain JSON only (no Decimal, no Date, no BigInt). */
type MarketRegimeRow = {
  symbol: string;
  quoteAsset: string;
  timeframe: PrismaTimeframe;
  regime: RegimeCode;
  strength: number | null;
  aiConfidence: number | null;
  analyzedAt: string;
};

type SignalRow = {
  id: string;
  symbol: string;
  quoteAsset: string;
  direction: 'LONG' | 'SHORT';
  regime: string;
  reliability: number | null;
  strategy: PrismaStrategy;
  timeframe: PrismaTimeframe;
  entryPrice: number | null;
  stopLoss: number | null;
  takeProfit1: number | null;
  takeProfit2: number | null;
  detectedAt: string;
};

type CoinRankRow = {
  symbol: string;
  quoteAsset: string;
  score: number;
};

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function since(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

function pair(symbol: string, quoteAsset: string): string {
  return `${symbol}/${quoteAsset}`;
}

/* ------------------------------------------------------------------ *
 * Cached readers (Redis -> Prisma)
 * ------------------------------------------------------------------ */

/** Raw BTC regime rows, one per analyzed timeframe. */
export function getBtcRegimeRows(): Promise<MarketRegimeRow[]> {
  return getCached<MarketRegimeRow[]>(
    CACHE_KEYS.btcRegime,
    async () => {
      const rows = await prisma.marketRegime.findMany({
        where: { symbol: BTC_SYMBOL, quoteAsset: BTC_QUOTE_ASSET },
        select: {
          symbol: true,
          quoteAsset: true,
          timeframe: true,
          regime: true,
          strength: true,
          aiConfidence: true,
          analyzedAt: true,
        },
        orderBy: { analyzedAt: 'desc' },
      });

      return rows.map((row) => ({
        symbol: row.symbol,
        quoteAsset: row.quoteAsset,
        timeframe: row.timeframe as PrismaTimeframe,
        regime: row.regime as RegimeCode,
        strength: toNumber(row.strength),
        aiConfidence: toNumber(row.aiConfidence),
        analyzedAt: row.analyzedAt.toISOString(),
      }));
    },
    CACHE_TTL,
  );
}

async function getTopSignalRows(
  direction: 'LONG' | 'SHORT',
  limit: number,
): Promise<SignalRow[]> {
  const key =
    direction === 'LONG' ? CACHE_KEYS.topLong(limit) : CACHE_KEYS.topShort(limit);

  return getCached<SignalRow[]>(
    key,
    async () => {
      const signals = await prisma.signal.findMany({
        where: { status: 'active', direction },
        orderBy: [{ reliability: 'desc' }, { detectedAt: 'desc' }],
        take: limit,
        select: {
          id: true,
          symbol: true,
          quoteAsset: true,
          direction: true,
          regime: true,
          reliability: true,
          strategy: true,
          timeframe: true,
          entryPrice: true,
          stopLoss: true,
          takeProfit1: true,
          takeProfit2: true,
          detectedAt: true,
        },
      });

      return signals.map((signal) => ({
        id: signal.id.toString(),
        symbol: signal.symbol,
        quoteAsset: signal.quoteAsset,
        direction: signal.direction,
        regime: signal.regime,
        reliability: toNumber(signal.reliability),
        strategy: signal.strategy as PrismaStrategy,
        timeframe: signal.timeframe as PrismaTimeframe,
        entryPrice: toNumber(signal.entryPrice),
        stopLoss: toNumber(signal.stopLoss),
        takeProfit1: toNumber(signal.takeProfit1),
        takeProfit2: toNumber(signal.takeProfit2),
        detectedAt: signal.detectedAt.toISOString(),
      }));
    },
    CACHE_TTL,
  );
}

export function getTopLongSignalRows(limit = 5): Promise<SignalRow[]> {
  return getTopSignalRows('LONG', limit);
}

export function getTopShortSignalRows(limit = 5): Promise<SignalRow[]> {
  return getTopSignalRows('SHORT', limit);
}

/** Average reliability per market over the ranking window. */
export function getReliableCoinRows(limit = 5): Promise<CoinRankRow[]> {
  return getCached<CoinRankRow[]>(
    CACHE_KEYS.rankingReliable(RANKING_WINDOW_DAYS, limit),
    async () => {
      const grouped = await prisma.signal.groupBy({
        by: ['symbol', 'quoteAsset'],
        where: {
          reliability: { not: null },
          detectedAt: { gte: since(RANKING_WINDOW_DAYS) },
        },
        _avg: { reliability: true },
        orderBy: { _avg: { reliability: 'desc' } },
        take: limit,
      });

      return grouped.map((group) => ({
        symbol: group.symbol,
        quoteAsset: group.quoteAsset,
        score: toNumber(group._avg.reliability) ?? 0,
      }));
    },
    CACHE_TTL,
  );
}

/**
 * Average realized result per market over the ranking window, based on closed
 * signals (`signals.result_perc`). Returns an empty list until signals are
 * closed with a result.
 */
export function getProfitableCoinRows(limit = 5): Promise<CoinRankRow[]> {
  return getCached<CoinRankRow[]>(
    CACHE_KEYS.rankingProfitable(RANKING_WINDOW_DAYS, limit),
    async () => {
      const grouped = await prisma.signal.groupBy({
        by: ['symbol', 'quoteAsset'],
        where: {
          status: 'closed',
          resultPerc: { not: null },
          closedAt: { gte: since(RANKING_WINDOW_DAYS) },
        },
        _avg: { resultPerc: true },
        orderBy: { _avg: { resultPerc: 'desc' } },
        take: limit,
      });

      return grouped.map((group) => ({
        symbol: group.symbol,
        quoteAsset: group.quoteAsset,
        score: toNumber(group._avg.resultPerc) ?? 0,
      }));
    },
    CACHE_TTL,
  );
}

/* ------------------------------------------------------------------ *
 * View models (mapped per request, so relative times never go stale)
 * ------------------------------------------------------------------ */

function toBtcRegimeView(rows: MarketRegimeRow[], now: number): BtcRegimeView {
  const timeframes: Partial<Record<TimeframeLabel, RegimeCode>> = {};

  for (const row of rows) {
    const label = TIMEFRAME_LABEL[row.timeframe];
    if (label) timeframes[label] = row.regime;
  }

  // Rows arrive ordered by analyzedAt desc, so rows[0] is the freshest.
  const updatedAt = rows[0]?.analyzedAt ?? null;

  return {
    regime: timeframes[HEADLINE_TIMEFRAME] ?? rows[0]?.regime ?? null,
    updatedAt,
    updatedAgo: updatedAt ? formatAge(updatedAt, now) : null,
    timeframes,
  };
}

function toSignalView(row: SignalRow, now: number): Signal {
  return {
    id: row.id,
    symbol: pair(row.symbol, row.quoteAsset),
    regime: row.regime,
    reliability: Math.round(row.reliability ?? 0),
    strategy: STRATEGY_LABEL[row.strategy] ?? row.strategy,
    timeframe: TIMEFRAME_LABEL[row.timeframe] ?? row.timeframe,
    age: formatAge(row.detectedAt, now),
    entry: formatPrice(row.entryPrice),
    stop: formatPrice(row.stopLoss),
    tp1: formatPrice(row.takeProfit1),
    tp2: formatPrice(row.takeProfit2),
  };
}

function toCoinRank(row: CoinRankRow): CoinRank {
  return { symbol: pair(row.symbol, row.quoteAsset), score: Math.round(row.score) };
}

/* ------------------------------------------------------------------ *
 * Public API used by the Home page
 * ------------------------------------------------------------------ */

export async function getBtcRegime(): Promise<BtcRegimeView> {
  return toBtcRegimeView(await getBtcRegimeRows(), Date.now());
}

export async function getTopLongSignals(limit = 5): Promise<Signal[]> {
  const now = Date.now();
  return (await getTopLongSignalRows(limit)).map((row) => toSignalView(row, now));
}

export async function getTopShortSignals(limit = 5): Promise<Signal[]> {
  const now = Date.now();
  return (await getTopShortSignalRows(limit)).map((row) => toSignalView(row, now));
}

export async function getReliableCoins(limit = 5): Promise<CoinRank[]> {
  return (await getReliableCoinRows(limit)).map(toCoinRank);
}

export async function getProfitableCoins(limit = 5): Promise<CoinRank[]> {
  return (await getProfitableCoinRows(limit)).map(toCoinRank);
}

/** Everything the Home page needs, fetched in parallel. */
export async function getHomeData(): Promise<HomeData> {
  const now = Date.now();

  const [btcRows, longRows, shortRows, reliableRows] = await Promise.all([
    getBtcRegimeRows(),
    getTopLongSignalRows(5),
    getTopShortSignalRows(5),
    getReliableCoinRows(5),
  ]);

  return {
    btc: toBtcRegimeView(btcRows, now),
    longSignals: longRows.map((row) => toSignalView(row, now)),
    shortSignals: shortRows.map((row) => toSignalView(row, now)),
    reliableCoins: reliableRows.map(toCoinRank),
  };
}
