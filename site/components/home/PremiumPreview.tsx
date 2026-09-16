'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type PremiumPreviewValue = {
  premium: boolean;
  toggle: () => void;
};

const PremiumPreviewContext = createContext<PremiumPreviewValue>({
  premium: false,
  toggle: () => {},
});

/**
 * Holds the premium/free preview state. Server Components can be passed
 * through as `children`, so only the components that actually read the state
 * become client components.
 */
export function PremiumPreviewProvider({
  initialPremium = false,
  children,
}: {
  initialPremium?: boolean;
  children: React.ReactNode;
}) {
  const [premium, setPremium] = useState(initialPremium);
  const toggle = useCallback(() => setPremium((value) => !value), []);
  const value = useMemo(() => ({ premium, toggle }), [premium, toggle]);

  return (
    <PremiumPreviewContext.Provider value={value}>{children}</PremiumPreviewContext.Provider>
  );
}

export function usePremiumPreview() {
  return useContext(PremiumPreviewContext);
}
