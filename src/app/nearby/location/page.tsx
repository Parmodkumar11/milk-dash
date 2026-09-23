'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Home, Landmark, MapPin, Phone, Store, User } from 'lucide-react';
import PageBanner from '@/components/common/PageBanner';
import NearbyStepper from '@/components/nearby/NearbyStepper';
import { useNearbyStore } from '@/store/nearby-store';
import { useCartStore } from '@/store/cart-store';
import { IMAGES } from '@/lib/images';
import { NEARBY_AREA_NAME, NEARBY_DEFAULT_LAT, NEARBY_DEFAULT_LNG, NEARBY_RADIUS_KM } from '@/lib/nearby';
import { useI18n } from '@/components/common/LanguageProvider';

const MapWithNoSSR = dynamic(() => import('@/components/delivery/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] dd-card flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  ),
});

function readField(form: HTMLFormElement, name: string, fallback: string) {
  const el = form.elements.namedItem(name);
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    return el.value;
  }
  if (el instanceof RadioNodeList && el[0] instanceof HTMLInputElement) {
    return el[0].value;
  }
  return fallback;
}

function indianMobile(raw: string) {
  let digits = raw.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return digits;
}

export default function NearbyLocationPage() {
  const router = useRouter();
  const cart = useCartStore();
  const nearby = useNearbyStore();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [houseFlat, setHouseFlat] = useState('');
  const [landmark, setLandmark] = useState('');
  const [instructions, setInstructions] = useState('');
  const [shop, setShop] = useState('');
  const [radiusConfirmed, setRadiusConfirmed] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { t } = useI18n();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const named = nearby.items.filter((item) => item.name.trim());
    if (named.length === 0) {
      router.push('/nearby/request');
      return;
    }
    setName(nearby.customer.name || cart.customer.name);
    setPhone(indianMobile(nearby.customer.phone || cart.customer.phone).slice(0, 10));
    setAddress(nearby.location.address || cart.deliveryLocation.address || NEARBY_AREA_NAME);
    setHouseFlat(nearby.location.houseFlat || cart.deliveryLocation.houseFlat);
    setLandmark(nearby.location.landmark || cart.deliveryLocation.landmark);
    setInstructions(nearby.instructions);
    setShop(nearby.preferredShop);
    setRadiusConfirmed(nearby.radiusConfirmed);
    if (!nearby.location.latitude) {
      nearby.updateLocation({
        latitude: cart.deliveryLocation.latitude || NEARBY_DEFAULT_LAT,
        longitude: cart.deliveryLocation.longitude || NEARBY_DEFAULT_LNG,
      });
    }
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  const handleLocationSelect = (lat: number, lng: number) => {
    nearby.updateLocation({ latitude: lat, longitude: lng });
  };

  const clearError = (key: string) => {
    setErrors((prev) => (prev[key] ? { ...prev, [key]: '' } : prev));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    // Read the DOM so browser autofill is included (React state can still be empty).
    const shopValue = readField(form, 'shop', shop).trim();
    const nameValue = readField(form, 'name', name).trim();
    const phoneValue = indianMobile(readField(form, 'phone', phone));
    const houseFlatValue = readField(form, 'houseFlat', houseFlat).trim();
    const addressValue = readField(form, 'address', address).trim();
    const landmarkValue = readField(form, 'landmark', landmark).trim();
    const instructionsValue = readField(form, 'instructions', instructions).trim();
    const radiusEl = form.elements.namedItem('radiusConfirmed');
    const radiusValue =
      radiusEl instanceof HTMLInputElement ? radiusEl.checked : radiusConfirmed;

    setShop(shopValue);
    setName(nameValue);
    setPhone(phoneValue);
    setHouseFlat(houseFlatValue);
    setAddress(addressValue);
    setLandmark(landmarkValue);
    setInstructions(instructionsValue);
    setRadiusConfirmed(radiusValue);

    const newErrors: { [key: string]: string } = {};
    if (!shopValue) newErrors.shop = t('location.errShop');
    if (!nameValue) newErrors.name = t('location.errName');
    if (!phoneValue) newErrors.phone = t('location.errPhone');
    else if (phoneValue.length !== 10) newErrors.phone = t('location.errPhoneDigits');
    if (!houseFlatValue) newErrors.houseFlat = t('location.errHouse');
    if (!addressValue) newErrors.address = t('location.errAddress');
    if (!radiusValue) newErrors.radius = t('location.errRadius');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const first = Object.keys(newErrors)[0];
      const element = document.getElementById(first);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    nearby.updateCustomer({ name: nameValue, phone: phoneValue });
    nearby.updateLocation({ address: addressValue, houseFlat: houseFlatValue, landmark: landmarkValue });
    nearby.setInstructions(instructionsValue);
    nearby.setPreferredShop(shopValue);
    nearby.setRadiusConfirmed(true);
    router.push('/nearby/review');
  };

  return (
    <div className="dd-page pb-28 sm:pb-12">
      <NearbyStepper />
      <div className="mb-6 space-y-3">
        <button
          type="button"
          onClick={() => router.push('/nearby/request')}
          className="p-2.5 rounded-full border border-border-custom bg-card-bg text-muted-fg hover:text-foreground hover:bg-muted"
          title={t('common.back')}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <PageBanner
          compact
          kicker={t('location.kicker')}
          title={t('location.title')}
          subtitle={t('location.subtitle', { km: NEARBY_RADIUS_KM, area: NEARBY_AREA_NAME })}
          imageSrc={IMAGES.farm}
          imageAlt={t('location.bannerAlt')}
          tone="meadow"
        />
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 dd-card p-5 sm:p-6">
          <MapWithNoSSR
            latitude={nearby.location.latitude}
            longitude={nearby.location.longitude}
            onLocationSelect={handleLocationSelect}
            fallbackLatitude={NEARBY_DEFAULT_LAT}
            fallbackLongitude={NEARBY_DEFAULT_LNG}
          />
          <p className="mt-3 text-xs text-muted-fg">
            {t('location.pinHint', { area: NEARBY_AREA_NAME, km: NEARBY_RADIUS_KM })}
          </p>
        </div>

        <div className="lg:col-span-5 dd-card p-5 sm:p-6 space-y-4">
          <div className="dd-surface p-3 text-sm text-muted-fg">
            {t('location.radius', { km: NEARBY_RADIUS_KM, area: NEARBY_AREA_NAME })}
          </div>
         <div>
  <label htmlFor="shop" className="dd-label">
    {t('location.shop')}
  </label>

  <div className="relative">
    <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" />

    <input
      id="shop"
      name="shop"
      type="text"
      value={shop}
      onChange={(e) => {
        setShop(e.target.value);

        if (errors.shop) {
          clearError('shop');
        }
      }}
      className={`dd-input pl-10 ${
        errors.shop ? 'dd-input-error' : ''
      }`}
      placeholder={t('location.shopPlaceholder')}
      autoComplete="off"
      aria-invalid={!!errors.shop}
      aria-describedby={errors.shop ? 'shop-error' : undefined}
    />
  </div>

  {errors.shop && (
    <span
      id="shop-error"
      className="text-rose-500 text-xs mt-1 block"
      role="alert"
    >
      {errors.shop}
    </span>
  )}
</div>
          <div>
            <label htmlFor="name" className="dd-label">{t('location.name')}</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" />
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) clearError('name');
                }}
                className={`dd-input ${errors.name ? 'dd-input-error' : ''}`}
                placeholder={t('location.namePlaceholder')}
                autoComplete="name"
              />
            </div>
            {errors.name && <span className="text-rose-500 text-xs mt-1 block">{errors.name}</span>}
          </div>
          <div>
            <label htmlFor="phone" className="dd-label">{t('location.phone')}</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" />
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                maxLength={13}
                value={phone}
                onChange={(e) => {
                  const next = indianMobile(e.target.value).slice(0, 10);
                  setPhone(next);
                  if (errors.phone) clearError('phone');
                }}
                className={`dd-input ${errors.phone ? 'dd-input-error' : ''}`}
                placeholder={t('location.phonePlaceholder')}
                autoComplete="tel"
              />
            </div>
            {errors.phone && <span className="text-rose-500 text-xs mt-1 block">{errors.phone}</span>}
          </div>
          <div>
            <label htmlFor="houseFlat" className="dd-label">{t('location.house')}</label>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" />
              <input
                id="houseFlat"
                name="houseFlat"
                type="text"
                value={houseFlat}
                onChange={(e) => {
                  setHouseFlat(e.target.value);
                  if (errors.houseFlat) clearError('houseFlat');
                }}
                className={`dd-input ${errors.houseFlat ? 'dd-input-error' : ''}`}
                placeholder={t('location.housePlaceholder')}
                autoComplete="address-line2"
              />
            </div>
            {errors.houseFlat && <span className="text-rose-500 text-xs mt-1 block">{errors.houseFlat}</span>}
          </div>
          <div>
            <label htmlFor="address" className="dd-label">{t('location.street')}</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-muted-fg" />
              <textarea
                id="address"
                name="address"
                rows={2}
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (errors.address) clearError('address');
                }}
                className={`dd-input ${errors.address ? 'dd-input-error' : ''}`}
                placeholder={NEARBY_AREA_NAME}
                autoComplete="street-address"
              />
            </div>
            {errors.address && <span className="text-rose-500 text-xs mt-1 block">{errors.address}</span>}
          </div>
          <div>
            <label htmlFor="landmark" className="dd-label">{t('location.landmark')}</label>
            <div className="relative">
              <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-fg" />
              <input
                id="landmark"
                name="landmark"
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="dd-input"
                placeholder={t('location.landmarkPlaceholder')}
              />
            </div>
          </div>
          <div>
            <label className="dd-label">{t('location.instructions')}</label>
            <textarea
              id="instructions"
              name="instructions"
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="dd-input pl-4"
              placeholder={t('location.instructionsPlaceholder')}
            />
          </div>
          <label className="flex items-start gap-2.5 text-sm cursor-pointer">
            <input
              id="radiusConfirmed"
              name="radiusConfirmed"
              type="checkbox"
              checked={radiusConfirmed}
              onChange={(e) => {
                setRadiusConfirmed(e.target.checked);
                if (errors.radius) clearError('radius');
              }}
              className="mt-0.5 rounded text-primary w-4 h-4"
            />
            <span>{t('location.confirmRadius', { km: NEARBY_RADIUS_KM, area: NEARBY_AREA_NAME })}</span>
          </label>
          {errors.radius && <span className="text-rose-500 text-xs font-bold">{errors.radius}</span>}
          <button type="submit" className="dd-btn-primary w-full">
            {t('location.review')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
