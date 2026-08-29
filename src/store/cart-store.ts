import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartStoreState, PastOrder } from '@/types/order';
import { calculateItemPrice } from '@/lib/pricing';

const DEFAULT_STATE = {
  items: [],
  customer: {
    name: '',
    phone: '',
  },
  deliveryLocation: {
    latitude: null,
    longitude: null,
    address: '',
    houseFlat: '',
    landmark: '',
  },
  notes: '',
  orderHistory: [],
  paymentMethod: 'online' as const,
  deliveryFee: 10,
  codFee: 2, // ₹2 extra charge for COD
};

export const useCartStore = create<CartStoreState>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,

      addItem: (item) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) =>
              i.milkType === item.milkType &&
              JSON.stringify(i.dryFruits.sort()) === JSON.stringify(item.dryFruits.sort())
          );

          let updatedItems = [...state.items];

          if (existingItemIndex > -1) {
            const existingItem = state.items[existingItemIndex];
            const newQuantity = existingItem.quantityMl + item.quantityMl;
            const newPrice = calculateItemPrice(item.milkType, newQuantity, item.dryFruits);
            
            updatedItems[existingItemIndex] = {
              ...existingItem,
              quantityMl: newQuantity,
              price: newPrice,
            };
          } else {
            const id = Math.random().toString(36).substring(2, 9);
            const price = calculateItemPrice(item.milkType, item.quantityMl, item.dryFruits);
            updatedItems.push({
              ...item,
              id,
              price,
            });
          }

          return { items: updatedItems };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateItemQuantity: (id, quantityMl) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === id) {
              const newPrice = calculateItemPrice(item.milkType, quantityMl, item.dryFruits);
              return {
                ...item,
                quantityMl,
                price: newPrice,
              };
            }
            return item;
          }),
        })),

      updateItemCustomization: (id, dryFruits) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === id) {
              const newPrice = calculateItemPrice(item.milkType, item.quantityMl, dryFruits);
              return {
                ...item,
                dryFruits,
                price: newPrice,
              };
            }
            return item;
          }),
        })),

      clearCart: () =>
        set((state) => ({
          items: [],
          notes: '',
        })),

      setPaymentMethod: (method) => set({ paymentMethod: method }),

      saveCompletedOrder: () =>
        set((state) => {
          if (state.items.length === 0) return state;

          const subtotal = state.items.reduce((sum, item) => sum + item.price, 0);
          const currentCodFee = state.paymentMethod === 'cod' ? state.codFee : 0;
          const total = subtotal + state.deliveryFee + currentCodFee;

          const newPastOrder: PastOrder = {
            orderId: 'DD-' + Math.floor(100000 + Math.random() * 900000),
            createdAt: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              day: 'numeric',
              month: 'short',
            }),
            items: [...state.items],
            subtotal,
            deliveryFee: state.deliveryFee,
            codFee: currentCodFee,
            total,
            paymentMethod: state.paymentMethod,
            status: 'Submitted via WhatsApp',
          };

          return {
            orderHistory: [newPastOrder, ...(state.orderHistory || [])],
            items: [],
            notes: '',
          };
        }),

      updateCustomer: (customer) =>
        set((state) => ({
          customer: { ...state.customer, ...customer },
        })),

      updateDeliveryLocation: (location) =>
        set((state) => ({
          deliveryLocation: { ...state.deliveryLocation, ...location },
        })),

      updateNotes: (notes) => set({ notes }),
    }),
    {
      name: 'milk-delivery-cart',
    }
  )
);
