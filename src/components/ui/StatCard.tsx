import React, { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  comparison?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: ReactNode;
  accent?: boolean;
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  comparison,
  trend,
  trendValue,
  icon,
  accent = false,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-5 border transition-all duration-150 relative overflow-hidden bg-white shadow-card ${
        accent ? 'border-yellow-brand/50 ring-1 ring-yellow-brand/30' : 'border-concrete-200'
      } ${onClick ? 'cursor-pointer hover:border-concrete-400 hover:shadow-md' : ''} ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">{label}</span>
        {icon && (
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              accent ? 'bg-yellow-brand/20 text-charcoal-900' : 'bg-concrete-100 text-charcoal-700'
            }`}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight font-sans">
          {value}
        </span>
      </div>

      {(comparison || trendValue) && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs">
          {trend === 'up' && (
            <span className="inline-flex items-center gap-0.5 font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3 h-3" />
              {trendValue}
            </span>
          )}
          {trend === 'down' && (
            <span className="inline-flex items-center gap-0.5 font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
              <TrendingDown className="w-3 h-3" />
              {trendValue}
            </span>
          )}
          {trend === 'neutral' && (
            <span className="inline-flex items-center gap-0.5 font-medium text-charcoal-600 bg-concrete-100 px-1.5 py-0.5 rounded">
              <Minus className="w-3 h-3" />
              {trendValue}
            </span>
          )}
          {comparison && <span className="text-charcoal-400 truncate">{comparison}</span>}
        </div>
      )}
    </div>
  );
};
