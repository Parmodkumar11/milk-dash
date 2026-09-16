import { CartItem, CustomerDetails, DeliveryLocation } from '@/types/order';
import { dryFruits } from '@/data/dry-fruits';

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917717625060';

export const generateWhatsAppUrl = (
  items: CartItem[],
  customer: CustomerDetails,
  deliveryLocation: DeliveryLocation,
  notes: string,
  subtotal: number,
  deliveryFee: number,
  paymentMethod: 'online' | 'cod',
  codFee: number,
  total: number
): string => {
  // 1. Build order items text with bold/italics
  const orderText = items
    .map((item, index) => {
      const selectedFruits = item.dryFruits
        .map((dfId) => dryFruits.find((df) => df.id === dfId)?.name)
        .filter(Boolean)
        .join(', ');

      return `*${index + 1}. ${item.milkType === 'hot' ? 'Hot Milk 🔥' : 'Cold Milk ❄️'}*
• _Quantity:_ *${item.quantityMl} ML*
• _Dry Fruits:_ *${selectedFruits || 'No Add-ons'}*
• _Item Price:_ *₹${item.price}*`;
    })
    .join('\n\n');

  // 2. Map link
  const latVal = deliveryLocation.latitude !== null ? deliveryLocation.latitude.toFixed(6) : 'XX.XXXX';
  const lngVal = deliveryLocation.longitude !== null ? deliveryLocation.longitude.toFixed(6) : 'XX.XXXX';
  
  const mapLink = deliveryLocation.latitude !== null && deliveryLocation.longitude !== null
    ? `https://www.google.com/maps?q=${deliveryLocation.latitude},${deliveryLocation.longitude}`
    : 'https://www.google.com/maps';

  const paymentText = paymentMethod === 'cod' ? `*Cash on Delivery (COD)* (+₹${codFee} Handling Fee)` : '*Online Payment (UPI/QR)*';

  // 3. Construct WhatsApp formatted message
  const message = `🚨 *NEW MILK ORDER* 🥛

👤 *Customer Details*
• *Name:* ${customer.name}
• *Phone:* ${customer.phone}

📦 *Order Items*
${orderText}

🏡 *Delivery Address*
• *Flat/House:* ${deliveryLocation.houseFlat}
• *Address:* ${deliveryLocation.address}
${deliveryLocation.landmark ? `• *Landmark:* ${deliveryLocation.landmark}` : ''}

📍 *GPS Coordinates*
• *Latitude:* ${latVal}
• *Longitude:* ${lngVal}
• *Map Link:* ${mapLink}

💬 *Instructions:*
_${notes || 'None'}_

💳 *Payment Mode:* ${paymentText}

💰 *Payment Breakdown*
• Subtotal: ₹${subtotal}
• Delivery Fee: ₹${deliveryFee}
${paymentMethod === 'cod' ? `• COD Charge: ₹${codFee}\n` : ''}*TOTAL AMOUNT:* *₹${total}*`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export const generateNearbyWhatsAppUrl = (
  requestId: string,
  items: { name: string; quantity: string; notes: string; estimatedCost: string }[],
  customer: { name: string; phone: string },
  location: {
    latitude: number | null;
    longitude: number | null;
    address: string;
    houseFlat: string;
    landmark: string;
  },
  preferredShop: string,
  instructions: string,
  estimatedItemsTotal: number,
  procurementFee: number,
  deliveryFee: number,
  estimatedTotal: number
): string => {
  const itemText = items
    .map((item, index) => {
      const cost = item.estimatedCost.trim() ? `₹${item.estimatedCost}` : 'TBD at shop';
      const notes = item.notes.trim() ? `\n• _Notes:_ ${item.notes}` : '';
      return `*${index + 1}. ${item.name}*
• _Qty:_ *${item.quantity || '1'}*
• _Est. cost:_ *${cost}*${notes}`;
    })
    .join('\n\n');

  const latVal = location.latitude !== null ? location.latitude.toFixed(6) : 'XX.XXXX';
  const lngVal = location.longitude !== null ? location.longitude.toFixed(6) : 'XX.XXXX';
  const mapLink =
    location.latitude !== null && location.longitude !== null
      ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
      : 'https://www.google.com/maps';

  const message = `🛍️ *HOPINMOHALI NEARBY REQUEST*

🆔 *Request ID:* ${requestId}

👤 *Customer Details*
• *Name:* ${customer.name}
• *Phone:* ${customer.phone}

📦 *Items to buy*
${itemText}

🏪 *Preferred shop:* ${preferredShop || 'Any nearby shop in Phase 7, Mohali'}

🏡 *Delivery Address*
• *Flat/House:* ${location.houseFlat}
• *Address:* ${location.address}
${location.landmark ? `• *Landmark:* ${location.landmark}` : ''}

📍 *GPS Coordinates*
• *Latitude:* ${latVal}
• *Longitude:* ${lngVal}
• *Map Link:* ${mapLink}

💬 *Instructions:*
_${instructions || 'None'}_

⚠️ Final item prices may vary based on shop availability.

💰 *What you pay*
• Shop bill: what the shop actually charges
• Procurement / service: ₹${procurementFee}
• Delivery (within 5 km): ₹${deliveryFee}`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

