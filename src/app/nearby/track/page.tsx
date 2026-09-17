'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, Package } from 'lucide-react';
import PageBanner from '@/components/common/PageBanner';
import NearbyStepper from '@/components/nearby/NearbyStepper';
import { useNearbyStore } from '@/store/nearby-store';
import { IMAGES } from '@/lib/images';
import { NEARBY_STATUSES } from '@/lib/nearby';
import { NearbyRequestStatus } from '@/types/nearby';
import { useI18n } from '@/components/common/LanguageProvider';
import type { MessageKey } from '@/lib/i18n';

const STATUS_ORDER: NearbyRequestStatus[] = [
  'received',
  'shopping',
  'purchased',
  'out_for_delivery',
  'delivered',
];

export default function NearbyTrackPage() {
  const { history, activeRequestId } = useNearbyStore();
  const [mounted, setMounted] = useState(false);
  const { t } = useI18n();

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

  const active =
    history.find((order) => order.requestId === activeRequestId) || history[0];

  if (!active) {
    return (
      <div className="dd-page pb-28 text-center max-w-md mx-auto">
        <Package className="w-12 h-12 text-muted-fg mx-auto mb-4" />
        <h1 className="font-display text-2xl font-semibold mb-2">{t('track.emptyTitle')}</h1>
        <p className="text-sm text-muted-fg mb-6">{t('track.emptyBody')}</p>
        <Link href="/nearby/request" className="dd-btn-primary">{t('common.getNearby')}</Link>
      </div>
    );
  }

  const currentIndex = STATUS_ORDER.indexOf(active.status);

  return (
    <div className="dd-page pb-28 sm:pb-12">
      <NearbyStepper />
      <PageBanner
        compact
        kicker={t('track.kicker')}
        title={t('track.title')}
        subtitle={t('track.subtitle', { id: active.requestId, when: active.createdAt })}
        imageSrc={IMAGES.privacy}
        imageAlt={t('track.bannerAlt')}
        tone="slate"
      />

      <div className="dd-card p-5 sm:p-7 mt-6 space-y-5">
        <div className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="w-5 h-5" />
          {t('track.saved')}
        </div>
        <ol className="space-y-4">
          {NEARBY_STATUSES.map((step, index) => {
            const done = index <= currentIndex;
            const current = index === currentIndex;
            return (
              <li key={step.id} className="flex gap-3">
                <span
                  className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    done ? 'bg-foreground text-background' : 'bg-muted text-muted-fg'
                  }`}
                >
                  {index + 1}
                </span>
                <div>
                  <p className={`font-bold ${current ? 'text-primary' : 'text-foreground'}`}>{t(`status.${step.id}` as MessageKey)}</p>
                  <p className="text-sm text-muted-fg">{t(`status.${step.id}Detail` as MessageKey)}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="dd-card p-5 mt-4 space-y-2 text-sm">
        <h2 className="font-display text-lg font-semibold">{t('track.items')}</h2>
        {active.items.map((item) => (
          <div key={item.id} className="flex justify-between gap-3">
            <span>{item.name} × {item.quantity || '1'}</span>
            <span className="text-muted-fg">{item.estimatedCost ? `₹${item.estimatedCost}` : t('common.tbd')}</span>
          </div>
        ))}
        <div className="border-t border-border-custom pt-2 space-y-1">
          <div className="flex justify-between text-muted-fg">
            <span>{t('nearby.shopBill')}</span>
            <span>{t('nearby.shopCharges')}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('nearby.procurement')}</span>
            <span>₹{active.procurementFee}</span>
          </div>
          <div className="flex justify-between">
            <span>{t('nearby.deliveryWithin', { km: 5 })}</span>
            <span>₹{active.deliveryFee}</span>
          </div>
        </div>
        <p className="text-xs text-muted-fg flex items-center gap-1 pt-1">
          <Clock className="w-3.5 h-3.5" /> {t('track.feesNote')}
        </p>
      </div>

      {history.length > 1 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-fg">{t('track.earlier')}</h3>
          {history.filter((order) => order.requestId !== active.requestId).map((order) => (
            <div key={order.requestId} className="dd-surface p-4 text-sm flex justify-between gap-3">
              <span className="font-bold">{order.requestId}</span>
              <span className="text-muted-fg">{order.status.replaceAll('_', ' ')}</span>
            </div>
          ))}
        </div>
      )}

      <Link href="/nearby/request" className="dd-btn-ghost w-full mt-6 justify-center">
        {t('track.new')}
      </Link>
    </div>
  );
}
