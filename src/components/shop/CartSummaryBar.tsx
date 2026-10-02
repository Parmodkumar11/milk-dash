'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { cartItemCount, serviceChargeInr } from '@/lib/pricing';

export default function CartSummaryBar() {
  const items = useCartStore((s) => s.items);
  const [mounted, setMounted] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || items.length === 0) return;
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 350);
    return () => clearTimeout(t);
  }, [items.length, mounted]);

  if (!mounted || items.length === 0) return null;

  const count = cartItemCount(items);
  const fee = serviceChargeInr(items);

  return (
    <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] md:bottom-6 left-4 right-4 z-[150] max-w-lg mx-auto animate-in-up">
      <Link
        href="/cart"
        className={`flex items-center justify-between gap-3 rounded-xl bg-ink text-white px-4 py-3.5 shadow-lg active:scale-[0.98] transition-transform ${
          pulse ? 'badge-bounce' : ''
        }`}
      >
        <span className="flex items-center gap-2 font-bold text-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-yellow text-ink">
            <ShoppingBag className="w-4 h-4" />
          </span>
          <span className="flex flex-col leading-tight">
            <span>{count} {count === 1 ? 'item' : 'items'}</span>
            <span className="text-[10px] font-semibold text-white/80">Service ₹{fee}</span>
          </span>
        </span>
        <span className="flex items-center gap-1 font-extrabold text-sm">
          View cart
          <ChevronRight className="w-4 h-4" />
        </span>
      </Link>
    </div>
  );
}
