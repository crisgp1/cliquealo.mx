import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Card, CardBody, Button } from '@heroui/react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
  isExiting?: boolean;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id, isExiting: false };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after duration
    const duration = toast.duration || 4000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    // First mark as exiting for animation
    setToasts(prev => prev.map(t => t.id === id ? { ...t, isExiting: true } : t));
    
    // Then remove after animation completes
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300); // Match animation duration
  }, []);

  // Set global toast instance for easy access
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).toastInstance = { addToast, removeToast };
    }
  }, [addToast, removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function Toaster() {
  const { toasts, removeToast } = useToast();

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getColorClasses = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200';
    }
  };

  const getAnimationClasses = (toast: Toast) => {
    if (toast.isExiting) {
      return 'toast-exit';
    }
    return 'toast-enter';
  };

  if (toasts.length === 0) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes toast-slide-in {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes toast-slide-out {
            from {
              transform: translateX(0);
              opacity: 1;
              max-height: 200px;
              margin-bottom: 8px;
            }
            to {
              transform: translateX(100%);
              opacity: 0;
              max-height: 0;
              margin-bottom: 0;
            }
          }

          @keyframes toast-fade-in {
            from {
              opacity: 0;
              transform: scale(0.95) translateY(-10px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          @keyframes toast-fade-out {
            from {
              opacity: 1;
              transform: scale(1) translateY(0);
              max-height: 200px;
              margin-bottom: 8px;
            }
            to {
              opacity: 0;
              transform: scale(0.95) translateY(-10px);
              max-height: 0;
              margin-bottom: 0;
            }
          }

          .toast-enter {
            animation: toast-slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards,
                       toast-fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          .toast-exit {
            animation: toast-slide-out 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards,
                       toast-fade-out 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }

          @media (max-width: 640px) {
            .toast-enter {
              animation: toast-fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            
            .toast-exit {
              animation: toast-fade-out 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
          }
        `
      }} />
      
      <div className="fixed top-4 right-4 left-4 sm:left-auto z-[9999] space-y-2 max-w-sm sm:max-w-md pointer-events-none">
        {toasts.map((toast, index) => (
          <Card
            key={toast.id}
            className={`
              ${getColorClasses(toast.type)}
              ${getAnimationClasses(toast)}
              border shadow-lg backdrop-blur-sm pointer-events-auto
              transition-all duration-300 ease-in-out
              hover:shadow-xl hover:scale-[1.02]
              transform-gpu will-change-transform
            `}
            style={{
              zIndex: 9999 - index,
              transformOrigin: 'top right'
            }}
          >
            <CardBody className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 transition-transform duration-200 ease-in-out">
                  {getIcon(toast.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm break-words leading-relaxed">
                    {toast.title}
                  </p>
                  {toast.description && (
                    <p className="text-sm opacity-90 mt-1 break-words leading-relaxed">
                      {toast.description}
                    </p>
                  )}
                </div>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="
                    text-current opacity-70 hover:opacity-100
                    min-w-unit-6 w-6 h-6 flex-shrink-0
                    transition-all duration-200 ease-in-out
                    hover:scale-110 hover:bg-black/10 dark:hover:bg-white/10
                  "
                  onPress={() => removeToast(toast.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </>
  );
}

// Helper functions for easy toast usage
export const toast = {
  success: (title: string, description?: string, duration?: number) => {
    // This will be implemented via a global toast instance
    if (typeof window !== 'undefined' && (window as any).toastInstance) {
      (window as any).toastInstance.addToast({ type: 'success', title, description, duration });
    }
  },
  error: (title: string, description?: string, duration?: number) => {
    if (typeof window !== 'undefined' && (window as any).toastInstance) {
      (window as any).toastInstance.addToast({ type: 'error', title, description, duration });
    }
  },
  warning: (title: string, description?: string, duration?: number) => {
    if (typeof window !== 'undefined' && (window as any).toastInstance) {
      (window as any).toastInstance.addToast({ type: 'warning', title, description, duration });
    }
  },
  info: (title: string, description?: string, duration?: number) => {
    if (typeof window !== 'undefined' && (window as any).toastInstance) {
      (window as any).toastInstance.addToast({ type: 'info', title, description, duration });
    }
  },
};