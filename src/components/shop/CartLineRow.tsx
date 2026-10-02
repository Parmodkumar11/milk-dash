'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import type { CartLine } from '@/types/order';
import { REQUEST_CATALOG } from '@/data/request-catalog';
import { productImageCandidates } from '@/lib/catalog-search';
import { lineDisplayName } from '@/lib/i18n/catalog-display';
import { getFilterLabel } from '@/data/filter-categories';
import {
  formatQuantity,
  presetLabel,
  unitConfigForProduct,
  validateQuantityForUnit,
} from '@/lib/product-units';
import QuantityControl from '@/components/shop/QuantityControl';
import { useCartStore } from '@/store/cart-store';

type Props = {
  line: CartLine;
  onQtyError?: (msg: string | null) => void;
};

export default function CartLineRow({ line, onQtyError }: Props) {
  const setLineQuantity = useCartStore((s) => s.setLineQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const product =
    line.kind === 'catalog'
      ? REQUEST_CATALOG.find((p) => p.id === line.productId)
      : undefined;

  const unitConfig = useMemo(
    () => unitConfigForProduct(line.kind === 'catalog' ? line.name : line.name, line.categoryId),
    [line]
  );

  const [imgSrc, setImgSrc] = useState(
    product ? productImageCandidates(product)[0] : `/catalog/${line.categoryId}.jpg`
  );
  const candidates = product ? productImageCandidates(product) : [`/catalog/${line.categoryId}.jpg`];

  const title =
    line.kind === 'custom' ? `Other — ${line.name}` : lineDisplayName(line.name, line.nameHi);

  const qtyLabel = formatQuantity(line.quantity, unitConfig.kind);

  const applyQty = (q: number) => {
    const err = validateQuantityForUnit(unitConfig, q, line.categoryId);
    if (err) {
      onQtyError?.(err);
      return;
    }
    const storeErr = setLineQuantity(line.id, q);
    onQtyError?.(storeErr);
  };

  return (
    <li className="dd-card p-3">
      <div className="flex gap-3 items-start">
        <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-muted">
          <Image
            src={imgSrc}
            alt=""
            fill
            sizes="64px"
            className="object-cover"
            onError={() => {
              const idx = candidates.indexOf(imgSrc);
              const next = candidates[idx + 1];
              if (next) setImgSrc(next);
            }}
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-sm leading-snug line-clamp-2">{title}</p>
              <p className="text-[11px] text-muted-fg mt-0.5">
                {getFilterLabel(line.categoryId)}
                {line.kind === 'custom' && line.note ? ` · ${line.note}` : ''}
              </p>
              <p className="text-xs font-bold text-accent-green mt-1">{qtyLabel}</p>
            </div>
            <button
              type="button"
              aria-label="Remove item"
              onClick={() => removeItem(line.id)}
              className="p-1.5 text-muted-fg hover:text-accent-green shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {unitConfig.presets.map((preset) => {
              const active = line.quantity === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => applyQty(preset)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors ${
                    active
                      ? 'bg-brand-yellow text-ink border-brand-yellow'
                      : 'bg-muted/50 text-muted-fg border-border-custom hover:border-accent-green/40'
                  }`}
                >
                  {presetLabel(preset, unitConfig.kind)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="shrink-0 self-center">
          <QuantityControl
            quantity={line.quantity}
            max={unitConfig.max}
            unitKind={unitConfig.kind}
            compact
            step={unitConfig.step}
            onChange={(q) => {
              if (q < 1) removeItem(line.id);
              else applyQty(q);
            }}
            size="sm"
          />
        </div>
      </div>
    </li>
  );
}
