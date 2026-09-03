'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

const FIELD_CLASS =
  'mt-1 w-full rounded-lg border border-white/10 bg-[#0b121b] px-3 py-2 text-sm text-white outline-none focus:border-emerald-400/40';

const EMPTY = { name: '', email: '', subject: '', message: '' };

/** Contact form. Fields are validated again on the server before saving. */
export function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field: keyof typeof EMPTY) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((current) => ({ ...current, [field]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.message.trim().length < 10) {
      setError('Please write at least 10 characters in your message');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not send your message');

      setSuccess('Thanks for reaching out. Your message has been received and we will get back to you by e-mail.');
      setForm(EMPTY);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs text-slate-400" htmlFor="name">Name</label>
          <input
            id="name"
            value={form.name}
            onChange={update('name')}
            required
            maxLength={100}
            placeholder="Your name"
            className={FIELD_CLASS}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400" htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={update('email')}
            required
            maxLength={190}
            placeholder="you@example.com"
            className={FIELD_CLASS}
          />
        </div>
      </div>
      <div>
        <label className="text-xs text-slate-400" htmlFor="subject">Subject</label>
        <input
          id="subject"
          value={form.subject}
          onChange={update('subject')}
          required
          maxLength={150}
          placeholder="How can we help?"
          className={FIELD_CLASS}
        />
      </div>
      <div>
        <label className="text-xs text-slate-400" htmlFor="message">Message</label>
        <textarea
          id="message"
          value={form.message}
          onChange={update('message')}
          required
          rows={6}
          maxLength={5000}
          placeholder="Tell us a bit more about your question or idea."
          className={`${FIELD_CLASS} resize-y`}
        />
      </div>

      {error && (
        <p className="rounded-lg border border-red-400/20 bg-red-400/[0.07] px-3 py-2 text-xs text-red-400">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-lg border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-2 text-xs text-emerald-400">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-[#07100b] transition hover:bg-emerald-300 disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send message'} <Send size={14} />
      </button>
    </form>
  );
}
