import Redis from 'ioredis';

const globalForRedis = globalThis as unknown as { redis: Redis | undefined };

export const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

export const CACHE_KEYS = {
  btcRegime: 'market:btc:regime',
  topLong: 'signals:long:top',
  topShort: 'signals:short:top',
  rankingReliable: 'ranking:reliable',
  rankingProfitable: 'ranking:profitable',
} as const;

export const CACHE_TTL = 300;
