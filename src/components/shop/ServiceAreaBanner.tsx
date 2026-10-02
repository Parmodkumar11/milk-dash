import { Clock, MapPin, IndianRupee } from 'lucide-react';
import { SERVICE_AREA_LABEL, serviceChargeFormulaLabel } from '@/lib/delivery';
import { serviceHoursSummary } from '@/lib/sessions';

export default function ServiceAreaBanner() {
  return (
    <div className="flex flex-wrap gap-2 text-xs font-bold">
      <span className="dd-chip bg-brand-yellow/30 text-ink border-brand-yellow/50">
        <MapPin className="w-3.5 h-3.5" />
        {SERVICE_AREA_LABEL}
      </span>
      <span className="dd-chip bg-muted text-muted-fg border-border-custom">
        <Clock className="w-3.5 h-3.5" />
        {serviceHoursSummary()}
      </span>
      <span className="dd-chip bg-accent-green/10 text-accent-green border-accent-green/25">
        <IndianRupee className="w-3.5 h-3.5" />
        {serviceChargeFormulaLabel()}
      </span>
    </div>
  );
}
