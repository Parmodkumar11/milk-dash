'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { MapPin, Navigation, RefreshCw } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { isInsideServiceArea, SERVICE_AREA_LABEL, SERVICE_RADIUS_KM } from '@/lib/geo';

type LocationStatus = 'checking' | 'denied' | 'unsupported' | 'outside' | 'inside';

type ServiceLocationContextValue = {
  status: LocationStatus;
  canUseApp: boolean;
  refreshLocation: () => void;
};

const ServiceLocationContext = createContext<ServiceLocationContextValue>({
  status: 'checking',
  canUseApp: false,
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
        setMessage(`You are outside our delivery zone (${SERVICE_AREA_LABEL}, ~${SERVICE_RADIUS_KM} km).`);
      }
    },
    [updateDeliveryLocation]
  );

  const refreshLocation = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!window.isSecureContext) {
      setStatus('unsupported');
      setMessage('Location needs HTTPS. Open the site over a secure connection.');
      return;
    }
    if (!navigator.geolocation) {
      setStatus('unsupported');
      setMessage('Your browser does not support location.');
      return;
    }

    setStatus('checking');
    setMessage('Getting your current location…');

    navigator.geolocation.getCurrentPosition(
      (pos) => applyPosition(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setStatus('denied');
          setMessage('Allow location access to use HopInMohali. We only deliver in Phase 7, Mohali.');
        } else {
          setStatus('denied');
          setMessage('Could not read your location. Enable GPS and try again.');
        }
      },
      { enableHighAccuracy: true, timeout: 25000, maximumAge: 0 }
    );
  }, [applyPosition]);

  useEffect(() => {
    refreshLocation();
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => applyPosition(pos.coords.latitude, pos.coords.longitude),
      () => {},
      { enableHighAccuracy: true, maximumAge: 60000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [refreshLocation, applyPosition]);

  const canUseApp = status === 'inside';

  const value = useMemo(
    () => ({ status, canUseApp, refreshLocation }),
    [status, canUseApp, refreshLocation]
  );

  return (
    <ServiceLocationContext.Provider value={value}>
      {children}
      {status !== 'inside' ? (
        <div className="fixed inset-0 z-[500] bg-ink/90 flex items-center justify-center p-6">
          <div className="dd-card max-w-md w-full p-6 space-y-4 text-center">
            <MapPin className="w-12 h-12 mx-auto text-accent-green" />
            <h2 className="text-xl font-extrabold">
              {status === 'checking' ? 'Checking your location' : 'Delivery not available here'}
            </h2>
            <p className="text-sm text-muted-fg leading-relaxed">{message}</p>
            {status !== 'checking' ? (
              <button
                type="button"
                onClick={refreshLocation}
                className="dd-btn-primary w-full justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try again
              </button>
            ) : (
              <div className="flex justify-center">
                <Navigation className="w-6 h-6 text-accent-green animate-pulse" />
              </div>
            )}
            <p className="text-[11px] text-muted-fg">
              We deliver only in {SERVICE_AREA_LABEL}. Your live GPS must be inside the service area.
            </p>
          </div>
        </div>
      ) : null}
    </ServiceLocationContext.Provider>
  );
}
