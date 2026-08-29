import { CartItem, CustomerDetails, DeliveryLocation } from '@/types/order';
import { dryFruits } from '@/data/dry-fruits';

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919417385308';

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
