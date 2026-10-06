'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useCartStore } from '@/store/cart-store';
import { isInsideServiceArea, SERVICE_AREA_LABEL, SERVICE_RADIUS_KM } from '@/lib/geo';

type LocationStatus = 'checking' | 'denied' | 'unsupported' | 'outside' | 'inside';

type ServiceLocationContextValue = {
  status: LocationStatus;
  canPlaceOrder: boolean;
  message: string;
  refreshLocation: () => void;
};

const ServiceLocationContext = createContext<ServiceLocationContextValue>({
  status: 'checking',
  canPlaceOrder: false,
  message: '',
  refreshLocation: () => {},
});

export function useServiceLocation() {
  return useContext(ServiceLocationContext);
}

export default function ServiceLocationProvider({ children }: { children: React.ReactNode }) {
  const updateDeliveryLocation = useCartStore((s) => s.updateDeliveryLocation);
  const [status, setStatus] = useState<LocationStatus>('checking');
  const [message, setMessage] = useState('');

  const applyPosition = useCallback(
    (lat: number, lng: number) => {
      updateDeliveryLocation({ latitude: lat, longitude: lng });
      if (isInsideServiceArea(lat, lng)) {
        setStatus('inside');
        setMessage('');
      } else {
        setStatus('outside');
        setMessage(
          `Delivery is currently limited to ${SERVICE_AREA_LABEL} (about ${SERVICE_RADIUS_KM} km from the service center).`
        );
      }
    },
    [updateDeliveryLocation]
  );

  const refreshLocation = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!window.isSecureContext) {
      setStatus('unsupported');
      setMessage(
        'Location needs HTTPS. Open the site over a secure connection to check delivery availability.'
      );
      return;
    }
    if (!navigator.geolocation) {
      setStatus('unsupported');
      setMessage(
        'Your browser does not support location. You can still browse, but delivery availability cannot be checked.'
      );
      return;
    }

    setStatus('checking');
    setMessage('Getting your current location…');

    navigator.geolocation.getCurrentPosition(
      (pos) => applyPosition(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setStatus('denied');
          setMessage(
            'Allow location access to check delivery availability. Browsing the website is still available.'
          );
        } else {
          setStatus('denied');
          setMessage(
            'Could not read your location. Enable GPS and try again. Browsing the website is still available.'
          );
        }
      },
      { enableHighAccuracy: true, timeout: 25000, maximumAge: 0 }
    );
  }, [applyPosition]);

  const canPlaceOrder = status === 'inside';

  const value = useMemo(
    () => ({ status, canPlaceOrder, message, refreshLocation }),
    [status, canPlaceOrder, message, refreshLocation]
  );

  return (
    <ServiceLocationContext.Provider value={value}>
      {children}
    </ServiceLocationContext.Provider>
  );
}
