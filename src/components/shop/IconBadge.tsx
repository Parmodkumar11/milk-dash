import type { LucideIcon } from 'lucide-react';

type Props = {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'yellow' | 'green' | 'neutral';
};

const box = {
  sm: 'w-10 h-10 rounded-lg',
  md: 'w-12 h-12 rounded-xl',
  lg: 'w-14 h-14 rounded-xl',
};

const iconSize = { sm: 'w-5 h-5', md: 'w-6 h-6', lg: 'w-7 h-7' };

const variants = {
  yellow: 'bg-brand-yellow/35 text-foreground border-brand-yellow/50',
  green: 'bg-accent-green/12 text-accent-green border-accent-green/25',
  neutral: 'bg-muted text-muted-fg border-border-custom',
};

export default function IconBadge({ icon: Icon, size = 'md', variant = 'yellow' }: Props) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center border ${box[size]} ${variants[variant]}`}
      aria-hidden
    >
      <Icon className={iconSize[size]} strokeWidth={2} />
    </span>
  );
}
