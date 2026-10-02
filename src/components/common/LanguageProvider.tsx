'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isLocale, LOCALE_STORAGE_KEY, type Locale } from '@/lib/i18n/locale';

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  ready: boolean;
};

const LanguageContext = createContext<LanguageContextValue>({
  locale: 'en',
  setLocale: () => {},
  ready: false,
});

export function useLocale() {
  return useContext(LanguageContext);
}

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved && isLocale(saved)) setLocaleState(saved);
    setReady(true);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(LOCALE_STORAGE_KEY, next);
  }, []);

  const value = useMemo(() => ({ locale, setLocale, ready }), [locale, setLocale, ready]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
