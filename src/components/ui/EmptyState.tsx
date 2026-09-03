import React, { ReactNode } from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-concrete-300 bg-concrete-50/50 ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-concrete-200/80 text-charcoal-600 flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-charcoal-900">{title}</h3>
      <p className="text-xs text-charcoal-500 max-w-sm mt-1 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <div className="mt-4">
          <Button variant="yellow" size="sm" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};
