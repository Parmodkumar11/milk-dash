'use client';

import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cart-store';
import { User, Phone, Home, Navigation, X, Check } from 'lucide-react';

export default function DetailsModal() {
  const { customer, deliveryLocation, updateCustomer, updateDeliveryLocation } = useCartStore();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [houseFlat, setHouseFlat] = useState('');
  const [locating, setLocating] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const hasDetails = customer.name && customer.phone && deliveryLocation.latitude && deliveryLocation.longitude;
    if (!hasDetails) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [customer, deliveryLocation]);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported.');
      return;
    }

    setLocating(true);
    setGpsError(null);
    setGpsSuccess(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updateDeliveryLocation({ latitude, longitude });
        setLocating(false);
        setGpsSuccess(true);
      },
      () => {
        setLocating(false);
        setGpsError('GPS access denied.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = 'Required';
    if (!phone.trim()) {
      newErrors.phone = 'Required';
    } else if (!/^\d{10}$/.test(phone.trim())) {
      newErrors.phone = '10 digits required';
    }
    if (!houseFlat.trim()) newErrors.houseFlat = 'Required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updateCustomer({ name, phone });
    updateDeliveryLocation({ houseFlat });

    if (deliveryLocation.latitude && !deliveryLocation.address) {
      updateDeliveryLocation({ address: 'Exact GPS Location Captured' });
    }

    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-card-bg rounded-t-[1.6rem] sm:rounded-[1.6rem] w-full max-w-md overflow-hidden animate-slide-up sm:animate-none border border-border-custom shadow-[var(--shadow-soft)]">
        <div className="p-5 pb-3 flex justify-between items-center border-b border-border-custom">
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground tracking-tight flex items-center gap-1.5">
              <span>🥛</span> Setup Delivery
            </h3>
            <p className="text-xs text-muted-fg mt-0.5">Enter details to unlock fresh milk delivery</p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-muted-fg hover:text-foreground p-2 rounded-full hover:bg-muted"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4">
          <div className="dd-surface p-3.5 flex items-center justify-between gap-3">
            <div className="text-left">
              <span className="dd-label mb-0">Delivery Point</span>
              <span className="text-sm font-bold text-foreground">
                {gpsSuccess ? '📍 GPS Captured' : 'Not detected'}
              </span>
            </div>
            <button
              type="button"
              onClick={detectLocation}
              disabled={locating}
              className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1 transition-all disabled:opacity-60 ${
                gpsSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-primary text-white hover:bg-primary-hover shadow-sm active:scale-95'
              }`}
            >
              {gpsSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Captured</span>
                </>
              ) : (
                <>
                  <Navigation className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
                  <span>{locating ? 'Locating...' : 'Locate Me'}</span>
                </>
              )}
            </button>
          </div>
          {gpsError && (
            <span className="text-xs font-semibold text-rose-500 block text-center">{gpsError}</span>
          )}

          <div>
            <label className="dd-label">Your Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                className={`dd-input ${errors.name ? 'dd-input-error' : ''}`}
                placeholder="Enter your name"
              />
            </div>
            {errors.name && <span className="text-rose-500 text-xs mt-1 block">{errors.name}</span>}
          </div>

          <div>
            <label className="dd-label">WhatsApp Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" />
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors({ ...errors, phone: '' });
                }}
                className={`dd-input ${errors.phone ? 'dd-input-error' : ''}`}
                placeholder="10-digit mobile number"
              />
            </div>
            {errors.phone && <span className="text-rose-500 text-xs mt-1 block">{errors.phone}</span>}
          </div>

          <div>
            <label className="dd-label">House / Flat No.</label>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" />
              <input
                type="text"
                value={houseFlat}
                onChange={(e) => {
                  setHouseFlat(e.target.value);
                  if (errors.houseFlat) setErrors({ ...errors, houseFlat: '' });
                }}
                className={`dd-input ${errors.houseFlat ? 'dd-input-error' : ''}`}
                placeholder="e.g. Flat 104, Block B"
              />
            </div>
            {errors.houseFlat && <span className="text-rose-500 text-xs mt-1 block">{errors.houseFlat}</span>}
          </div>

          <button type="submit" className="dd-btn-primary w-full mt-1">
            Start Delivery
          </button>
        </form>
      </div>
    </div>
  );
}
