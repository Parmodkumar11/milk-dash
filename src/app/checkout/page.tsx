'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart-store';
import { dryFruits } from '@/data/dry-fruits';
import { generateWhatsAppUrl } from '@/lib/whatsapp';
import { User, Phone, MapPin, Landmark, ArrowLeft, MessageSquare, CheckCircle2, History, ShoppingBag, Clock, CreditCard, Banknote } from 'lucide-react';
import PageBanner from '@/components/common/PageBanner';
import { IMAGES } from '@/lib/images';
import { getTodaySession } from '@/lib/sessions';
import SessionClosedModal from '@/components/common/SessionClosedModal';

const SmallPreviewMap = dynamic(() => import('@/components/delivery/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[160px] dd-surface flex items-center justify-center">
      <span className="text-xs text-muted-fg font-bold">Loading Preview Map...</span>
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
  const [sessionClosed, setSessionClosed] = useState(false);

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

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const currentCodFee = paymentMethod === 'cod' ? codFee : 0;
  const total = subtotal + deliveryFee + currentCodFee;

  const handleWhatsAppOrder = () => {
    if (!getTodaySession().open) {
      setSessionClosed(true);
      return;
    }
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

  if (items.length === 0 && !orderSent) {
    return (
      <div className="dd-page pb-28 sm:pb-12 w-full flex-1 flex flex-col">
        <div className="mb-6 flex justify-between items-start gap-3">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              <span>Order history</span>
            </h1>
            <p className="text-sm text-muted-fg mt-1">Saved user details and past delivery logs.</p>
          </div>
          <button
            type="button"
            onClick={() => router.push('/order')}
            className="dd-btn-primary text-xs py-2.5 px-4"
          >
            + New order
          </button>
        </div>

        {customer.name && (
          <div className="dd-card p-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="dd-label mb-0">Saved profile</span>
              <h3 className="font-display text-lg font-semibold text-foreground">{customer.name} ({customer.phone})</h3>
              <p className="text-sm text-muted-fg mt-0.5">{deliveryLocation.houseFlat}, {deliveryLocation.address}</p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/delivery')}
              className="text-sm font-bold text-primary hover:underline shrink-0"
            >
              Edit details
            </button>
          </div>
        )}

        {orderHistory && orderHistory.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-muted-fg uppercase tracking-wider">Past delivered orders</h3>
            {orderHistory.map((pastOrder) => (
              <div key={pastOrder.orderId} className="dd-card p-5 space-y-3">
                <div className="overflow-x-auto whitespace-nowrap flex items-center justify-between gap-3 pb-2 border-b border-border-custom text-xs">
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-extrabold text-foreground">{pastOrder.orderId}</span>
                    <span className="dd-chip bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">
                      {pastOrder.status}
                    </span>
                    <span className="dd-chip bg-muted text-muted-fg uppercase">
                      {pastOrder.paymentMethod === 'cod' ? 'COD (+₹2)' : 'Online UPI'}
                    </span>
                  </div>
                  <span className="text-muted-fg flex items-center gap-1 font-semibold text-[11px] shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    {pastOrder.createdAt}
                  </span>
                </div>

                <div className="space-y-1 text-sm">
                  {pastOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-foreground/80 gap-3">
                      <span>
                        {item.milkType === 'hot' ? 'Hot Milk' : 'Cold Milk'} ({item.quantityMl} ML)
                        {item.dryFruits.length > 0
                          ? ` + ${item.dryFruits
                              .map((id) => dryFruits.find((df) => df.id === id)?.name)
                              .filter(Boolean)
                              .join(', ')}`
                          : ''}
                      </span>
                      <span className="font-bold shrink-0">₹{item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-border-custom border-dashed flex justify-between items-center text-sm">
                  <span className="text-muted-fg font-semibold">Total paid</span>
                  <span className="font-display text-lg font-semibold text-foreground">₹{pastOrder.total}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="dd-card p-8 text-center space-y-3 max-w-md mx-auto my-6">
            <ShoppingBag className="w-10 h-10 text-muted-fg mx-auto" />
            <h3 className="font-display text-lg font-semibold text-foreground">No past orders yet</h3>
            <button
              type="button"
              onClick={() => router.push('/order')}
              className="dd-btn-dark text-sm"
            >
              Order now
            </button>
          </div>
        )}
      </div>
    );
  }

  if (orderSent) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center flex-1 flex flex-col items-center justify-center pb-28 sm:pb-12">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 flex items-center justify-center mb-4 dark:bg-emerald-950/40 dark:border-emerald-900">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-foreground mb-2">Order saved & sent</h1>
        <p className="text-muted-fg text-sm mb-6 leading-relaxed">
          Your order has been recorded in Order History and formatted for WhatsApp.
        </p>
        <button
          type="button"
          onClick={() => setOrderSent(false)}
          className="dd-btn-dark w-full"
        >
          View order history
        </button>
      </div>
    );
  }

  return (
    <div className="dd-page pb-28 sm:pb-12 w-full flex-1 flex flex-col">
      <SessionClosedModal open={sessionClosed} onClose={() => setSessionClosed(false)} />
      <div className="mb-6 space-y-3">
        <button
          type="button"
          onClick={() => router.push('/delivery')}
          className="p-2.5 rounded-full border border-border-custom bg-card-bg text-muted-fg hover:text-foreground hover:bg-muted transition-all"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <PageBanner
          compact
          kicker="Final step"
          title="Confirm your order"
          subtitle="Review, choose payment, send on WhatsApp."
          imageSrc={IMAGES.checkout}
          imageAlt="Order confirmation"
          tone="slate"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start flex-1">
        <div className="lg:col-span-7 space-y-5">
          <div className="dd-card p-5">
            <h3 className="dd-label flex items-center gap-2 mb-3 pb-2 border-b border-border-custom">
              <User className="w-3.5 h-3.5 text-primary" />
              <span>Customer details</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-fg block font-semibold mb-0.5 text-xs">Name</span>
                <span className="font-bold text-foreground">{customer.name}</span>
              </div>
              <div>
                <span className="text-muted-fg block font-semibold mb-0.5 text-xs flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Phone
                </span>
                <span className="font-bold text-foreground">{customer.phone}</span>
              </div>
            </div>
          </div>

          <div className="dd-card p-5 space-y-4">
            <h3 className="dd-label flex items-center gap-2 pb-2 border-b border-border-custom">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>Delivery location</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2.5 text-sm">
                <div>
                  <span className="text-muted-fg block font-semibold mb-0.5 text-xs">House / flat</span>
                  <span className="font-bold text-foreground">{deliveryLocation.houseFlat}</span>
                </div>
                <div>
                  <span className="text-muted-fg block font-semibold mb-0.5 text-xs">Street address</span>
                  <span className="font-bold text-foreground leading-relaxed">{deliveryLocation.address}</span>
                </div>
                {deliveryLocation.landmark && (
                  <div>
                    <span className="text-muted-fg block font-semibold mb-0.5 text-xs flex items-center gap-1">
                      <Landmark className="w-3 h-3" /> Landmark
                    </span>
                    <span className="font-bold text-foreground">{deliveryLocation.landmark}</span>
                  </div>
                )}
                <div>
                  <span className="text-muted-fg block font-semibold mb-0.5 text-xs">Instructions</span>
                  <span className="font-bold text-foreground italic">{notes || 'None'}</span>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-muted-fg block font-semibold mb-1 text-xs">Map pinpoint</span>
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

          <div className="dd-card p-5 space-y-3">
            <h3 className="dd-label flex items-center gap-2 pb-2 border-b border-border-custom">
              <CreditCard className="w-3.5 h-3.5 text-primary" />
              <span>Select payment method</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('online')}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  paymentMethod === 'online'
                    ? 'border-primary bg-primary/5 font-bold'
                    : 'border-border-custom bg-card-bg hover:bg-surface'
                }`}
              >
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0 dark:bg-emerald-950/40">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-extrabold block text-foreground">Online payment (UPI/QR)</span>
                  <span className="text-xs text-muted-fg">Pay via Google Pay / PhonePe / Paytm</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-primary bg-primary/5 font-bold'
                    : 'border-border-custom bg-card-bg hover:bg-surface'
                }`}
              >
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600 shrink-0 dark:bg-amber-950/40">
                  <Banknote className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-extrabold text-foreground flex items-center gap-1 flex-wrap">
                    Cash on delivery <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold dark:bg-amber-950 dark:text-amber-200">+₹2 Charge</span>
                  </span>
                  <span className="text-xs text-muted-fg">Pay cash upon milk arrival</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 dd-surface p-5 sm:p-6 space-y-5">
          <h2 className="font-display text-lg font-semibold text-foreground pb-2 border-b border-border-custom">
            Final price summary
          </h2>

          <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="text-sm bg-card-bg p-2.5 rounded-xl border border-border-custom">
                <div className="flex justify-between font-bold mb-0.5 gap-2">
                  <span>
                    {item.milkType === 'hot' ? 'Hot Milk' : 'Cold Milk'} ({item.quantityMl} ML)
                  </span>
                  <span>₹{item.price}</span>
                </div>
                <div className="text-xs text-muted-fg">
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

          <div className="space-y-2 text-sm pt-3 border-t border-border-custom">
            <div className="flex justify-between text-muted-fg">
              <span>Subtotal</span>
              <span className="font-semibold text-foreground">₹{subtotal}</span>
            </div>

            <div className="flex justify-between text-muted-fg">
              <span>Delivery fee</span>
              <span className="font-semibold text-foreground">₹{deliveryFee}</span>
            </div>

            {paymentMethod === 'cod' && (
              <div className="flex justify-between text-amber-700 dark:text-amber-400 font-semibold">
                <span>COD handling fee</span>
                <span>+ ₹{codFee}</span>
              </div>
            )}

            <div className="border-t border-border-custom border-dashed my-2 pt-2 flex justify-between items-baseline">
              <span className="text-sm font-bold text-foreground">Total amount</span>
              <span className="font-display text-2xl font-semibold text-foreground">₹{total}</span>
            </div>
          </div>

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
              <span className="text-xs text-muted-fg leading-tight">
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
              <span className="text-rose-500 text-xs font-bold mt-1 block">{validationError}</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleWhatsAppOrder}
            className="w-full py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold flex items-center justify-center gap-2 transition-all shadow-sm text-sm active:scale-[0.98]"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>Order on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
