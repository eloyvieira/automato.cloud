export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getMostReliableCoins } from '@/services/ranking.service';

export async function GET() {
  const rankings = await getMostReliableCoins(20);
  return NextResponse.json({ rankings });
}
