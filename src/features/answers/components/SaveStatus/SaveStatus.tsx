/**
 * SaveStatus Component
 * 
 * Visual indicator for auto-save status.
 * Shows saving spinner, saved checkmark, or error state.
 */

import { type FC } from 'react';
import clsx from 'clsx';
import type { AutoSaveStatus } from '../../hooks';
import './SaveStatus.css';

export interface SaveStatusProps {
  /** Current save status */
  status: AutoSaveStatus;
  /** Additional CSS class */
  className?: string;
}

/**
 * Save status indicator component.
 * 
 * @example
 * ```tsx
 * <SaveStatus status="saving" />
 * ```
 */
export const SaveStatus: FC<SaveStatusProps> = ({ status, className }) => {
  if (status === 'idle') {
    return null;
  }

  return (
    <div 
      className={clsx('save-status', `save-status--${status}`, className)}
      role="status"
      aria-live="polite"
    >
      {status === 'saving' && (
        <>
          <span className="save-status__spinner" aria-hidden="true" />
          <span className="save-status__text">Saving...</span>
        </>
      )}
      
      {status === 'saved' && (
        <>
          <svg 
            className="save-status__icon" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="save-status__text">Saved</span>
        </>
      )}
      
      {status === 'error' && (
        <>
          <svg 
            className="save-status__icon" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span className="save-status__text">Save failed</span>
        </>
      )}
    </div>
  );
};
