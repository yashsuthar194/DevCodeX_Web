/**
 * Textarea Component
 * 
 * Multi-line text input with auto-resize and character count.
 */

import {
  type TextareaHTMLAttributes,
  type ReactNode,
  forwardRef,
  useId,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import clsx from 'clsx';
import './Textarea.css';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  /** Field label */
  label?: string;
  /** Error message */
  error?: string;
  /** Hint text */
  hint?: string;
  /** Show character count */
  showCharCount?: boolean;
  /** Max characters (for display) */
  maxLength?: number;
  /** Auto-resize to content */
  autoResize?: boolean;
  /** Min rows */
  minRows?: number;
  /** Max rows */
  maxRows?: number;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Icon on the left */
  leftIcon?: ReactNode;
}

/**
 * Textarea with auto-resize and character count.
 * 
 * @example
 * ```tsx
 * <Textarea
 *   label="Description"
 *   placeholder="Enter question description..."
 *   maxLength={2000}
 *   showCharCount
 *   autoResize
 * />
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      showCharCount = false,
      maxLength,
      autoResize = false,
      minRows = 3,
      maxRows = 10,
      onChange,
      leftIcon,
      className,
      id: providedId,
      disabled,
      value,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) ?? internalRef;

    const generatedId = useId();
    const id = providedId ?? generatedId;
    const hintId = `${id}-hint`;
    const errorId = `${id}-error`;

    // Calculate character count
    const charCount = typeof value === 'string' ? value.length : 0;

    // Auto-resize handler
    const adjustHeight = useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea || !autoResize) return;

      // Reset height to calculate scroll height
      textarea.style.height = 'auto';

      // Calculate line height
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 24;
      const minHeight = lineHeight * minRows;
      const maxHeight = lineHeight * maxRows;

      // Set new height within bounds
      const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
      textarea.style.height = `${newHeight}px`;
    }, [autoResize, minRows, maxRows, textareaRef]);

    // Adjust height on value change
    useEffect(() => {
      adjustHeight();
    }, [value, adjustHeight]);

    // Handle change
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e.target.value);
      if (autoResize) {
        adjustHeight();
      }
    };

    // Build aria-describedby
    const ariaDescribedBy = [
      hint ? hintId : null,
      error ? errorId : null,
    ].filter(Boolean).join(' ') || undefined;

    return (
      <div className={clsx('textarea-wrapper', className)}>
        {/* Label */}
        {label && (
          <label htmlFor={id} className="textarea__label">
            {label}
          </label>
        )}

        {/* Container */}
        <div
          className={clsx(
            'textarea__container',
            error && 'textarea__container--error',
            disabled && 'textarea__container--disabled',
            leftIcon && 'textarea__container--has-icon'
          )}
        >
          {/* Left icon */}
          {leftIcon && (
            <span className="textarea__icon" aria-hidden="true">
              {leftIcon}
            </span>
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            id={id}
            className="textarea__field"
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={ariaDescribedBy}
            value={value}
            defaultValue={defaultValue}
            maxLength={maxLength}
            onChange={handleChange}
            rows={minRows}
            {...props}
          />
        </div>

        {/* Footer with hint/error and char count */}
        <div className="textarea__footer">
          {/* Hint or Error */}
          <div className="textarea__messages">
            {hint && !error && (
              <p id={hintId} className="textarea__hint">{hint}</p>
            )}
            {error && (
              <p id={errorId} className="textarea__error" role="alert">{error}</p>
            )}
          </div>

          {/* Character count */}
          {showCharCount && maxLength && (
            <span 
              className={clsx(
                'textarea__char-count',
                charCount >= maxLength && 'textarea__char-count--limit'
              )}
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
