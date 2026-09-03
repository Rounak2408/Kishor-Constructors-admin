import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ title, description, type, duration = 4000 }: Omit<ToastMessage, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastMessage = { id, title, description, type, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((title: string, description?: string) => {
    addToast({ title, description, type: 'success' });
  }, [addToast]);

  const error = useCallback((title: string, description?: string) => {
    addToast({ title, description, type: 'error' });
  }, [addToast]);

  const warning = useCallback((title: string, description?: string) => {
    addToast({ title, description, type: 'warning' });
  }, [addToast]);

  const info = useCallback((title: string, description?: string) => {
    addToast({ title, description, type: 'info' });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-modal border bg-white animate-fade-in transition-all ${
              toast.type === 'success'
                ? 'border-emerald-200 text-charcoal-900'
                : toast.type === 'error'
                ? 'border-red-200 text-charcoal-900'
                : toast.type === 'warning'
                ? 'border-amber-200 text-charcoal-900'
                : 'border-blue-200 text-charcoal-900'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {toast.type === 'error' && <XCircle className="w-5 h-5 text-red-600" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-charcoal-900">{toast.title}</h4>
              {toast.description && (
                <p className="text-xs text-charcoal-600 mt-0.5 leading-relaxed">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-charcoal-400 hover:text-charcoal-700 p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
