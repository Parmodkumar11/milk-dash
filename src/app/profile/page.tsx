'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart-store';
import { dryFruits } from '@/data/dry-fruits';
import { User, Phone, MapPin, Home, ArrowLeft, Trash2, Edit2, Check, Navigation, ShieldCheck, History, Save, Clock, ShoppingBag } from 'lucide-react';
import { ANDROID_APP_URL, openAndroidApp } from '@/lib/app-links';

export default function ProfilePage() {
  const router = useRouter();
  const { customer, deliveryLocation, orderHistory, updateCustomer, updateDeliveryLocation } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [houseFlat, setHouseFlat] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [locating, setLocating] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setMounted(true);
    if (customer.name || deliveryLocation.address) {
      setName(customer.name || '');
      setPhone(customer.phone || '');
      setHouseFlat(deliveryLocation.houseFlat || '');
      setAddress(deliveryLocation.address || '');
      setLandmark(deliveryLocation.landmark || '');
    } else {
      setIsEditing(true);
    }
  }, [customer, deliveryLocation]);

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateDeliveryLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true }
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = 'Name is required';
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone.trim())) {
      newErrors.phone = 'Enter valid 10-digit number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updateCustomer({ name, phone });
    updateDeliveryLocation({ houseFlat, address, landmark });

    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDeleteProfile = () => {
    if (confirm('Are you sure you want to clear your saved profile details?')) {
      updateCustomer({ name: '', phone: '' });
      updateDeliveryLocation({ address: '', houseFlat: '', landmark: '', latitude: null, longitude: null });
      setName('');
      setPhone('');
      setHouseFlat('');
      setAddress('');
      setLandmark('');
      setIsEditing(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 pb-36 md:pb-20 w-full flex-1 space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-border-custom flex justify-between items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <span>My Profile & Settings</span>
          </h1>
          <p className="text-xs text-foreground/60">View, update, or manage your profile and past orders.</p>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 rounded-full border border-border-custom bg-white text-foreground/70 hover:text-foreground hover:bg-[#FCFAF6] transition-all shadow-xs shrink-0"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-xl font-bold flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Profile details saved successfully!</span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-white border border-border-custom rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">

        {/* User Header Info with Avatar */}
        <div className="flex items-center gap-4 pb-4 border-b border-border-custom">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-amber-400 text-white flex items-center justify-center font-black text-xl shadow-xs border-2 border-white ring-2 ring-primary/20 shrink-0">
            {name ? name.charAt(0).toUpperCase() : '🥛'}
          </div>

          <div className="flex-1">
            <h2 className="text-base font-extrabold text-foreground">
              {customer.name || 'Dairy Customer'}
            </h2>
            <p className="text-xs text-foreground/60">
              {customer.phone ? `+91 ${customer.phone}` : 'No phone number set'}
            </p>
            <span className="inline-block mt-0.5 text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
              Active Member
            </span>
          </div>

          {!isEditing && customer.name && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-xl border border-border-custom hover:bg-[#FCFAF6] text-foreground/70 hover:text-foreground text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Edit</span>
            </button>
          )}
        </div>

        {/* View / Edit Mode */}
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="text-xs font-extrabold text-foreground/70 uppercase tracking-wider">
              Update Personal & Delivery Details
            </h3>

            <div>
              <label className="block text-xs font-bold text-foreground/75 mb-1 uppercase">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                className="w-full bg-white border border-border-custom focus:border-primary px-3.5 py-2 rounded-xl text-xs font-semibold focus:outline-none"
                placeholder="John Doe"
              />
              {errors.name && <span className="text-rose-500 text-[10px] mt-1 block font-bold">{errors.name}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground/75 mb-1 uppercase">WhatsApp Number *</label>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors({ ...errors, phone: '' });
                }}
                className="w-full bg-white border border-border-custom focus:border-primary px-3.5 py-2 rounded-xl text-xs font-semibold focus:outline-none"
                placeholder="10-digit mobile number"
              />
              {errors.phone && <span className="text-rose-500 text-[10px] mt-1 block font-bold">{errors.phone}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground/75 mb-1 uppercase">House / Flat No.</label>
              <input
                type="text"
                value={houseFlat}
                onChange={(e) => setHouseFlat(e.target.value)}
                className="w-full bg-white border border-border-custom focus:border-primary px-3.5 py-2 rounded-xl text-xs font-semibold focus:outline-none"
                placeholder="House 123, Flat 4B"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground/75 mb-1 uppercase">Street Address</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-white border border-border-custom focus:border-primary px-3.5 py-2 rounded-xl text-xs font-semibold focus:outline-none resize-none"
                placeholder="Main Road, Area Name"
              />
            </div>

            <div className="bg-[#FCFAF6] p-3 rounded-xl border border-border-custom flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-foreground/50 uppercase block">GPS Location</span>
                <span className="text-xs font-bold text-foreground">
                  {deliveryLocation.latitude
                    ? `Lat: ${deliveryLocation.latitude.toFixed(4)}, Lng: ${deliveryLocation.longitude?.toFixed(4)}`
                    : 'Not captured yet'}
                </span>
              </div>
              <button
                type="button"
                onClick={detectLocation}
                disabled={locating}
                className="px-3 py-1.5 rounded-lg bg-foreground text-background font-bold text-xs flex items-center gap-1.5"
              >
                <Navigation className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
                <span>{locating ? 'Locating...' : 'Detect GPS'}</span>
              </button>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile</span>
              </button>
              {customer.name && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="py-2.5 px-4 rounded-xl border border-border-custom hover:bg-[#FCFAF6] text-foreground font-bold text-xs"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#FCFAF6] rounded-xl border border-border-custom">
                <span className="text-[10px] font-bold text-foreground/50 uppercase block mb-0.5">Saved Name</span>
                <span className="font-extrabold text-foreground text-xs">{customer.name}</span>
              </div>

              <div className="p-3 bg-[#FCFAF6] rounded-xl border border-border-custom">
                <span className="text-[10px] font-bold text-foreground/50 uppercase block mb-0.5">WhatsApp Number</span>
                <span className="font-extrabold text-foreground text-xs">{customer.phone}</span>
              </div>

              <div className="p-3 bg-[#FCFAF6] rounded-xl border border-border-custom sm:col-span-2">
                <span className="text-[10px] font-bold text-foreground/50 uppercase block mb-0.5">Delivery Address</span>
                <span className="font-extrabold text-foreground block">{deliveryLocation.houseFlat}</span>
                <span className="text-foreground/70">{deliveryLocation.address}</span>
              </div>

              {deliveryLocation.latitude && (
                <div className="p-3 bg-[#FCFAF6] rounded-xl border border-border-custom sm:col-span-2 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-foreground/50 uppercase block">GPS Coordinates</span>
                    <span className="font-mono text-xs font-bold text-emerald-700">
                      {deliveryLocation.latitude.toFixed(5)}, {deliveryLocation.longitude?.toFixed(5)}
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    GPS Pin Active 📍
                  </span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-border-custom flex justify-between items-center">
              <button
                type="button"
                onClick={handleDeleteProfile}
                className="text-xs text-rose-500 font-bold hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Profile Data</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Prominently Visible Order History Section inside Profile */}
      <div className="bg-white border border-border-custom rounded-2xl p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-border-custom">
          <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            <span>My Past Orders ({orderHistory?.length || 0})</span>
          </h3>
          <button
            type="button"
            onClick={() => router.push('/order')}
            className="text-xs font-bold text-primary hover:underline"
          >
            + New Order
          </button>
        </div>

        {orderHistory && orderHistory.length > 0 ? (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {orderHistory.map((pastOrder) => (
              <div key={pastOrder.orderId} className="bg-[#FCFAF6] border border-border-custom p-4 rounded-xl space-y-2">
                <div className="overflow-x-auto whitespace-nowrap scrollbar-none flex items-center justify-between gap-3 text-xs pb-1.5 border-b border-border-custom">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="font-extrabold text-foreground">{pastOrder.orderId}</span>
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[9px]">
                      {pastOrder.status}
                    </span>
                    <span className="px-1.5 py-0.5 bg-foreground/5 text-foreground/70 font-bold rounded text-[9px] uppercase">
                      {pastOrder.paymentMethod === 'cod' ? 'COD (+₹2)' : 'Online UPI'}
                    </span>
                  </div>
                  <span className="text-foreground/50 text-[10px] flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" />
                    {pastOrder.createdAt}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  {pastOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-foreground/80">
                      <span>
                        {item.milkType === 'hot' ? 'Hot Milk 🔥' : 'Cold Milk ❄️'} ({item.quantityMl} ML)
                        {item.dryFruits.length > 0
                          ? ` + ${item.dryFruits
                            .map((id) => dryFruits.find((df) => df.id === id)?.name)
                            .filter(Boolean)
                            .join(', ')}`
                          : ''}
                      </span>
                      <span className="font-bold">₹{item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-1.5 border-t border-border-custom border-dashed flex justify-between items-center text-xs">
                  <span className="text-foreground/50 text-[10px]">
                    Mode: {pastOrder.paymentMethod === 'cod' ? 'COD (+₹2)' : 'Online UPI'}
                  </span>
                  <span className="font-extrabold text-foreground">Total: ₹{pastOrder.total}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 space-y-2">
            <ShoppingBag className="w-8 h-8 text-foreground/20 mx-auto" />
            <p className="text-xs text-foreground/60">No delivered orders recorded yet.</p>
          </div>
        )}
      </div>

      {/* Social & App Store Links (Icon Only) */}
      <div >

        <div className="flex items-center justify-around w-full ">
          {/* Instagram Icon */}
          <a
            href="https://www.instagram.com/dairy.dash.in?igsi=MXFqZGJrcjZ2cXhjbw=="
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-500 hover:bg-pink-50 transition-all shadow-xs"
            title="Instagram"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>

          {/* GET IT ON Google Play Badge */}
          <a
            href={ANDROID_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              openAndroidApp();
            }}
            className="inline-flex items-center gap-2 bg-foreground text-background border border-border-custom px-2.5 py-1 rounded-lg hover:opacity-90 transition-all active:scale-95 shrink-0 shadow-xs"
            title="Get it on Google Play"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M3.6 2.5C3.2 2.8 3 3.3 3 3.9v16.2c0 .6.2 1.1.6 1.4l.1.1 9.1-9.1v-.2L3.7 2.4l-.1.1z" />
              <path fill="#34A853" d="M15.8 15.3l-3-3v-.2l3-3 3.6 2c1 .6 1 1.6 0 2.2l-3.6 2z" />
              <path fill="#EA4335" d="M15.8 15.3L12.8 12.3 3.7 21.4c.4.4.9.4 1.5.1l10.6-6.2" />
              <path fill="#FBBC05" d="M15.8 8.7L5.2 2.5c-.6-.3-1.1-.3-1.5.1l9.1 9.1 3-3z" />
            </svg>
            <div className="flex flex-col text-left leading-none">
              <span className="text-[7px] text-background/50 font-semibold tracking-wider uppercase">GET IT ON</span>
              <span className="text-[11px] font-extrabold text-background tracking-tight">Google Play</span>
            </div>
          </a>


        </div>

      </div>
      <div className='text-center'>
        <a
          href="/privacy-policy"
          className="text-sm text-center text-gray -600 hover:bg-emerald-50 transition-all shadow-xs"
          title="Privacy Policy"
        >
          Privacy Policy
        </a>
      </div>
    </div>
  );
}
