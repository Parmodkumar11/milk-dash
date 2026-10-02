'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';
import type { UnitKind } from '@/lib/product-units';

type Props = {
  quantity: number;
  onChange: (quantity: number) => void;
  size?: 'sm' | 'md';
  max?: number;
  unitLabel?: string | null;
  unitKind?: UnitKind;
  step?: number;
  compact?: boolean;
};

function roundStep(q: number, step: number, dir: 1 | -1) {
  if (step >= 1) return q + dir * step;
  const next = q + dir * step;
  return Math.round(next * 10) / 10;
}

export default function QuantityControl({
  quantity,
  onChange,
  size = 'md',
  max = 99,
  unitLabel,
  unitKind,
  step = 1,
  compact = false,
}: Props) {
  const btn = size === 'sm' ? 'w-8 h-8' : 'w-9 h-9';
  const text = size === 'sm' ? 'text-sm min-w-[1.5rem]' : 'text-base min-w-[1.5rem]';
  const label = unitLabel ?? (unitKind === 'kg' ? 'kg' : unitKind === 'L' ? 'L' : null);

  const wrapper = compact
    ? 'inline-flex items-center rounded-lg border-2 border-accent-green bg-white shadow-sm overflow-hidden'
    : 'inline-flex items-center gap-0.5 rounded-lg border border-accent-green bg-accent-green/5 p-0.5 w-full justify-between';

  return (
    <div className={wrapper}>
      <button
        type="button"
        aria-label="Decrease quantity"
        className={`${btn} flex items-center justify-center text-accent-green hover:bg-accent-green/10 active:scale-95 ${
          compact ? 'bg-accent-green/5' : 'rounded-md'
        }`}
        onClick={() => onChange(Math.max(step, roundStep(quantity, step, -1)))}
      >
        <Minus className="w-4 h-4" strokeWidth={2.5} />
      </button>
      <span className={`${text} text-center font-extrabold tabular-nums px-1.5`}>
        {quantity}
        {label && !compact ? (
          <span className="text-[10px] font-bold text-muted-fg ml-0.5">{label}</span>
        ) : null}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        className={`${btn} flex items-center justify-center bg-accent-green text-white hover:bg-accent-green-hover active:scale-95 disabled:opacity-40 ${
          compact ? '' : 'rounded-md'
        }`}
        disabled={quantity >= max}
        onClick={() => onChange(Math.min(max, roundStep(quantity, step, 1)))}
      >
        <Plus className="w-4 h-4" strokeWidth={2.5} />
      </button>
    </div>
  );
}
