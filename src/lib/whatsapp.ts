import { getFilterLabel } from '@/data/filter-categories';
import { serviceChargeFormulaLabel } from '@/lib/delivery';
import { lineDisplayName } from '@/lib/i18n/catalog-display';
import { formatQuantity, unitConfigForProduct } from '@/lib/product-units';
import { serviceChargeInr } from '@/lib/pricing';
import { formatScheduledIst } from '@/lib/sessions';
import type { CartLine, CustomerDetails, DeliveryLocation } from '@/types/order';

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917717625060';

export type HopInOrderPayload = {
  customer: CustomerDetails;
  location: DeliveryLocation;
  lines: CartLine[];
  notes: string;
  scheduledAt?: string | null;
  feedingIndiaDonation?: boolean;
  deliveryPartnerTip?: number;
};

export function generateHopInOrderWhatsAppUrl(order: HopInOrderPayload): string {
  const {
    customer,
    location,
    lines,
    notes,
    scheduledAt,
    feedingIndiaDonation = false,
    deliveryPartnerTip = 0,
  } = order;
  const serviceFee = serviceChargeInr(lines);
  const donation = feedingIndiaDonation ? 1 : 0;
  const tip = Math.min(10000, Math.max(0, Math.round(deliveryPartnerTip)));

  const itemText = lines
    .map((line, index) => {
      if (line.kind === 'catalog') {
        const label = lineDisplayName(line.name, line.nameHi);
        const cfg = unitConfigForProduct(line.name, line.categoryId);
        const qty = formatQuantity(line.quantity, cfg.kind);
        return `${index + 1}. ${label} — ${qty}`;
      }
      const cat = getFilterLabel(line.categoryId);
      const note = line.note ? `\n   Note: ${line.note}` : '';
      return `${index + 1}. Other — ${line.name} × ${line.quantity}\n   Category: ${cat}${note}`;
    })
    .join('\n');

  const mapLink =
    location.latitude != null && location.longitude != null
      ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
      : '';

  const scheduleBlock = scheduledAt
    ? `\n*Scheduled for:*\n${formatScheduledIst(scheduledAt)} IST\n`
    : '\n*Delivery:* As soon as possible\n';

  const message = `*New HopInMohali Order*

Customer: ${customer.name}
Mobile: ${customer.phone}
${scheduleBlock}
*Items:*
${itemText}

*Product Amount:*
Actual shop bill

*Delivery/Service Charge:*
₹${serviceFee} (${serviceChargeFormulaLabel()})
${tip ? `\n*Delivery Partner Tip:*\n₹${tip}\n` : ''}
*Additional Charges:*
₹${serviceFee + donation + tip} (service charge${donation ? ' + donation' : ''}${tip ? ' + tip' : ''})

*Delivery Location:*
${location.address || 'Phase 7, Mohali'}
${location.houseFlat ? `Flat/House: ${location.houseFlat}\n` : ''}
*Landmark:*
${location.landmark || '—'}
${mapLink ? `\nMap: ${mapLink}` : ''}

*Customer Note:*
${notes || '—'}`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
