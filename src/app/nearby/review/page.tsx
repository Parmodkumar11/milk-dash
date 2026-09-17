'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import PageBanner from '@/components/common/PageBanner';
import NearbyStepper from '@/components/nearby/NearbyStepper';
import { useNearbyStore } from '@/store/nearby-store';
import { IMAGES } from '@/lib/images';
import {
  NEARBY_PROCUREMENT_FEE,
  NEARBY_DELIVERY_FEE,
  NEARBY_RADIUS_KM,
  sumEstimatedItems,
} from '@/lib/nearby';
import { generateNearbyWhatsAppUrl } from '@/lib/whatsapp';
import { getTodaySession } from '@/lib/sessions';
import SessionClosedModal from '@/components/common/SessionClosedModal';
import { useI18n } from '@/components/common/LanguageProvider';

export default function NearbyReviewPage() {
  const router = useRouter();
  const nearby = useNearbyStore();
  const [mounted, setMounted] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [error, setError] = useState('');
  const [sessionClosed, setSessionClosed] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const named = nearby.items.filter((item) => item.name.trim());
    if (named.length === 0) router.push('/nearby/request');
    else if (!nearby.customer.name || !nearby.location.address) router.push('/nearby/location');
  }, [mounted, nearby.items, nearby.customer, nearby.location]);

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  const namedItems = nearby.items.filter((item) => item.name.trim());
  const estimatedItemsTotal = sumEstimatedItems(namedItems.map((item) => item.estimatedCost));
  const serviceFees = NEARBY_PROCUREMENT_FEE + NEARBY_DELIVERY_FEE;

  const handleConfirm = () => {
    if (!getTodaySession().open) {
      setSessionClosed(true);
      return;
    }
    if (!agreed) {
      setError(t('review.errAgree'));
      return;
    }
    const order = nearby.submitRequest();
    if (!order) {
      router.push('/nearby/request');
      return;
    }
    const url = generateNearbyWhatsAppUrl(
      order.requestId,
      order.items,
      order.customer,
      order.location,
      order.preferredShop,
      order.instructions,
      order.estimatedItemsTotal,
      order.procurementFee,
      order.deliveryFee,
      order.estimatedTotal
    );
    window.open(url, '_blank');
    router.push('/nearby/track');
  };

  return (
    <div className="dd-page pb-28 sm:pb-12">
      <SessionClosedModal open={sessionClosed} onClose={() => setSessionClosed(false)} />
      <NearbyStepper />
      <div className="mb-6 space-y-3">
        <button
          type="button"
          onClick={() => router.push('/nearby/location')}
          className="p-2.5 rounded-full border border-border-custom bg-card-bg text-muted-fg hover:text-foreground hover:bg-muted"
          title={t('common.back')}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <PageBanner
          compact
          kicker={t('review.kicker')}
          title={t('review.title')}
          subtitle={t('review.subtitle')}
          imageSrc={IMAGES.checkout}
          imageAlt={t('review.bannerAlt')}
          tone="slate"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="dd-card p-5 space-y-3">
            <h2 className="font-display text-lg font-semibold">{t('review.items')}</h2>
            {namedItems.map((item) => (
              <div key={item.id} className="border border-border-custom rounded-xl p-3 text-sm">
                <div className="flex justify-between gap-3 font-bold">
                  <span>{item.name}</span>
                  <span>{item.estimatedCost ? `₹${item.estimatedCost}` : t('common.tbd')}</span>
                </div>
                <p className="text-muted-fg mt-1">{t('review.qty', { qty: item.quantity || '1' })}{item.notes ? ` · ${item.notes}` : ''}</p>
              </div>
            ))}
            {nearby.preferredShop && (
              <p className="text-sm text-muted-fg">{t('review.shop')} <strong className="text-foreground">{nearby.preferredShop}</strong></p>
            )}
          </div>
          <div className="dd-card p-5 text-sm space-y-1">
            <h2 className="font-display text-lg font-semibold mb-2">{t('review.deliverTo')}</h2>
            <p className="font-bold">{nearby.customer.name} · {nearby.customer.phone}</p>
            <p>{nearby.location.houseFlat}, {nearby.location.address}</p>
            {nearby.location.landmark && <p className="text-muted-fg">{nearby.location.landmark}</p>}
            <p className="text-muted-fg pt-2">{t('review.radius', { km: NEARBY_RADIUS_KM })}</p>
          </div>
        </div>

        <div className="lg:col-span-5 dd-surface p-5 sm:p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold">{t('review.pay')}</h2>
          <div className="text-sm space-y-2">
            <div className="flex justify-between gap-3">
              <span className="text-muted-fg">{t('nearby.shopBill')}</span>
              <span className="font-semibold text-right">
                {estimatedItemsTotal > 0 ? t('review.about', { n: estimatedItemsTotal }) : t('nearby.shopCharges')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-fg">{t('nearby.procurement')}</span>
              <span className="font-semibold">₹{NEARBY_PROCUREMENT_FEE}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-fg">{t('nearby.deliveryWithin', { km: NEARBY_RADIUS_KM })}</span>
              <span className="font-semibold">₹{NEARBY_DELIVERY_FEE}</span>
            </div>
            <div className="border-t border-dashed border-border-custom pt-3">
              {estimatedItemsTotal > 0 ? (
                <div className="flex justify-between items-baseline">
                  <span className="font-bold">{t('review.aboutLabel')}</span>
                  <span className="font-display text-2xl font-semibold">₹{estimatedItemsTotal + serviceFees}</span>
                </div>
              ) : (
                <p className="font-display text-xl font-semibold leading-snug">
                  {t('review.billPlus', { proc: NEARBY_PROCUREMENT_FEE, del: NEARBY_DELIVERY_FEE })}
                </p>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-fg leading-relaxed">
            {t('review.noMarkup')}
          </p>
          <label className="flex items-start gap-2.5 text-sm cursor-pointer">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 rounded text-primary" />
            <span>{t('review.agree')}</span>
          </label>
          {error && <p className="text-rose-500 text-xs font-bold">{error}</p>}
          <button type="button" onClick={handleConfirm} className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold flex items-center justify-center gap-2">
            <MessageSquare className="w-4 h-4 fill-current" />
            {t('review.whatsapp')}
          </button>
        </div>
      </div>
    </div>
  );
}
