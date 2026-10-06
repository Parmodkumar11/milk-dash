'use client';

import React from 'react';
import { Check, Heart, HandCoins } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';

const TIP_AMOUNTS = [20, 30, 50] as const;
const MAX_TIP = 10000;

export default function CheckoutExtras() {
  const donationEnabled = useCartStore((state) => state.feedingIndiaDonation);
  const setDonationEnabled = useCartStore((state) => state.setFeedingIndiaDonation);
  const tipAmount = useCartStore((state) => state.deliveryPartnerTip);
  const setTipAmount = useCartStore((state) => state.setDeliveryPartnerTip);
  const customSelected = useCartStore((state) => state.customDeliveryPartnerTip);
  const setCustomSelected = useCartStore((state) => state.setCustomDeliveryPartnerTip);
  const customInput = customSelected ? String(tipAmount) : '';

  const selectTip = (amount: number) => {
    setCustomSelected(false);
    setTipAmount(tipAmount === amount ? 0 : amount);
  };

  const selectCustomTip = () => {
    if (customSelected) {
      setCustomSelected(false);
      setTipAmount(0);
    } else {
      setCustomSelected(true);
      setTipAmount(0);
    }
  };

  const updateCustomTip = (value: string) => {
    const amount = Number(value);
    setTipAmount(value && Number.isFinite(amount) ? Math.min(MAX_TIP, Math.max(0, amount)) : 0);
  };

  return (
    <div className="space-y-3">
      {/* <section className="dd-card flex items-center gap-3 p-4 sm:p-5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <Heart className="h-6 w-6 fill-current" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-extrabold text-sm sm:text-base">Feeding India donation</h2>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-fg sm:text-sm">
            Help support a malnutrition-free India.
          </p>
        </div>
        <label className="flex shrink-0 cursor-pointer items-center gap-2">
          <span className="text-sm font-extrabold">₹1</span>
          <input
            type="checkbox"
            checked={donationEnabled}
            onChange={(event) => setDonationEnabled(event.target.checked)}
            aria-label="Add ₹1 Feeding India donation"
            className="peer sr-only"
          />
          <span className="flex h-6 w-6 items-center justify-center rounded-md border-2 border-border-custom bg-white text-transparent transition-colors peer-checked:border-accent-green peer-checked:bg-accent-green peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-accent-green/40">
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
        </label>
      </section> */}

      <section className="dd-card p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-yellow/25 text-ink">
            <HandCoins className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-extrabold text-base sm:text-lg">Tip your delivery partner</h2>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-fg sm:text-sm">
              Optional. Your tip goes directly to your delivery partner.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TIP_AMOUNTS.map((amount) => (
            <button
              key={amount}
              type="button"
              aria-pressed={tipAmount === amount && !customSelected}
              onClick={() => selectTip(amount)}
              className={`min-h-12 rounded-xl border px-3 py-2 text-sm font-extrabold transition-colors ${
                tipAmount === amount && !customSelected
                  ? 'border-accent-green bg-accent-green/10 text-accent-green'
                  : 'border-border-custom bg-white text-foreground hover:border-accent-green/50'
              }`}
            >
              💛 ₹{amount}
            </button>
          ))}
          <button
            type="button"
            aria-pressed={customSelected}
            onClick={selectCustomTip}
            className={`min-h-12 rounded-xl border px-3 py-2 text-sm font-extrabold transition-colors ${
              customSelected
                ? 'border-accent-green bg-accent-green/10 text-accent-green'
                : 'border-border-custom bg-white text-foreground hover:border-accent-green/50'
            }`}
          >
            🙌 Custom
          </button>
        </div>

        {customSelected ? (
          <label className="mt-3 block text-xs font-bold text-muted-fg" htmlFor="custom-delivery-tip">
            Custom tip amount
            <span className="relative mt-1 block">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-fg">₹</span>
              <input
                id="custom-delivery-tip"
                type="number"
                inputMode="numeric"
                min="0"
                max={MAX_TIP}
                step="1"
                value={customInput}
                onChange={(event) => updateCustomTip(event.target.value)}
                placeholder="Enter amount"
                className="w-full rounded-xl border border-border-custom bg-card-bg py-3 pl-8 pr-3 text-sm text-foreground"
              />
            </span>
          </label>
        ) : null}
        {tipAmount > 0 ? (
          <button
            type="button"
            onClick={() => {
              setTipAmount(0);
              setCustomSelected(false);
            }}
            className="mt-2 text-xs font-bold text-muted-fg underline underline-offset-2"
          >
            Remove tip
          </button>
        ) : null}
      </section>
    </div>
  );
}
