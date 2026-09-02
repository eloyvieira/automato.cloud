export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getMostProfitableCoins, getMostReliableCoins } from '@/services/ranking.service';

export async function GET() {
  const [rankings, profitable] = await Promise.all([
    getMostReliableCoins(20),
    getMostProfitableCoins(20),
  ]);

  return NextResponse.json({ rankings, profitable });
}
