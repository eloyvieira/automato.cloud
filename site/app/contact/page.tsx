import type { Metadata } from 'next';
import { LifeBuoy, Mail, Handshake } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';

export const metadata: Metadata = {
  title: 'Contact | Automato',
  description:
    'Get in touch with the Automato team about support, questions, partnerships or anything related to the platform.',
};

const REASONS = [
  { icon: LifeBuoy, title: 'Support', text: 'Trouble with your account, a subscription or the API.' },
  { icon: Mail, title: 'Questions', text: 'Anything about signals, market regimes or our methodology.' },
  { icon: Handshake, title: 'Partnerships', text: 'Integrations, data partnerships and everything in between.' },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#080d14] text-slate-200">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-5 py-14 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Contact us</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Need a hand or have something to share? Send us a message about support, questions,
          partnerships or anything related to the platform. We read every message and usually reply
          within one business day.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {REASONS.map((reason) => (
            <div key={reason.title} className="rounded-xl border border-white/[0.08] bg-[#121923] p-5">
              <reason.icon className="text-emerald-400" size={18} />
              <h2 className="mt-3 text-sm font-medium text-white">{reason.title}</h2>
              <p className="mt-2 text-xs leading-5 text-slate-500">{reason.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-white/[0.08] bg-[#121923] p-6">
          <h2 className="text-sm font-semibold text-white">Send us a message</h2>
          <p className="mt-2 text-sm text-slate-400">
            Fill in the form below and we will get back to you by e-mail.
          </p>
          <div className="mt-5">
            <ContactForm />
          </div>
        </div>
      </main>

      <SiteFooter showPreviewToggle />
    </div>
  );
}
