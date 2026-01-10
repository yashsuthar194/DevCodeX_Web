/**
 * Badge Component
 * 
 * Status indicator or label with semantic color variants.
 * Used for difficulty levels, tags, and status indicators.
 */

import { type HTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';
import './Badge.css';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Badge content */
  children: ReactNode;
  /** Color variant */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Make badge rounded pill shape */
  isPill?: boolean;
  /** Optional icon before text */
  icon?: ReactNode;
}

/**
 * Badge for status indicators and labels.
 * 
 * @example
 * ```tsx
 * // Difficulty levels
 * <Badge variant="success">Beginner</Badge>
 * <Badge variant="info">Intermediate</Badge>
 * <Badge variant="warning">Advanced</Badge>
 * <Badge variant="error">Expert</Badge>
 * 
 * // With icon
 * <Badge variant="primary" icon={<TagIcon />}>React</Badge>
 * ```
 */
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  isPill = false,
  icon,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'badge',
        `badge--${variant}`,
        `badge--${size}`,
        isPill && 'badge--pill',
        className
      )}
      {...props}
    >
      {icon && <span className="badge__icon" aria-hidden="true">{icon}</span>}
      {children}
    </span>
  );
}
