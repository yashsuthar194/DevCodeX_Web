/**
 * Checkbox Component
 * 
 * Accessible checkbox with label and indeterminate state.
 */

import { type InputHTMLAttributes, forwardRef, useId } from 'react';
import clsx from 'clsx';
import './Checkbox.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Checkbox label */
  label?: string;
  /** Error message */
  error?: string;
  /** Hint text */
  hint?: string;
  /** Indeterminate state (for "select all" patterns) */
  indeterminate?: boolean;
}

/**
 * Accessible checkbox with label support.
 * 
 * @example
 * ```tsx
 * <Checkbox
 *   label="Accept terms and conditions"
 *   checked={accepted}
 *   onChange={(e) => setAccepted(e.target.checked)}
 * />
 * ```
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      hint,
      indeterminate = false,
      className,
      id: providedId,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId ?? generatedId;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    const ariaDescribedBy = [
      hint ? hintId : null,
      error ? errorId : null,
    ].filter(Boolean).join(' ') || undefined;

    return (
      <div className={clsx('checkbox-wrapper', className)}>
        <div className="checkbox__container">
          {/* Hidden native checkbox */}
          <input
            ref={(node) => {
              // Handle indeterminate state
              if (node) {
                node.indeterminate = indeterminate;
              }
              // Forward ref
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            type="checkbox"
            id={id}
            className="checkbox__input"
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={ariaDescribedBy}
            {...props}
          />

          {/* Custom checkbox visual */}
          <div
            className={clsx(
              'checkbox__box',
              error && 'checkbox__box--error',
              disabled && 'checkbox__box--disabled'
            )}
            aria-hidden="true"
          >
            {/* Checkmark icon */}
            <svg
              className="checkbox__check"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {indeterminate ? (
                <line x1="5" y1="12" x2="19" y2="12" />
              ) : (
                <polyline points="20 6 9 17 4 12" />
              )}
            </svg>
          </div>

          {/* Label */}
          {label && (
            <label htmlFor={id} className="checkbox__label">
              {label}
            </label>
          )}
        </div>

        {/* Hint */}
        {hint && !error && (
          <p id={hintId} className="checkbox__hint">{hint}</p>
        )}

        {/* Error */}
        {error && (
          <p id={errorId} className="checkbox__error" role="alert">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
