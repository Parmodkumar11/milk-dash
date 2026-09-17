'use client';

import React from 'react';
import { LOCALES } from '@/lib/i18n';
import { useI18n } from '@/components/common/LanguageProvider';

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      role="radiogroup"
      aria-label={t('lang.label')}
      className="inline-flex items-center rounded-full border border-border-custom bg-card-bg p-0.5 h-9 sm:h-10"
    >
      {LOCALES.map((item) => {
        const selected = locale === item.id;
        return (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={selected}
            title={item.native}
            onClick={() => setLocale(item.id)}
            className={`min-w-[1.85rem] px-1.5 sm:px-2 h-8 rounded-full text-[11px] font-extrabold leading-none transition-colors ${
              selected ? 'bg-primary text-white shadow-sm' : 'text-muted-fg hover:text-foreground'
            }`}
          >
            {item.short}
          </button>
        );
      })}
    </div>
  );
}
