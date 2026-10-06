'use client';

import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { RequestProduct } from '@/data/request-catalog';
import { getFilterLabel } from '@/data/filter-categories';
import { productImageCandidates } from '@/lib/catalog-search';
import { displayName } from '@/lib/i18n/catalog-display';
import { useLocale } from '@/components/common/LanguageProvider';
import {
  formatQuantity,
  presetLabel,
  unitConfigForProduct,
  validateQuantityForUnit,
} from '@/lib/product-units';
import { useCartStore } from '@/store/cart-store';

type Props = {
  products: RequestProduct[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

const subscribeToMount = () => () => {};
const getClientMountSnapshot = () => true;
const getServerMountSnapshot = () => false;

export default function ProductDetailsCarousel({
  products,
  activeIndex,
  onClose,
  onNavigate,
}: Props) {
  const { locale } = useLocale();
  const addCatalogItem = useCartStore((state) => state.addCatalogItem);
  const product = products[activeIndex];
  const candidates = useMemo(() => productImageCandidates(product), [product]);
  const unitConfig = useMemo(
    () => unitConfigForProduct(product.name, product.categoryId),
    [product.name, product.categoryId]
  );
  const mounted = useSyncExternalStore(
    subscribeToMount,
    getClientMountSnapshot,
    getServerMountSnapshot
  );
  const [imageIndex, setImageIndex] = useState(0);
  const [imageSrc, setImageSrc] = useState(candidates[0]);
  const [quantity, setQuantity] = useState(unitConfig.presets[0] ?? 1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const touchStartX = useRef<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft' && activeIndex > 0) onNavigate(activeIndex - 1);
      if (event.key === 'ArrowRight' && activeIndex < products.length - 1) {
        onNavigate(activeIndex + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [activeIndex, onClose, onNavigate, products.length]);

  if (!mounted) return null;

  const onImageError = () => {
    const next = imageIndex + 1;
    if (candidates[next]) {
      setImageIndex(next);
      setImageSrc(candidates[next]);
    }
  };

  const addToCart = () => {
    const validationError = validateQuantityForUnit(
      unitConfig,
      quantity,
      product.categoryId
    );
    if (validationError) {
      setError(validationError);
      return;
    }
    const storeError = addCatalogItem({
      productId: product.id,
      name: product.name,
      nameHi: product.nameHi,
      categoryId: product.categoryId,
      quantity,
    });
    if (storeError) {
      setError(storeError);
      return;
    }
    setError(null);
    setAdded(true);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[220] flex items-end justify-center bg-black/55 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-details-title"
      onClick={onClose}
    >
      <section
        className="relative z-10 max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-t-[1.5rem] border border-border-custom bg-card-bg shadow-[var(--shadow-soft)] sm:rounded-[1.5rem]"
        onClick={(event) => event.stopPropagation()}
        onTouchStart={(event) => {
          touchStartX.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null) return;
          const distance = event.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(distance) > 55) {
            const nextIndex = activeIndex + (distance < 0 ? 1 : -1);
            if (nextIndex >= 0 && nextIndex < products.length) onNavigate(nextIndex);
          }
          touchStartX.current = null;
        }}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-[#f7f9f6] sm:aspect-[16/9]">
          <Image
            key={product.id}
            src={imageSrc}
            alt={displayName(product, locale)}
            fill
            sizes="(max-width: 640px) 100vw, 576px"
            className="object-contain p-4"
            onError={onImageError}
            priority
          />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close product details"
            className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-ink shadow-md hover:bg-white"
          >
            <X className="h-5 w-5" />
          </button>
          {products.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => onNavigate(activeIndex - 1)}
                disabled={activeIndex === 0}
                aria-label="Previous product"
                className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-ink shadow-md hover:bg-white disabled:opacity-40"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate(activeIndex + 1)}
                disabled={activeIndex === products.length - 1}
                aria-label="Next product"
                className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-ink shadow-md hover:bg-white disabled:opacity-40"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white">
                {activeIndex + 1} / {products.length}
              </span>
            </>
          ) : null}
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div>
            <p className="mb-2 inline-flex rounded-full bg-accent-green/10 px-3 py-1 text-xs font-bold text-accent-green">
              {getFilterLabel(product.categoryId)}
            </p>
            <h2 id="product-details-title" className="font-display text-xl font-bold sm:text-2xl">
              {displayName(product, locale)}
            </h2>
            {product.nameHi && locale !== 'hi' ? (
              <p className="mt-1 text-sm text-muted-fg">{product.nameHi}</p>
            ) : null}
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-fg">
              Available sizes
            </p>
            <div className="flex flex-wrap gap-2">
              {unitConfig.presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setQuantity(preset);
                    setAdded(false);
                    setError(null);
                  }}
                  aria-pressed={quantity === preset}
                  className={`rounded-lg border px-3 py-2 text-sm font-bold transition-colors ${
                    quantity === preset
                      ? 'border-accent-green bg-accent-green/10 text-accent-green'
                      : 'border-border-custom bg-white text-muted-fg hover:border-accent-green/50'
                  }`}
                >
                  {presetLabel(preset, unitConfig.kind)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-border-custom pt-4">
            <p className="text-sm font-semibold text-muted-fg">
              Selected: <span className="text-ink">{formatQuantity(quantity, unitConfig.kind)}</span>
            </p>
            <button
              type="button"
              onClick={addToCart}
              className={`min-w-36 rounded-xl px-5 py-3 text-sm font-extrabold transition-colors ${
                added
                  ? 'bg-brand-yellow text-ink'
                  : 'bg-accent-green text-white hover:bg-accent-green-hover'
              }`}
            >
              {added ? 'Added to cart' : 'Add to cart'}
            </button>
          </div>
          {error ? <p role="alert" className="text-sm font-medium text-primary">{error}</p> : null}
        </div>
      </section>
    </div>,
    document.body
  );
}
