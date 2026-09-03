import React, { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverable = false, ...props }) => {
  return (
    <div
      className={`bg-white rounded-xl border border-concrete-200 shadow-card ${
        hoverable ? 'hover:border-concrete-300 hover:shadow-md transition-all duration-150' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
  children?: ReactNode;
}> = ({ title, subtitle, action, className = '', children }) => {
  if (children) {
    return <div className={`px-5 py-4 border-b border-concrete-200/80 ${className}`}>{children}</div>;
  }

  return (
    <div className={`px-5 py-4 border-b border-concrete-200/80 flex items-center justify-between gap-4 ${className}`}>
      <div>
        {title && <h3 className="text-base font-semibold text-charcoal-900 tracking-tight">{title}</h3>}
        {subtitle && <p className="text-xs text-charcoal-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

export const CardContent: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => {
  return <div className={`p-5 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => {
  return <div className={`px-5 py-3.5 bg-concrete-50/70 border-t border-concrete-200 rounded-b-xl ${className}`}>{children}</div>;
};
