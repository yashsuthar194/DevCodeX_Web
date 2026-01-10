/**
 * Select Component
 * 
 * Accessible dropdown with keyboard navigation and search.
 * Uses GPU-accelerated animations for dropdown.
 * Optimized with useMemo for filtered options and optional debounce.
 */

import {
  type ReactNode,
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
  useMemo,
} from 'react';
import clsx from 'clsx';
import './Select.css';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  /** Available options */
  options: SelectOption[];
  /** Selected value */
  value?: string | number;
  /** Change callback - receives undefined when cleared */
  onChange: (value: string | number | undefined) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Field label */
  label?: string;
  /** Error message */
  error?: string;
  /** Hint text */
  hint?: string;
  /** Enable search/filter */
  isSearchable?: boolean;
  /** Debounce delay for search input in ms (0 = no debounce) */
  searchDebounceMs?: number;
  /** Allow clearing the selected value */
  isClearable?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Custom class */
  className?: string;
  /** Custom option renderer */
  renderOption?: (option: SelectOption) => ReactNode;
}

/**
 * Select dropdown with keyboard navigation.
 * 
 * @example
 * ```tsx
 * <Select
 *   label="Technology"
 *   options={technologies.map(t => ({ value: t.id, label: t.name }))}
 *   value={selectedId}
 *   onChange={setSelectedId}
 *   placeholder="Select a technology..."
 *   isSearchable
 *   isClearable
 *   searchDebounceMs={150}
 * />
 * ```
 */
export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  label,
  error,
  hint,
  isSearchable = false,
  searchDebounceMs = 0,
  isClearable = false,
  disabled = false,
  className,
  renderOption,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  
  const id = useId();
  const listboxId = `${id}-listbox`;
  const labelId = `${id}-label`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  // Debounce search query for performance with large option lists
  useEffect(() => {
    if (!searchDebounceMs || searchDebounceMs === 0) {
      setDebouncedQuery(searchQuery);
      return;
    }
    
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, searchDebounceMs);
    
    return () => clearTimeout(timer);
  }, [searchQuery, searchDebounceMs]);

  // Get selected option
  const selectedOption = useMemo(
    () => options.find(opt => opt.value === value),
    [options, value]
  );

  // Memoize filtered options to prevent recalculation on unrelated re-renders
  const filteredOptions = useMemo(() => {
    if (!isSearchable || !debouncedQuery.trim()) {
      return options;
    }
    const query = debouncedQuery.toLowerCase();
    return options.filter(opt => 
      opt.label.toLowerCase().includes(query)
    );
  }, [options, debouncedQuery, isSearchable]);

  // Handle opening dropdown - stable dependencies without filteredOptions
  const openDropdown = useCallback(() => {
    if (!disabled) {
      setIsOpen(true);
      // Find initial highlight index based on current value
      const index = options.findIndex(opt => opt.value === value);
      setHighlightedIndex(index >= 0 ? index : 0);
    }
  }, [disabled, options, value]);

  // Handle closing dropdown
  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
    setHighlightedIndex(-1);
  }, []);

  // Handle option selection
  const selectOption = useCallback((option: SelectOption) => {
    if (!option.disabled) {
      onChange(option.value);
      closeDropdown();
    }
  }, [onChange, closeDropdown]);

  // Handle clearing the value
  const clearValue = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dropdown from opening
    onChange(undefined);
  }, [onChange]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          selectOption(filteredOptions[highlightedIndex]);
        } else {
          openDropdown();
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          openDropdown();
        } else {
          setHighlightedIndex(prev => 
            Math.min(prev + 1, filteredOptions.length - 1)
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex(prev => Math.max(prev - 1, 0));
        }
        break;
      case 'Escape':
        closeDropdown();
        break;
      case 'Tab':
        closeDropdown();
        break;
    }
  }, [disabled, isOpen, highlightedIndex, filteredOptions, openDropdown, closeDropdown, selectOption]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeDropdown]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (isOpen && listRef.current && highlightedIndex >= 0) {
      const items = listRef.current.children;
      if (items[highlightedIndex]) {
        (items[highlightedIndex] as HTMLElement).scrollIntoView({
          block: 'nearest',
        });
      }
    }
  }, [isOpen, highlightedIndex]);

  // Build aria-describedby
  const ariaDescribedBy = [
    hint ? hintId : null,
    error ? errorId : null,
  ].filter(Boolean).join(' ') || undefined;

  return (
    <div 
      ref={containerRef}
      className={clsx('select-wrapper', className)}
    >
      {/* Label */}
      {label && (
        <label id={labelId} className="select__label">
          {label}
        </label>
      )}

      {/* Trigger */}
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={ariaDescribedBy}
        aria-invalid={error ? true : undefined}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        className={clsx(
          'select__trigger',
          isOpen && 'select__trigger--open',
          error && 'select__trigger--error',
          disabled && 'select__trigger--disabled'
        )}
        onClick={isOpen ? closeDropdown : openDropdown}
        onKeyDown={handleKeyDown}
      >
        {isSearchable && isOpen ? (
          <input
            ref={inputRef}
            type="text"
            className="select__search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={selectedOption?.label ?? placeholder}
            autoFocus
          />
        ) : (
          <span className={clsx(
            'select__value',
            !selectedOption && 'select__value--placeholder'
          )}>
            {selectedOption?.label ?? placeholder}
          </span>
        )}

        {/* Clear button */}
        {isClearable && selectedOption && !disabled && (
          <button
            type="button"
            className="select__clear"
            onClick={clearValue}
            aria-label="Clear selection"
            tabIndex={-1}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        {/* Chevron icon */}
        <svg 
          className={clsx('select__chevron', isOpen && 'select__chevron--open')}
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={label ? labelId : undefined}
          className="select__dropdown"
        >
          {filteredOptions.length === 0 ? (
            <li className="select__empty">No options found</li>
          ) : (
            filteredOptions.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                aria-disabled={option.disabled}
                className={clsx(
                  'select__option',
                  option.value === value && 'select__option--selected',
                  index === highlightedIndex && 'select__option--highlighted',
                  option.disabled && 'select__option--disabled'
                )}
                onClick={() => selectOption(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {renderOption ? renderOption(option) : option.label}
              </li>
            ))
          )}
        </ul>
      )}

      {/* Hint */}
      {hint && !error && (
        <p id={hintId} className="select__hint">{hint}</p>
      )}

      {/* Error */}
      {error && (
        <p id={errorId} className="select__error" role="alert">{error}</p>
      )}
    </div>
  );
}
