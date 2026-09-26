export type NearbyRequestStatus =
  | 'received'
  | 'shopping'
  | 'purchased'
  | 'out_for_delivery'
  | 'delivered';

export interface NearbyItem {
  id: string;
  name: string;
  quantity: string;
  notes: string;
  estimatedCost: string;
}

export interface NearbyCustomer {
  name: string;
  phone: string;
}

export interface NearbyLocation {
  latitude: number | null;
  longitude: number | null;
  address: string;
  houseFlat: string;
  landmark: string;
}

export interface NearbyOrder {
  requestId: string;
  createdAt: string;
  createdAtMs: number;
  items: NearbyItem[];
  preferredShop: string;
  customer: NearbyCustomer;
  location: NearbyLocation;
  instructions: string;
  estimatedItemsTotal: number;
  procurementFee: number;
  deliveryFee: number;
  estimatedTotal: number;
  status: NearbyRequestStatus;
}

export interface NearbyStoreState {
  items: NearbyItem[];
  customer: NearbyCustomer;
  location: NearbyLocation;
  instructions: string;
  radiusConfirmed: boolean;
  history: NearbyOrder[];
  activeRequestId: string | null;

  setInstructions: (notes: string) => void;
  setRadiusConfirmed: (value: boolean) => void;
  addItem: () => void;
  addSuggestedItem: (name: string) => void;
  toggleSuggestedItem: (name: string) => void;
  updateItem: (id: string, patch: Partial<NearbyItem>) => void;
  removeItem: (id: string) => void;
  updateCustomer: (customer: Partial<NearbyCustomer>) => void;
  updateLocation: (location: Partial<NearbyLocation>) => void;
  submitRequest: () => NearbyOrder | null;
  updateRequestStatus: (id: string, status: NearbyRequestStatus) => void;
}
