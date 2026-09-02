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

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = CACHE_TTL,
): Promise<T> {
  try {
    const cached = await redis.get(key);

    if (cached) {
      return JSON.parse(cached) as T;
    }

    const data = await fetcher();

    await redis.set(key, JSON.stringify(data), 'EX', ttl);

    return data;
  } catch (error) {
    console.error(`Redis cache error [${key}]:`, error);

    return fetcher();
  }
}

export async function clearCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    console.error(`Redis delete error [${key}]:`, error);
  }
}