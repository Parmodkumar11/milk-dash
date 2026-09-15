'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart-store';
import { dryFruits } from '@/data/dry-fruits';
import { Flame, Snowflake, Plus, Minus, Check, ShoppingBag, ShoppingCart } from 'lucide-react';
import { calculateItemPrice } from '@/lib/pricing';
import PageBanner from '@/components/common/PageBanner';
import { IMAGES } from '@/lib/images';

function OrderFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addItem = useCartStore((state) => state.addItem);

  const [milkType, setMilkType] = useState<'hot' | 'cold'>('hot');
  const [quantityMl, setQuantityMl] = useState<number>(500);
  const [selectedDryFruits, setSelectedDryFruits] = useState<string[]>([]);
  const [customMlInput, setCustomMlInput] = useState<string>('500');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const typeParam = searchParams?.get('type');
    if (typeParam === 'hot' || typeParam === 'cold') {
      setMilkType(typeParam);
    }
  }, [searchParams]);

  const livePrice = calculateItemPrice(milkType, quantityMl, selectedDryFruits);

  const handleTypeSelect = (type: 'hot' | 'cold') => {
    setMilkType(type);
  };

  const presets = [250, 500, 750, 1000];

  const handlePresetSelect = (ml: number) => {
    setQuantityMl(ml);
    setCustomMlInput(ml.toString());
    setShowCustomInput(false);
  };

  const handleQuantityAdjust = (amount: number) => {
    const nextVal = Math.max(100, quantityMl + amount);
    setQuantityMl(nextVal);
    setCustomMlInput(nextVal.toString());
  };

  const handleCustomMlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomMlInput(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= 100) {
      setQuantityMl(parsed);
    }
  };

  const handleDryFruitToggle = (id: string) => {
    setSelectedDryFruits((prev) => {
      if (prev.includes(id)) {
        return prev.filter((df) => df !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleAddToCart = () => {
    addItem({
      milkType,
      quantityMl,
      dryFruits: selectedDryFruits,
    });

    setNotification('Added to Cart!');
    setTimeout(() => {
      setNotification(null);
      router.push('/cart');
    }, 1200);
  };

  return (
    <div className="dd-page pb-28 sm:pb-12">
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-foreground text-background px-5 py-3 rounded-full shadow-lg font-bold flex items-center gap-2 z-50">
          <Check className="w-5 h-5 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      <PageBanner
        kicker="Build your glass"
        title="Customise your milk"
        subtitle="Hot or cold. Your quantity. Your add-ons."
        imageSrc={IMAGES.orderBanner}
        imageAlt="Hot and cold milk glasses"
        tone="espresso"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start mt-8">
        <div className="space-y-6 dd-card p-5 sm:p-8">
          <div>
            <label className="block text-sm font-bold text-foreground mb-3">
              1. Choose milk temperature
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTypeSelect('hot')}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-200 ${
                  milkType === 'hot'
                    ? 'border-hot bg-hot/8 text-hot font-bold'
                    : 'border-border-custom bg-surface hover:bg-card-bg text-muted-fg'
                }`}
              >
                <Flame className={`w-8 h-8 mb-2 ${milkType === 'hot' ? 'fill-current' : ''}`} />
                <span className="text-base">Hot Milk</span>
                <span className="text-xs text-muted-fg mt-1">₹45 / 250ML</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeSelect('cold')}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-200 ${
                  milkType === 'cold'
                    ? 'border-cold bg-cold/8 text-cold font-bold'
                    : 'border-border-custom bg-surface hover:bg-card-bg text-muted-fg'
                }`}
              >
                <Snowflake className="w-8 h-8 mb-2" />
                <span className="text-base">Cold Milk</span>
                <span className="text-xs text-muted-fg mt-1">₹40 / 250ML</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-3">
              2. Select quantity (ML)
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {presets.map((ml) => (
                <button
                  key={ml}
                  type="button"
                  onClick={() => handlePresetSelect(ml)}
                  className={`py-2.5 px-1 text-center rounded-xl text-sm border font-semibold transition-all ${
                    quantityMl === ml && !showCustomInput
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-card-bg border-border-custom text-muted-fg hover:bg-surface'
                  }`}
                >
                  {ml} ML
                </button>
              ))}
            </div>

            <div className="dd-surface p-4">
              <div className="flex justify-between items-center mb-3 gap-3">
                <span className="text-xs font-semibold text-muted-fg">
                  Custom quantity
                </span>
                <button
                  type="button"
                  onClick={() => setShowCustomInput(!showCustomInput)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  {showCustomInput ? 'Use presets' : 'Enter custom ML'}
                </button>
              </div>

              {showCustomInput ? (
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="100"
                    max="5000"
                    step="50"
                    value={customMlInput}
                    onChange={handleCustomMlChange}
                    className="w-full bg-card-bg border border-border-custom px-3 py-2.5 rounded-xl text-foreground font-bold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter custom ML (min 100)"
                  />
                  <span className="font-bold text-sm text-muted-fg shrink-0">ML</span>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-card-bg border border-border-custom p-1.5 rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleQuantityAdjust(-250)}
                    disabled={quantityMl <= 250}
                    className="p-2 rounded-lg hover:bg-muted disabled:opacity-30 disabled:hover:bg-transparent"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-5 h-5" />
                  </button>

                  <span className="font-extrabold text-lg text-foreground tracking-tight">
                    {quantityMl} ML
                  </span>

                  <button
                    type="button"
                    onClick={() => handleQuantityAdjust(250)}
                    className="p-2 rounded-lg hover:bg-muted"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-3">
              3. Customise with dry fruits
            </label>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {dryFruits.map((df) => {
                const isSelected = selectedDryFruits.includes(df.id);
                return (
                  <button
                    key={df.id}
                    type="button"
                    onClick={() => handleDryFruitToggle(df.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-foreground bg-foreground/5 font-bold'
                        : 'border-border-custom bg-card-bg hover:bg-surface'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        isSelected ? 'bg-foreground border-foreground text-background' : 'border-border-custom bg-card-bg'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-sm font-semibold">{df.name}</span>
                    </div>
                    <span className="text-sm text-muted-fg">+ ₹{df.price}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="sticky top-24 dd-surface p-6 sm:p-8 flex flex-col justify-between h-fit">
          <div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-4 pb-3 border-b border-border-custom flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <span>Order selection</span>
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-fg">Milk choice</span>
                <span className="font-bold">
                  {milkType === 'hot' ? 'Hot Milk' : 'Cold Milk'}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-fg">Quantity</span>
                <span className="font-bold">{quantityMl} ML</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-fg">Add-ons</span>
                <span className="font-bold text-right max-w-[180px] truncate">
                  {selectedDryFruits.length > 0
                    ? selectedDryFruits
                        .map((id) => dryFruits.find((df) => df.id === id)?.name)
                        .filter(Boolean)
                        .join(', ')
                    : 'None'}
                </span>
              </div>
            </div>

            <div className="border-t border-border-custom border-dashed my-6 pt-4 flex justify-between items-baseline">
              <span className="text-base font-bold text-foreground/80">Subtotal</span>
              <span className="font-display text-3xl font-semibold text-foreground">₹{livePrice}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="dd-btn-dark w-full mt-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Add to cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    }>
      <OrderFormContent />
    </Suspense>
  );
}
