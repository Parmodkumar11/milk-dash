'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Plus, Trash2 } from 'lucide-react';
import PageBanner from '@/components/common/PageBanner';
import NearbyStepper from '@/components/nearby/NearbyStepper';
import { useNearbyStore } from '@/store/nearby-store';
import { IMAGES } from '@/lib/images';
import { NEARBY_AREA_NAME, NEARBY_SUGGESTIONS } from '@/lib/nearby';
import SessionHours from '@/components/common/SessionHours';

function NearbyRequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, preferredShop, addItem, addSuggestedItem, updateItem, removeItem, setPreferredShop } =
    useNearbyStore();
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState('');

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

  const handleContinue = () => {
    const named = items.filter((item) => item.name.trim());
    if (named.length === 0) {
      setError('Add at least one item to continue.');
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
        kicker="Step 1 · Request items"
        title="What should we buy?"
        subtitle={`Lunch, groceries, medicines — delivered around ${NEARBY_AREA_NAME}.`}
        imageSrc={IMAGES.nearby}
        imageAlt="Local shop shelves"
        tone="shop"
      />
      <div className="mt-6">
        <SessionHours />
      </div>

      <div className="mt-6 mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-fg mb-2">Quick add</p>
        <div className="flex flex-wrap gap-2">
          {NEARBY_SUGGESTIONS.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => addSuggestedItem(name)}
              className="dd-chip bg-card-bg border border-border-custom text-foreground hover:border-primary/40"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="dd-card p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-base font-semibold">Item {index + 1}</h3>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="p-2 rounded-lg text-muted-fg hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="dd-label">Item name *</label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => {
                    updateItem(item.id, { name: e.target.value });
                    if (error) setError('');
                  }}
                  className="dd-input pl-4"
                  placeholder="e.g. Paracetamol, bread, A4 notebook"
                />
              </div>
              <div>
                <label className="dd-label">Quantity</label>
                <input
                  type="text"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, { quantity: e.target.value })}
                  className="dd-input pl-4"
                  placeholder="e.g. 2 packs"
                />
              </div>
              <div>
                <label className="dd-label">Estimated cost (₹, optional)</label>
                <input
                  type="number"
                  min="0"
                  value={item.estimatedCost}
                  onChange={(e) => updateItem(item.id, { estimatedCost: e.target.value })}
                  className="dd-input pl-4"
                  placeholder="If you know approx. price"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="dd-label">Notes / instructions</label>
                <input
                  type="text"
                  value={item.notes}
                  onChange={(e) => updateItem(item.id, { notes: e.target.value })}
                  className="dd-input pl-4"
                  placeholder="Brand, size, or substitutes"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="dd-btn-ghost w-full mt-4"
      >
        <Plus className="w-4 h-4" />
        Add another item
      </button>

      <div className="dd-card p-4 sm:p-5 mt-6">
        <label className="dd-label">Preferred shop (optional)</label>
        <input
          type="text"
          value={preferredShop}
          onChange={(e) => setPreferredShop(e.target.value)}
          className="dd-input pl-4"
          placeholder="e.g. Medical store near gate 2"
        />
      </div>

      {error && <p className="text-rose-500 text-sm font-bold mt-3">{error}</p>}

      <button type="button" onClick={handleContinue} className="dd-btn-primary w-full mt-6">
        Continue to location
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
