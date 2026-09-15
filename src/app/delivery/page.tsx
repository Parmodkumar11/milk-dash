'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart-store';
import { User, Phone, MapPin, Home, Landmark, FileText, ArrowRight, ArrowLeft } from 'lucide-react';
import PageBanner from '@/components/common/PageBanner';
import { IMAGES } from '@/lib/images';

const MapWithNoSSR = dynamic(() => import('@/components/delivery/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] dd-card flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <span className="text-xs text-muted-fg font-bold">Loading OpenStreetMap...</span>
      </div>
    </div>
  ),
});

export default function DeliveryPage() {
  const router = useRouter();
  const {
    items,
    customer,
    deliveryLocation,
    notes,
    updateCustomer,
    updateDeliveryLocation,
    updateNotes,
  } = useCartStore();

  const [mounted, setMounted] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [houseFlat, setHouseFlat] = useState('');
  const [landmark, setLandmark] = useState('');
  const [instructions, setInstructions] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setMounted(true);
    if (mounted) {
      setName(customer.name);
      setPhone(customer.phone);
      setAddress(deliveryLocation.address);
      setHouseFlat(deliveryLocation.houseFlat);
      setLandmark(deliveryLocation.landmark);
      setInstructions(notes);
    }
  }, [mounted]);

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push('/order');
    }
  }, [mounted, items]);

  if (!mounted || items.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  const handleLocationSelect = (lat: number, lng: number) => {
    updateDeliveryLocation({ latitude: lat, longitude: lng });
  };

  const handleConfirmLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit phone number.';
    }
    if (!address.trim()) newErrors.address = 'Delivery address is required.';
    if (!houseFlat.trim()) newErrors.houseFlat = 'House / Flat number is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.keys(newErrors)[0];
      const element = document.getElementById(firstError);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    updateCustomer({ name, phone });
    updateDeliveryLocation({ address, houseFlat, landmark });
    updateNotes(instructions);

    router.push('/checkout');
  };

  return (
    <div className="dd-page pb-28 sm:pb-12 flex-1 flex flex-col">
      <div className="mb-6 space-y-3">
        <button
          type="button"
          onClick={() => router.push('/cart')}
          className="p-2.5 rounded-full border border-border-custom bg-card-bg text-muted-fg hover:text-foreground hover:bg-muted transition-all"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <PageBanner
          compact
          kicker="Step 3 of 4"
          title="Delivery details"
          subtitle="Pin your room or home. We deliver nearby."
          imageSrc={IMAGES.farm}
          imageAlt="Delivery neighbourhood"
          tone="meadow"
        />
      </div>

      <form onSubmit={handleConfirmLocation} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch flex-1">
        <div className="lg:col-span-7 flex flex-col h-full dd-card p-5 sm:p-6">
          <MapWithNoSSR
            latitude={deliveryLocation.latitude}
            longitude={deliveryLocation.longitude}
            onLocationSelect={handleLocationSelect}
          />

          <div className="text-center mt-4 p-3.5 dd-surface flex flex-col items-center gap-3 text-xs text-muted-fg">
            <div>
              <span className="dd-label">Selected coordinates</span>
              {deliveryLocation.latitude && deliveryLocation.longitude ? (
                <div className="font-mono font-bold text-primary">
                  Lat: {deliveryLocation.latitude.toFixed(6)},
                  Lng: {deliveryLocation.longitude.toFixed(6)}
                </div>
              ) : (
                <span className="text-amber-700 dark:text-amber-400 font-semibold">Coordinates not selected. Pin will default to local center.</span>
              )}
            </div>
            {deliveryLocation.latitude && (
              <span className="dd-chip bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-900">
                Pin placed
              </span>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 dd-card p-5 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold pb-2 border-b border-border-custom">Customer information</h3>

            <div>
              <label htmlFor="name" className="dd-label">
                Full name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  className={`dd-input ${errors.name ? 'dd-input-error' : ''}`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <span className="text-rose-500 text-xs mt-1 block">{errors.name}</span>}
            </div>

            <div>
              <label htmlFor="phone" className="dd-label">
                Phone number (WhatsApp) *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" />
                <input
                  id="phone"
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  className={`dd-input ${errors.phone ? 'dd-input-error' : ''}`}
                  placeholder="9876543210"
                />
              </div>
              {errors.phone && <span className="text-rose-500 text-xs mt-1 block">{errors.phone}</span>}
            </div>

            <h3 className="font-display text-lg font-semibold pt-4 pb-2 border-b border-border-custom">Delivery address</h3>

            <div>
              <label htmlFor="address" className="dd-label">
                Street / area address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-muted-fg" />
                <textarea
                  id="address"
                  rows={2}
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address) setErrors({ ...errors, address: '' });
                  }}
                  className={`dd-input ${errors.address ? 'dd-input-error' : ''}`}
                  placeholder="Main Road, Patiala, Punjab"
                />
              </div>
              {errors.address && <span className="text-rose-500 text-xs mt-1 block">{errors.address}</span>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="houseFlat" className="dd-label">
                  House / flat no. *
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" />
                  <input
                    id="houseFlat"
                    type="text"
                    value={houseFlat}
                    onChange={(e) => {
                      setHouseFlat(e.target.value);
                      if (errors.houseFlat) setErrors({ ...errors, houseFlat: '' });
                    }}
                    className={`dd-input ${errors.houseFlat ? 'dd-input-error' : ''}`}
                    placeholder="House 123"
                  />
                </div>
                {errors.houseFlat && <span className="text-rose-500 text-xs mt-1 block">{errors.houseFlat}</span>}
              </div>

              <div>
                <label htmlFor="landmark" className="dd-label">
                  Landmark
                </label>
                <div className="relative">
                  <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" />
                  <input
                    id="landmark"
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="dd-input"
                    placeholder="Near XYZ School"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="instructions" className="dd-label">
                Delivery instructions
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-fg" />
                <textarea
                  id="instructions"
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="dd-input"
                  placeholder="Please call before arriving, leave at gate, etc."
                />
              </div>
            </div>
          </div>

          <button type="submit" className="dd-btn-primary w-full mt-2">
            <span>Confirm & continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
