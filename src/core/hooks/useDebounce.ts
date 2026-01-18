/**
 * useDebounce Hook
 * 
 * Debounces a value by a specified delay.
 * Commonly used for search inputs to reduce API calls.
 * 
 * @example
 * ```tsx
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 300);
 * 
 * // Use debouncedSearch for API calls
 * useQuery(['search', debouncedSearch], () => searchApi(debouncedSearch));
 * ```
 */

import { useState, useEffect } from 'react';

/**
 * Debounce a value by a specified delay
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up the timeout
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up on value change or unmount
    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedValue;
}
