import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowRight, LockKeyhole, Users, Wallet } from 'lucide-react';
import { ChangePasswordForm } from '@/components/account/ChangePasswordForm';
import { CopyButton } from '@/components/account/CopyButton';
import { LogoutButton } from '@/components/account/LogoutButton';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { getSession } from '@/lib/auth';
import { getReferralSummary } from '@/services/referral.service';
import { getUserSubscriptions } from '@/services/subscription.service';

// Reads the session cookie and per-user data on every request.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Account | Automato',
  description: 'Manage your password, subscriptions and referral program.',
  robots: { index: false, follow: false },
};

function formatUsdt(value: number): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const [subscriptions, referral] = await Promise.all([
    getUserSubscriptions(session.userId),
    getReferralSummary(session.userId),
  ]);

  const premium = subscriptions.find((s) => s.plan.type === 'premium' && s.status === 'active');
  const api = subscriptions.find((s) => s.plan.type === 'api' && s.status === 'active');

  return (
    <div className="min-h-screen bg-[#080d14] text-slate-200">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-5 py-14 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">Account</h1>
            <p className="mt-2 text-sm text-slate-400">
              Signed in as <span className="text-slate-200">{session.email}</span>
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* Subscriptions */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl border border-white/[0.08] bg-[#121923] p-6">
            <div className="flex items-center gap-2 text-amber-300">
              <LockKeyhole size={16} />
              <h2 className="text-sm font-semibold text-white">Premium subscription</h2>
            </div>
            {premium ? (
              <p className="mt-3 text-sm text-emerald-400">{premium.plan.name} · active</p>
            ) : (
              <>
                <p className="mt-3 text-sm text-slate-400">No active premium subscription.</p>
                <Link href="/pricing" className="mt-4 inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:underline">
                  Upgrade to Premium <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>
          <div className="rounded-xl border border-white/[0.08] bg-[#121923] p-6">
            <div className="flex items-center gap-2 text-amber-300">
              <LockKeyhole size={16} />
              <h2 className="text-sm font-semibold text-white">API subscription</h2>
            </div>
            {api ? (
              <p className="mt-3 text-sm text-emerald-400">{api.plan.name} · active</p>
            ) : (
              <>
                <p className="mt-3 text-sm text-slate-400">No active API subscription.</p>
                <Link href="/pricing" className="mt-4 inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:underline">
                  Get API access <ArrowRight size={14} />
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Referral Program */}
        <section className="mt-5 rounded-xl border border-white/[0.08] bg-[#121923] p-6">
          <div className="flex items-center gap-2 text-emerald-400">
            <Users size={16} />
            <h2 className="text-sm font-semibold text-white">Referral Program</h2>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            Invite a friend and earn {referral.commissionRatePercent}% of every Premium payment
            they make, first payment and renewals included.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-slate-500">Referral Code</p>
              <div className="mt-1 flex items-center gap-2">
                <code className="rounded-lg border border-white/10 bg-[#0b121b] px-3 py-2 text-sm font-semibold tracking-[0.18em] text-white">
                  {referral.code}
                </code>
                <CopyButton value={referral.code} label="Copy code" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-slate-500">Referral Link</p>
              <div className="mt-1 flex items-center gap-2">
                <input
                  readOnly
                  value={referral.link}
                  aria-label="Referral link"
                  className="w-full truncate rounded-lg border border-white/10 bg-[#0b121b] px-3 py-2 text-sm text-slate-300 outline-none"
                />
                <CopyButton value={referral.link} label="Copy link" />
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-white/[0.06] bg-[#0b121b] p-4">
              <p className="text-xs text-slate-500">Accounts created</p>
              <p className="mt-1 text-2xl font-semibold text-white">{referral.signups}</p>
              <p className="mt-1 text-[11px] text-slate-500">Signed up with your link</p>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-[#0b121b] p-4">
              <p className="text-xs text-slate-500">Premium accounts</p>
              <p className="mt-1 text-2xl font-semibold text-white">{referral.premiumSignups}</p>
              <p className="mt-1 text-[11px] text-slate-500">Referrals paying for Premium</p>
            </div>
            <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/[0.06] p-4">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <Wallet size={13} /> Available balance
              </div>
              <p className="mt-1 text-2xl font-semibold text-white">
                {formatUsdt(referral.availableBalance)}{' '}
                <span className="text-sm font-normal text-slate-400">{referral.currency}</span>
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                {formatUsdt(referral.totalEarned)} {referral.currency} earned in total
              </p>
            </div>
          </div>

          <p className="mt-4 border-t border-white/[0.06] pt-3 text-[11px] text-slate-500">
            Commissions are credited automatically in {referral.currency} once a referred payment
            is confirmed. Withdrawals are not available yet.
          </p>
        </section>

        {/* Change Password */}
        <div className="mt-5">
          <ChangePasswordForm />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
