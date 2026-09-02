import { prisma } from '../lib/prisma';
import { redis, CACHE_KEYS, CACHE_TTL } from '../lib/redis';
import { jsonSafe } from '../lib/serializer';

export async function getMostReliableCoins(limit = 10) {
  const cached = await redis.get(CACHE_KEYS.rankingReliable).catch(() => null);
  if (cached) return JSON.parse(cached);

  const results = await prisma.signal.groupBy({
    by: ['symbol'],
    _avg: { reliability: true },
    where: { status: 'active' },
    orderBy: { _avg: { reliability: 'desc' } },
    take: limit,
  });
  const safe = jsonSafe(results);
  await redis.set(CACHE_KEYS.rankingReliable, JSON.stringify(safe), 'EX', CACHE_TTL).catch(() => {});
  return safe;
}

export async function getBestLong(limit = 10) {
  return prisma.signal.findMany({
    where: { status: 'active', direction: 'LONG' },
    orderBy: { reliability: 'desc' },
    take: limit,
  });
}

export async function getBestShort(limit = 10) {
  return prisma.signal.findMany({
    where: { status: 'active', direction: 'SHORT' },
    orderBy: { reliability: 'desc' },
    take: limit,
  });
}
