/**
 * Input Component
 * 
 * Accessible text input with label, error, hint, and icon support.
 * Follows coding-standards.md for accessibility (WCAG 2.2 AA).
 */

import { type InputHTMLAttributes, type ReactNode, forwardRef, useId } from 'react';
import clsx from 'clsx';
import './Input.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input label (rendered above input) */
  label?: string;
  /** Error message (shows error state) */
  error?: string;
  /** Hint text (below input) */
  hint?: string;
  /** Icon on the left side */
  leftIcon?: ReactNode;
  /** Icon on the right side */
  rightIcon?: ReactNode;
  /** Visual size variant */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Accessible text input with full form integration support.
 * 
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="you@example.com"
 *   error={errors.email?.message}
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      size = 'md',
      className,
      id: providedId,
      disabled,
      ...props
    },
    ref
  ) => {
    // Generate unique ID for accessibility
    const generatedId = useId();
    const id = providedId ?? generatedId;
    const hintId = `${id}-hint`;
    const errorId = `${id}-error`;

    // Build aria-describedby for screen readers
    const ariaDescribedBy = [
      hint ? hintId : null,
      error ? errorId : null,
    ].filter(Boolean).join(' ') || undefined;

    return (
      <div className={clsx('input-wrapper', className)}>
        {/* Label */}
        {label && (
          <label htmlFor={id} className="input__label">
            {label}
          </label>
        )}

        {/* Input container with icons */}
        <div
          className={clsx(
            'input__container',
            `input__container--${size}`,
            error && 'input__container--error',
            disabled && 'input__container--disabled',
            leftIcon && 'input__container--has-left-icon',
            rightIcon && 'input__container--has-right-icon'
          )}
        >
          {/* Left icon */}
          {leftIcon && (
            <span className="input__icon input__icon--left" aria-hidden="true">
              {leftIcon}
            </span>
          )}

          {/* Input element */}
          <input
            ref={ref}
            id={id}
            className="input__field"
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={ariaDescribedBy}
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <span className="input__icon input__icon--right" aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </div>

        {/* Hint text */}
        {hint && !error && (
          <p id={hintId} className="input__hint">
            {hint}
          </p>
        )}

        {/* Error message - role="alert" for screen readers */}
        {error && (
          <p id={errorId} className="input__error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
