/**
 * Button Component
 * 
 * Primary action trigger with multiple variants and sizes.
 * Uses GPU-accelerated animations for press feedback.
 */

import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react';
import clsx from 'clsx';
import './Button.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Show loading spinner */
  isLoading?: boolean;
  /** Icon before text */
  leftIcon?: ReactNode;
  /** Icon after text */
  rightIcon?: ReactNode;
}

/**
 * Button component with multiple variants and GPU-animated interactions.
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md">
 *   Click me
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'button',
          `button--${variant}`,
          `button--${size}`,
          isLoading && 'button--loading',
          className
        )}
        disabled={disabled ?? isLoading}
        {...props}
      >
        {isLoading && (
          <span className="button__spinner" aria-hidden="true">
            <svg
              className="button__spinner-icon"
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
              />
            </svg>
          </span>
        )}
        {leftIcon && !isLoading && (
          <span className="button__icon button__icon--left">{leftIcon}</span>
        )}
        <span className={clsx('button__text', isLoading && 'button__text--hidden')}>
          {children}
        </span>
        {rightIcon && !isLoading && (
          <span className="button__icon button__icon--right">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
