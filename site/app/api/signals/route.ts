export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getTopLongSignals, getTopShortSignals } from '@/services/signal.service';
import { getSession } from '@/lib/auth';
import { hasPremiumAccess } from '@/lib/permissions';

export async function GET() {
  const [longSignals, shortSignals] = await Promise.all([
    getTopLongSignals(5),
    getTopShortSignals(5),
  ]);

  const session = await getSession();
  const premium = session ? await hasPremiumAccess(session.userId) : false;

  const stripPremium = (signals: any[]) =>
    signals.map((s) => {
      const { entryPrice, stopLoss, takeProfit1, takeProfit2, ...rest } = s;
      return premium ? s : rest;
    });

  return NextResponse.json({
    long: stripPremium(longSignals),
    short: stripPremium(shortSignals),
    premium,
  });
}
