/**
 * EmptyState Component
 * 
 * Display when no data is available.
 */

import { type ReactNode } from 'react';
import clsx from 'clsx';
import { Button } from '../../ui/Button';
import './EmptyState.css';

export interface EmptyStateProps {
  /** Icon to display */
  icon?: ReactNode;
  /** Title text */
  title: string;
  /** Description text */
  description?: string;
  /** Primary action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Secondary action */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional class */
  className?: string;
}

/**
 * Empty state for lists and pages.
 * 
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<SearchIcon />}
 *   title="No questions found"
 *   description="Try adjusting your filters or create a new question."
 *   action={{
 *     label: "Create Question",
 *     onClick: () => navigate('/questions/new')
 *   }}
 * />
 * ```
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  size = 'md',
  className,
}: EmptyStateProps) {
  return (
    <div className={clsx('empty-state', `empty-state--${size}`, className)}>
      {/* Icon */}
      {icon && (
        <div className="empty-state__icon" aria-hidden="true">
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className="empty-state__title">{title}</h3>

      {/* Description */}
      {description && (
        <p className="empty-state__description">{description}</p>
      )}

      {/* Actions */}
      {(action ?? secondaryAction) && (
        <div className="empty-state__actions">
          {action && (
            <Button variant="primary" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="ghost" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Default empty icon (box with question mark)
 */
export function EmptyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
