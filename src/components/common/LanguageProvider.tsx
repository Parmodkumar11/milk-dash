'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_LOCALE,
  LOCALE_CHOSEN_KEY,
  LOCALE_STORAGE_KEY,
  guessLocale,
  isLocale,
  translate,
  type Locale,
  type MessageKey,
} from '@/lib/i18n';
import LanguageWelcome from '@/components/common/LanguageWelcome';

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
  ready: boolean;
};

const LanguageContext = createContext<LanguageContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (key) => translate(DEFAULT_LOCALE, key),
  ready: false,
});

export function useI18n() {
  return useContext(LanguageContext);
}

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [ready, setReady] = useState(false);
  const [ask, setAsk] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    const chosen = localStorage.getItem(LOCALE_CHOSEN_KEY);
    setLocaleState(isLocale(saved) ? saved : guessLocale());
    setAsk(!chosen);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const htmlLang = locale === 'pa' ? 'pa' : locale;
    document.documentElement.lang = htmlLang;
    document.documentElement.dataset.locale = locale;
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale, ready]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(LOCALE_STORAGE_KEY, next);
    localStorage.setItem(LOCALE_CHOSEN_KEY, '1');
    setAsk(false);
  }, []);

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) => translate(locale, key, vars),
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, ready }),
    [locale, setLocale, t, ready]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
      {ready && ask ? <LanguageWelcome locale={locale} onChoose={setLocale} /> : null}
    </LanguageContext.Provider>
  );
}
