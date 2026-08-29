'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart-store';
import { User, Phone, MapPin, Home, Landmark, FileText, ArrowRight, ArrowLeft } from 'lucide-react';

// Dynamically import Leaflet Map to avoid SSR errors
const MapWithNoSSR = dynamic(() => import('@/components/delivery/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] bg-white border border-border-custom rounded-2xl flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <span className="text-xs text-foreground/50 font-bold">Loading OpenStreetMap...</span>
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

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [houseFlat, setHouseFlat] = useState('');
  const [landmark, setLandmark] = useState('');
  const [instructions, setInstructions] = useState('');

  // Validation state
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

  // If cart is empty, redirect back
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

  // Handle live location coordinate selection from Leaflet
  const handleLocationSelect = (lat: number, lng: number) => {
    updateDeliveryLocation({ latitude: lat, longitude: lng });
  };

  // Form submit handler
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
      // Scroll to the first error input
      const firstError = Object.keys(newErrors)[0];
      const element = document.getElementById(firstError);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    // Save details to Zustand
    updateCustomer({ name, phone });
    updateDeliveryLocation({ address, houseFlat, landmark });
    updateNotes(instructions);

    router.push('/checkout');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 pb-28 sm:pb-12 w-full flex-1 flex flex-col">
      <div className="mb-6 pb-3 border-b border-border-custom flex justify-between items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">Delivery Details</h1>
          <p className="text-xs text-foreground/60">select location pin.</p>
        </div>
        <button
          type="button"
          onClick={() => router.push('/cart')}
          className="p-2 rounded-full border border-border-custom bg-white text-foreground/70 hover:text-foreground hover:bg-[#FCFAF6] transition-all shadow-xs shrink-0"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleConfirmLocation} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-1">
        {/* Left Area (Col 7): Map & Pin Coordinates */}
        <div className="lg:col-span-7 flex flex-col h-full bg-white border border-border-custom p-5 sm:p-6 rounded-2xl shadow-sm">
          <MapWithNoSSR
            latitude={deliveryLocation.latitude}
            longitude={deliveryLocation.longitude}
            onLocationSelect={handleLocationSelect}
          />

          {/* Coordinates display indicator */}
          <div className="text-center mt-4 p-3.5 bg-[#FCFAF6] border border-border-custom rounded-xl flex flex-col items-center gap-4 text-xs text-foreground/75">
            <div>
              <span className="font-bold block text-foreground/60 uppercase tracking-wide mb-0.5">Selected Coordinates</span>
              {deliveryLocation.latitude && deliveryLocation.longitude ? (
                <div className="font-mono font-bold text-primary-hover">
                  Lat: {deliveryLocation.latitude.toFixed(6)},
                  Lng: {deliveryLocation.longitude.toFixed(6)}
                </div>
              ) : (
                <span className="text-amber-600 font-semibold">Coordinates not selected. Pin will default to local center.</span>
              )}
            </div>
            {deliveryLocation.latitude && (
              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold rounded-md">
                Pin Placed 👍
              </span>
            )}
          </div>
        </div>

        {/* Right Area (Col 5): Customer Details Form */}
        <div className="lg:col-span-5 bg-white border border-border-custom p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold pb-2 border-b border-border-custom">Customer Information</h3>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-foreground/75 mb-1.5 uppercase">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  className={`w-full bg-white border ${errors.name ? 'border-rose-500 focus:border-rose-500' : 'border-border-custom focus:border-primary'
                    } pl-10 pr-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none transition-all`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <span className="text-rose-500 text-xs mt-1 block">{errors.name}</span>}
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-foreground/75 mb-1.5 uppercase">
                Phone Number (WhatsApp) *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                <input
                  id="phone"
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors({ ...errors, phone: '' });
                  }}
                  className={`w-full bg-white border ${errors.phone ? 'border-rose-500 focus:border-rose-500' : 'border-border-custom focus:border-primary'
                    } pl-10 pr-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none transition-all`}
                  placeholder="9876543210"
                />
              </div>
              {errors.phone && <span className="text-rose-500 text-xs mt-1 block">{errors.phone}</span>}
            </div>

            <h3 className="text-lg font-bold pt-4 pb-2 border-b border-border-custom">Delivery Address</h3>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-xs font-bold text-foreground/75 mb-1.5 uppercase">
                Street / Area Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-foreground/40" />
                <textarea
                  id="address"
                  rows={2}
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address) setErrors({ ...errors, address: '' });
                  }}
                  className={`w-full bg-white border ${errors.address ? 'border-rose-500 focus:border-rose-500' : 'border-border-custom focus:border-primary'
                    } pl-10 pr-4 py-2 rounded-xl text-sm font-semibold focus:outline-none transition-all resize-none`}
                  placeholder="Main Road, Patiala, Punjab"
                />
              </div>
              {errors.address && <span className="text-rose-500 text-xs mt-1 block">{errors.address}</span>}
            </div>

            {/* House / Flat No. & Landmark in a responsive 2-column or 1-column layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="houseFlat" className="block text-xs font-bold text-foreground/75 mb-1.5 uppercase">
                  House / Flat No. *
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                  <input
                    id="houseFlat"
                    type="text"
                    value={houseFlat}
                    onChange={(e) => {
                      setHouseFlat(e.target.value);
                      if (errors.houseFlat) setErrors({ ...errors, houseFlat: '' });
                    }}
                    className={`w-full bg-white border ${errors.houseFlat ? 'border-rose-500 focus:border-rose-500' : 'border-border-custom focus:border-primary'
                      } pl-10 pr-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none transition-all`}
                    placeholder="House 123"
                  />
                </div>
                {errors.houseFlat && <span className="text-rose-500 text-xs mt-1 block">{errors.houseFlat}</span>}
              </div>

              <div>
                <label htmlFor="landmark" className="block text-xs font-bold text-foreground/75 mb-1.5 uppercase">
                  Landmark
                </label>
                <div className="relative">
                  <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                  <input
                    id="landmark"
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full bg-white border border-border-custom focus:border-primary pl-10 pr-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none transition-all"
                    placeholder="Near XYZ School"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Instructions */}
            <div>
              <label htmlFor="instructions" className="block text-xs font-bold text-foreground/75 mb-1.5 uppercase">
                Delivery Instructions
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-foreground/40" />
                <textarea
                  id="instructions"
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full bg-white border border-border-custom focus:border-primary pl-10 pr-4 py-2 rounded-xl text-sm font-semibold focus:outline-none transition-all resize-none"
                  placeholder="Please call before arriving, leave at gate, etc."
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-5 rounded-xl bg-primary hover:bg-primary-hover text-white font-extrabold flex items-center justify-center gap-2 transition-all shadow-sm text-sm active:scale-98 mt-2"
          >
            <span>Confirm & Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
