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
      (error) => {
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-sm overflow-hidden animate-slide-up sm:animate-none">
        
        {/* Compact Header */}
        <div className="p-4 pb-2 flex justify-between items-center border-b border-border-custom">
          <div>
            <h3 className="text-base font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
              <span className="text-primary">🥛</span> Setup Delivery
            </h3>
            <p className="text-[10px] text-foreground/50">Enter details to unlock fresh milk delivery</p>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-foreground/40 hover:text-foreground p-1 rounded-full hover:bg-foreground/5"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-4 space-y-3.5">
          {/* Location button */}
          <div className="bg-[#F8F8FA] border border-border-custom p-3 rounded-xl flex items-center justify-between gap-3">
            <div className="text-left">
              <span className="text-[10px] font-bold text-foreground/50 uppercase block">Delivery Point</span>
              <span className="text-xs font-extrabold text-foreground">
                {gpsSuccess ? '📍 GPS Captured' : 'Not detected'}
              </span>
            </div>
            <button
              type="button"
              onClick={detectLocation}
              disabled={locating}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition-all ${
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
            <span className="text-[10px] font-semibold text-rose-500 block text-center -mt-2">{gpsError}</span>
          )}

          {/* Name Input */}
          <div>
            <label className="block text-[10px] font-bold text-foreground/60 mb-1 uppercase">Your Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/35" />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                className={`w-full bg-white border ${
                  errors.name ? 'border-rose-500' : 'border-border-custom focus:border-primary'
                } pl-9 pr-3 py-2 rounded-lg text-xs font-semibold focus:outline-none`}
                placeholder="Enter your name"
              />
            </div>
          </div>

          {/* Phone Input */}
          <div>
            <label className="block text-[10px] font-bold text-foreground/60 mb-1 uppercase">WhatsApp Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/35" />
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors({ ...errors, phone: '' });
                }}
                className={`w-full bg-white border ${
                  errors.phone ? 'border-rose-500' : 'border-border-custom focus:border-primary'
                } pl-9 pr-3 py-2 rounded-lg text-xs font-semibold focus:outline-none`}
                placeholder="10-digit mobile number"
              />
            </div>
          </div>

          {/* House Flat Input */}
          <div>
            <label className="block text-[10px] font-bold text-foreground/60 mb-1 uppercase">House / Flat No.</label>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/35" />
              <input
                type="text"
                value={houseFlat}
                onChange={(e) => {
                  setHouseFlat(e.target.value);
                  if (errors.houseFlat) setErrors({ ...errors, houseFlat: '' });
                }}
                className={`w-full bg-white border ${
                  errors.houseFlat ? 'border-rose-500' : 'border-border-custom focus:border-primary'
                } pl-9 pr-3 py-2 rounded-lg text-xs font-semibold focus:outline-none`}
                placeholder="e.g. Flat 104, Block B"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-extrabold text-xs shadow-sm transition-all active:scale-[0.98] mt-3"
          >
            Start Delivery
          </button>
        </form>
      </div>
    </div>
  );
}
