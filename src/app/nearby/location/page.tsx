'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Home, Landmark, MapPin, Phone, User } from 'lucide-react';
import PageBanner from '@/components/common/PageBanner';
import NearbyStepper from '@/components/nearby/NearbyStepper';
import { useNearbyStore } from '@/store/nearby-store';
import { useCartStore } from '@/store/cart-store';
import { IMAGES } from '@/lib/images';
import { NEARBY_AREA_NAME, NEARBY_DEFAULT_LAT, NEARBY_DEFAULT_LNG, NEARBY_RADIUS_KM } from '@/lib/nearby';

const MapWithNoSSR = dynamic(() => import('@/components/delivery/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] dd-card flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  ),
});

export default function NearbyLocationPage() {
  const router = useRouter();
  const cart = useCartStore();
  const nearby = useNearbyStore();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [houseFlat, setHouseFlat] = useState('');
  const [landmark, setLandmark] = useState('');
  const [instructions, setInstructions] = useState('');
  const [radiusConfirmed, setRadiusConfirmed] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const named = nearby.items.filter((item) => item.name.trim());
    if (named.length === 0) {
      router.push('/nearby/request');
      return;
    }
    setName(nearby.customer.name || cart.customer.name);
    setPhone(nearby.customer.phone || cart.customer.phone);
    setAddress(nearby.location.address || cart.deliveryLocation.address || NEARBY_AREA_NAME);
    setHouseFlat(nearby.location.houseFlat || cart.deliveryLocation.houseFlat);
    setLandmark(nearby.location.landmark || cart.deliveryLocation.landmark);
    setInstructions(nearby.instructions);
    setRadiusConfirmed(nearby.radiusConfirmed);
    if (!nearby.location.latitude) {
      nearby.updateLocation({
        latitude: cart.deliveryLocation.latitude || NEARBY_DEFAULT_LAT,
        longitude: cart.deliveryLocation.longitude || NEARBY_DEFAULT_LNG,
      });
    }
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  const handleLocationSelect = (lat: number, lng: number) => {
    nearby.updateLocation({ latitude: lat, longitude: lng });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!phone.trim()) newErrors.phone = 'Phone number is required.';
    else if (!/^\d{10}$/.test(phone.trim())) newErrors.phone = 'Enter a valid 10-digit number.';
    if (!address.trim()) newErrors.address = 'Delivery address is required.';
    if (!houseFlat.trim()) newErrors.houseFlat = 'House / room number is required.';
    if (!radiusConfirmed) newErrors.radius = 'Please confirm you are within the 5 km service area.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    nearby.updateCustomer({ name, phone });
    nearby.updateLocation({ address, houseFlat, landmark });
    nearby.setInstructions(instructions);
    nearby.setRadiusConfirmed(true);
    router.push('/nearby/review');
  };

  return (
    <div className="dd-page pb-28 sm:pb-12">
      <NearbyStepper />
      <div className="mb-6 space-y-3">
        <button
          type="button"
          onClick={() => router.push('/nearby/request')}
          className="p-2.5 rounded-full border border-border-custom bg-card-bg text-muted-fg hover:text-foreground hover:bg-muted"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <PageBanner
          compact
          kicker="Step 2 · Delivery point"
          title="Where should we deliver?"
          subtitle={`Within about ${NEARBY_RADIUS_KM} km of ${NEARBY_AREA_NAME}.`}
          imageSrc={IMAGES.farm}
          imageAlt="Neighbourhood map"
          tone="meadow"
        />
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 dd-card p-5 sm:p-6">
          <MapWithNoSSR
            latitude={nearby.location.latitude}
            longitude={nearby.location.longitude}
            onLocationSelect={handleLocationSelect}
            fallbackLatitude={NEARBY_DEFAULT_LAT}
            fallbackLongitude={NEARBY_DEFAULT_LNG}
          />
          <p className="mt-3 text-xs text-muted-fg">
            Pin your exact room or building in {NEARBY_AREA_NAME}. Delivery is limited to approximately {NEARBY_RADIUS_KM} km.
          </p>
        </div>

        <div className="lg:col-span-5 dd-card p-5 sm:p-6 space-y-4">
          <div className="dd-surface p-3 text-sm text-muted-fg">
            Service radius: <strong className="text-foreground">{NEARBY_RADIUS_KM} km</strong> around {NEARBY_AREA_NAME}.
          </div>
          <div>
            <label htmlFor="name" className="dd-label">Full name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" />
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} className={`dd-input ${errors.name ? 'dd-input-error' : ''}`} placeholder="Your name" />
            </div>
            {errors.name && <span className="text-rose-500 text-xs mt-1 block">{errors.name}</span>}
          </div>
          <div>
            <label htmlFor="phone" className="dd-label">WhatsApp number *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" />
              <input id="phone" type="tel" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value)} className={`dd-input ${errors.phone ? 'dd-input-error' : ''}`} placeholder="10-digit mobile" />
            </div>
            {errors.phone && <span className="text-rose-500 text-xs mt-1 block">{errors.phone}</span>}
          </div>
          <div>
            <label htmlFor="houseFlat" className="dd-label">Room / house / flat *</label>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" />
              <input id="houseFlat" value={houseFlat} onChange={(e) => setHouseFlat(e.target.value)} className={`dd-input ${errors.houseFlat ? 'dd-input-error' : ''}`} placeholder="Room 204" />
            </div>
            {errors.houseFlat && <span className="text-rose-500 text-xs mt-1 block">{errors.houseFlat}</span>}
          </div>
          <div>
            <label htmlFor="address" className="dd-label">Street / area *</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-muted-fg" />
              <textarea id="address" rows={2} value={address} onChange={(e) => setAddress(e.target.value)} className={`dd-input ${errors.address ? 'dd-input-error' : ''}`} placeholder={NEARBY_AREA_NAME} />
            </div>
            {errors.address && <span className="text-rose-500 text-xs mt-1 block">{errors.address}</span>}
          </div>
          <div>
            <label htmlFor="landmark" className="dd-label">Landmark</label>
            <div className="relative">
              <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" />
              <input id="landmark" value={landmark} onChange={(e) => setLandmark(e.target.value)} className="dd-input" placeholder="Near main gate" />
            </div>
          </div>
          <div>
            <label className="dd-label">Delivery instructions</label>
            <textarea rows={2} value={instructions} onChange={(e) => setInstructions(e.target.value)} className="dd-input pl-4" placeholder="Call on arrival, leave at reception..." />
          </div>
          <label className="flex items-start gap-2.5 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={radiusConfirmed}
              onChange={(e) => setRadiusConfirmed(e.target.checked)}
              className="mt-0.5 rounded text-primary w-4 h-4"
            />
            <span>I confirm this delivery point is within about {NEARBY_RADIUS_KM} km of a nearby shop in {NEARBY_AREA_NAME}.</span>
          </label>
          {errors.radius && <span className="text-rose-500 text-xs font-bold">{errors.radius}</span>}
          <button type="submit" className="dd-btn-primary w-full">
            Review request
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
