'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';

interface MapComponentProps {
  latitude: number | null;
  longitude: number | null;
  onLocationSelect?: (lat: number, lng: number) => void;
  readOnly?: boolean;
}

export default function MapComponent({
  latitude,
  longitude,
  onLocationSelect,
  readOnly = false,
}: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [locating, setLocating] = useState<boolean>(false);

  // Default coordinate (Patiala, Punjab, India) if nothing is selected yet
  const defaultLat = 30.3398;
  const defaultLng = 76.3869;

  const currentLat = latitude || defaultLat;
  const currentLng = longitude || defaultLng;

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
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        onLocationSelect(lat, lng);
        setLocating(false);
      },
      (error) => {
        setLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGpsError('Permission denied. Please search or enter address manually.');
            break;
          default:
            setGpsError('Could not retrieve your location.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="flex flex-col h-full min-h-[220px] md:min-h-[300px]">
      {!readOnly && (
        <div className="flex flex-col gap-4  items-center gap-2 mb-3">
          <span className="text-xs font-bold text-foreground/50 uppercase tracking-wider flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-primary" /> Pinpoint your Location
          </span>
          <button
            type="button"
            onClick={detectLocation}
            disabled={locating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary-hover hover:bg-primary/20 text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
          >
            <Navigation className={`w-3.5 h-3.5 ${locating ? 'animate-spin' : ''}`} />
            <span>{locating ? 'Locating...' : 'Detect My Location'}</span>
          </button>
        </div>
      )}

      {gpsError && !readOnly && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-2 rounded-lg mb-3">
          {gpsError}
        </div>
      )}

      {/* Actual Map Target */}
      <div className="relative flex-1 rounded-2xl border border-border-custom overflow-hidden shadow-inner bg-[#FCFAF6] h-[200px] md:h-full">
        <div ref={mapContainerRef} className="absolute inset-0" />
      </div>

      {!readOnly && (
        <p className="text-[11px] text-foreground/50 mt-2 italic text-center sm:text-left">
          Drag the orange pin to your exact delivery location or click anywhere on the map to position it.
        </p>
      )}
    </div>
  );
}
