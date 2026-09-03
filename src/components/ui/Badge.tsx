import React from 'react';

export type BadgeVariant =
  | 'healthy'
  | 'low-stock'
  | 'critical'
  | 'out-of-stock'
  | 'paid'
  | 'partial'
  | 'due'
  | 'active'
  | 'inactive'
  | 'visible'
  | 'hidden'
  | 'featured'
  | 'neutral'
  | 'yellow'
  | 'blue';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string; dotColor: string }> = {
    healthy: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      dotColor: 'bg-emerald-500',
    },
    'low-stock': {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      dotColor: 'bg-amber-500',
    },
    critical: {
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-200',
      dotColor: 'bg-orange-500 animate-pulse',
    },
    'out-of-stock': {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      dotColor: 'bg-red-500',
    },
    paid: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      dotColor: 'bg-emerald-500',
    },
    partial: {
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200',
      dotColor: 'bg-blue-500',
    },
    due: {
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-200',
      dotColor: 'bg-red-500',
    },
    active: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      dotColor: 'bg-emerald-500',
    },
    inactive: {
      bg: 'bg-concrete-100',
      text: 'text-charcoal-500',
      border: 'border-concrete-300',
      dotColor: 'bg-charcoal-400',
    },
    visible: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      dotColor: 'bg-emerald-500',
    },
    hidden: {
      bg: 'bg-concrete-200',
      text: 'text-charcoal-600',
      border: 'border-concrete-300',
      dotColor: 'bg-charcoal-400',
    },
    featured: {
      bg: 'bg-yellow-light',
      text: 'text-charcoal-900 font-semibold',
      border: 'border-yellow-brand/40',
      dotColor: 'bg-yellow-brand',
    },
    neutral: {
      bg: 'bg-concrete-100',
      text: 'text-charcoal-700',
      border: 'border-concrete-200',
      dotColor: 'bg-charcoal-400',
    },
    yellow: {
      bg: 'bg-yellow-light',
      text: 'text-yellow-dark font-medium',
      border: 'border-yellow-brand/30',
      dotColor: 'bg-yellow-brand',
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      dotColor: 'bg-blue-500',
    },
  };

  const style = variantStyles[variant] || variantStyles.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${style.bg} ${style.text} ${style.border} ${sizeClasses[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.dotColor}`} />}
      <span>{children}</span>
    </span>
  );
};
