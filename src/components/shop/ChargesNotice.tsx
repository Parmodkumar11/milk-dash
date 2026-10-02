'use client';

import React from 'react';
import type { CartLine } from '@/types/order';
import { SERVICE_CHARGE_PER_TWO_ITEMS, serviceChargeFormulaLabel } from '@/lib/delivery';
import { serviceChargeInr, uniqueLineCount } from '@/lib/pricing';
import { useCartStore } from '@/store/cart-store';

type Props = {
  lines?: CartLine[];
  className?: string;
  compact?: boolean;
};

export default function ChargesNotice({ lines, className = '', compact = false }: Props) {
  const storeLines = useCartStore((s) => s.items);
  const effective = lines ?? storeLines;
  const fee = serviceChargeInr(effective);
  const unique = uniqueLineCount(effective);

  if (compact) {
    return (
      <p className={`text-xs text-muted-fg leading-relaxed ${className}`}>
        Shop bill at store · Service ₹{fee || SERVICE_CHARGE_PER_TWO_ITEMS} ({unique} different items, {serviceChargeFormulaLabel()})
      </p>
    );
  }

  return (
    <div className={`space-y-2 text-sm ${className}`}>
      <div className="flex justify-between gap-4">
        <span className="text-muted-fg">Product amount</span>
        <span className="font-semibold text-right">Based on actual shop bill</span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-muted-fg">Delivery / service charge</span>
        <span className="font-semibold tabular-nums">₹{fee}</span>
      </div>
      <p className="text-xs text-muted-fg">
        {serviceChargeFormulaLabel()} in your cart ({unique} unique · not quantity).
      </p>
      <div className="flex justify-between gap-4 border-t border-border-custom pt-2">
        <span className="font-bold">You pay</span>
        <span className="font-bold text-right text-sm">Shop bill + ₹{fee}</span>
      </div>
    </div>
  );
}
