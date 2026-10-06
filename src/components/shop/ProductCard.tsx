'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';
import type { RequestProduct } from '@/data/request-catalog';
import { useCartStore } from '@/store/cart-store';
import { productImageCandidates } from '@/lib/catalog-search';
import { displayName, displaySecondary } from '@/lib/i18n/catalog-display';
import { useLocale } from '@/components/common/LanguageProvider';
import {
  formatQuantity,
  presetLabel,
  unitConfigForProduct,
  validateQuantityForUnit,
} from '@/lib/product-units';
import QuantityControl from '@/components/shop/QuantityControl';

type Props = {
  product: RequestProduct;
  priority?: boolean;
  onOpenDetails?: () => void;
};

export default function ProductCard({ product, priority, onOpenDetails }: Props) {
  const { locale } = useLocale();
  const items = useCartStore((s) => s.items);
  const addCatalogItem = useCartStore((s) => s.addCatalogItem);
  const setLineQuantity = useCartStore((s) => s.setLineQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const [addedFlash, setAddedFlash] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const candidates = useMemo(() => productImageCandidates(product), [product]);
  const [imgSrc, setImgSrc] = useState(candidates[0]);

  const unitConfig = useMemo(
    () => unitConfigForProduct(product.name, product.categoryId),
    [product.name, product.categoryId]
  );

  const line = items.find((l) => l.kind === 'catalog' && l.productId === product.id);
  const inCart = line && line.kind === 'catalog';
  const secondary = displaySecondary(product, locale);

  const handleAdd = (qty = unitConfig.presets[0] ?? 1) => {
    const err = validateQuantityForUnit(unitConfig, qty, product.categoryId);
    if (err) {
      setError(err);
      return;
    }
    const storeErr = addCatalogItem({
      productId: product.id,
      name: product.name,
      nameHi: product.nameHi,
      categoryId: product.categoryId,
      quantity: qty,
    });
    if (storeErr) {
      setError(storeErr);
      return;
    }
    setError(null);
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 900);
  };

  const onImgError = () => {
    const next = imgIdx + 1;
    if (candidates[next]) {
      setImgIdx(next);
      setImgSrc(candidates[next]);
    }
  };

  return (
    <article className="dd-card group flex flex-col h-full min-h-[168px] overflow-hidden active:scale-[0.98] transition-transform">
      <button
        type="button"
        onClick={onOpenDetails}
        aria-label={`View ${displayName(product, locale)} details`}
        className="relative aspect-[4/3] max-h-[104px] w-full overflow-hidden bg-[#f7f9f6] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-green sm:max-h-[120px]"
      >
        <Image
          src={imgSrc}
          alt={displayName(product, locale)}
          fill
          sizes="(max-width: 640px) 33vw, 160px"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          onError={onImgError}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
        />
      </button>
      <div className="p-2 flex flex-col flex-1 gap-1.5">
        <button
          type="button"
          onClick={onOpenDetails}
          className="min-h-[2.25rem] text-left font-semibold text-[11px] leading-snug line-clamp-2 hover:text-accent-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-green sm:text-xs"
        >
          {displayName(product, locale)}
        </button>
        {secondary ? (
          <p className="min-h-4 text-[10px] text-muted-fg line-clamp-1 -mt-1">{secondary}</p>
        ) : (
          <span aria-hidden="true" className="min-h-4 -mt-1" />
        )}
        {!inCart ? (
          <div className="flex min-h-5 flex-wrap content-start gap-1">
            {unitConfig.presets.slice(0, 3).map((preset) => (
              <span
                key={preset}
                className="text-[9px] font-bold text-muted-fg bg-muted/60 px-1.5 py-0.5 rounded"
              >
                {presetLabel(preset, unitConfig.kind)}
              </span>
            ))}
          </div>
        ) : (
          <p className="flex min-h-5 items-center text-[10px] font-bold text-accent-green">
            {formatQuantity(line.quantity, unitConfig.kind)}
          </p>
        )}
        {error ? <p className="text-[10px] text-primary font-medium leading-tight">{error}</p> : null}
        <div className="mt-auto flex min-h-9 items-center justify-end">
          {inCart ? (
            <QuantityControl
              quantity={line.quantity}
              max={unitConfig.max}
              step={unitConfig.step}
              compact
              onChange={(q) => {
                const err = validateQuantityForUnit(unitConfig, q, product.categoryId);
                if (err) {
                  setError(err);
                  return;
                }
                const storeErr = setLineQuantity(line.id, q);
                if (storeErr) setError(storeErr);
                else setError(null);
                if (q < 1) removeItem(line.id);
              }}
              size="sm"
            />
          ) : (
            <button
              type="button"
              onClick={() => handleAdd()}
              className={`h-9 w-[72px] shrink-0 rounded-lg px-2 text-[11px] font-extrabold uppercase tracking-wide transition-all ${
                addedFlash
                  ? 'bg-brand-yellow text-ink animate-pop'
                  : 'bg-accent-green text-white hover:bg-accent-green-hover'
              }`}
            >
              {addedFlash ? (
                <span className="inline-flex items-center justify-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Added
                </span>
              ) : (
                'ADD'
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
