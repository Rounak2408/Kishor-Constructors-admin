import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'yellow' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
    icon: 'p-2',
  };

  const variantClasses = {
    primary:
      'bg-charcoal-800 text-white hover:bg-charcoal-950 focus:ring-charcoal-700 shadow-sm border border-charcoal-900',
    secondary:
      'bg-concrete-200 text-charcoal-800 hover:bg-concrete-300 focus:ring-concrete-400 border border-concrete-300',
    outline:
      'bg-white text-charcoal-800 border border-concrete-300 hover:bg-concrete-50 hover:border-concrete-400 focus:ring-concrete-300 shadow-sm',
    yellow:
      'bg-yellow-brand text-charcoal-950 font-semibold hover:bg-yellow-hover focus:ring-yellow-brand shadow-sm hover:shadow-yellow-glow border border-yellow-dark/20',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm border border-red-700',
    ghost:
      'bg-transparent text-charcoal-600 hover:bg-concrete-200/60 hover:text-charcoal-900 focus:ring-concrete-300',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
