'use client';

import { usePremiumPreview } from '@/components/home/PremiumPreview';

/** Home-only switch to preview free vs premium signal details. */
export function PremiumPreviewToggle() {
  const { premium, toggle } = usePremiumPreview();

  return (
    <button type="button" onClick={toggle} className="text-xs text-slate-500 hover:text-white">
      {premium ? 'Preview free view' : 'Preview premium'}
    </button>
  );
}
