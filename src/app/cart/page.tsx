'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import ChargesNotice from '@/components/shop/ChargesNotice';
import CartLineRow from '@/components/shop/CartLineRow';
import { useServiceLocation } from '@/components/common/ServiceLocationProvider';
import { cartItemCount, serviceChargeInr } from '@/lib/pricing';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const { canUseApp } = useServiceLocation();
  const [mounted, setMounted] = useState(false);
  const [qtyError, setQtyError] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-green" />
      </div>
    );
  }

  const lineCount = cartItemCount(items);
  const serviceFee = serviceChargeInr(items);

  return (
    <div className="dd-page pb-32 max-w-lg mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-fg hover:text-foreground mb-4 font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        Continue shopping
      </Link>
      <h1 className="text-2xl font-extrabold">Your cart</h1>
      {items.length > 0 ? (
        <p className="text-sm text-muted-fg mt-1 mb-6">
          {lineCount} {lineCount === 1 ? 'item' : 'items'} · Service fee ₹{serviceFee}
        </p>
      ) : (
        <div className="mb-6" />
      )}

      {items.length === 0 ? (
        <div className="dd-card p-8 text-center space-y-4">
          <ShoppingBag className="w-12 h-12 mx-auto text-muted-fg" />
          <p className="font-bold">Your cart is empty</p>
          <p className="text-sm text-muted-fg">
            Find something you need and we&apos;ll get it for you.
          </p>
          <Link href="/" className="dd-btn-primary inline-flex justify-center">
            Start shopping
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-3 mb-6">
            {items.map((line) => (
              <CartLineRow key={line.id} line={line} onQtyError={setQtyError} />
            ))}
          </ul>

          {qtyError ? (
            <p className="text-sm text-primary font-medium mb-3">{qtyError}</p>
          ) : null}
          <div className="dd-card p-5 mb-4">
            <ChargesNotice lines={items} />
          </div>

          <Link
            href="/checkout/location"
            className={`dd-btn-primary w-full justify-center ${!canUseApp ? 'pointer-events-none opacity-50' : ''}`}
          >
            Proceed to checkout
          </Link>
        </>
      )}
    </div>
  );
}
