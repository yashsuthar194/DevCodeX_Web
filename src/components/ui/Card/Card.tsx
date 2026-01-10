/**
 * Card Component
 * 
 * Container for related content with optional hover effects.
 * Uses GPU-accelerated transform for hover animation.
 */

import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';
import clsx from 'clsx';
import './Card.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card content */
  children: ReactNode;
  /** Enable hover lift effect */
  isHoverable?: boolean;
  /** Make the entire card clickable */
  isClickable?: boolean;
  /** Card padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Visual variant */
  variant?: 'default' | 'outline' | 'ghost';
}

/**
 * Card container with optional hover animation.
 * 
 * @example
 * ```tsx
 * <Card isHoverable onClick={() => navigate('/questions/1')}>
 *   <h3>React Hooks</h3>
 *   <p>Explain useState and useEffect</p>
 * </Card>
 * ```
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      isHoverable = false,
      isClickable = false,
      padding = 'md',
      variant = 'default',
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    // If onClick is provided, treat as clickable
    const clickable = isClickable || !!onClick;

    return (
      <div
        ref={ref}
        className={clsx(
          'card',
          `card--${variant}`,
          `card--padding-${padding}`,
          isHoverable && 'card--hoverable',
          clickable && 'card--clickable',
          className
        )}
        onClick={onClick}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        onKeyDown={
          clickable
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
                }
              }
            : undefined
        }
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * Card Header - for title area
 */
export function CardHeader({ 
  children, 
  className, 
  ...props 
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('card__header', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Card Body - for main content
 */
export function CardBody({ 
  children, 
  className, 
  ...props 
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('card__body', className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Card Footer - for actions
 */
export function CardFooter({ 
  children, 
  className, 
  ...props 
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('card__footer', className)} {...props}>
      {children}
    </div>
  );
}
