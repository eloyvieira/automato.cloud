export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getBtcRegime } from '@/services/market.service';

export async function GET() {
  const regime = await getBtcRegime();
  return NextResponse.json({ regime });
}
