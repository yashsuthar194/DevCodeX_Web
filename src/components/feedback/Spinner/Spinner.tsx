/**
 * Spinner Component
 * 
 * Loading indicator with GPU-accelerated rotation animation.
 */

import clsx from 'clsx';
import './Spinner.css';

export interface SpinnerProps {
  /** Spinner size */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS class */
  className?: string;
}

/**
 * Loading spinner with smooth GPU-accelerated rotation.
 * 
 * @example
 * ```tsx
 * <Spinner size="md" />
 * ```
 */
export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      className={clsx('spinner', `spinner--${size}`, className)}
      role="status"
      aria-label="Loading"
    >
      <svg
        className="spinner__icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="31.4 31.4"
          opacity="0.25"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="31.4 31.4"
          strokeDashoffset="62.8"
          className="spinner__arc"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
