'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';

interface MapComponentProps {
  latitude: number | null;
  longitude: number | null;
  onLocationSelect?: (lat: number, lng: number) => void;
  readOnly?: boolean;
  fallbackLatitude?: number;
  fallbackLongitude?: number;
}

export default function MapComponent({
  latitude,
  longitude,
  onLocationSelect,
  readOnly = false,
  fallbackLatitude = 30.3398,
  fallbackLongitude = 76.3869,
}: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [locating, setLocating] = useState<boolean>(false);

  const currentLat = latitude || fallbackLatitude;
  const currentLng = longitude || fallbackLongitude;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create custom pin icon
    const customIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="
          background-color: #F0A500;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid #FFFFFF;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        ">
          <div style="transform: rotate(45deg); font-size: 16px;">🥛</div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    // Create leaflet map instance with optional readOnly settings
    const mapOptions: L.MapOptions = readOnly
      ? {
        zoomControl: false,
        dragging: false,
        touchZoom: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
      }
      : {};

    const map = L.map(mapContainerRef.current, mapOptions).setView([currentLat, currentLng], 15);
    mapRef.current = map;

    // Load OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Create marker
    const marker = L.marker([currentLat, currentLng], {
      icon: customIcon,
      draggable: !readOnly,
    }).addTo(map);
    markerRef.current = marker;

    if (!readOnly && onLocationSelect) {
      // Drag events
      marker.on('dragend', () => {
        const position = marker.getLatLng();
        onLocationSelect(position.lat, position.lng);
      });

      // Map click to place pin
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        onLocationSelect(lat, lng);
      });
    }

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [readOnly]);

  // Update marker & map view if coordinates change externally
  useEffect(() => {
    if (mapRef.current && markerRef.current && latitude && longitude) {
      markerRef.current.setLatLng([latitude, longitude]);
      mapRef.current.setView([latitude, longitude], 16);
    }
  }, [latitude, longitude]);

  // Request browser geolocation
  const detectLocation = () => {
    if (readOnly || !onLocationSelect) return;
    if (typeof window !== 'undefined' && !window.isSecureContext) {
      setGpsError('Location works only on HTTPS. Open the live site, then tap Detect again.');
      return;
    }
    if (!navigator.geolocation) {
      setGpsError('This browser cannot read GPS. Try Safari or Chrome.');
      return;
    }

    setLocating(true);
    setGpsError(null);

    const onSuccess = (position: GeolocationPosition) => {
      onLocationSelect(position.coords.latitude, position.coords.longitude);
      setLocating(false);
      setGpsError(null);
    };

    const tryAccurate = () => {
      navigator.geolocation.getCurrentPosition(
        onSuccess,
        (error) => {
          setLocating(false);
          if (error.code === error.PERMISSION_DENIED) {
            setGpsError(
              'GPS is blocked. iPhone: Settings → Safari → Location → Allow, then return and tap Detect again. Also turn on Location Services.'
            );
          } else if (error.code === error.TIMEOUT) {
            setGpsError('GPS timed out. Move near a window, keep the app open, and tap Detect again.');
          } else {
            setGpsError('Could not read your location. Check Location Services and tap Detect again.');
          }
        },
        { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
      );
    };

    navigator.geolocation.getCurrentPosition(
      onSuccess,
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocating(false);
          setGpsError(
            'GPS is blocked. iPhone: Settings → Safari → Location → Allow, then return and tap Detect again. Also turn on Location Services.'
          );
          return;
        }
        tryAccurate();
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 120000 }
    );
  };

  return (
    <div className="flex flex-col h-full min-h-[220px] md:min-h-[300px]">
      {!readOnly && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
          <span className="text-xs font-bold text-muted-fg uppercase tracking-wider flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-primary" /> Pinpoint your location
          </span>
          <button
            type="button"
            onClick={detectLocation}
            disabled={locating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
          >
            <Navigation className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
            <span>{locating ? 'Locating...' : 'Detect My Location'}</span>
          </button>
        </div>
      )}

      {gpsError && !readOnly && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-2 rounded-lg mb-3 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-200">
          {gpsError}
        </div>
      )}

      <div className="relative flex-1 rounded-2xl border border-border-custom overflow-hidden shadow-inner bg-surface h-[220px] md:h-full min-h-[220px]">
        <div ref={mapContainerRef} className="absolute inset-0" />
      </div>

      {!readOnly && (
        <p className="text-[11px] text-muted-fg mt-2 italic text-center sm:text-left">
          Drag the orange pin to your exact delivery location or click anywhere on the map to position it.
        </p>
      )}
    </div>
  );
}
