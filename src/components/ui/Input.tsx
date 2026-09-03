import React, { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix'> {
  label?: string;
  helperText?: string;
  error?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, prefix, suffix, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-charcoal-700 mb-1.5 uppercase tracking-wider">
            {label} {props.required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <div className="absolute left-3 flex items-center pointer-events-none text-charcoal-400 text-sm">
              {prefix}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-charcoal-800/10 focus:border-charcoal-800 transition-colors ${
              prefix ? 'pl-9' : ''
            } ${suffix ? 'pr-9' : ''} ${
              error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-concrete-300'
            } ${className}`}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 flex items-center pointer-events-none text-charcoal-400 text-sm">
              {suffix}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-red-600 mt-1">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-charcoal-500 mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
