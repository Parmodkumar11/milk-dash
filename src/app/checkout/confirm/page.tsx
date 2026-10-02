'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, CheckCircle2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart-store';
import ChargesNotice from '@/components/shop/ChargesNotice';
import OrderCelebration from '@/components/shop/OrderCelebration';
import { generateHopInOrderWhatsAppUrl } from '@/lib/whatsapp';
import { canPlaceOrderNow, formatScheduledIst } from '@/lib/sessions';
import { serviceChargeInr } from '@/lib/pricing';
import { isInsideServiceArea } from '@/lib/geo';
import { getFilterLabel } from '@/data/filter-categories';
import { lineDisplayName } from '@/lib/i18n/catalog-display';
import SessionClosedModal from '@/components/common/SessionClosedModal';
import OutsideServiceModal from '@/components/shop/OutsideServiceModal';
import { formatQuantity, unitConfigForProduct } from '@/lib/product-units';

export default function CheckoutConfirmPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const customer = useCartStore((s) => s.customer);
  const deliveryLocation = useCartStore((s) => s.deliveryLocation);
  const notes = useCartStore((s) => s.notes);
  const deliveryTiming = useCartStore((s) => s.deliveryTiming);
  const scheduledAt = useCartStore((s) => s.scheduledAt);
  const clearCart = useCartStore((s) => s.clearCart);
  const [mounted, setMounted] = useState(false);
  const [sessionClosed, setSessionClosed] = useState(false);
  const [outsideModal, setOutsideModal] = useState(false);
  const [sent, setSent] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [orderKey, setOrderKey] = useState('');

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (items.length === 0 && !sent && !preparing) router.replace('/cart');
    else if (!deliveryLocation.latitude) router.replace('/checkout/location');
    else if (!customer.name || !customer.phone) router.replace('/checkout/details');
  }, [mounted, items.length, deliveryLocation.latitude, customer, router, sent, preparing]);

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-green" />
      </div>
    );
  }

  const lat = deliveryLocation.latitude!;
  const lng = deliveryLocation.longitude!;
  const inside = isInsideServiceArea(lat, lng);
  const serviceFee = serviceChargeInr(items);

  const handleConfirmSend = async () => {
    if (!canPlaceOrderNow(deliveryTiming, scheduledAt)) {
      setSessionClosed(true);
      return;
    }
    if (!inside) {
      setOutsideModal(true);
      return;
    }

    const key = `ord-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setOrderKey(key);

    setPreparing(true);
    const url = generateHopInOrderWhatsAppUrl({
      customer,
      location: deliveryLocation,
      lines: items,
      notes,
      scheduledAt: deliveryTiming === 'scheduled' ? scheduledAt : null,
    });

    await new Promise((r) => setTimeout(r, 750));
    window.open(url, '_blank');
    clearCart();
    setPreparing(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="dd-page pb-32 max-w-lg mx-auto text-center space-y-4 relative">
        <OrderCelebration orderKey={orderKey} />
        <CheckCircle2 className="w-16 h-16 text-accent-green mx-auto animate-success" />
        <h1 className="text-2xl font-extrabold">Order ready to send</h1>
        <p className="text-sm text-muted-fg">
          Complete the message in WhatsApp. Pay the shop bill plus ₹{serviceFee} service charge at
          delivery.
        </p>
        <Link href="/" className="dd-btn-primary inline-flex justify-center">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="dd-page pb-32 max-w-lg mx-auto">
      <SessionClosedModal open={sessionClosed} onClose={() => setSessionClosed(false)} />
      <OutsideServiceModal open={outsideModal} onClose={() => setOutsideModal(false)} />

      <Link
        href="/checkout/details"
        className="inline-flex items-center gap-2 text-sm text-muted-fg hover:text-foreground mb-4 font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        Edit details
      </Link>

      <h1 className="text-2xl font-extrabold mb-2">Your order</h1>
      <p className="text-sm text-muted-fg mb-6">Review before sending on WhatsApp.</p>

      <div className="dd-card p-5 space-y-4 mb-4">
        <h2 className="font-bold text-sm text-muted-fg uppercase tracking-wide">Items</h2>
        <ul className="space-y-2 text-sm">
          {items.map((line) => {
            const cfg = unitConfigForProduct(
              line.kind === 'catalog' ? line.name : line.name,
              line.categoryId
            );
            const qtyLabel = formatQuantity(line.quantity, cfg.kind);
            const title =
              line.kind === 'custom'
                ? `Other — ${line.name}`
                : lineDisplayName(line.name, line.nameHi);
            return (
              <li key={line.id}>
                {title} × {qtyLabel}
                <span className="text-muted-fg text-xs block">
                  {getFilterLabel(line.categoryId)}
                </span>
              </li>
            );
          })}
        </ul>
        {notes ? (
          <p className="text-sm">
            <span className="font-bold">Note: </span>
            {notes}
          </p>
        ) : null}
        <ChargesNotice lines={items} />
      </div>

      <div className="dd-card p-5 space-y-2 text-sm mb-6">
        <h2 className="font-bold text-sm text-muted-fg uppercase tracking-wide">Delivery</h2>
        {deliveryTiming === 'scheduled' && scheduledAt ? (
          <p>
            <span className="text-muted-fg">Scheduled: </span>
            {formatScheduledIst(scheduledAt)} IST
          </p>
        ) : (
          <p className="text-muted-fg">As soon as possible</p>
        )}
        <p>{deliveryLocation.address}</p>
        {deliveryLocation.landmark ? (
          <p>
            <span className="text-muted-fg">Landmark: </span>
            {deliveryLocation.landmark}
          </p>
        ) : null}
        <p>
          <span className="text-muted-fg">Mobile: </span>
          {customer.phone}
        </p>
      </div>

      {preparing ? (
        <div className="flex items-center justify-center gap-2 py-4 text-sm font-semibold text-muted-fg">
          <Loader2 className="w-5 h-5 animate-spin text-accent-green" />
          Preparing your WhatsApp order…
        </div>
      ) : (
        <button
          type="button"
          onClick={handleConfirmSend}
          className="dd-btn-primary w-full justify-center gap-2"
        >
          <MessageSquare className="w-5 h-5" />
          Confirm &amp; Send Order
        </button>
      )}
    </div>
  );
}
