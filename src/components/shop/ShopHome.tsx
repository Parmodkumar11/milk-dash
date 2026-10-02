'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CalendarClock, Sparkles } from 'lucide-react';
import {
  FILTER_CATEGORIES,
  getFilterLabel,
  type FilterCategoryId,
} from '@/data/filter-categories';
import { REQUEST_CATALOG } from '@/data/request-catalog';
import {
  filterByCategory,
  HOME_SECTION_CATEGORIES,
  searchProducts,
} from '@/lib/catalog-search';
import ProductGrid from '@/components/shop/ProductGrid';
import ProductCard from '@/components/shop/ProductCard';
import CartSummaryBar from '@/components/shop/CartSummaryBar';
import RequestItemSheet from '@/components/shop/RequestItemSheet';
import ServiceAreaBanner from '@/components/shop/ServiceAreaBanner';
import SearchBar from '@/components/shop/SearchBar';
import { useCartStore } from '@/store/cart-store';

const SECTION_PREVIEW = 8;

function parseCategory(param: string | null): FilterCategoryId | 'all' {
  if (!param || param === 'all') return 'all';
  const valid = FILTER_CATEGORIES.some((c) => c.id === param);
  return valid ? (param as FilterCategoryId) : 'all';
}

export default function ShopHome() {
  const searchParams = useSearchParams();
  const items = useCartStore((s) => s.items);
  const setDeliveryTiming = useCartStore((s) => s.setDeliveryTiming);
  const gridRef = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<FilterCategoryId | 'all'>('all');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestPrefill, setRequestPrefill] = useState('');
  const [requestCategory, setRequestCategory] = useState<FilterCategoryId>('others');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 180);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const cat = parseCategory(searchParams.get('category'));
    setCategory(cat);
    if (searchParams.get('request') === '1') {
      setRequestCategory(cat === 'all' ? 'others' : cat);
      setRequestOpen(true);
    }
    if (searchParams.get('schedule') === '1' && items.length > 0) {
      setDeliveryTiming('scheduled');
    }
  }, [searchParams, items.length, setDeliveryTiming]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 320);
    return () => clearTimeout(t);
  }, []);

  const results = useMemo(
    () => searchProducts(debouncedQuery, category),
    [debouncedQuery, category]
  );

  const showSections =
    category === 'all' && !debouncedQuery.trim() && !loading;

  const openRequest = useCallback((name: string, cat: FilterCategoryId) => {
    setRequestPrefill(name);
    setRequestCategory(cat);
    setRequestOpen(true);
  }, []);

  const handleCategoryClick = (id: FilterCategoryId | 'all') => {
    if (id === 'others') {
      openRequest('', 'others');
      return;
    }
    setCategory(id);
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const showEmptySearch = debouncedQuery.trim().length > 0 && results.length === 0 && !loading;
  const showMedicalNote = category === 'medical';

  const scheduleHref = items.length > 0 ? '/checkout/details?schedule=1' : '/?schedule=1';

  return (
    <div className="pb-32">
      <div className="dd-page max-w-6xl mx-auto pt-3 space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <ServiceAreaBanner />
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => openRequest('', category === 'all' ? 'others' : category)}
              className="inline-flex items-center gap-1 rounded-lg bg-brand-yellow text-ink font-bold text-[11px] px-2.5 py-1.5 shadow-sm active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Request
            </button>
            <Link
              href={scheduleHref}
              onClick={() => setDeliveryTiming('scheduled')}
              className="inline-flex items-center gap-1 rounded-lg border border-accent-green/40 text-accent-green font-bold text-[11px] px-2.5 py-1.5 bg-card-bg active:scale-[0.98]"
            >
              <CalendarClock className="w-3.5 h-3.5" />
              Schedule
            </Link>
          </div>
        </div>

        <SearchBar
          category={category}
          value={query}
          onChange={setQuery}
          onRequestMissing={(q) =>
            openRequest(q, category === 'all' ? 'others' : category)
          }
        />

        <div ref={gridRef} className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {FILTER_CATEGORIES.map((chip) => {
            const active = category === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleCategoryClick(chip.id)}
                className={`shrink-0 px-3.5 py-2 rounded-lg text-sm font-bold transition-all ${
                  active
                    ? 'bg-brand-yellow text-ink shadow-sm chip-active'
                    : 'bg-card-bg border border-border-custom text-muted-fg hover:border-brand-yellow/50'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {showMedicalNote ? (
          <p className="text-xs text-muted-fg bg-muted rounded-lg p-3 leading-relaxed">
            Request common medical-store items. Prescription medicines require a valid prescription.
          </p>
        ) : null}

        {showEmptySearch ? (
          <div className="dd-card p-6 text-center space-y-4 animate-in-up">
            <h2 className="font-bold text-lg">Can&apos;t find what you&apos;re looking for?</h2>
            <p className="text-sm text-muted-fg">
              Don&apos;t worry. We can try to get it for you.
            </p>
            <button
              type="button"
              className="dd-btn-primary w-full justify-center"
              onClick={() =>
                openRequest(
                  debouncedQuery.trim(),
                  category === 'all' ? 'others' : category
                )
              }
            >
              Request &quot;{debouncedQuery.trim()}&quot;
            </button>
          </div>
        ) : showSections ? (
          <div className="space-y-8">
            {HOME_SECTION_CATEGORIES.map((catId) => {
              const sectionItems = filterByCategory(REQUEST_CATALOG, catId).slice(
                0,
                SECTION_PREVIEW
              );
              if (sectionItems.length === 0) return null;
              return (
                <section key={catId} className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-extrabold text-base">{getFilterLabel(catId)}</h2>
                    <button
                      type="button"
                      onClick={() => handleCategoryClick(catId)}
                      className="text-xs font-bold text-accent-green"
                    >
                      View all
                    </button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                    {sectionItems.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <ProductGrid products={results} loading={loading} />
        )}
      </div>

      <CartSummaryBar />

      <RequestItemSheet
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        initialName={requestPrefill}
        initialCategoryId={requestCategory}
        source={requestPrefill ? 'search' : 'global'}
        showMedicalDisclaimer={requestCategory === 'medical'}
      />
    </div>
  );
}
