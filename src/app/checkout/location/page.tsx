'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Landmark, MapPin, Navigation } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { SERVICE_AREA_LABEL } from '@/lib/geo';
import { useServiceLocation } from '@/components/common/ServiceLocationProvider';

const MapWithNoSSR = dynamic(() => import('@/components/delivery/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[280px] dd-card flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  ),
});

export default function CheckoutLocationPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const deliveryLocation = useCartStore((s) => s.deliveryLocation);
  const updateDeliveryLocation = useCartStore((s) => s.updateDeliveryLocation);
  const { canUseApp, refreshLocation } = useServiceLocation();
  const [mounted, setMounted] = useState(false);
  const [landmark, setLandmark] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (items.length === 0) router.replace('/cart');
  }, [mounted, items.length, router]);

  useEffect(() => {
    if (!mounted) return;
    setLandmark(deliveryLocation.landmark);
    setAddress(deliveryLocation.address || SERVICE_AREA_LABEL);
  }, [mounted, deliveryLocation.landmark, deliveryLocation.address]);

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  const lat = deliveryLocation.latitude;
  const lng = deliveryLocation.longitude;

  const handleContinue = () => {
    if (!canUseApp || lat == null || lng == null) {
      refreshLocation();
      return;
    }
    updateDeliveryLocation({
      landmark: landmark.trim(),
      address: address.trim() || SERVICE_AREA_LABEL,
    });
    router.push('/checkout/details');
  };

  return (
    <div className="dd-page pb-32 max-w-lg mx-auto">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-sm text-muted-fg hover:text-foreground mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Cart
      </Link>
      <h1 className="font-display text-2xl font-semibold mb-1">Your live location</h1>
      <p className="text-sm text-muted-fg mb-4">
        Delivery uses your current GPS in {SERVICE_AREA_LABEL}. The pin updates automatically when
        you move.
      </p>

      <div className="dd-card overflow-hidden mb-4 h-[240px]">
        {lat != null && lng != null ? (
          <MapWithNoSSR
            latitude={lat}
            longitude={lng}
            readOnly
            fallbackLatitude={lat}
            fallbackLongitude={lng}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-muted-fg">
            Waiting for GPS…
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={refreshLocation}
        className="mb-4 inline-flex items-center gap-2 text-xs font-bold text-accent-green"
      >
        <Navigation className="w-3.5 h-3.5" />
        Refresh my location
      </button>

      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1.5" htmlFor="address">
            <MapPin className="w-4 h-4 text-primary" />
            Address note
          </label>
          <input
            id="address"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              updateDeliveryLocation({ address: e.target.value });
            }}
            className="w-full rounded-xl border border-border-custom bg-card-bg px-4 py-3 text-sm"
            placeholder={SERVICE_AREA_LABEL}
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1.5" htmlFor="landmark">
            <Landmark className="w-4 h-4 text-primary" />
            Landmark
          </label>
          <input
            id="landmark"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            className="w-full rounded-xl border border-border-custom bg-card-bg px-4 py-3 text-sm"
            placeholder="e.g. Near XYZ Market, Tower B"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={!canUseApp || lat == null}
        className="dd-btn-primary w-full justify-center mt-6 disabled:opacity-50"
      >
        Continue
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
