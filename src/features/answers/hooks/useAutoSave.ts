/**
 * useAutoSave Hook
 * 
 * Debounced auto-save functionality for answer content.
 * Automatically saves after user stops typing for specified delay.
 */

import { useState, useEffect, useRef, useCallback } from 'react';

/** Auto-save status states */
export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutoSaveOptions {
  /** Debounce delay in milliseconds */
  debounceMs?: number;
  /** Enable/disable auto-save */
  enabled?: boolean;
  /** Callback when save succeeds */
  onSuccess?: () => void;
  /** Callback when save fails */
  onError?: (error: Error) => void;
}

interface UseAutoSaveReturn {
  /** Current save status */
  status: AutoSaveStatus;
  /** Last saved content for comparison */
  lastSavedContent: string;
  /** Force immediate save */
  forceSave: () => Promise<void>;
  /** Reset status to idle */
  resetStatus: () => void;
  /** Whether there are unsaved changes */
  hasUnsavedChanges: boolean;
}

/**
 * Hook for debounced auto-save functionality.
 * 
 * @example
 * ```tsx
 * const { status, hasUnsavedChanges } = useAutoSave(
 *   content,
 *   async (content) => await saveAnswer(content),
 *   { debounceMs: 1000, enabled: true }
 * );
 * ```
 */
export function useAutoSave(
  content: string,
  onSave: (content: string) => Promise<void>,
  options: UseAutoSaveOptions = {}
): UseAutoSaveReturn {
  const {
    debounceMs = 1000,
    enabled = true,
    onSuccess,
    onError,
  } = options;

  const [status, setStatus] = useState<AutoSaveStatus>('idle');
  const lastSavedContentRef = useRef(content);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  // Track mounted state to prevent updates after unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Save function
  const performSave = useCallback(async (contentToSave: string) => {
    if (!isMountedRef.current) return;
    
    setStatus('saving');
    try {
      await onSave(contentToSave);
      if (isMountedRef.current) {
        lastSavedContentRef.current = contentToSave;
        setStatus('saved');
        onSuccess?.();
        
        // Auto-reset to idle after 2 seconds
        setTimeout(() => {
          if (isMountedRef.current) {
            setStatus('idle');
          }
        }, 2000);
      }
    } catch (error) {
      if (isMountedRef.current) {
        setStatus('error');
        onError?.(error instanceof Error ? error : new Error('Save failed'));
      }
    }
  }, [onSave, onSuccess, onError]);

  // Debounced auto-save effect
  useEffect(() => {
    if (!enabled) return;
    if (content === lastSavedContentRef.current) return;

    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new debounced timer
    timerRef.current = setTimeout(() => {
      void performSave(content);
    }, debounceMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [content, enabled, debounceMs, performSave]);

  // Force save immediately
  const forceSave = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    await performSave(content);
  }, [content, performSave]);

  // Reset status
  const resetStatus = useCallback(() => {
    setStatus('idle');
  }, []);

  return {
    status,
    lastSavedContent: lastSavedContentRef.current,
    forceSave,
    resetStatus,
    hasUnsavedChanges: content !== lastSavedContentRef.current,
  };
}
