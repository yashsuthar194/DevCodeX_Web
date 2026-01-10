/**
 * SearchInput Component
 * 
 * Specialized search field with debounce, clear button, and loading state.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import clsx from 'clsx';
import { Spinner } from '../../feedback/Spinner';
import './SearchInput.css';

export interface SearchInputProps {
  /** Current search value */
  value: string;
  /** Change handler (debounced) */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Debounce delay in ms */
  debounceMs?: number;
  /** Loading state */
  isLoading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional class */
  className?: string;
  /** Auto focus on mount */
  autoFocus?: boolean;
}

/**
 * Search input with debounced onChange.
 * 
 * @example
 * ```tsx
 * const [search, setSearch] = useState('');
 * 
 * <SearchInput
 *   value={search}
 *   onChange={setSearch}
 *   placeholder="Search questions..."
 *   debounceMs={300}
 *   isLoading={isSearching}
 * />
 * ```
 */
export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  debounceMs = 300,
  isLoading = false,
  disabled = false,
  size = 'md',
  className,
  autoFocus = false,
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Sync external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced onChange
  const handleChange = useCallback((newValue: string) => {
    setLocalValue(newValue);

    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new debounced call
    debounceRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounceMs);
  }, [onChange, debounceMs]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Handle clear
  const handleClear = () => {
    setLocalValue('');
    onChange('');
    inputRef.current?.focus();
  };

  // Handle key down
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div
      className={clsx(
        'search-input',
        `search-input--${size}`,
        disabled && 'search-input--disabled',
        className
      )}
    >
      {/* Search icon */}
      <svg
        className="search-input__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>

      {/* Input field */}
      <input
        ref={inputRef}
        type="search"
        className="search-input__field"
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        aria-label={placeholder}
      />

      {/* Loading spinner or clear button */}
      <div className="search-input__actions">
        {isLoading ? (
          <Spinner size="sm" className="search-input__spinner" />
        ) : localValue ? (
          <button
            type="button"
            className="search-input__clear"
            onClick={handleClear}
            aria-label="Clear search"
            tabIndex={-1}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  );
}
