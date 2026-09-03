/**
 * Single source of truth for the top menu. The API reference is deliberately
 * absent here: it is linked from the footer only.
 */
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Signals', href: '/#signals' },
  { label: 'Rankings', href: '/rankings' },
  { label: 'How it works', href: '/#methodology' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
] as const;
