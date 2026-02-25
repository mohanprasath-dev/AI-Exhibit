"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

const toastConfig: Record<ToastType, { icon: typeof CheckCircle2; className: string }> = {
  success: {
    icon: CheckCircle2,
    className: "border-green-500/50 bg-green-500/10",
  },
  error: {
    icon: AlertCircle,
    className: "border-red-500/50 bg-red-500/10",
  },
  info: {
    icon: Info,
    className: "border-violet-500/50 bg-violet-700/30",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-amber-500/50 bg-amber-500/10",
  },
};

const iconColors: Record<ToastType, string> = {
  success: "text-green-400",
  error: "text-red-400",
  info: "text-violet-400",
  warning: "text-amber-400",
};

interface ToastProviderProps {
  children: ReactNode;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  maxToasts?: number;
}

export function ToastProvider({ 
  children, 
  position = "bottom-right",
  maxToasts = 5 
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info", duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, type, message, duration };

    setToasts((prev) => {
      const updated = [...prev, newToast];
      // Keep only the last maxToasts
      return updated.slice(-maxToasts);
    });

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [maxToasts]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    addToast(message, "success", duration);
  }, [addToast]);

  const error = useCallback((message: string, duration?: number) => {
    addToast(message, "error", duration);
  }, [addToast]);

  const info = useCallback((message: string, duration?: number) => {
    addToast(message, "info", duration);
  }, [addToast]);

  const warning = useCallback((message: string, duration?: number) => {
    addToast(message, "warning", duration);
  }, [addToast]);

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info, warning }}>
      {children}
      
      {/* Toast Container */}
      <div className={cn("fixed z-[100] flex flex-col gap-2", positionClasses[position])}>
        <AnimatePresence mode="sync">
          {toasts.map((toast) => {
            const config = toastConfig[toast.type];
            const Icon = config.icon;

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.9 }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl",
                  "border backdrop-blur-xl",
                  "min-w-[300px] max-w-[400px]",
                  "shadow-lg",
                  config.className
                )}
              >
                <Icon className={cn("w-5 h-5 flex-shrink-0", iconColors[toast.type])} />
                <p className="text-white text-sm flex-1">{toast.message}</p>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-violet-300/60 hover:text-white transition-colors flex-shrink-0"
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
