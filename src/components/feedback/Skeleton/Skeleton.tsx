/**
 * Skeleton Component
 * 
 * Loading placeholder with GPU-accelerated shimmer animation.
 */

import clsx from 'clsx';
import './Skeleton.css';

export interface SkeletonProps {
  /** Shape variant */
  variant?: 'text' | 'circular' | 'rectangular';
  /** Width (CSS value) */
  width?: string | number;
  /** Height (CSS value) */
  height?: string | number;
  /** Additional class */
  className?: string;
  /** Number of lines (for text variant) */
  lines?: number;
  /** Animation enabled */
  animate?: boolean;
}

/**
 * Skeleton loading placeholder.
 * 
 * @example
 * ```tsx
 * // Single skeleton
 * <Skeleton variant="text" width="60%" />
 * 
 * // Multiple text lines
 * <Skeleton variant="text" lines={3} />
 * 
 * // Avatar placeholder
 * <Skeleton variant="circular" width={40} height={40} />
 * 
 * // Card placeholder
 * <Skeleton variant="rectangular" height={200} />
 * ```
 */
export function Skeleton({
  variant = 'text',
  width,
  height,
  className,
  lines = 1,
  animate = true,
}: SkeletonProps) {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  // For multiple text lines
  if (variant === 'text' && lines > 1) {
    return (
      <div className={clsx('skeleton-lines', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <span
            key={i}
            className={clsx(
              'skeleton',
              'skeleton--text',
              animate && 'skeleton--animate',
              // Last line is shorter
              i === lines - 1 && 'skeleton--short'
            )}
            style={i === lines - 1 ? { width: '80%' } : undefined}
          />
        ))}
      </div>
    );
  }

  return (
    <span
      className={clsx(
        'skeleton',
        `skeleton--${variant}`,
        animate && 'skeleton--animate',
        className
      )}
      style={style}
    />
  );
}

/**
 * Pre-built skeleton for a card layout
 */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={clsx('skeleton-card', className)}>
      <div className="skeleton-card__header">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="skeleton-card__header-text">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="text" lines={3} />
    </div>
  );
}

/**
 * Pre-built skeleton for a table row
 */
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr className="skeleton-table-row">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i}>
          <Skeleton variant="text" width="80%" />
        </td>
      ))}
    </tr>
  );
}

/**
 * Pre-built skeleton for a page
 */
export function PageSkeleton() {
  return (
    <div className="skeleton-page">
      {/* Header */}
      <div className="skeleton-page__header">
        <Skeleton variant="text" width="200px" height="32px" />
        <Skeleton variant="text" width="300px" />
      </div>
      
      {/* Content grid */}
      <div className="skeleton-page__grid">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
