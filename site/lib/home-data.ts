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
import { formatAge, formatClock, formatPrice, regimeLabel, regimeScore } from './format';
import type {
  BtcRegimeView,
  CoinRank,
  HomeData,
  ProfitSignal,
  RankingEntry,
  RankingKind,
  RegimeCode,
  RegimeTrendPoint,
  Signal,
  TimeframeLabel,
} from './home-types';
import { cutoffDate, type AccessPolicy } from './access-policy';

const BTC_SYMBOL = 'BTC';
const BTC_QUOTE_ASSET = 'USDT';

/**
 * `market_regimes` stores one row per timeframe and has no aggregate column,
 * so the headline regime shown in the hero is the 1h row (falling back to the
 * most recently analyzed timeframe when 1h is missing).
 */
const HEADLINE_TIMEFRAME: TimeframeLabel = '15m';

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

/** Timeframe e número de leituras do gráfico de tendência do hero. */
const TREND_TIMEFRAME: PrismaTimeframe = 'fifteen_m';
const TREND_POINTS = 20;

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
  category: string | null;
  entryPrice: number | null;
  stopLoss: number | null;
  takeProfit1: number | null;
  takeProfit2: number | null;
  mfe: number | null;
  mae: number | null;
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
        orderBy: { id: 'desc' },
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

/**
 * Últimas leituras de regime do BTC no timeframe do gráfico, em ordem
 * cronológica (mais antiga primeiro).
 *
 * Atenção: `market_regimes` tem UNIQUE (symbol, quote_asset, timeframe), ou
 * seja, guarda apenas o estado atual - uma linha por timeframe. Enquanto não
 * existir histórico, esta consulta devolve no máximo 1 ponto.
 */
