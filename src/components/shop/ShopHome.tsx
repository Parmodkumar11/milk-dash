'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { ArrowDown, CalendarClock, Sparkles, Store } from 'lucide-react';
import {
  FILTER_CATEGORIES,
  getFilterLabel,
  type FilterCategoryId,
} from '@/data/filter-categories';
import CategoryCarousel from '@/components/shop/CategoryCarousel';
import { REQUEST_CATALOG } from '@/data/request-catalog';
import {
  filterByCategory,
  HOME_SECTION_CATEGORIES,
  searchProducts,
} from '@/lib/catalog-search';
import ProductGrid from '@/components/shop/ProductGrid';
import ProductCarousel from '@/components/shop/ProductCarousel';
import PromoBanners from '@/components/shop/PromoBanners';
import CartSummaryBar from '@/components/shop/CartSummaryBar';
import RequestItemSheet from '@/components/shop/RequestItemSheet';
import ServiceAreaBanner from '@/components/shop/ServiceAreaBanner';
import SearchBar from '@/components/shop/SearchBar';
import { useCartStore } from '@/store/cart-store';

const SECTION_PREVIEW = 16;

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
      <section className="relative isolate overflow-hidden bg-[#123b22] text-white">
        <div className="absolute inset-y-0 right-0 w-[62%] sm:w-1/2">
          <Image
            src="/catalog/grocery.jpg"
            alt="Fresh groceries displayed in a local shop"
            fill
            priority
            sizes="(max-width: 640px) 62vw, 50vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#123b22] via-[#123b22]/75 to-[#123b22]/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#123b22]/40 to-transparent sm:hidden" />
        </div>
        <div className="relative mx-auto flex min-h-[190px] max-w-6xl items-center px-4 py-5 sm:min-h-[220px] sm:px-6 sm:py-7">
          <div className="max-w-xl">
            <p className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white/90 sm:text-xs">
              <Store className="h-3.5 w-3.5" />
              Local essentials, delivered
            </p>
            <h1 className="max-w-md text-2xl font-extrabold leading-tight sm:text-3xl">
              Meet HopInMohali
            </h1>
            <p className="mt-2 max-w-lg text-xs leading-relaxed text-white/85 sm:text-sm">
              Your neighborhood ordering and delivery service in Phase 7, Mohali. Shop everyday essentials
              from nearby stores, request what&apos;s missing, and get it delivered on your schedule.
            </p>
            <button
              type="button"
              onClick={() => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-extrabold text-accent-green shadow-md transition-transform hover:-translate-y-0.5 active:scale-[0.98] sm:text-sm"
            >
              Explore local essentials <ArrowDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <div className="dd-page w-full pt-3 space-y-4">
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

        <div ref={gridRef}>
          <CategoryCarousel active={category} onChange={handleCategoryClick} />
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
            <PromoBanners onCategorySelect={(cat) => handleCategoryClick(cat as FilterCategoryId | 'all')} />
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
                  <ProductCarousel products={sectionItems} priorityCount={catId === HOME_SECTION_CATEGORIES[0] ? 3 : 0} />
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
