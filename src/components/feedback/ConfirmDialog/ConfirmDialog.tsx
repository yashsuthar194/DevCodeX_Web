/**
 * ConfirmDialog Component
 * 
 * Confirmation modal for destructive actions.
 */

import { type ReactNode } from 'react';
import { Modal, ModalFooter } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import './ConfirmDialog.css';

export interface ConfirmDialogProps {
  /** Whether dialog is visible */
  isOpen: boolean;
  /** Close callback */
  onClose: () => void;
  /** Confirm callback */
  onConfirm: () => void;
  /** Dialog title */
  title: string;
  /** Dialog message */
  message: ReactNode;
  /** Confirm button text */
  confirmLabel?: string;
  /** Cancel button text */
  cancelLabel?: string;
  /** Variant for confirm button */
  variant?: 'destructive' | 'primary';
  /** Loading state for confirm button */
  isLoading?: boolean;
}

/**
 * Confirmation dialog for delete and other destructive actions.
 * 
 * @example
 * ```tsx
 * <ConfirmDialog
 *   isOpen={showConfirm}
 *   onClose={() => setShowConfirm(false)}
 *   onConfirm={handleDelete}
 *   title="Delete Question?"
 *   message="This action cannot be undone. The question and all its answers will be permanently deleted."
 *   confirmLabel="Delete"
 *   variant="destructive"
 *   isLoading={isDeleting}
 * />
 * ```
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'destructive',
  isLoading = false,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      closeOnBackdrop={!isLoading}
      closeOnEscape={!isLoading}
    >
      <div className="confirm-dialog__content">
        {/* Icon */}
        <div className={`confirm-dialog__icon confirm-dialog__icon--${variant}`}>
          {variant === 'destructive' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          )}
        </div>

        {/* Message */}
        <p className="confirm-dialog__message">{message}</p>
      </div>

      <ModalFooter>
        <Button
          variant="ghost"
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={variant === 'destructive' ? 'destructive' : 'primary'}
          onClick={handleConfirm}
          isLoading={isLoading}
        >
          {confirmLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
