'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { searchProducts } from '@/lib/catalog-search';
import { displayName, displaySecondary } from '@/lib/i18n/catalog-display';
import { useLocale } from '@/components/common/LanguageProvider';
import type { FilterCategoryId } from '@/data/filter-categories';
import type { RequestProduct } from '@/data/request-catalog';

const RECENT_KEY = 'hopin-recent-searches';
const MAX_RECENT = 5;

type Props = {
  category: FilterCategoryId | 'all';
  value: string;
  onChange: (value: string) => void;
  onSelectProduct?: (product: RequestProduct) => void;
  onRequestMissing?: (query: string) => void;
};

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

function saveRecent(query: string) {
  const q = query.trim();
  if (!q) return;
  const prev = loadRecent().filter((x) => x !== q);
  localStorage.setItem(RECENT_KEY, JSON.stringify([q, ...prev].slice(0, MAX_RECENT)));
}

export default function SearchBar({
  category,
  value,
  onChange,
  onSelectProduct,
  onRequestMissing,
}: Props) {
  const { locale } = useLocale();
  const [focused, setFocused] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focused) setRecent(loadRecent());
  }, [focused]);

  const matches = useMemo(() => {
    if (!value.trim()) return [];
    return searchProducts(value, category).slice(0, 8);
  }, [value, category]);

  const showDropdown = focused && (value.trim() ? matches.length > 0 || true : recent.length > 0);

  const close = useCallback(() => setFocused(false), []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) close();
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [close]);

  const pickQuery = (q: string) => {
    onChange(q);
    saveRecent(q);
    close();
  };

  const pickProduct = (p: RequestProduct) => {
    saveRecent(p.name);
    onChange(p.name);
    onSelectProduct?.(p);
    close();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;
    const total = value.trim() ? matches.length + (matches.length === 0 ? 1 : 0) : recent.length;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => (h + 1) % Math.max(total, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => (h - 1 + Math.max(total, 1)) % Math.max(total, 1));
    } else if (e.key === 'Enter') {
      if (value.trim() && matches.length === 0) {
        onRequestMissing?.(value.trim());
        saveRecent(value);
        close();
      } else if (matches[highlight]) {
        pickProduct(matches[highlight]);
      } else if (recent[highlight]) {
        pickQuery(recent[highlight]);
      }
    } else if (e.key === 'Escape') {
      close();
    }
  };

  const hint =
    locale === 'hi'
      ? 'आटा, दूध, लेज़… खोजें'
      : 'Search atta, doodh, lays…';

  return (
    <div ref={wrapRef} className="relative">
      <div
        className={`relative transition-shadow rounded-xl border ${
          focused ? 'border-accent-green shadow-md ring-2 ring-accent-green/20' : 'border-border-custom'
        }`}
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-fg" />
        <input
          type="search"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setHighlight(0);
          }}
          onFocus={() => setFocused(true)}
          onKeyDown={onKeyDown}
          placeholder={hint}
          className="w-full rounded-xl bg-card-bg py-3 pl-10 pr-4 text-sm font-medium"
          aria-label="Search products"
          aria-expanded={showDropdown}
          autoComplete="off"
        />
        {showDropdown ? (
          <ul
            className="absolute left-0 right-0 top-full mt-1 z-[80] max-h-72 overflow-auto rounded-xl border border-border-custom bg-card-bg shadow-lg py-1"
            role="listbox"
          >
            {!value.trim() &&
              recent.map((r, i) => (
                <li key={r}>
                  <button
                    type="button"
                    role="option"
                    className={`w-full text-left px-4 py-2.5 text-sm ${
                      i === highlight ? 'bg-brand-yellow/25' : 'hover:bg-muted'
                    }`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pickQuery(r)}
                  >
                    <span className="text-muted-fg text-xs">Recent · </span>
                    {r}
                  </button>
                </li>
              ))}
            {value.trim() &&
              matches.map((p, i) => {
                const secondary = displaySecondary(p, locale);
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      role="option"
                      className={`w-full text-left px-4 py-2.5 text-sm ${
                        i === highlight ? 'bg-brand-yellow/25' : 'hover:bg-muted'
                      }`}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => pickProduct(p)}
                    >
                      <span className="font-semibold">{displayName(p, locale)}</span>
                      {secondary ? (
                        <span className="text-muted-fg text-xs block">{secondary}</span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            {value.trim() && matches.length === 0 ? (
              <li>
                <button
                  type="button"
                  className="w-full text-left px-4 py-2.5 text-sm font-bold text-accent-green hover:bg-muted"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onRequestMissing?.(value.trim());
                    saveRecent(value);
                    close();
                  }}
                >
                  Request &quot;{value.trim()}&quot;
                </button>
              </li>
            ) : null}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