export function getBtcRegimeTrendRows(): Promise<MarketRegimeRow[]> {
  return getCached<MarketRegimeRow[]>(
    CACHE_KEYS.btcRegimeTrend(TIMEFRAME_LABEL[TREND_TIMEFRAME], TREND_POINTS),
    async () => {
      const rows = await prisma.marketRegime.findMany({
        where: {
          symbol: BTC_SYMBOL,
          quoteAsset: BTC_QUOTE_ASSET,
          timeframe: TREND_TIMEFRAME,
        },
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
        take: TREND_POINTS,
      });

      return rows.reverse().map((row) => ({
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
  limit: number | null,
  delayMinutes = 0,
): Promise<SignalRow[]> {
  const key =
    direction === 'LONG'
      ? CACHE_KEYS.topLong(limit, delayMinutes)
      : CACHE_KEYS.topShort(limit, delayMinutes);

  return getCached<SignalRow[]>(
    key,
    async () => {
      const cutoff = cutoffDate(delayMinutes);
      const signals = await prisma.signal.findMany({
        where: {
          status: 'active',
          direction,
          ...(cutoff ? { detectedAt: { lte: cutoff } } : {}),
        },
        orderBy: [{ detectedAt: 'desc' }],
        ...(limit === null ? {} : { take: limit }),
        select: {
          id: true,
          symbol: true,
          quoteAsset: true,
          direction: true,
          regime: true,
          reliability: true,
          strategy: true,
          timeframe: true,
          category: true,
          entryPrice: true,
          stopLoss: true,
          takeProfit1: true,
          takeProfit2: true,
          mfe: true,
          mae: true,
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
        category: signal.category,
        entryPrice: toNumber(signal.entryPrice),
        stopLoss: toNumber(signal.stopLoss),
        takeProfit1: toNumber(signal.takeProfit1),
        takeProfit2: toNumber(signal.takeProfit2),
        mfe: toNumber(signal.mfe),
        mae: toNumber(signal.mae),
        detectedAt: signal.detectedAt.toISOString(),
      }));
    },
    CACHE_TTL,
  );
}

async function getTopMfeSignalRows(limit: number, delayMinutes = 0): Promise<SignalRow[]> {
  const key = CACHE_KEYS.topMfe(limit, delayMinutes);

  return getCached<SignalRow[]>(
    key,
    async () => {
      const cutoff = cutoffDate(delayMinutes);
      const signals = await prisma.signal.findMany({
        where: {
          status: 'active',
          mfe: { not: null },
          ...(cutoff ? { detectedAt: { lte: cutoff } } : {}),
        },
        orderBy: [
          { mfe: 'desc' },
          { detectedAt: 'desc' },
        ],
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
          category: true,
          entryPrice: true,
          stopLoss: true,
          takeProfit1: true,
          takeProfit2: true,
          mfe: true,
          mae: true,
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
        category: signal.category,
        entryPrice: toNumber(signal.entryPrice),
        stopLoss: toNumber(signal.stopLoss),
        takeProfit1: toNumber(signal.takeProfit1),
        takeProfit2: toNumber(signal.takeProfit2),
        mfe: toNumber(signal.mfe),
        mae: toNumber(signal.mae),
        detectedAt: signal.detectedAt.toISOString(),
      }));
    },
    CACHE_TTL,
  );
}

export function getTopLongSignalRows(limit: number | null = 5, delayMinutes = 0): Promise<SignalRow[]> {
  return getTopSignalRows('LONG', limit, delayMinutes);
}

export function getTopShortSignalRows(limit: number | null = 5, delayMinutes = 0): Promise<SignalRow[]> {
  return getTopSignalRows('SHORT', limit, delayMinutes);
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

  const normalizeTimeframe = (timeframe: string): TimeframeLabel | null => {
    const map: Record<string, TimeframeLabel> = {
      '15m': '15m',
      '1h': '1h',
      '4h': '4h',
      '1d': '1d',

      fifteen_m: '15m',
      one_h: '1h',
      four_h: '4h',
      one_d: '1d',
    };

    return map[timeframe] ?? null;
  };

  for (const row of rows) {
    const label = normalizeTimeframe(row.timeframe);
    if (label && timeframes[label] === undefined) {
      timeframes[label] = row.regime;
    }
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

function toRegimeTrendPoint(row: MarketRegimeRow): RegimeTrendPoint {
  return {
    time: formatClock(row.analyzedAt),
    score: regimeScore(row.regime),
    regime: row.regime,
    label: regimeLabel(row.regime),
  };
}

function formatSignedPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '--';
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
}

function toSignalView(row: SignalRow, now: number): Signal {
  return {
    id: row.id,
    direction: row.direction,
    symbol: pair(row.symbol, row.quoteAsset),
    regime: row.regime,
    reliability: Math.round(row.reliability ?? 0),
    strategy: STRATEGY_LABEL[row.strategy] ?? row.strategy,
    timeframe: TIMEFRAME_LABEL[row.timeframe] ?? row.timeframe,
    category: row.category ?? '--',
    age: formatAge(row.detectedAt, now),

    entry: formatPrice(row.entryPrice),
    stop: formatPrice(row.stopLoss),
    tp1: formatPrice(row.takeProfit1),
    tp2: formatPrice(row.takeProfit2),

    mfe: formatSignedPercent(row.mfe),
    mae: formatSignedPercent(row.mae),
  };
}

function toCoinRank(row: CoinRankRow): CoinRank {
  return { symbol: pair(row.symbol, row.quoteAsset), score: Math.round(row.score) };
}

/* ------------------------------------------------------------------ *
 * Rankings page (/rankings)
 * ------------------------------------------------------------------ */

type RankingRow = SignalRow & { resultPerc: number | null };

/**
 * Prisma filter/order for each board. Every board reads real `signals` rows:
 * Top MFE and direction/strategy boards rank active signals by `mfe`;
 * Most Profitable ranks closed signals by `result_perc`.
 */
const RANKING_QUERY: Record<
  RankingKind,
  { where: Record<string, unknown>; orderBy: Record<string, 'asc' | 'desc'>[] }
> = {
  'top-mfe': {
    where: { status: 'active', mfe: { not: null } },
    orderBy: [{ mfe: 'desc' }, { detectedAt: 'desc' }],
  },
  'most-profitable': {
    where: { status: 'closed', resultPerc: { not: null } },
    orderBy: [{ resultPerc: 'desc' }, { closedAt: 'desc' }],
  },
  'best-long': {
    where: { status: 'active', direction: 'LONG', mfe: { not: null } },
    orderBy: [{ mfe: 'desc' }, { detectedAt: 'desc' }],
  },
  'best-short': {
    where: { status: 'active', direction: 'SHORT', mfe: { not: null } },
    orderBy: [{ mfe: 'desc' }, { detectedAt: 'desc' }],
  },
  'best-scalping': {
    where: { status: 'active', strategy: 'scalping', mfe: { not: null } },
    orderBy: [{ mfe: 'desc' }, { detectedAt: 'desc' }],
  },
  'best-day': {
    where: { status: 'active', strategy: 'day', mfe: { not: null } },
    orderBy: [{ mfe: 'desc' }, { detectedAt: 'desc' }],
  },
  'best-swing': {
    where: { status: 'active', strategy: 'swing', mfe: { not: null } },
    orderBy: [{ mfe: 'desc' }, { detectedAt: 'desc' }],
  },
};

/** Raw rows of one ranking board, cached in Redis like every other read. */
export function getRankingRows(
  kind: RankingKind,
  limit: number | null = 20,
  delayMinutes = 0,
): Promise<RankingRow[]> {
  const query = RANKING_QUERY[kind];

  return getCached<RankingRow[]>(
    CACHE_KEYS.rankingBoard(kind, limit, delayMinutes),
    async () => {
      const cutoff = cutoffDate(delayMinutes);
      const delayField = kind === 'most-profitable' ? 'closedAt' : 'detectedAt';
      const where = {
        ...query.where,
        ...(cutoff ? { [delayField]: { lte: cutoff } } : {}),
      };

      const signals = await prisma.signal.findMany({
        where,
        orderBy: query.orderBy,
        ...(limit === null ? {} : { take: limit }),
        select: {
          id: true,
          symbol: true,
          quoteAsset: true,
          direction: true,
          regime: true,
          reliability: true,
          strategy: true,
          timeframe: true,
          category: true,
          entryPrice: true,
          stopLoss: true,
          takeProfit1: true,
          takeProfit2: true,
          mfe: true,
          mae: true,
          resultPerc: true,
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
        category: signal.category,
        entryPrice: toNumber(signal.entryPrice),
        stopLoss: toNumber(signal.stopLoss),
        takeProfit1: toNumber(signal.takeProfit1),
        takeProfit2: toNumber(signal.takeProfit2),
        mfe: toNumber(signal.mfe),
        mae: toNumber(signal.mae),
        resultPerc: toNumber(signal.resultPerc),
        detectedAt: signal.detectedAt.toISOString(),
      }));
    },
    CACHE_TTL,
  );
}

function toRankingEntry(row: RankingRow): RankingEntry {
  return {
    id: row.id,
    symbol: pair(row.symbol, row.quoteAsset),
    regime: row.regime,
    mfe: formatSignedPercent(row.mfe),
    mae: formatSignedPercent(row.mae),
    strategy: STRATEGY_LABEL[row.strategy] ?? row.strategy,
    timeframe: TIMEFRAME_LABEL[row.timeframe] ?? row.timeframe,
    detectedAt: new Date(row.detectedAt).toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
    result:
      row.resultPerc === null
        ? null
        : `${row.resultPerc > 0 ? '+' : ''}${row.resultPerc.toFixed(2)}%`,
  };
}

/** One ranking board, ready to render. */
export async function getRanking(
  kind: RankingKind,
  limit: number | null = 20,
  delayMinutes = 0,
): Promise<RankingEntry[]> {
  return (await getRankingRows(kind, limit, delayMinutes)).map(toRankingEntry);
}

type ProfitableSignalRow = {
  id: string;
  symbol: string;
  quoteAsset: string;
  direction: 'LONG' | 'SHORT';
  strategy: PrismaStrategy;
  timeframe: PrismaTimeframe;
  mfe: number;
  closedAt: string;
};

async function getTopProfitableSignalRows(
  windowDays: number,
  limit: number,
  delayMinutes = 0,
): Promise<ProfitableSignalRow[]> {
  return getCached<ProfitableSignalRow[]>(
    CACHE_KEYS.topProfitableSignals(windowDays, limit, delayMinutes),
    async () => {
      const cutoff = cutoffDate(delayMinutes);
      const rows = await prisma.signal.findMany({
        where: {
          status: 'closed',
          mfe: { not: null },
          closedAt: {
            gte: since(windowDays),
            ...(cutoff ? { lte: cutoff } : {}),
          },
        },
        orderBy: [{ mfe: 'desc' }, { closedAt: 'desc' }],
        take: limit,
        select: {
          id: true,
          symbol: true,
          quoteAsset: true,
          direction: true,
          strategy: true,
          regime: true,
          timeframe: true,
          mfe: true,
          closedAt: true,
        },
      });

      return rows
        .filter((row) => row.mfe !== null && row.closedAt !== null)
        .map((row) => ({
          id: row.id.toString(),
          symbol: row.symbol,
          quoteAsset: row.quoteAsset,
          direction: row.direction,
          regime: row.regime,
          strategy: row.strategy as PrismaStrategy,
          timeframe: row.timeframe as PrismaTimeframe,
          mfe: Number(row.mfe),
          closedAt: row.closedAt!.toISOString(),
        }));
    },
    CACHE_TTL,
  );
}

function toProfitSignal(row: ProfitableSignalRow, now: number): ProfitSignal {
  return {
    id: row.id,
    symbol: pair(row.symbol, row.quoteAsset),
    direction: row.direction,
    strategy: STRATEGY_LABEL[row.strategy] ?? row.strategy,
    timeframe: TIMEFRAME_LABEL[row.timeframe] ?? row.timeframe,
    regime: row.regime,
    mfe: formatSignedPercent(row.mfe),
    age: formatAge(row.closedAt, now),
  };
}

/* ------------------------------------------------------------------ *
 * Public API used by the Home page
 * ------------------------------------------------------------------ */

export async function getBtcRegime(): Promise<BtcRegimeView> {
  return toBtcRegimeView(await getBtcRegimeRows(), Date.now());
}

export async function getBtcRegimeTrend(): Promise<RegimeTrendPoint[]> {
  return (await getBtcRegimeTrendRows()).map(toRegimeTrendPoint);
}

export async function getTopLongSignals(limit: number | null = 5, delayMinutes = 0): Promise<Signal[]> {
  const now = Date.now();
  return (await getTopLongSignalRows(limit, delayMinutes)).map((row) => toSignalView(row, now));
}

export async function getTopShortSignals(limit: number | null = 5, delayMinutes = 0): Promise<Signal[]> {
  const now = Date.now();
  return (await getTopShortSignalRows(limit, delayMinutes)).map((row) => toSignalView(row, now));
}

export async function getReliableCoins(limit = 5): Promise<CoinRank[]> {
  return (await getReliableCoinRows(limit)).map(toCoinRank);
}

export async function getProfitableCoins(limit = 5): Promise<CoinRank[]> {
  return (await getProfitableCoinRows(limit)).map(toCoinRank);
}

/** Everything the Home page needs, fetched in parallel. */
export async function getHomeData(policy: AccessPolicy): Promise<HomeData> {
  const now = Date.now();

  const [
    btcRows,
    btcTrendRows,
    longRows,
    shortRows,
    topMfeRows,
    sevenDayRows,
    reliableRows,
  ] = await Promise.all([
    getBtcRegimeRows(),
    getBtcRegimeTrendRows(),
    getTopLongSignalRows(policy.signalListLimit, policy.signalDelayMinutes),
    getTopShortSignalRows(policy.signalListLimit, policy.signalDelayMinutes),
    getTopMfeSignalRows(policy.signalCardLimit, policy.signalDelayMinutes),
    getTopProfitableSignalRows(7, policy.sevenDayLimit, policy.signalDelayMinutes),
    getReliableCoinRows(5),
  ]);

  const btc = toBtcRegimeView(btcRows, now);

  return {
    btc,
    btcTrend: btcTrendRows.map(toRegimeTrendPoint),
    longSignals: longRows.map((row) => toSignalView(row, now, policy.premium)),
    shortSignals: shortRows.map((row) => toSignalView(row, now, policy.premium)),
    profitableSignals: topMfeRows.map((row) => toSignalView(row, now, policy.premium)),
    sevenDayProfitableSignals: sevenDayRows.map((row) => toProfitSignal(row, now)),
    reliableCoins: reliableRows.map(toCoinRank),
  };
}
