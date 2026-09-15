'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart-store';
import { dryFruits } from '@/data/dry-fruits';
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, Info, Flame, Snowflake, RotateCcw } from 'lucide-react';
import PageBanner from '@/components/common/PageBanner';
import { IMAGES } from '@/lib/images';

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

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal > 0 ? subtotal + deliveryFee : 0;

  const handleQtyChange = (id: string, currentQty: number, change: number) => {
    const nextQty = Math.max(100, currentQty + change);
    updateItemQuantity(id, nextQty);
  };

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
      <div className="dd-page flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="w-10 h-10 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-foreground mb-2">Your cart is empty</h1>
        <p className="text-muted-fg text-sm mb-8 leading-relaxed">
          You have not added any customisable hot or cold milk yet. Configure a glass and it will show up here.
        </p>
        <Link href="/order" className="dd-btn-dark w-full">
          <span>Start ordering</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="dd-page flex-1 flex flex-col">
      <PageBanner
        compact
        kicker="Review before delivery"
        title="Your order"
        subtitle="Adjust quantities, then pin your location."
        imageSrc={IMAGES.pour}
        imageAlt="Milk pour"
        tone="espresso"
      />

      <div className="flex justify-between items-center gap-4 mt-8 mb-5">
        <p className="text-sm text-muted-fg">{items.length} item{items.length === 1 ? '' : 's'} in cart</p>
        <button
          type="button"
          onClick={clearCart}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-600 border border-rose-200 hover:border-rose-300 bg-rose-50/50 hover:bg-rose-50 dark:bg-rose-950/30 dark:border-rose-900 px-3 py-1.5 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start flex-1">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="dd-card p-5 flex flex-col gap-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    item.milkType === 'hot' ? 'bg-hot/10 text-hot' : 'bg-cold/10 text-cold'
                  }`}>
                    {item.milkType === 'hot' ? <Flame className="w-5 h-5 fill-current" /> : <Snowflake className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {item.milkType === 'hot' ? 'Hot Milk' : 'Cold Milk'}
                    </h3>
                    <p className="text-sm text-muted-fg font-semibold">{item.quantityMl} ML</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-muted-fg hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between bg-surface px-3 py-2 rounded-xl border border-border-custom">
                <span className="text-xs font-bold text-muted-fg">Quantity</span>
                <div className="flex items-center gap-3 bg-card-bg border border-border-custom rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => handleQtyChange(item.id, item.quantityMl, -250)}
                    className="p-1 rounded hover:bg-muted"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-extrabold text-sm min-w-[54px] text-center">
                    {item.quantityMl} ML
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQtyChange(item.id, item.quantityMl, 250)}
                    className="p-1 rounded hover:bg-muted"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <span className="block text-xs font-bold text-muted-fg mb-2">
                  Dry fruit customisation
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
                            : 'bg-card-bg border-border-custom text-muted-fg hover:border-foreground/30 hover:bg-surface'
                        }`}
                      >
                        {df.name} (+₹{df.price})
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-border-custom">
                <span className="text-xs font-semibold text-muted-fg">Item total</span>
                <span className="font-display text-xl font-semibold text-foreground">₹{item.price}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="sticky top-24 dd-surface p-6 sm:p-8 space-y-6">
          <h2 className="font-display text-xl font-semibold text-foreground pb-2 border-b border-border-custom">
            Order summary
          </h2>

          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between text-muted-fg">
              <span>Subtotal</span>
              <span className="font-semibold text-foreground">₹{subtotal}</span>
            </div>

            <div className="flex justify-between text-muted-fg items-center">
              <span className="flex items-center gap-1">
                Delivery fee
                <span title="Flat delivery fee within the city">
                  <Info className="w-3.5 h-3.5 text-muted-fg" />
                </span>
              </span>
              <span className="font-semibold text-foreground">₹{deliveryFee}</span>
            </div>

            <div className="border-t border-border-custom border-dashed my-4 pt-4 flex justify-between items-baseline">
              <span className="text-base font-bold text-foreground">Total</span>
              <span className="font-display text-3xl font-semibold text-foreground">₹{total}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push('/delivery')}
            className="dd-btn-dark w-full"
          >
            <span>Proceed to delivery</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
