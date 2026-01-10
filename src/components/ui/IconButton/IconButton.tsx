/**
 * IconButton Component
 * 
 * Icon-only button with required aria-label for accessibility.
 */

import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react';
import clsx from 'clsx';
import './IconButton.css';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Required accessibility label */
  'aria-label': string;
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** The icon to display */
  icon: ReactNode;
}

/**
 * Icon-only button with enforced accessibility.
 * 
 * @example
 * ```tsx
 * <IconButton
 *   aria-label="Close menu"
 *   icon={<CloseIcon />}
 *   onClick={handleClose}
 * />
 * ```
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = 'ghost',
      size = 'md',
      icon,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'icon-button',
          `icon-button--${variant}`,
          `icon-button--${size}`,
          className
        )}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
