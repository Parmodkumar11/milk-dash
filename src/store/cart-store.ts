import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartStoreState, CartLine } from '@/types/order';
import { unitConfigForProduct, validateQuantityForUnit } from '@/lib/product-units';

const newId = () => Math.random().toString(36).substring(2, 9);

const DEFAULT_STATE = {
  items: [] as CartLine[],
  customer: { name: '', phone: '' },
  deliveryLocation: {
    latitude: null,
    longitude: null,
    address: '',
    houseFlat: '',
    landmark: '',
  },
  notes: '',
  deliveryTiming: 'asap' as const,
  scheduledAt: null as string | null,
  feedingIndiaDonation: false,
  deliveryPartnerTip: 0,
  customDeliveryPartnerTip: false,
};

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      addCatalogItem: (product) => {
        const qty = product.quantity ?? 1;
        const unitCfg = unitConfigForProduct(product.name, product.categoryId);
        const err = validateQuantityForUnit(unitCfg, qty, product.categoryId);
        if (err) return err;

        const state = get();
        const existing = state.items.find(
          (line) => line.kind === 'catalog' && line.productId === product.productId
        );
        if (existing && existing.kind === 'catalog') {
          const newQty = existing.quantity + qty;
          const err2 = validateQuantityForUnit(unitCfg, newQty, product.categoryId);
          if (err2) return err2;
          set({
            items: state.items.map((line) =>
              line.id === existing.id && line.kind === 'catalog'
                ? { ...line, quantity: newQty }
                : line
            ),
          });
          return null;
        }
        const line: CartLine = {
          kind: 'catalog',
          id: newId(),
          productId: product.productId,
          name: product.name,
          nameHi: product.nameHi,
          categoryId: product.categoryId,
          quantity: qty,
        };
        set({ items: [...state.items, line] });
        return null;
      },

      addCustomItem: (item) =>
        set((state) => {
          const qty = item.quantity ?? 1;
          const line: CartLine = {
            kind: 'custom',
            id: newId(),
            name: item.name.trim(),
            quantity: qty,
            note: item.note?.trim() ?? '',
            categoryId: item.categoryId,
            source: item.source,
          };
          return { items: [...state.items, line] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      setLineQuantity: (id, quantity) => {
        const state = get();
        const line = state.items.find((l) => l.id === id);
        if (!line) return null;
        const unitCfg = unitConfigForProduct(
          line.kind === 'catalog' ? line.name : line.name,
          line.categoryId
        );
        const q = quantity;
        const err = validateQuantityForUnit(unitCfg, q, line.categoryId);
        if (err) return err;
        set({
          items: state.items
            .map((l) => (l.id === id ? { ...l, quantity: q } : l))
            .filter((l) => l.quantity > 0),
        });
        return null;
      },

      clearCart: () =>
        set((state) => ({
          items: [],
          notes: state.notes,
          deliveryTiming: state.deliveryTiming,
          scheduledAt: state.scheduledAt,
          feedingIndiaDonation: false,
          deliveryPartnerTip: 0,
          customDeliveryPartnerTip: false,
        })),

      updateCustomer: (customer) =>
        set((state) => ({
          customer: { ...state.customer, ...customer },
        })),

      updateDeliveryLocation: (location) =>
        set((state) => ({
          deliveryLocation: { ...state.deliveryLocation, ...location },
        })),

      updateNotes: (notes) => set({ notes }),
      setDeliveryTiming: (timing) => set({ deliveryTiming: timing }),
      setScheduledAt: (iso) => set({ scheduledAt: iso }),
      setFeedingIndiaDonation: (feedingIndiaDonation) => set({ feedingIndiaDonation }),
      setDeliveryPartnerTip: (amount) => {
        const deliveryPartnerTip = Number.isFinite(amount)
          ? Math.min(10000, Math.max(0, Math.round(amount)))
          : 0;
        set({ deliveryPartnerTip });
      },
      setCustomDeliveryPartnerTip: (customDeliveryPartnerTip) => set({ customDeliveryPartnerTip }),
    }),
    { name: 'hopin-cart-v4' }
  )
);
