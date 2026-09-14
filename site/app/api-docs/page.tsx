import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Code2, Lock } from 'lucide-react';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';

export const metadata: Metadata = {
  title: 'API Reference | Automato',
  description:
    'REST endpoints for crypto market regimes, trading signals and rankings. JSON responses, one request per read.',
};

type Endpoint = {
  method: 'GET';
  path: string;
  access: 'Premium Weekly';
  description: string;
  response: string;
};

/** Only endpoints that exist in this codebase are listed here. */
const API_ENDPOINTS: Endpoint[] = [
  {
    method: 'GET',
    path: '/api/v1/market/btc',
    access: 'Premium Weekly',
    description: 'Same Bitcoin regime payload as /api/market/btc, under the versioned prefix.',
    response: `{ "regime": [ /* market regime rows */ ] }`,
  },
  {
    method: 'GET',
    path: '/api/v1/signals',
    access: 'Premium Weekly',
    description: 'Active signals, newest first, with all execution levels.',
    response: `{
  "signals": [
    {
      "id": "1",
      "symbol": "SOL",
      "quoteAsset": "USDT",
      "strategy": "scalping",
      "timeframe": "fifteen_m",
      "direction": "LONG",
      "regime": "LONG_STRONG",
      "reliability": 82,
      "entryPrice": 203.42,
      "stopLoss": 198.75,
      "takeProfit1": 208.9,
      "takeProfit2": 214.3,
      "status": "active",
      "detectedAt": "2026-09-02T18:21:00.000Z"
    }
  ]
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/rankings/long',
    access: 'Premium Weekly',
    description: 'The 20 most reliable active long signals.',
    response: `{ "signals": [ /* signal objects */ ] }`,
  },
  {
    method: 'GET',
    path: '/api/v1/rankings/short',
    access: 'Premium Weekly',
    description: 'The 20 most reliable active short signals.',
    response: `{ "signals": [ /* signal objects */ ] }`,
  },
  {
    method: 'GET',
    path: '/api/v1/crypto/{symbol}',
    access: 'Premium Weekly',
    description:
      'Up to 50 active signals for one market. The symbol is the base asset, for example BTC or SOL.',
    response: `{ "symbol": "SOL", "signals": [ /* signal objects */ ] }`,
  },
];

const ERRORS = [
  { code: '401', meaning: 'Unauthorized', text: 'No valid session was sent with the request.' },
  { code: '403', meaning: 'API access required', text: 'The account has no active Premium Weekly subscription.' },
  { code: '400', meaning: 'Bad request', text: 'The request body or a parameter is invalid.' },
];

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  const restricted = true;

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#121923] p-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-md bg-emerald-400/10 px-2 py-1 text-[11px] font-semibold text-emerald-400">
          {endpoint.method}
        </span>
        <code className="text-sm text-white">{endpoint.path}</code>
        <span
          className={`ml-auto inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] ${
            restricted ? 'bg-amber-400/10 text-amber-300' : 'bg-white/[0.06] text-slate-400'
          }`}
        >
          <Lock size={11} />
          {endpoint.access}
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-400">{endpoint.description}</p>
      <pre className="mt-4 overflow-x-auto rounded-lg border border-white/[0.06] bg-[#0b121b] p-4 text-[11px] leading-5 text-slate-300">
        <code>{endpoint.response}</code>
      </pre>
    </div>
  );
}

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-[#080d14] text-slate-200">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-5 py-14 lg:px-8">
        <div className="flex items-center gap-2 text-emerald-400">
          <Code2 size={18} />
          <span className="text-xs font-semibold uppercase tracking-[0.18em]">API reference</span>
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          Automato REST API
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Premium Weekly API endpoints answer with JSON over HTTPS and reads the same data that powers the site:
          market regimes, trading signals and rankings. Responses are cached for a few minutes.
        </p>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-white">Authentication</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            All API endpoints require an active <span className="text-amber-300">Premium Weekly</span>
            subscription. Requests are authenticated with the session cookie you receive when you
            log in, so today the API is consumed from an authenticated browser session or by
            forwarding that cookie. Standalone API keys are not available yet.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-[#07100b] transition hover:bg-emerald-300"
            >
              View Premium Weekly <ArrowRight size={14} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-white transition hover:border-white/25"
            >
              Talk to us
            </Link>
          </div>
        </section>



        <section className="mt-10">
          <h2 className="text-lg font-semibold text-white">Versioned endpoints (/api/v1)</h2>
          <p className="mt-2 text-sm text-slate-400">
            The stable integration surface. All endpoints require Premium Weekly.
          </p>
          <div className="mt-5 space-y-4">
            {API_ENDPOINTS.map((endpoint) => (
              <EndpointCard key={endpoint.path} endpoint={endpoint} />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-white">Errors</h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.08] bg-[#121923]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/[0.08] text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Error</th>
                  <th className="px-4 py-3 font-medium">When it happens</th>
                </tr>
              </thead>
              <tbody>
                {ERRORS.map((error) => (
                  <tr key={error.code} className="border-b border-white/[0.04] last:border-0">
                    <td className="px-4 py-3 font-medium text-white">{error.code}</td>
                    <td className="px-4 py-3 text-amber-300">{error.meaning}</td>
                    <td className="px-4 py-3 text-slate-400">{error.text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Errors are returned as <code className="text-slate-400">{'{ "error": "message" }'}</code>{' '}
            with the matching HTTP status.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
