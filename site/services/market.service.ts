import { prisma } from '../lib/prisma';
import { redis, CACHE_KEYS, CACHE_TTL } from '../lib/redis';
import { jsonSafe } from '../lib/serializer';

export async function getBtcRegime() {
  const cached = await redis.get(CACHE_KEYS.btcRegime).catch(() => null);
  if (cached) return JSON.parse(cached);

  const regimes = await prisma.marketRegime.findMany({
    where: { symbol: 'BTC', quoteAsset: 'USDT' },
  });
  const safe = jsonSafe(regimes);
  await redis.set(CACHE_KEYS.btcRegime, JSON.stringify(safe), 'EX', CACHE_TTL).catch(() => {});
  return safe;
}

export async function getLastUpdate() {
  const latest = await prisma.marketRegime.findFirst({
    orderBy: { analyzedAt: 'desc' },
  });
  return latest ? jsonSafe(latest.analyzedAt) : null;
}
