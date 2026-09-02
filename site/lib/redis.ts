import Redis from 'ioredis';

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
  redisErrorHandlerAttached: boolean | undefined;
};

export const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    lazyConnect: true,
    // Fail fast instead of hanging a page render when Redis is unreachable:
    // every cached read falls back to Prisma/MySQL.
    maxRetriesPerRequest: 2,
    connectTimeout: 3000,
    commandTimeout: 2000,
    retryStrategy: (times) => Math.min(times * 200, 2000),
  });

// Without an 'error' listener ioredis turns a connection failure into an
// unhandled event, which would take the Node process down.
if (!globalForRedis.redisErrorHandlerAttached) {
  redis.on('error', (error) => {
    console.error('[redis] connection error:', error.message);
  });
  globalForRedis.redisErrorHandlerAttached = true;
}

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

/**
 * Cache keys. Anything that changes the shape or size of the payload must be
 * part of the key, otherwise a request with a different `limit` would read a
 * cache entry that does not match it.
 */
export const CACHE_KEYS = {
  btcRegime: 'market:btc:regime',
  btcRegimeTrend: (timeframe: string, points: number) =>
    `market:btc:regime:trend:${timeframe}:${points}`,
  topLong: (limit: number) => `signals:long:top:${limit}`,
  topShort: (limit: number) => `signals:short:top:${limit}`,
  rankingReliable: (windowDays: number, limit: number) =>
    `ranking:reliable:${windowDays}d:${limit}`,
  rankingProfitable: (windowDays: number, limit: number) =>
    `ranking:profitable:${windowDays}d:${limit}`,
} as const;

/** Market data is recalculated roughly every 5 minutes. */
export const CACHE_TTL = 60;

/**
 * After a failed command, Redis is skipped for a short while so that a single
 * page render does not wait on a dead server once per cache key.
 */
const REDIS_DOWN_COOLDOWN_MS = 10_000;
let redisDownUntil = 0;

const redisReachable = () => Date.now() >= redisDownUntil;
const markRedisDown = () => {
  redisDownUntil = Date.now() + REDIS_DOWN_COOLDOWN_MS;
};

/**
 * Read-through cache. MySQL is the source of truth: if Redis is unavailable
 * (read or write), the fetcher still runs exactly once and its result is
 * returned, so the page keeps working without Redis.
 */
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = CACHE_TTL,
): Promise<T> {
  if (redisReachable()) {
    try {
      const cached = await redis.get(key);
      if (cached) return JSON.parse(cached) as T;
    } catch (error) {
      markRedisDown();
      console.error(`Redis read error [${key}]:`, error);
    }
  }

  const data = await fetcher();

  if (redisReachable()) {
    try {
      await redis.set(key, JSON.stringify(data), 'EX', ttl);
    } catch (error) {
      markRedisDown();
      console.error(`Redis write error [${key}]:`, error);
    }
  }

  return data;
}

export async function clearCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    console.error(`Redis delete error [${key}]:`, error);
  }
}
