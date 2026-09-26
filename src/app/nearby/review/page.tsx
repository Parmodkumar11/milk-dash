'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageSquare } from 'lucide-react';

import PageBanner from '@/components/common/PageBanner';
import NearbyStepper from '@/components/nearby/NearbyStepper';

import { useNearbyStore } from '@/store/nearby-store';

import { IMAGES } from '@/lib/images';

import {
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

    const named = nearby.items.filter(
      (item) => item.name.trim()
    );

    if (named.length === 0) {
      router.push('/nearby/request');
      return;
    }

    if (
      !nearby.customer.name ||
      !nearby.location.address
    ) {
      router.push('/nearby/location');
    }
  }, [
    mounted,
    nearby.items,
    nearby.customer,
    nearby.location,
    router,
  ]);

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  const namedItems = nearby.items.filter(
    (item) => item.name.trim()
  );

  /*
   * ---------------------------------------------------------
   * ESTIMATED SHOP BILL
   * ---------------------------------------------------------
   */

  const estimatedItemsTotal = sumEstimatedItems(
    namedItems.map((item) => item.estimatedCost)
  );

  /*
   * ---------------------------------------------------------
   * TOTAL QUANTITY
   * ---------------------------------------------------------
   *
   * Example:
   *
   * Milk × 2
   * Bread × 1
   * Eggs × 2
   *
   * Total quantity = 5
   */

  const totalQuantity = namedItems.reduce(
    (total, item) => {
      const quantity =
        parseInt(String(item.quantity), 10) || 1;

      return total + Math.max(1, quantity);
    },
    0
  );

  /*
   * ---------------------------------------------------------
   * SERVICE & DELIVERY FEE
   * ---------------------------------------------------------
   *
   * ₹5 per item
   *
   * Quantity 1 → ₹5
   * Quantity 2 → ₹10
   * Quantity 3 → ₹15
   * Quantity 4 → ₹20
   * Quantity 5 → ₹25
   */

  const serviceFee =
    Math.max(1, totalQuantity) * 5;

  /*
   * ---------------------------------------------------------
   * ESTIMATED TOTAL
   * ---------------------------------------------------------
   */

  const estimatedTotal =
    estimatedItemsTotal + serviceFee;

  /*
   * ---------------------------------------------------------
   * CONFIRM ORDER
   * ---------------------------------------------------------
   */

  const handleConfirm = () => {
    if (!getTodaySession().open) {
      setSessionClosed(true);
      return;
    }

    if (!agreed) {
      setError(t('review.errAgree'));
      return;
    }

    setError('');

    const order = nearby.submitRequest();

    if (!order) {
      router.push('/nearby/request');
      return;
    }

    /*
     * WhatsApp
     *
     * generateNearbyWhatsAppUrl should accept:
     *
     * requestId
     * items
     * customer
     * location
     * preferredShop
     * instructions
     * estimatedItemsTotal
     * serviceFee
     * estimatedTotal
     */

    const url = generateNearbyWhatsAppUrl(
      order.requestId,
      order.items,
      order.customer,
      order.location,
      order.preferredShop,
      order.instructions,
      order.estimatedItemsTotal,
      serviceFee,
      estimatedTotal
    );

    window.open(url, '_blank');

    router.push('/nearby/track');
  };

  return (
    <div className="dd-page pb-28 sm:pb-12">

      {/* Session Closed */}
      <SessionClosedModal
        open={sessionClosed}
        onClose={() => setSessionClosed(false)}
      />

      {/* Stepper */}
      <NearbyStepper />

      {/* Header */}
      <div className="mb-6 space-y-3">

        <button
          type="button"
          onClick={() =>
            router.push('/nearby/location')
          }
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* =====================================================
            LEFT SIDE
        ====================================================== */}

        <div className="lg:col-span-7 space-y-4">

          {/* Items */}
          <div className="dd-card p-5 space-y-3">

            <h2 className="font-display text-lg font-semibold">
              {t('review.items')}
            </h2>

            {namedItems.map((item) => {

              const quantity =
                parseInt(String(item.quantity), 10) || 1;

              return (
                <div
                  key={item.id}
                  className="border border-border-custom rounded-xl p-3 text-sm"
                >

                  <div className="flex justify-between gap-3 font-bold">

                    <span>
                      {item.name}
                    </span>

                    <span>
                      {item.estimatedCost
                        ? `₹${item.estimatedCost}`
                        : t('common.tbd')}
                    </span>

                  </div>

                  <p className="text-muted-fg mt-1">

                    {t('review.qty', {
                      qty: String(quantity),
                    })}

                    {item.notes
                      ? ` · ${item.notes}`
                      : ''}

                  </p>

                </div>
              );
            })}

          </div>

          {/* Delivery Address */}
          <div className="dd-card p-5 text-sm space-y-1">

            <h2 className="font-display text-lg font-semibold mb-2">
              {t('review.deliverTo')}
            </h2>

            <p className="font-bold">
              {nearby.customer.name} ·{' '}
              {nearby.customer.phone}
            </p>

            <p>
              {nearby.location.houseFlat},{' '}
              {nearby.location.address}
            </p>

            {nearby.location.landmark && (
              <p className="text-muted-fg">
                {nearby.location.landmark}
              </p>
            )}

            <p className="text-muted-fg pt-2">
              {t('review.radius', {
                km: NEARBY_RADIUS_KM,
              })}
            </p>

          </div>

        </div>

        {/* =====================================================
            RIGHT SIDE
        ====================================================== */}

        <div className="lg:col-span-5 dd-surface p-5 sm:p-6 space-y-4">

          <h2 className="font-display text-lg font-semibold">
            {t('review.pay')}
          </h2>

          <div className="text-sm space-y-3">

            {/* Shop Bill */}
            <div className="flex justify-between gap-3">

              <span className="text-muted-fg">
                {t('nearby.shopBill')}
              </span>

              <span className="font-semibold text-right">

                {estimatedItemsTotal > 0
                  ? t('review.about', {
                      n: estimatedItemsTotal,
                    })
                  : t('nearby.shopCharges')}

              </span>

            </div>

            {/* Service & Delivery */}
            <div className="flex justify-between gap-3">

              <div>

                <span className="text-muted-fg">
                  Service & Delivery
                </span>

                <p className="text-xs text-muted-fg mt-0.5">
                  ₹5 per item
                </p>

              </div>

              <span className="font-semibold">
                ₹{serviceFee}
              </span>

            </div>

            {/* Total Items */}
            <div className="flex justify-between">

              <span className="text-muted-fg">
                Total items
              </span>

              <span className="font-semibold">
                {totalQuantity}
              </span>

            </div>

            {/* Estimated Total */}
            <div className="border-t border-dashed border-border-custom pt-3">

              {estimatedItemsTotal > 0 ? (

                <div className="flex justify-between items-baseline gap-3">

                  <span className="font-bold">
                    Estimated Total
                  </span>

                  <span className="font-display text-2xl font-semibold">
                    ₹{estimatedTotal}
                  </span>

                </div>

              ) : (

                <div>

                  <p className="font-display text-xl font-semibold leading-snug">
                    Shop bill + ₹{serviceFee}
                  </p>

                  <p className="text-xs text-muted-fg mt-1">
                    Final shop bill may vary.
                  </p>

                </div>

              )}

            </div>

          </div>

          {/* No Markup */}
          <p className="text-xs text-muted-fg leading-relaxed">
            {t('review.noMarkup')}
          </p>

          {/* Agreement */}
          <label className="flex items-start gap-2.5 text-sm cursor-pointer">

            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => {

                setAgreed(e.target.checked);

                if (error) {
                  setError('');
                }

              }}
              className="mt-0.5 w-4 h-4 rounded text-primary"
            />

            <span>
              {t('review.agree')}
            </span>

          </label>

          {/* Error */}
          {error && (
            <p className="text-rose-500 text-xs font-bold">
              {error}
            </p>
          )}

          {/* WhatsApp Button */}
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold flex items-center justify-center gap-2"
          >

            <MessageSquare className="w-4 h-4 fill-current" />

            {t('review.whatsapp')}

          </button>

        </div>

      </div>

    </div>
  );
}