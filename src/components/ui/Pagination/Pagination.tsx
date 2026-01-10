/**
 * Pagination Component
 * 
 * Reusable pagination controls with page navigation and page size selector.
 * Follows Lighthouse optimization rules (GPU-safe animations only).
 * 
 * @example
 * ```tsx
 * <Pagination
 *   pageIndex={1}
 *   pageSize={10}
 *   totalCount={100}
 *   onPageChange={(page) => setPage(page)}
 *   onPageSizeChange={(size) => setPageSize(size)}
 * />
 * ```
 */

import { type FC, useCallback } from 'react';
import clsx from 'clsx';
import { PAGINATION } from '@/core/config';
import './Pagination.css';

export interface PaginationProps {
  /** Current page index (1-indexed) */
  pageIndex: number;
  
  /** Items per page */
  pageSize: number;
  
  /** Total number of items */
  totalCount: number;
  
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  
  /** Callback when page size changes */
  onPageSizeChange?: (size: number) => void;
  
  /** Show page size selector */
  showPageSizeSelector?: boolean;
  
  /** Additional CSS class */
  className?: string;
  
  /** Disabled state */
  disabled?: boolean;
}

export const Pagination: FC<PaginationProps> = ({
  pageIndex,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  showPageSizeSelector = true,
  className,
  disabled = false,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const hasNextPage = pageIndex < totalPages;
  const hasPreviousPage = pageIndex > 1;
  
  const handlePrevious = useCallback(() => {
    if (hasPreviousPage && !disabled) {
      onPageChange(pageIndex - 1);
    }
  }, [hasPreviousPage, pageIndex, onPageChange, disabled]);
  
  const handleNext = useCallback(() => {
    if (hasNextPage && !disabled) {
      onPageChange(pageIndex + 1);
    }
  }, [hasNextPage, pageIndex, onPageChange, disabled]);
  
  const handlePageSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    onPageSizeChange?.(newSize);
    // Reset to page 1 when page size changes
    onPageChange(1);
  }, [onPageSizeChange, onPageChange]);
  
  // Calculate from-to range
  const from = totalCount === 0 ? 0 : (pageIndex - 1) * pageSize + 1;
  const to = Math.min(pageIndex * pageSize, totalCount);
  
  return (
    <nav 
      className={clsx('pagination', className)} 
      aria-label="Pagination"
      role="navigation"
    >
      {/* Results summary */}
      <div className="pagination__info" aria-live="polite">
        <span className="pagination__summary">
          Showing <strong>{from}</strong> to <strong>{to}</strong> of <strong>{totalCount}</strong> results
        </span>
      </div>
      
      <div className="pagination__controls">
        {/* Page size selector */}
        {showPageSizeSelector && onPageSizeChange && (
          <div className="pagination__size">
            <label htmlFor="page-size" className="pagination__size-label">
              Rows per page:
            </label>
            <select
              id="page-size"
              className="pagination__size-select"
              value={pageSize}
              onChange={handlePageSizeChange}
              disabled={disabled}
            >
              {PAGINATION.pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* Page info */}
        <span className="pagination__page-info">
          Page {pageIndex} of {totalPages}
        </span>
        
        {/* Navigation buttons */}
        <div className="pagination__nav" role="group" aria-label="Page navigation">
          <button
            type="button"
            className="pagination__button"
            onClick={handlePrevious}
            disabled={!hasPreviousPage || disabled}
            aria-label="Go to previous page"
            aria-disabled={!hasPreviousPage || disabled}
          >
            <svg
              className="pagination__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          
          <button
            type="button"
            className="pagination__button"
            onClick={handleNext}
            disabled={!hasNextPage || disabled}
            aria-label="Go to next page"
            aria-disabled={!hasNextPage || disabled}
          >
            <svg
              className="pagination__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};
