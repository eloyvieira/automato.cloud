import { prisma } from '../lib/prisma';
import { redis, CACHE_KEYS, CACHE_TTL } from '../lib/redis';
import { jsonSafe } from '../lib/serializer';

export async function getTopLongSignals(limit = 5) {
  const cached = await redis.get(CACHE_KEYS.topLong).catch(() => null);
  if (cached) return JSON.parse(cached);

  const signals = await prisma.signal.findMany({
    where: { status: 'active', direction: 'LONG' },
    orderBy: [{ reliability: 'desc' }, { detectedAt: 'desc' }],
    take: limit,
  });
  const safe = jsonSafe(signals);
  await redis.set(CACHE_KEYS.topLong, JSON.stringify(safe), 'EX', CACHE_TTL).catch(() => {});
  return safe;
}

export async function getTopShortSignals(limit = 5) {
  const cached = await redis.get(CACHE_KEYS.topShort).catch(() => null);
  if (cached) return JSON.parse(cached);

  const signals = await prisma.signal.findMany({
    where: { status: 'active', direction: 'SHORT' },
    orderBy: [{ reliability: 'desc' }, { detectedAt: 'desc' }],
    take: limit,
  });
  const safe = jsonSafe(signals);
  await redis.set(CACHE_KEYS.topShort, JSON.stringify(safe), 'EX', CACHE_TTL).catch(() => {});
  return safe;
}

export async function getSignalById(id: string) {
  const signal = await prisma.signal.findUnique({ where: { id: BigInt(id) } });
  return signal ? jsonSafe(signal) : null;
}
