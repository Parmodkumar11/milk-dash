'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart-store';
import { dryFruits } from '@/data/dry-fruits';
import { generateWhatsAppUrl } from '@/lib/whatsapp';
import { User, Phone, MapPin, Landmark, ArrowLeft, MessageSquare, CheckCircle2, History, ShoppingBag, Clock, CreditCard, Banknote, ShieldCheck } from 'lucide-react';

const SmallPreviewMap = dynamic(() => import('@/components/delivery/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[160px] bg-[#FCFAF6] border border-border-custom rounded-2xl flex items-center justify-center">
      <span className="text-xs text-foreground/40 font-bold">Loading Preview Map...</span>
    </div>
  ),
});

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    customer,
    deliveryLocation,
    notes,
    deliveryFee,
    codFee,
    paymentMethod,
    setPaymentMethod,
    orderHistory,
    saveCompletedOrder,
  } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [orderSent, setOrderSent] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(true);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && items.length > 0) {
      if (!customer.name || !customer.phone || !deliveryLocation.address) {
        router.push('/delivery');
      }
    }
  }, [mounted, items, customer, deliveryLocation]);

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  // Calculate prices
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const currentCodFee = paymentMethod === 'cod' ? codFee : 0;
  const total = subtotal + deliveryFee + currentCodFee;

  const handleWhatsAppOrder = () => {
    if (!agreedPrivacy) {
      setValidationError('Please accept the Privacy Policy to proceed.');
      return;
    }
    setValidationError('');

    const url = generateWhatsAppUrl(
      items,
      customer,
      deliveryLocation,
      notes,
      subtotal,
      deliveryFee,
      paymentMethod,
      codFee,
      total
    );

    saveCompletedOrder();
    window.open(url, '_blank');
    setOrderSent(true);
  };

  // If no items in active cart, show Order History
  if (items.length === 0 && !orderSent) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 pb-28 sm:pb-12 w-full flex-1 flex flex-col">
        <div className="mb-6 pb-3 border-b border-border-custom flex justify-between items-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              <span>Order History & Profile</span>
            </h1>
            <p className="text-xs text-foreground/60">Saved user details & past delivery logs.</p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/order')}
            className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-hover transition-all"
          >
            + New Order
          </button>
        </div>

        {customer.name && (
          <div className="bg-white border border-border-custom p-5 rounded-2xl shadow-xs mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] font-bold text-foreground/50 uppercase block">Saved Profile</span>
              <h3 className="font-extrabold text-base text-foreground">{customer.name} ({customer.phone})</h3>
              <p className="text-xs text-foreground/60 mt-0.5">{deliveryLocation.houseFlat}, {deliveryLocation.address}</p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/delivery')}
              className="text-xs font-bold text-primary hover:underline shrink-0"
            >
              Edit Details
            </button>
          </div>
        )}

        {orderHistory && orderHistory.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-foreground/75 uppercase tracking-wider">Past Delivered Orders</h3>
            {orderHistory.map((pastOrder) => (
              <div key={pastOrder.orderId} className="bg-white border border-border-custom p-5 rounded-2xl shadow-xs space-y-3">
                <div className="overflow-x-auto whitespace-nowrap scrollbar-none flex items-center justify-between gap-3 pb-2 border-b border-border-custom text-xs">
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-extrabold text-foreground">{pastOrder.orderId}</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-md text-[10px]">
                      {pastOrder.status}
                    </span>
                    <span className="px-2 py-0.5 bg-foreground/5 text-foreground/70 font-bold rounded-md text-[10px] uppercase">
                      {pastOrder.paymentMethod === 'cod' ? 'COD (+₹2)' : 'Online UPI'}
                    </span>
                  </div>
                  <span className="text-foreground/50 flex items-center gap-1 font-semibold text-[11px] shrink-0">
                    <Clock className="w-3.5 h-3.5" />
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

                <div className="pt-2 border-t border-border-custom border-dashed flex justify-between items-center text-xs">
                  <span className="text-foreground/60 font-semibold">Total Paid</span>
                  <span className="font-extrabold text-sm text-foreground">₹{pastOrder.total}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-border-custom p-8 rounded-2xl text-center space-y-3 max-w-md mx-auto my-6">
            <ShoppingBag className="w-10 h-10 text-foreground/30 mx-auto" />
            <h3 className="font-bold text-base text-foreground">No Past Orders Yet</h3>
            <button
              type="button"
              onClick={() => router.push('/order')}
              className="px-6 py-2.5 rounded-xl bg-foreground text-background font-bold text-xs shadow-xs transition-all"
            >
              Order Now
            </button>
          </div>
        )}
      </div>
    );
  }

  if (orderSent) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center flex-1 flex flex-col items-center justify-center pb-28 sm:pb-12">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full border border-emerald-100 flex items-center justify-center mb-4 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground mb-2">Order Saved & Sent!</h1>
        <p className="text-foreground/60 text-xs mb-6 leading-relaxed">
          Your order has been recorded in Order History and formatted for WhatsApp.
        </p>
        <button
          type="button"
          onClick={() => setOrderSent(false)}
          className="w-full py-3 px-6 rounded-xl bg-foreground hover:bg-foreground/90 text-background font-bold text-xs transition-all shadow-xs"
        >
          View Order History
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 pb-28 sm:pb-12 w-full flex-1 flex flex-col">
      {/* Clean Header with Icon-Only Back Button */}
      <div className="mb-6 pb-3 border-b border-border-custom flex justify-between items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">Confirm Your Order</h1>
          <p className="text-xs text-foreground/60">Review details & select payment mode.</p>
        </div>
        <button
          type="button"
          onClick={() => router.push('/delivery')}
          className="p-2 rounded-full border border-border-custom bg-white text-foreground/70 hover:text-foreground hover:bg-[#FCFAF6] transition-all shadow-xs shrink-0"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1">
        {/* Left Area: Customer & Delivery Details */}
        <div className="lg:col-span-7 space-y-5">
          {/* Customer info */}
          <div className="bg-white border border-border-custom p-5 rounded-2xl shadow-xs">
            <h3 className="text-xs font-extrabold text-foreground/80 mb-3 pb-2 border-b border-border-custom flex items-center gap-2 uppercase tracking-wide">
              <User className="w-3.5 h-3.5 text-primary" />
              <span>Customer Details</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-foreground/50 block font-semibold mb-0.5 uppercase text-[10px]">Name</span>
                <span className="font-bold text-foreground">{customer.name}</span>
              </div>
              <div>
                <span className="text-foreground/50 block font-semibold mb-0.5 uppercase text-[10px]">Phone</span>
                <span className="font-bold text-foreground">{customer.phone}</span>
              </div>
            </div>
          </div>

          {/* Delivery location info */}
          <div className="bg-white border border-border-custom p-5 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold text-foreground/80 pb-2 border-b border-border-custom flex items-center gap-2 uppercase tracking-wide">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>Delivery Location Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-foreground/50 block font-semibold mb-0.5 uppercase text-[10px]">House / Flat</span>
                  <span className="font-bold text-foreground">{deliveryLocation.houseFlat}</span>
                </div>
                <div>
                  <span className="text-foreground/50 block font-semibold mb-0.5 uppercase text-[10px]">Street Address</span>
                  <span className="font-bold text-foreground leading-relaxed">{deliveryLocation.address}</span>
                </div>
                {deliveryLocation.landmark && (
                  <div>
                    <span className="text-foreground/50 block font-semibold mb-0.5 uppercase text-[10px] flex items-center gap-1">
                      <Landmark className="w-3 h-3" /> Landmark
                    </span>
                    <span className="font-bold text-foreground">{deliveryLocation.landmark}</span>
                  </div>
                )}
                <div>
                  <span className="text-foreground/50 block font-semibold mb-0.5 uppercase text-[10px]">Instructions</span>
                  <span className="font-bold text-foreground italic">{notes || 'None'}</span>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-foreground/50 block font-semibold mb-1 text-[10px] uppercase">Map Pinpoint</span>
                <div className="h-[150px] rounded-xl border border-border-custom overflow-hidden">
                  <SmallPreviewMap
                    latitude={deliveryLocation.latitude}
                    longitude={deliveryLocation.longitude}
                    readOnly={true}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white border border-border-custom p-5 rounded-2xl shadow-xs space-y-3">
            <h3 className="text-xs font-extrabold text-foreground/80 pb-2 border-b border-border-custom flex items-center gap-2 uppercase tracking-wide">
              <CreditCard className="w-3.5 h-3.5 text-primary" />
              <span>Select Payment Method</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Online Payment Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('online')}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  paymentMethod === 'online'
                    ? 'border-primary bg-primary/5 font-bold shadow-xs'
                    : 'border-border-custom bg-white hover:bg-[#FCFAF6]'
                }`}
              >
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-extrabold block text-foreground">Online Payment (UPI/QR)</span>
                  <span className="text-[10px] text-foreground/50">Pay via Google Pay / PhonePe / Paytm</span>
                </div>
              </button>

              {/* COD Option (+ ₹2 Charge) */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-primary bg-primary/5 font-bold shadow-xs'
                    : 'border-border-custom bg-white hover:bg-[#FCFAF6]'
                }`}
              >
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600 shrink-0">
                  <Banknote className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-extrabold block text-foreground flex items-center gap-1">
                    Cash on Delivery <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">+₹2 Charge</span>
                  </span>
                  <span className="text-[10px] text-foreground/50">Pay cash upon milk arrival</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Area: Order Summary & Terms */}
        <div className="lg:col-span-5 bg-[#FCFAF6] border border-border-custom p-5 sm:p-6 rounded-2xl shadow-xs space-y-5">
          <h2 className="text-sm font-extrabold text-foreground pb-2 border-b border-border-custom uppercase tracking-wide">
            Final Price Summary
          </h2>

          <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="text-xs bg-white p-2.5 rounded-xl border border-border-custom">
                <div className="flex justify-between font-bold mb-0.5">
                  <span>
                    {item.milkType === 'hot' ? 'Hot Milk 🔥' : 'Cold Milk ❄️'} ({item.quantityMl} ML)
                  </span>
                  <span>₹{item.price}</span>
                </div>
                <div className="text-[10px] text-foreground/60">
                  {item.dryFruits.length > 0
                    ? `Add-ons: ${item.dryFruits
                        .map((id) => dryFruits.find((df) => df.id === id)?.name)
                        .filter(Boolean)
                        .join(', ')}`
                    : 'No dry fruit add-ons'}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs pt-3 border-t border-border-custom">
            <div className="flex justify-between text-foreground/70">
              <span>Subtotal</span>
              <span className="font-semibold text-foreground">₹{subtotal}</span>
            </div>
            
            <div className="flex justify-between text-foreground/70">
              <span>Delivery Fee</span>
              <span className="font-semibold text-foreground">₹{deliveryFee}</span>
            </div>

            {paymentMethod === 'cod' && (
              <div className="flex justify-between text-amber-700 font-semibold">
                <span>COD Handling Fee</span>
                <span>+ ₹{codFee}</span>
              </div>
            )}

            <div className="border-t border-border-custom border-dashed my-2 pt-2 flex justify-between items-baseline">
              <span className="text-xs font-bold text-foreground">Total Amount</span>
              <span className="text-xl font-extrabold text-foreground">₹{total}</span>
            </div>
          </div>

          {/* Privacy Policy & Terms Checkbox */}
          <div className="pt-2 border-t border-border-custom">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedPrivacy}
                onChange={(e) => {
                  setAgreedPrivacy(e.target.checked);
                  if (e.target.checked) setValidationError('');
                }}
                className="mt-0.5 rounded text-primary focus:ring-primary border-border-custom w-4 h-4"
              />
              <span className="text-[11px] text-foreground/70 leading-tight">
                I agree to the{' '}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline text-foreground hover:text-primary"
                >
                  Terms & Privacy Policy
                </a>{' '}
                for fresh local daily milk delivery.
              </span>
            </label>
            {validationError && (
              <span className="text-rose-500 text-[10px] font-bold mt-1 block">{validationError}</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleWhatsAppOrder}
            className="w-full py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold flex items-center justify-center gap-2 transition-all shadow-xs text-xs active:scale-98"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>Order on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
