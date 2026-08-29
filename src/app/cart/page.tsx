'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart-store';
import { dryFruits } from '@/data/dry-fruits';
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, Info, Flame, Snowflake, RotateCcw } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateItemQuantity,
    updateItemCustomization,
    clearCart,
    deliveryFee,
  } = useCartStore();

  const [mounted, setMounted] = useState(false);

  // Prevent SSR hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal > 0 ? subtotal + deliveryFee : 0;

  const handleQtyChange = (id: string, currentQty: number, change: number) => {
    const nextQty = Math.max(100, currentQty + change);
    updateItemQuantity(id, nextQty);
  };

  // Inline dry fruit toggle inside cart item
  const handleToggleDryFruitInCart = (itemId: string, selectedList: string[], dryFruitId: string) => {
    const isAlreadySelected = selectedList.includes(dryFruitId);
    let updatedList = [];
    if (isAlreadySelected) {
      updatedList = selectedList.filter((id) => id !== dryFruitId);
    } else {
      updatedList = [...selectedList, dryFruitId];
    }
    updateItemCustomization(itemId, updatedList);
  };

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground mb-2">Your Cart is Empty</h1>
        <p className="text-foreground/60 text-sm mb-8 leading-relaxed">
          Looks like you haven't added any customizable hot or cold milk to your cart yet. Let's configure one!
        </p>
        <Link
          href="/order"
          className="w-full inline-flex items-center justify-center gap-2 bg-foreground text-background font-bold py-3.5 px-6 rounded-xl hover:bg-foreground/90 transition-all shadow-md"
        >
          <span>Start Ordering</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 w-full flex-1 flex flex-col">
      <div className="flex justify-between items-center gap-4 mb-6 pb-3 border-b border-border-custom">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">Your Order</h1>
          <p className="text-xs text-foreground/60">Review configurations & pricing.</p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-600 border border-rose-200 hover:border-rose-300 bg-rose-50/50 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start flex-1">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="border border-border-custom bg-white p-5 rounded-2xl shadow-sm transition-all hover:shadow-md flex flex-col gap-4"
            >
              {/* Header: Item Details & Remove Button */}
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    item.milkType === 'hot' ? 'bg-hot/10 text-hot' : 'bg-cold/10 text-cold'
                  }`}>
                    {item.milkType === 'hot' ? <Flame className="w-5 h-5 fill-current" /> : <Snowflake className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-foreground">
                      {item.milkType === 'hot' ? 'Hot Milk' : 'Cold Milk'}
                    </h3>
                    <p className="text-xs text-foreground/50 font-semibold">{item.quantityMl} ML</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-foreground/40 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between bg-[#FCFAF6] px-3 py-2 rounded-xl border border-border-custom">
                <span className="text-xs font-bold text-foreground/60">Quantity</span>
                <div className="flex items-center gap-4 bg-white border border-border-custom rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => handleQtyChange(item.id, item.quantityMl, -250)}
                    className="p-1 rounded hover:bg-foreground/5"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-extrabold text-sm min-w-[54px] text-center">
                    {item.quantityMl} ML
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQtyChange(item.id, item.quantityMl, 250)}
                    className="p-1 rounded hover:bg-foreground/5"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Customization Toggles inside Cart */}
              <div>
                <span className="block text-xs font-bold text-foreground/60 mb-2">
                  Dry Fruit Customization
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {dryFruits.map((df) => {
                    const isSelected = item.dryFruits.includes(df.id);
                    return (
                      <button
                        key={df.id}
                        type="button"
                        onClick={() => handleToggleDryFruitInCart(item.id, item.dryFruits, df.id)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-foreground border-foreground text-background font-bold'
                            : 'bg-white border-border-custom text-foreground/60 hover:border-foreground/30 hover:bg-[#FCFAF6]'
                        }`}
                      >
                        {df.name} (+₹{df.price})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Individual Price */}
              <div className="flex justify-between items-center pt-2 border-t border-border-custom">
                <span className="text-xs font-semibold text-foreground/50">Item Total</span>
                <span className="font-extrabold text-lg text-foreground">₹{item.price}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Pricing Summary Drawer/Sidebar */}
        <div className="sticky top-24 border border-border-custom p-6 sm:p-8 bg-[#FCFAF6] rounded-2xl shadow-md space-y-6">
          <h2 className="text-lg font-extrabold text-foreground pb-2 border-b border-border-custom">
            Order Summary
          </h2>

          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between text-foreground/75">
              <span>Subtotal</span>
              <span className="font-semibold text-foreground">₹{subtotal}</span>
            </div>
            
            <div className="flex justify-between text-foreground/75 items-center">
              <span className="flex items-center gap-1">
                Delivery Fee
                <span title="Flat delivery fee within the city">
                  <Info className="w-3.5 h-3.5 text-foreground/45" />
                </span>
              </span>
              <span className="font-semibold text-foreground">₹{deliveryFee}</span>
            </div>

            <div className="border-t border-border-custom border-dashed my-4 pt-4 flex justify-between items-baseline">
              <span className="text-base font-bold text-foreground">Total Price</span>
              <span className="text-3xl font-extrabold text-foreground">₹{total}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push('/delivery')}
            className="w-full py-4 px-6 rounded-xl bg-foreground hover:bg-foreground/90 text-background font-bold flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-md"
          >
            <span>Proceed to Delivery</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
