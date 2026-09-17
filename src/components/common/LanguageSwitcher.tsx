'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { LOCALES } from '@/lib/i18n';
import { useI18n } from '@/components/common/LanguageProvider';

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const selected = LOCALES.find((item) => item.id === locale) ?? LOCALES[0];

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('touchstart', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('touchstart', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={t('lang.label')}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        title={selected.native}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-1 rounded-full border border-border-custom bg-card-bg hover:border-primary/50 transition-all h-9 sm:h-10 pl-2.5 pr-2 text-xs font-extrabold"
      >
        <span>{selected.native}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-fg transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open ? (
        <ul
          id={menuId}
          role="listbox"
          aria-label={t('lang.label')}
          className="absolute right-0 mt-1.5 z-[80] min-w-[10.5rem] rounded-2xl border border-border-custom bg-card-bg shadow-[var(--shadow-soft)] p-1"
        >
          {LOCALES.map((item) => {
            const isSelected = item.id === locale;
            return (
              <li key={item.id} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    setLocale(item.id);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                    isSelected ? 'bg-primary/8 text-primary' : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <span className="font-display">{item.native}</span>
                  {isSelected ? <Check className="w-4 h-4 shrink-0" /> : <span className="text-[10px] font-extrabold text-muted-fg">{item.short}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
