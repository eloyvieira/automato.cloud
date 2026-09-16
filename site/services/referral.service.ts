/**
 * Referral program server logic: commission accrual and account summary.
 *
 * Commissions are never calculated in the browser. `recordReferralCommission`
 * is the single entry point and is idempotent per payment
 * (`referral_commissions.payment_id` is unique).
 */
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import {
  REFERRAL_CODE_ALPHABET,
  REFERRAL_CODE_LENGTH,
  REFERRAL_COMMISSION_CURRENCY,
  REFERRAL_COMMISSION_RATE,
  buildReferralLink,
  normalizeReferralCode,
} from '../lib/referral';

export type ReferralSummary = {
  code: string;
  link: string;
  /** Accounts created through the referral link. */
  signups: number;
  /** How many of those accounts have paid for / hold Premium. */
  premiumSignups: number;
  /** Balance the referrer can withdraw once withdrawals exist, in USDT. */
  availableBalance: number;
  /** Everything ever credited (available + already paid out), in USDT. */
  totalEarned: number;
  currency: string;
  commissionRatePercent: number;
};

export type CommissionResult =
  | { status: 'created'; amount: string }
  | { status: 'skipped'; reason: string };

function toNumber(value: Prisma.Decimal | null | undefined): number {
  return value ? Number(value.toString()) : 0;
}

function randomReferralCode(): string {
  let code = '';
  for (let i = 0; i < REFERRAL_CODE_LENGTH; i++) {
    code += REFERRAL_CODE_ALPHABET[Math.floor(Math.random() * REFERRAL_CODE_ALPHABET.length)];
  }
  return code;
}

/**
 * Returns the user's referral code, generating and persisting one the first
 * time it is needed (accounts created before the referral program have none).
 */
export async function getOrCreateReferralCode(userId: string): Promise<string> {
  const id = BigInt(userId);

  const user = await prisma.user.findUnique({
    where: { id },
    select: { referralCode: true },
  });

  if (user?.referralCode) return user.referralCode;

  // `users.referral_code` is unique, so a collision only costs another attempt.
  for (let attempt = 0; attempt < 10; attempt++) {
    try {
      const updated = await prisma.user.update({
        where: { id },
        data: { referralCode: randomReferralCode() },
        select: { referralCode: true },
      });
      return updated.referralCode as string;
    } catch (error) {
      if ((error as { code?: string }).code !== 'P2002') throw error;
    }
  }

  throw new Error('Could not generate a unique referral code');
}

/**
 * Resolves a referral code to the referrer id. Returns null when the code does
 * not exist, is malformed, belongs to a blocked account, or is the user's own
 * code (self-referral).
 */
export async function resolveReferrerId(
  code: string | null | undefined,
  selfUserId?: string,
): Promise<bigint | null> {
  const normalized = normalizeReferralCode(code);
  if (!normalized) return null;

  const referrer = await prisma.user.findUnique({
    where: { referralCode: normalized },
    select: { id: true, status: true },
  });

  if (!referrer || referrer.status !== 'active') return null;
  if (selfUserId && referrer.id === BigInt(selfUserId)) return null;

  return referrer.id;
}

/**
 * Credits the referrer with 10% of a Premium payment.
 *
 * Runs on the first Premium payment and on every renewal, because it is keyed
 * by payment: each new payment row produces exactly one commission row.
 * Call it from the payment provider webhook once a payment is confirmed.
 */
export async function recordReferralCommission(
  paymentId: string | bigint,
): Promise<CommissionResult> {
  const id = typeof paymentId === 'bigint' ? paymentId : BigInt(paymentId);

  const payment = await prisma.payment.findUnique({
    where: { id },
    select: {
      id: true,
      amount: true,
      status: true,
      userId: true,
      user: { select: { referredById: true } },
      subscription: { select: { plan: { select: { type: true } } } },
    },
  });

  if (!payment) return { status: 'skipped', reason: 'payment_not_found' };
  if (payment.status !== 'paid') return { status: 'skipped', reason: 'payment_not_paid' };

  // Only Premium generates commission.
  if (payment.subscription?.plan.type !== 'premium') {
    return { status: 'skipped', reason: 'not_a_premium_payment' };
  }

  const referrerId = payment.user.referredById;
  if (!referrerId) return { status: 'skipped', reason: 'user_has_no_referrer' };
  if (referrerId === payment.userId) return { status: 'skipped', reason: 'self_referral' };

  // Payments are settled in a USD-pegged amount, so the commission is credited
  // 1:1 as USDT.
  // Cheap pre-check so a retried webhook does not have to trigger (and log) a
  // unique constraint violation. The constraint below is still the real guard.
  const existing = await prisma.referralCommission.findUnique({
    where: { paymentId: payment.id },
    select: { id: true },
  });
  if (existing) return { status: 'skipped', reason: 'already_commissioned' };

  const amount = new Prisma.Decimal(payment.amount.toString())
    .mul(REFERRAL_COMMISSION_RATE)
    .toFixed(8);

  try {
    await prisma.referralCommission.create({
      data: {
        referrerId,
        referredUserId: payment.userId,
        paymentId: payment.id,
        amount,
        currency: REFERRAL_COMMISSION_CURRENCY,
        rate: REFERRAL_COMMISSION_RATE,
        status: 'available',
      },
    });
  } catch (error) {
    // Unique violation on payment_id: this payment was already commissioned.
    if ((error as { code?: string }).code === 'P2002') {
      return { status: 'skipped', reason: 'already_commissioned' };
    }
    throw error;
  }

  return { status: 'created', amount };
}

/** Commission history of a referrer, newest first. */
export async function getCommissionHistory(userId: string, limit = 20) {
  return prisma.referralCommission.findMany({
    where: { referrerId: BigInt(userId) },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      amount: true,
      currency: true,
      status: true,
      createdAt: true,
      referredUser: { select: { email: true } },
    },
  });
}

/** Everything the Referral Program panel on /account displays. */
export async function getReferralSummary(userId: string): Promise<ReferralSummary> {
  const referrerId = BigInt(userId);

  const [code, signups, premiumSignups, available, total] = await Promise.all([
    getOrCreateReferralCode(userId),
    prisma.user.count({ where: { referredById: referrerId } }),
    prisma.user.count({
      where: {
        referredById: referrerId,
        OR: [
          { subscriptions: { some: { status: 'active', plan: { type: 'premium' } } } },
          {
            payments: {
              some: { status: 'paid', subscription: { plan: { type: 'premium' } } },
            },
          },
        ],
      },
    }),
    prisma.referralCommission.aggregate({
      where: { referrerId, status: 'available' },
      _sum: { amount: true },
    }),
    prisma.referralCommission.aggregate({
      where: { referrerId, status: { in: ['available', 'paid'] } },
      _sum: { amount: true },
    }),
  ]);

  return {
    code,
    link: buildReferralLink(code),
    signups,
    premiumSignups,
    availableBalance: toNumber(available._sum.amount),
    totalEarned: toNumber(total._sum.amount),
    currency: REFERRAL_COMMISSION_CURRENCY,
    commissionRatePercent: Math.round(REFERRAL_COMMISSION_RATE * 100),
  };
}
