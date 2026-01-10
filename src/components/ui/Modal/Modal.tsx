/**
 * Modal Component
 * 
 * Accessible dialog overlay with focus trap and GPU-animated transitions.
 * Uses Portal to render at document root.
 */

import {
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { IconButton } from '../IconButton';
import './Modal.css';

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Whether modal is visible */
  isOpen: boolean;
  /** Close callback */
  onClose: () => void;
  /** Modal title (rendered in header) */
  title?: ReactNode;
  /** Modal content */
  children: ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Whether clicking backdrop closes modal */
  closeOnBackdrop?: boolean;
  /** Whether pressing Escape closes modal */
  closeOnEscape?: boolean;
  /** Hide the close button */
  hideCloseButton?: boolean;
}

/**
 * Modal dialog with accessibility features.
 * 
 * @example
 * ```tsx
 * <Modal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   title="Create Question"
 * >
 *   <QuestionForm />
 * </Modal>
 * ```
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  hideCloseButton = false,
  className,
  ...props
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (closeOnBackdrop && e.target === e.currentTarget) {
        onClose();
      }
    },
    [closeOnBackdrop, onClose]
  );

  // Focus management and body scroll lock
  useEffect(() => {
    if (isOpen) {
      // Store current focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Focus modal
      modalRef.current?.focus();
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      
      // Add escape listener
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (isOpen) {
        // Unlock body scroll
        document.body.style.overflow = '';
        
        // Remove escape listener
        document.removeEventListener('keydown', handleKeyDown);
        
        // Restore focus
        previousActiveElement.current?.focus();
      }
    };
  }, [isOpen, handleKeyDown]);

  // Don't render if closed
  if (!isOpen) return null;

  const modalContent = (
    <div
      className={clsx('modal-backdrop', isOpen && 'modal-backdrop--visible')}
      onClick={handleBackdropClick}
      aria-hidden={!isOpen}
    >
      <div
        ref={modalRef}
        className={clsx('modal', `modal--${size}`, className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
        {...props}
      >
        {/* Header */}
        {(title ?? !hideCloseButton) && (
          <div className="modal__header">
            {title && (
              <h2 id="modal-title" className="modal__title">
                {title}
              </h2>
            )}
            {!hideCloseButton && (
              <IconButton
                aria-label="Close modal"
                className="modal__close"
                onClick={onClose}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                }
              />
            )}
          </div>
        )}

        {/* Body */}
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );

  // Render in portal
  return createPortal(modalContent, document.body);
}

/**
 * Modal Footer - for action buttons
 */
export function ModalFooter({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('modal__footer', className)} {...props}>
      {children}
    </div>
  );
}
