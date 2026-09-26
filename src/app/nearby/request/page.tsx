'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Plus, Trash2, Check } from 'lucide-react';
import PageBanner from '@/components/common/PageBanner';
import NearbyStepper from '@/components/nearby/NearbyStepper';
import { useNearbyStore } from '@/store/nearby-store';
import { IMAGES } from '@/lib/images';
import { NEARBY_AREA_NAME, NEARBY_SUGGESTIONS } from '@/lib/nearby';
import SessionHours from '@/components/common/SessionHours';
import { useI18n } from '@/components/common/LanguageProvider';
import type { MessageKey } from '@/lib/i18n';

function NearbyRequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, addItem, addSuggestedItem, toggleSuggestedItem, updateItem, removeItem } =
    useNearbyStore();
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState('');
  const { t } = useI18n();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const preset = searchParams?.get('item');
    if (preset && !items.some((item) => item.name.toLowerCase() === preset.toLowerCase())) {
      addSuggestedItem(preset);
    }
  }, [mounted, searchParams]);

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  const selectedNames = new Set(
    items.map((item) => item.name.trim().toLowerCase()).filter(Boolean)
  );

  const handleContinue = () => {
    const named = items.filter((item) => item.name.trim());
    if (named.length === 0) {
      setError(t('request.needItem'));
      return;
    }
    setError('');
    router.push('/nearby/location');
  };

  return (
    <div className="dd-page pb-28 sm:pb-12">
      <NearbyStepper />
      <PageBanner
        compact
        kicker={t('request.kicker')}
        title={t('request.title')}
        subtitle={t('request.subtitle', { area: NEARBY_AREA_NAME })}
        imageSrc={IMAGES.nearby}
        imageAlt={t('request.bannerAlt')}
        tone="shop"
      />
      <div className="mt-6">
        <SessionHours />
      </div>

      <div className="mt-6 mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-fg mb-2">{t('request.quickAdd')}</p>
        <p className="text-xs text-muted-fg mb-2">{t('request.quickHint')}</p>
        <div className="flex flex-wrap gap-2">
          {NEARBY_SUGGESTIONS.map((name) => {
            const selected = selectedNames.has(name.toLowerCase());
            return (
              <button
                key={name}
                type="button"
                onClick={() => {
                  toggleSuggestedItem(name);
                  if (error) setError('');
                }}
                aria-pressed={selected}
                className={`dd-chip border transition-colors ${
                  selected
                    ? 'bg-primary text-white border-primary'
                    : 'bg-card-bg border-border-custom text-foreground hover:border-primary/40'
                }`}
              >
                {selected && <Check className="w-3.5 h-3.5" />}
                {t(`suggest.${name}` as MessageKey)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="dd-card p-6 text-center space-y-2">
            <p className="font-display text-lg font-semibold">{t('request.emptyTitle')}</p>
            <p className="text-sm text-muted-fg">{t('request.emptyBody')}</p>
          </div>
        ) : (
          items.map((item, index) => (
          <div key={item.id} className="dd-card p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-base font-semibold">
                {item.name.trim() || t('request.itemN', { n: index + 1 })}
              </h3>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="p-2 rounded-lg text-muted-fg hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                aria-label={t('request.remove', { name: item.name.trim() || t('request.itemN', { n: index + 1 }) })}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="dd-label">{t('request.itemName')}</label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => {
                    updateItem(item.id, { name: e.target.value });
                    if (error) setError('');
                  }}
                  className="dd-input pl-4"
                  placeholder={t('request.itemPlaceholder')}
                />
              </div>
              <div>
                <label className="dd-label">{t('request.qty')}</label>
                <input
                  type="text"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, { quantity: e.target.value })}
                  className="dd-input pl-4"
                  placeholder={t('request.qtyPlaceholder')}
                />
              </div>
              <div>
                <label className="dd-label">{t('request.cost')}</label>
                <input
                  type="number"
                  min="0"
                  value={item.estimatedCost}
                  onChange={(e) => updateItem(item.id, { estimatedCost: e.target.value })}
                  className="dd-input pl-4"
                  placeholder={t('request.costPlaceholder')}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="dd-label">{t('request.notes')}</label>
                <input
                  type="text"
                  value={item.notes}
                  onChange={(e) => updateItem(item.id, { notes: e.target.value })}
                  className="dd-input pl-4"
                  placeholder={t('request.notesPlaceholder')}
                />
              </div>
            </div>
          </div>
          ))
        )}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="dd-btn-ghost w-full mt-4"
      >
        <Plus className="w-4 h-4" />
        {items.length === 0 ? t('request.addCustom') : t('request.addAnother')}
      </button>

      {/* <div className="dd-card p-4 sm:p-5 mt-6">
        <label className="dd-label" htmlFor="preferredShop">{t('request.shopLabel')}</label>
        <p className="text-xs text-muted-fg mb-2">
          {t('request.shopHint')}
        </p>
        <input
          id="preferredShop"
          name="preferredShop"
          type="text"
          value={preferredShop}
          onChange={(e) => setPreferredShop(e.target.value)}
          className="dd-input pl-4"
          placeholder={t('request.shopPlaceholder')}
          autoComplete="off"
        />
      </div>

      {error && <p className="text-rose-500 text-sm font-bold mt-3">{error}</p>} */}

      <button type="button" onClick={handleContinue} className="dd-btn-primary w-full mt-6">
        {t('request.continue')}
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function NearbyRequestPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    }>
      <NearbyRequestForm />
    </Suspense>
  );
}
