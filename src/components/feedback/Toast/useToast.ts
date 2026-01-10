/**
 * Toast hook and context
 */

import { createContext, useContext } from 'react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
}

export interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/**
 * Hook to access toast functions.
 * 
 * @example
 * ```tsx
 * const { addToast } = useToast();
 * 
 * addToast({
 *   variant: 'success',
 *   title: 'Question created',
 *   description: 'Your question has been saved.',
 * });
 * ```
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
