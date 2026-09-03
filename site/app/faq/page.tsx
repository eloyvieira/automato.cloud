import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { FaqAccordion, type FaqItem } from '@/components/faq/FaqAccordion';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';

export const metadata: Metadata = {
  title: 'FAQ | Automato',
  description:
    'Answers about Automato trading signals, market regimes, rankings, plans and how the platform works.',
};

const FAQ_SECTIONS: { title: string; description: string; items: FaqItem[] }[] = [
  {
    title: 'About Automato',
    description: 'What the platform is and how it fits into your workflow.',
    items: [
      {
        id: 'what-is-automato',
        question: 'What is Automato?',
        answer:
          'Automato is a crypto market intelligence platform. It scans USDT, USDC and BTC markets every five minutes, surfaces long and short trading opportunities, tracks BTC market regimes and ranks coins by reliability and performance — all from real signal data, not static lists.',
      },
      {
        id: 'who-is-it-for',
        question: 'Who is Automato for?',
        answer:
          'Automato is built for active crypto traders and developers who want a clear, data-driven view of market conditions. You can use the public dashboard for a quick read, upgrade to Premium for full signal details, or integrate via the API into your own tools.',
      },
      {
        id: 'financial-advice',
        question: 'Is Automato financial advice?',
        answer:
          'No. Automato provides quantitative analysis and probabilistic signals — it does not guarantee profits and should not be treated as investment advice. Always do your own research and manage risk according to your strategy.',
      },
    ],
  },
  {
    title: 'Trading signals',
    description: 'How signals are generated, scored and displayed.',
    items: [
      {
        id: 'what-is-a-signal',
        question: 'What is a trading signal?',
        answer:
          'A signal is a detected market opportunity with a direction (long or short), a reliability score, a strategy type and a timeframe. Premium users also see entry price, stop loss and take profit levels, plus signal status and history.',
      },
      {
        id: 'how-often-updated',
        question: 'How often are signals updated?',
        answer:
          'Market data and signals refresh every five minutes across supported pairs. Rankings and the home dashboard are cached for a few minutes so pages stay fast while staying close to live conditions.',
      },
      {
        id: 'reliability-score',
        question: 'What does the reliability score mean?',
        answer:
          'Reliability is a percentage score derived from historical signal performance and current market structure. Higher scores indicate stronger statistical alignment with past outcomes — not a guarantee of future results.',
      },
      {
        id: 'long-vs-short',
        question: 'What is the difference between long and short signals?',
        answer:
          'Long signals suggest upward price opportunity; short signals suggest downward opportunity. Each is ranked independently on the home page and in the Rankings section so you can focus on the direction that matches your view.',
      },
      {
        id: 'strategies',
        question: 'What are scalping, day trading and swing strategies?',
        answer:
          'These labels describe the expected holding horizon of a signal. Scalping targets very short moves, day trading covers intraday setups and swing covers multi-day opportunities. Rankings include separate boards for each strategy type.',
      },
    ],
  },
  {
    title: 'Market regimes & rankings',
    description: 'How we classify market conditions and rank opportunities.',
    items: [
      {
        id: 'market-regimes',
        question: 'What are the five market regimes?',
        answer:
          'Automato classifies BTC market conditions into five regimes: Strong Bullish, Bullish, Neutral, Bearish and Strong Bearish. They help you understand the broader context before acting on individual coin signals.',
      },
      {
        id: 'rankings',
        question: 'How do rankings work?',
        answer:
          'Rankings are calculated live from real signals. Boards include Most Reliable, Most Profitable, Best Long, Best Short and strategy-specific lists (scalping, day trading, swing). Visit the Rankings page to switch between them.',
      },
      {
        id: 'most-reliable-vs-profitable',
        question: 'What is the difference between Most Reliable and Most Profitable?',
        answer:
          'Most Reliable ranks active signals by reliability score — how well similar setups have performed. Most Profitable ranks closed signals by realized result, showing which markets delivered the best actual outcomes over the ranking window.',
      },
      {
        id: 'supported-markets',
        question: 'Which markets does Automato cover?',
        answer:
          'Automato focuses on USDT, USDC and BTC quote markets. The home page highlights top opportunities and reliable coins; the full Rankings page expands that view across strategies and performance metrics.',
      },
    ],
  },
  {
    title: 'Plans & access',
    description: 'Free, Premium and API options.',
    items: [
      {
        id: 'free-plan',
        question: 'What is included in the free plan?',
        answer:
          'Free access includes public signals, the BTC market regime, top long and short opportunities and live rankings. Entry prices, stop loss, take profits and signal history require Premium or API access.',
      },
      {
        id: 'premium-plan',
        question: 'What does Premium unlock?',
        answer:
          'Premium adds full signal details — entry, stop loss and take profit levels — plus signal status, history, all market regimes and an ad-free experience. See the Pricing page for current rates.',
      },
      {
        id: 'api-access',
        question: 'Can I access signals via API?',
        answer:
          'Yes. API plans provide programmatic access to active signals, market regimes and rankings. Starter and Professional tiers differ by daily request limits and endpoint coverage. Full documentation is available on the API reference page.',
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-[#080d14] text-slate-200">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white">FAQ</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Common questions about Automato, trading signals, market regimes and plans.
        </p>

        <div className="mt-10 space-y-10">
          {FAQ_SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-semibold text-white">{section.title}</h2>
              <p className="mt-1 text-xs text-slate-500">{section.description}</p>

              <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.08] bg-[#121923]">
                <FaqAccordion items={section.items} />
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] p-6">
          <p className="text-sm font-medium text-white">Still have questions?</p>
          <p className="mt-2 text-sm text-slate-400">
            Reach out about support, partnerships or anything not covered here.
          </p>
          <Link
            href="/contact"
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:underline"
          >
            Contact us <ArrowRight size={14} />
          </Link>
        </div>
      </main>

      <SiteFooter showPreviewToggle />
    </div>
  );
}
