import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NearbyItem, NearbyOrder, NearbyStoreState } from '@/types/nearby';
import { NEARBY_DELIVERY_FEE, NEARBY_PROCUREMENT_FEE, sumEstimatedItems } from '@/lib/nearby';

const emptyItem = (): NearbyItem => ({
  id: Math.random().toString(36).substring(2, 9),
  name: '',
  quantity: '1',
  notes: '',
  estimatedCost: '',
});

export const useNearbyStore = create<NearbyStoreState>()(
  persist(
    (set, get) => ({
      items: [emptyItem()],
      preferredShop: '',
      customer: { name: '', phone: '' },
      location: {
        latitude: null,
        longitude: null,
        address: '',
        houseFlat: '',
        landmark: '',
      },
      instructions: '',
      radiusConfirmed: false,
      history: [],
      activeRequestId: null,

      setPreferredShop: (shop) => set({ preferredShop: shop }),
      setInstructions: (notes) => set({ instructions: notes }),
      setRadiusConfirmed: (value) => set({ radiusConfirmed: value }),

      addItem: () =>
        set((state) => ({
          items: [...state.items, emptyItem()],
        })),

      addSuggestedItem: (name) =>
        set((state) => {
          const blank = state.items.find((item) => !item.name.trim());
          if (blank) {
            return {
              items: state.items.map((item) =>
                item.id === blank.id ? { ...item, name } : item
              ),
            };
          }
          return {
            items: [...state.items, { ...emptyItem(), name }],
          };
        }),

      updateItem: (id, patch) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...patch } : item
          ),
        })),

      removeItem: (id) =>
        set((state) => ({
          items:
            state.items.length <= 1
              ? state.items.map((item) =>
                  item.id === id ? emptyItem() : item
                )
              : state.items.filter((item) => item.id !== id),
        })),

      updateCustomer: (customer) =>
        set((state) => ({
          customer: { ...state.customer, ...customer },
        })),

      updateLocation: (location) =>
        set((state) => ({
          location: { ...state.location, ...location },
        })),

      submitRequest: () => {
        const state = get();
        const validItems = state.items.filter((item) => item.name.trim());
        if (validItems.length === 0) return null;

        const estimatedItemsTotal = sumEstimatedItems(
          validItems.map((item) => item.estimatedCost)
        );
        const estimatedTotal =
          estimatedItemsTotal + NEARBY_PROCUREMENT_FEE + NEARBY_DELIVERY_FEE;

        const order: NearbyOrder = {
          requestId: 'NB-' + Math.floor(100000 + Math.random() * 900000),
          createdAt: new Date().toLocaleString([], {
            hour: '2-digit',
            minute: '2-digit',
            day: 'numeric',
            month: 'short',
          }),
          createdAtMs: Date.now(),
          items: validItems,
          preferredShop: state.preferredShop,
          customer: { ...state.customer },
          location: { ...state.location },
          instructions: state.instructions,
          estimatedItemsTotal,
          procurementFee: NEARBY_PROCUREMENT_FEE,
          deliveryFee: NEARBY_DELIVERY_FEE,
          estimatedTotal,
          status: 'received',
        };

        set({
          history: [order, ...(state.history || [])],
          activeRequestId: order.requestId,
          items: [emptyItem()],
          preferredShop: '',
          instructions: '',
          radiusConfirmed: false,
        });

        return order;
      },

      updateRequestStatus: (id, status) =>
        set((state) => ({
          history: state.history.map((order) =>
            order.requestId === id ? { ...order, status } : order
          ),
        })),
    }),
    { name: 'dairydash-nearby-requests' }
  )
);
