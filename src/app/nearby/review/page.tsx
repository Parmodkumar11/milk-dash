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

export default function NearbyReviewPage() {
  const router = useRouter();
  const nearby = useNearbyStore();
  const [mounted, setMounted] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [error, setError] = useState('');

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
    if (!agreed) {
      setError('Please acknowledge that final prices may vary.');
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
      <NearbyStepper />
      <div className="mb-6 space-y-3">
        <button
          type="button"
          onClick={() => router.push('/nearby/location')}
          className="p-2.5 rounded-full border border-border-custom bg-card-bg text-muted-fg hover:text-foreground hover:bg-muted"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <PageBanner
          compact
          kicker="Step 3 · Confirm"
          title="Review your request"
          subtitle="We’ll buy these items nearby and bring them to you."
          imageSrc={IMAGES.checkout}
          imageAlt="Shopping list review"
          tone="slate"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="dd-card p-5 space-y-3">
            <h2 className="font-display text-lg font-semibold">Requested items</h2>
            {namedItems.map((item) => (
              <div key={item.id} className="border border-border-custom rounded-xl p-3 text-sm">
                <div className="flex justify-between gap-3 font-bold">
                  <span>{item.name}</span>
                  <span>{item.estimatedCost ? `₹${item.estimatedCost}` : 'TBD'}</span>
                </div>
                <p className="text-muted-fg mt-1">Qty: {item.quantity || '1'}{item.notes ? ` · ${item.notes}` : ''}</p>
              </div>
            ))}
            {nearby.preferredShop && (
              <p className="text-sm text-muted-fg">Shop: <strong className="text-foreground">{nearby.preferredShop}</strong></p>
            )}
          </div>
          <div className="dd-card p-5 text-sm space-y-1">
            <h2 className="font-display text-lg font-semibold mb-2">Deliver to</h2>
            <p className="font-bold">{nearby.customer.name} · {nearby.customer.phone}</p>
            <p>{nearby.location.houseFlat}, {nearby.location.address}</p>
            {nearby.location.landmark && <p className="text-muted-fg">{nearby.location.landmark}</p>}
            <p className="text-muted-fg pt-2">Radius: within {NEARBY_RADIUS_KM} km</p>
          </div>
        </div>

        <div className="lg:col-span-5 dd-surface p-5 sm:p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold">What you pay</h2>
          <div className="text-sm space-y-2">
            <div className="flex justify-between gap-3">
              <span className="text-muted-fg">Shop bill</span>
              <span className="font-semibold text-right">
                {estimatedItemsTotal > 0 ? `About ₹${estimatedItemsTotal}` : 'What the shop charges'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-fg">Procurement / service</span>
              <span className="font-semibold">₹{NEARBY_PROCUREMENT_FEE}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-fg">Delivery (within {NEARBY_RADIUS_KM} km)</span>
              <span className="font-semibold">₹{NEARBY_DELIVERY_FEE}</span>
            </div>
            <div className="border-t border-dashed border-border-custom pt-3">
              {estimatedItemsTotal > 0 ? (
                <div className="flex justify-between items-baseline">
                  <span className="font-bold">About</span>
                  <span className="font-display text-2xl font-semibold">₹{estimatedItemsTotal + serviceFees}</span>
                </div>
              ) : (
                <p className="font-display text-xl font-semibold leading-snug">
                  Shop bill + ₹{NEARBY_PROCUREMENT_FEE} + ₹{NEARBY_DELIVERY_FEE}
                </p>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-fg leading-relaxed">
            Items stay at the shop’s actual price. No markup on the bill.
          </p>
          <label className="flex items-start gap-2.5 text-sm cursor-pointer">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 rounded text-primary" />
            <span>I understand prices can change at the shop and I want HopInMohali to procure these items.</span>
          </label>
          {error && <p className="text-rose-500 text-xs font-bold">{error}</p>}
          <button type="button" onClick={handleConfirm} className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold flex items-center justify-center gap-2">
            <MessageSquare className="w-4 h-4 fill-current" />
            Confirm on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
