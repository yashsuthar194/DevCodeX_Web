/**
 * DevCodeX Application Providers
 * 
 * Composable provider wrapper for the application.
 * Handles TanStack Query, Router, Toast, and other global providers.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router';
import { type ReactNode, useMemo } from 'react';
import { QUERY_DEFAULTS } from '@/core/config';
import { ToastProvider } from '@/components/feedback/Toast';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Application providers wrapper component
 * 
 * Provides:
 * - TanStack Query client with default options
 * - React Router BrowserRouter
 * - Toast notifications
 * 
 * @example
 * ```tsx
 * <Providers>
 *   <App />
 * </Providers>
 * ```
 */
export function Providers({ children }: ProvidersProps) {
  // Create QueryClient with stable reference using useMemo
  // This prevents recreation on re-renders
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: QUERY_DEFAULTS.staleTime,
            gcTime: QUERY_DEFAULTS.gcTime,
            retry: QUERY_DEFAULTS.retry,
            refetchOnWindowFocus: QUERY_DEFAULTS.refetchOnWindowFocus,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastProvider>
          {children}
        </ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

