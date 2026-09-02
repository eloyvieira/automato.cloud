import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding plans...');
  await prisma.plan.upsert({
    where: { slug: 'premium-weekly' },
    update: {},
    create: {
      name: 'Premium Weekly',
      slug: 'premium-weekly',
      type: 'premium',
      price: 9.90,
      billingPeriod: 'weekly',
      isActive: true,
    },
  });

  await prisma.plan.upsert({
    where: { slug: 'api-starter' },
    update: {},
    create: {
      name: 'API Starter',
      slug: 'api-starter',
      type: 'api',
      price: 29.00,
      billingPeriod: 'monthly',
      apiRequestsDay: 10000,
      isActive: true,
    },
  });

  await prisma.plan.upsert({
    where: { slug: 'api-professional' },
    update: {},
    create: {
      name: 'API Professional',
      slug: 'api-professional',
      type: 'api',
      price: 79.00,
      billingPeriod: 'monthly',
      apiRequestsDay: 100000,
      isActive: true,
    },
  });

  console.log('Seeding BTC market regimes...');
  const btcRegimes = [
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'fifteen_m' as const, regime: 'LONG_WEAK' as const, strength: 58.4, aiConfidence: 64.0 },
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'fifteen_m' as const, regime: 'NEUTRAL' as const, strength: 42.7, aiConfidence: 55.0 },
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'fifteen_m' as const, regime: 'LONG_STRONG' as const, strength: 81.2, aiConfidence: 87.0 },
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'fifteen_m' as const, regime: 'SHORT_WEAK' as const, strength: 54.8, aiConfidence: 62.0 },
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'fifteen_m' as const, regime: 'LONG_STRONG' as const, strength: 76.9, aiConfidence: 82.0 },
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'fifteen_m' as const, regime: 'SHORT_STRONG' as const, strength: 84.3, aiConfidence: 89.0 },
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'fifteen_m' as const, regime: 'LONG_WEAK' as const, strength: 63.1, aiConfidence: 71.0 },
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'fifteen_m' as const, regime: 'NEUTRAL' as const, strength: 46.2, aiConfidence: 57.0 },
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'fifteen_m' as const, regime: 'SHORT_WEAK' as const, strength: 59.7, aiConfidence: 68.0 },
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'fifteen_m' as const, regime: 'LONG_STRONG' as const, strength: 82.5, aiConfidence: 88.0 },
  
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'one_h' as const, regime: 'LONG_WEAK' as const, strength: 61.2, aiConfidence: 69.0 },
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'one_h' as const, regime: 'LONG_STRONG' as const, strength: 78.6, aiConfidence: 84.0 },
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'one_h' as const, regime: 'NEUTRAL' as const, strength: 44.3, aiConfidence: 56.0 },
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'one_h' as const, regime: 'SHORT_WEAK' as const, strength: 57.8, aiConfidence: 65.0 },
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'one_h' as const, regime: 'LONG_STRONG' as const, strength: 80.1, aiConfidence: 86.0 },
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'one_h' as const, regime: 'SHORT_STRONG' as const, strength: 83.0, aiConfidence: 88.0 },
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'one_h' as const, regime: 'LONG_WEAK' as const, strength: 64.5, aiConfidence: 73.0 },
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'one_h' as const, regime: 'NEUTRAL' as const, strength: 48.0, aiConfidence: 59.0 },
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'one_h' as const, regime: 'SHORT_WEAK' as const, strength: 60.3, aiConfidence: 70.0 },
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'one_h' as const, regime: 'LONG_STRONG' as const, strength: 79.0, aiConfidence: 85.0 },
  
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'one_d' as const, regime: 'NEUTRAL' as const, strength: 41.5, aiConfidence: 53.0 },
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'one_d' as const, regime: 'LONG_WEAK' as const, strength: 56.8, aiConfidence: 66.0 },
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'one_d' as const, regime: 'LONG_STRONG' as const, strength: 75.4, aiConfidence: 81.0 },
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'one_d' as const, regime: 'SHORT_WEAK' as const, strength: 55.7, aiConfidence: 63.0 },
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'one_d' as const, regime: 'NEUTRAL' as const, strength: 47.9, aiConfidence: 58.0 },
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'one_d' as const, regime: 'SHORT_STRONG' as const, strength: 79.6, aiConfidence: 84.0 },
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'one_d' as const, regime: 'LONG_WEAK' as const, strength: 60.2, aiConfidence: 70.0 },
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'one_d' as const, regime: 'LONG_STRONG' as const, strength: 77.3, aiConfidence: 83.0 },
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'one_d' as const, regime: 'SHORT_WEAK' as const, strength: 58.9, aiConfidence: 67.0 },
    { symbol: 'BTC', quoteAsset: 'USDT' as const, timeframe: 'one_d' as const, regime: 'LONG_WEAK' as const, strength: 61.0, aiConfidence: 72.0 },
  ];
  
  const nowr = Date.now();

  for (let i = 0; i < btcRegimes.length; i++) {
    const r = btcRegimes[i];
    const position = i % 10;
  
    await prisma.marketRegime.create({
      data: {
        ...r,
        analyzedAt: new Date(nowr - (9 - position) * 5 * 60 * 1000),
      },
    });
  }

  console.log('Seeding sample signals...');
  const now = new Date();
  const minsAgo = (m: number) => new Date(now.getTime() - m * 60 * 1000);
  const signals = [
    { symbol: 'SOL', quoteAsset: 'USDT' as const, strategy: 'scalping' as const, timeframe: 'fifteen_m' as const, direction: 'LONG' as const, regime: 'LONG_STRONG' as const, reliability: 82, entryPrice: 203.42, stopLoss: 198.75, takeProfit1: 208.90, takeProfit2: 214.30, detectedAt: minsAgo(14) },
    { symbol: 'ETH', quoteAsset: 'USDT' as const, strategy: 'day' as const, timeframe: 'one_h' as const, direction: 'LONG' as const, regime: 'LONG_STRONG' as const, reliability: 79, entryPrice: 3642.18, stopLoss: 3531.40, takeProfit1: 3720.50, takeProfit2: 3890.90, detectedAt: minsAgo(18) },
    { symbol: 'LINK', quoteAsset: 'USDT' as const, strategy: 'swing' as const, timeframe: 'four_h' as const, direction: 'LONG' as const, regime: 'LONG_WEAK' as const, reliability: 77, entryPrice: 15.28, stopLoss: 14.60, takeProfit1: 15.85, takeProfit2: 16.42, detectedAt: minsAgo(24) },
    { symbol: 'AVAX', quoteAsset: 'USDT' as const, strategy: 'day' as const, timeframe: 'one_h' as const, direction: 'LONG' as const, regime: 'LONG_WEAK' as const, reliability: 74, entryPrice: 24.91, stopLoss: 23.74, takeProfit1: 25.78, takeProfit2: 26.90, detectedAt: minsAgo(32) },
    { symbol: 'SUI', quoteAsset: 'USDT' as const, strategy: 'scalping' as const, timeframe: 'fifteen_m' as const, direction: 'LONG' as const, regime: 'LONG_WEAK' as const, reliability: 72, entryPrice: 1.845, stopLoss: 1.756, takeProfit1: 1.915, takeProfit2: 1.985, detectedAt: minsAgo(41) },
    { symbol: 'DOGE', quoteAsset: 'USDT' as const, strategy: 'scalping' as const, timeframe: 'fifteen_m' as const, direction: 'SHORT' as const, regime: 'SHORT_STRONG' as const, reliability: 76, entryPrice: 0.1234, stopLoss: 0.1278, takeProfit1: 0.1189, takeProfit2: 0.1162, detectedAt: minsAgo(15) },
    { symbol: 'PEPE', quoteAsset: 'USDT' as const, strategy: 'day' as const, timeframe: 'one_h' as const, direction: 'SHORT' as const, regime: 'SHORT_STRONG' as const, reliability: 74, entryPrice: 0.00001123, stopLoss: 0.00001168, takeProfit1: 0.00001078, takeProfit2: 0.00001030, detectedAt: minsAgo(21) },
    { symbol: 'ARB', quoteAsset: 'USDT' as const, strategy: 'swing' as const, timeframe: 'four_h' as const, direction: 'SHORT' as const, regime: 'SHORT_WEAK' as const, reliability: 71, entryPrice: 1.156, stopLoss: 1.192, takeProfit1: 1.102, takeProfit2: 1.064, detectedAt: minsAgo(28) },
    { symbol: 'OP', quoteAsset: 'USDT' as const, strategy: 'day' as const, timeframe: 'one_h' as const, direction: 'SHORT' as const, regime: 'SHORT_WEAK' as const, reliability: 69, entryPrice: 1.789, stopLoss: 1.845, takeProfit1: 1.712, takeProfit2: 1.641, detectedAt: minsAgo(35) },
    { symbol: 'WIF', quoteAsset: 'USDT' as const, strategy: 'scalping' as const, timeframe: 'fifteen_m' as const, direction: 'SHORT' as const, regime: 'SHORT_WEAK' as const, reliability: 68, entryPrice: 2.345, stopLoss: 2.416, takeProfit1: 2.276, takeProfit2: 2.116, detectedAt: minsAgo(44) },
  ];
  for (const s of signals) {
    await prisma.signal.create({ data: s });
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
