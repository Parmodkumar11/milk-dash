import type { FilterCategoryId } from '@/data/filter-categories';

export type CartLine =
  | {
      kind: 'catalog';
      id: string;
      productId: string;
      name: string;
      nameHi?: string;
      categoryId: FilterCategoryId;
      quantity: number;
    }
  | {
      kind: 'custom';
      id: string;
      name: string;
      quantity: number;
      note: string;
      categoryId: FilterCategoryId;
      source?: 'search' | 'other' | 'global';
    };

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

export type DeliveryTiming = 'asap' | 'scheduled';

export interface CartStoreState {
  items: CartLine[];
  customer: CustomerDetails;
  deliveryLocation: DeliveryLocation;
  notes: string;
  deliveryTiming: DeliveryTiming;
  scheduledAt: string | null;

  addCatalogItem: (product: {
    productId: string;
    name: string;
    nameHi?: string;
    categoryId: FilterCategoryId;
    quantity?: number;
  }) => string | null;
  addCustomItem: (item: {
    name: string;
    note?: string;
    categoryId: FilterCategoryId;
    quantity?: number;
    source?: 'search' | 'other' | 'global';
  }) => void;
  removeItem: (id: string) => void;
  setLineQuantity: (id: string, quantity: number) => string | null;
  clearCart: () => void;

  updateCustomer: (customer: Partial<CustomerDetails>) => void;
  updateDeliveryLocation: (location: Partial<DeliveryLocation>) => void;
  updateNotes: (notes: string) => void;
  setDeliveryTiming: (timing: DeliveryTiming) => void;
  setScheduledAt: (iso: string | null) => void;
}
