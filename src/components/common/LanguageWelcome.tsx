'use client';

import React from 'react';
import { LOCALES, type Locale } from '@/lib/i18n';

export default function LanguageWelcome({
  locale,
  onChoose,
}: {
  locale: Locale;
  onChoose: (locale: Locale) => void;
}) {
  const [picked, setPicked] = React.useState<Locale>(locale);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lang-welcome-title"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md bg-card-bg rounded-t-[1.6rem] sm:rounded-[1.6rem] border border-border-custom shadow-[var(--shadow-soft)] p-5 sm:p-6 space-y-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <div className="space-y-1">
          <h2 id="lang-welcome-title" className="font-display text-2xl font-semibold leading-tight">
            Choose your language
          </h2>
          <p className="text-sm text-muted-fg">अपनी भाषा चुनें · ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ</p>
          <p className="text-xs text-muted-fg">You can change this anytime from the top bar.</p>
        </div>

        <div className="grid gap-2" role="radiogroup" aria-label="Language">
          {LOCALES.map((item) => {
            const selected = picked === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setPicked(item.id)}
                className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors ${
                  selected
                    ? 'border-primary bg-primary/8 ring-2 ring-primary/20'
                    : 'border-border-custom bg-surface hover:border-primary/40'
                }`}
              >
                <span className="font-display text-xl font-semibold">{item.native}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-fg">{item.short}</span>
              </button>
            );
          })}
        </div>

        <button type="button" className="dd-btn-primary w-full" onClick={() => onChoose(picked)}>
          Continue · आगे बढ़ें · ਅੱਗੇ ਵਧੋ
        </button>
      </div>
    </div>
  );
}
