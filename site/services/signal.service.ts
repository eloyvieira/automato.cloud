import { prisma } from '../lib/prisma';
import { getTopLongSignalRows, getTopShortSignalRows } from '../lib/home-data';
import { jsonSafe } from '../lib/serializer';

/** Active LONG signals. Delay/limit are enforced in the database query. */
export async function getTopLongSignals(limit: number | null = 5, delayMinutes = 0) {
  return getTopLongSignalRows(limit, delayMinutes);
}

/** Active SHORT signals. Delay/limit are enforced in the database query. */
export async function getTopShortSignals(limit: number | null = 5, delayMinutes = 0) {
  return getTopShortSignalRows(limit, delayMinutes);
}

export async function getSignalById(id: string) {
  const signal = await prisma.signal.findUnique({ where: { id: BigInt(id) } });
  return signal ? jsonSafe(signal) : null;
}
