export interface CartItem {
  id: string;
  milkType: 'hot' | 'cold';
  quantityMl: number;
  dryFruits: string[];
  price: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
}

export interface DeliveryLocation {
  latitude: number | null;
  longitude: number | null;
  address: string;
  houseFlat: string;
  landmark: string;
}

export interface PastOrder {
  orderId: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  codFee: number;
  total: number;
  paymentMethod: 'online' | 'cod';
  status: 'Submitted via WhatsApp';
}

export interface CartStoreState {
  items: CartItem[];
  customer: CustomerDetails;
  deliveryLocation: DeliveryLocation;
  notes: string;
  orderHistory: PastOrder[];
  paymentMethod: 'online' | 'cod';
  
  // Actions
  addItem: (item: Omit<CartItem, 'id' | 'price'>) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantityMl: number) => void;
  updateItemCustomization: (id: string, dryFruits: string[]) => void;
  clearCart: () => void;
  saveCompletedOrder: () => void;
  setPaymentMethod: (method: 'online' | 'cod') => void;
  
  updateCustomer: (customer: Partial<CustomerDetails>) => void;
  updateDeliveryLocation: (location: Partial<DeliveryLocation>) => void;
  updateNotes: (notes: string) => void;

  deliveryFee: number;
  codFee: number;
}
