'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart-store';
import { User, ArrowLeft, Save, MapPin } from 'lucide-react';
import { SERVICE_AREA_LABEL } from '@/lib/delivery';

export default function ProfilePage() {
  const { customer, deliveryLocation, updateCustomer, updateDeliveryLocation } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [landmark, setLandmark] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
    setName(customer.name || '');
    setPhone(customer.phone || '');
    setLandmark(deliveryLocation.landmark || '');
  }, [customer, deliveryLocation.landmark]);

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!/^\d{10}$/.test(phone.replace(/\D/g, '').slice(-10))) {
      newErrors.phone = 'Enter a valid 10-digit mobile number';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const digits = phone.replace(/\D/g, '').slice(-10);
    updateCustomer({ name: name.trim(), phone: digits });
    updateDeliveryLocation({ landmark: landmark.trim() });
    setErrors({});
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="dd-page pb-32 max-w-lg mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-fg hover:text-foreground mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Home
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold">Profile</h1>
          <p className="text-sm text-muted-fg">Saved for faster checkout</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="dd-card p-5 space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5" htmlFor="profile-name">Name</label>
          <input
            id="profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-border-custom bg-card-bg px-4 py-3 text-sm"
          />
          {errors.name ? <p className="text-xs text-primary mt-1">{errors.name}</p> : null}
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5" htmlFor="profile-phone">Mobile</label>
          <input
            id="profile-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-border-custom bg-card-bg px-4 py-3 text-sm"
          />
          {errors.phone ? <p className="text-xs text-primary mt-1">{errors.phone}</p> : null}
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold mb-1.5" htmlFor="profile-landmark">
            <MapPin className="w-4 h-4 text-primary" />
            Default landmark
          </label>
          <input
            id="profile-landmark"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            placeholder="e.g. Near XYZ Market"
            className="w-full rounded-xl border border-border-custom bg-card-bg px-4 py-3 text-sm"
          />
          <p className="text-xs text-muted-fg mt-1">Service area: {SERVICE_AREA_LABEL}</p>
        </div>
        <button type="submit" className="dd-btn-primary w-full justify-center gap-2">
          <Save className="w-4 h-4" />
          {savedSuccess ? 'Saved' : 'Save details'}
        </button>
      </form>
    </div>
  );
}
