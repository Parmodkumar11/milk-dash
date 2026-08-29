'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart-store';
import { milkProducts } from '@/data/products';
import { dryFruits } from '@/data/dry-fruits';
import { Flame, Snowflake, Plus, Minus, Check, ShoppingBag, ShoppingCart } from 'lucide-react';
import { calculateItemPrice } from '@/lib/pricing';

function OrderFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addItem = useCartStore((state) => state.addItem);

  // States
  const [milkType, setMilkType] = useState<'hot' | 'cold'>('hot');
  const [quantityMl, setQuantityMl] = useState<number>(500);
  const [selectedDryFruits, setSelectedDryFruits] = useState<string[]>([]);
  const [customMlInput, setCustomMlInput] = useState<string>('500');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync with search parameter if provided
  useEffect(() => {
    const typeParam = searchParams?.get('type');
    if (typeParam === 'hot' || typeParam === 'cold') {
      setMilkType(typeParam);
    }
  }, [searchParams]);

  // Compute live price
  const livePrice = calculateItemPrice(milkType, quantityMl, selectedDryFruits);

  // Handle milk type click
  const handleTypeSelect = (type: 'hot' | 'cold') => {
    setMilkType(type);
  };

  // Preset sizes
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

  // Toggle Dry Fruit selection
  const handleDryFruitToggle = (id: string) => {
    setSelectedDryFruits((prev) => {
      // Mixed selection rule: if Mixed is selected, we can keep others or toggle it off if others are picked.
      // But let's keep it simple: just standard multi-select toggle.
      if (prev.includes(id)) {
        return prev.filter((df) => df !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Add to cart handler
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
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 pb-28 sm:pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-foreground text-background px-6 py-3 rounded-full shadow-lg font-bold flex items-center gap-2 z-50 animate-bounce">
          <Check className="w-5 h-5 text-emerald-500" />
          <span>{notification}</span>
        </div>
      )}

      <div className="text-center mb-6">
        <h1 className="text-xl sm:text-2xl font-extrabold text-foreground mb-1 tracking-tight">
          Customise Your Milk
        </h1>
        <p className="text-foreground/60 text-xs">
          Select temperature, adjust quantity, and add dry fruit options.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column: Customizations */}
        <div className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-border-custom shadow-sm">
          {/* Step 1: Temperature / Milk Type */}
          <div>
            <label className="block text-sm font-bold text-foreground/80 mb-3">
              1. Choose Milk Temperature
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleTypeSelect('hot')}
                className={`flex flex-col items-center justify-center p-5 rounded-xl border-2 transition-all duration-200 ${
                  milkType === 'hot'
                    ? 'border-hot bg-hot/5 text-hot font-bold scale-[1.02]'
                    : 'border-border-custom bg-[#FCFAF6] hover:bg-white text-foreground/70'
                }`}
              >
                <Flame className={`w-8 h-8 mb-2 ${milkType === 'hot' ? 'fill-current animate-pulse' : ''}`} />
                <span className="text-base">Hot Milk 🔥</span>
                <span className="text-xs text-foreground/50 mt-1">₹45 / 250ML</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeSelect('cold')}
                className={`flex flex-col items-center justify-center p-5 rounded-xl border-2 transition-all duration-200 ${
                  milkType === 'cold'
                    ? 'border-cold bg-cold/5 text-cold font-bold scale-[1.02]'
                    : 'border-border-custom bg-[#FCFAF6] hover:bg-white text-foreground/70'
                }`}
              >
                <Snowflake className={`w-8 h-8 mb-2 ${milkType === 'cold' ? 'animate-spin-slow' : ''}`} />
                <span className="text-base">Cold Milk ❄️</span>
                <span className="text-xs text-foreground/50 mt-1">₹40 / 250ML</span>
              </button>
            </div>
          </div>

          {/* Step 2: Quantity Selection */}
          <div>
            <label className="block text-sm font-bold text-foreground/80 mb-3">
              2. Select Quantity (ML)
            </label>
            
            {/* Presets */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {presets.map((ml) => (
                <button
                  key={ml}
                  type="button"
                  onClick={() => handlePresetSelect(ml)}
                  className={`py-2 px-1 text-center rounded-lg text-sm border font-semibold transition-all ${
                    quantityMl === ml && !showCustomInput
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-white border-border-custom text-foreground/70 hover:bg-[#FCFAF6]'
                  }`}
                >
                  {ml} ML
                </button>
              ))}
            </div>

            {/* Custom ML Toggle & Controls */}
            <div className="bg-[#FCFAF6] p-4 rounded-xl border border-border-custom">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-foreground/60">
                  Custom Quantity
                </span>
                <button
                  type="button"
                  onClick={() => setShowCustomInput(!showCustomInput)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  {showCustomInput ? 'Use Presets' : 'Enter Custom ML'}
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
                    className="w-full bg-white border border-border-custom px-3 py-2 rounded-lg text-foreground font-bold focus:outline-none focus:border-primary"
                    placeholder="Enter custom ML (min 100)"
                  />
                  <span className="font-bold text-sm text-foreground/70">ML</span>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-white border border-border-custom p-1.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => handleQuantityAdjust(-250)}
                    disabled={quantityMl <= 250}
                    className="p-2 rounded-md hover:bg-foreground/5 disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  
                  <span className="font-extrabold text-lg text-foreground tracking-tight">
                    {quantityMl} ML
                  </span>

                  <button
                    type="button"
                    onClick={() => handleQuantityAdjust(250)}
                    className="p-2 rounded-md hover:bg-foreground/5"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Dry Fruits / Add-ons */}
          <div>
            <label className="block text-sm font-bold text-foreground/80 mb-3">
              3. Customize Your Milk (Optional Dry Fruits)
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
                        : 'border-border-custom bg-white hover:bg-[#FCFAF6]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                        isSelected ? 'bg-foreground border-foreground text-white' : 'border-border-custom bg-white'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-sm font-semibold">{df.name}</span>
                    </div>
                    <span className="text-sm text-foreground/60">+ ₹{df.price}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Price Summary Sticky Card */}
        <div className="sticky top-24 bg-[#FCFAF6] border border-border-custom p-6 sm:p-8 rounded-2xl flex flex-col justify-between h-fit shadow-md">
          <div>
            <h3 className="text-lg font-extrabold text-foreground mb-4 pb-2 border-b border-border-custom flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <span>Order Selection</span>
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-foreground/70 text-sm">Milk Choice:</span>
                <span className="font-bold text-sm">
                  {milkType === 'hot' ? 'Hot Milk 🔥' : 'Cold Milk ❄️'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/70 text-sm">Quantity:</span>
                <span className="font-bold text-sm">{quantityMl} ML</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/70 text-sm">Add-ons:</span>
                <span className="font-bold text-sm text-right max-w-[180px] truncate">
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
              <span className="text-base font-bold text-foreground/80">Subtotal Price:</span>
              <span className="text-3xl font-extrabold text-foreground">₹{livePrice}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full py-4 px-6 rounded-xl bg-foreground hover:bg-foreground/90 text-background font-bold flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-md mt-4"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
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
