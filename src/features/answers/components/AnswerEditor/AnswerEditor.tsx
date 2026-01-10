/**
 * AnswerEditor Component
 * 
 * Markdown editor for creating/editing question answers.
 * Features auto-save with debounce and visual status indicator.
 * 
 * OPTIMIZATION: 
 * - MDEditor is lazy loaded to reduce initial bundle size
 * - Keyboard event listeners use stable refs to prevent re-registration
 */

import { useState, useCallback, useEffect, useRef, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/Button';
import { SaveStatus } from '../SaveStatus';
import { useAutoSave } from '../../hooks/useAutoSave';
import './AnswerEditor.css';

// Lazy load the heavy markdown editor
const MDEditor = lazy(() => import('@uiw/react-md-editor'));

// Loading skeleton for the editor
function EditorSkeleton() {
  return (
    <div className="answer-editor__skeleton" style={{ height: 400 }}>
      <div className="answer-editor__skeleton-toolbar" />
      <div className="answer-editor__skeleton-content" />
    </div>
  );
}

export interface AnswerEditorProps {
  /** Initial markdown content */
  initialContent?: string;
  /** Save callback - must return a promise */
  onSave: (content: string) => Promise<void>;
  /** Loading state for manual save button */
  isSaving?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Enable auto-save (default: true) */
  autoSave?: boolean;
  /** Auto-save debounce delay in ms (default: 1000) */
  autoSaveDelay?: number;
  /** Cancel callback for inline editing */
  onCancel?: () => void;
}

/**
 * Markdown editor component for answers with auto-save.
 * 
 * @example
 * ```tsx
 * <AnswerEditor
 *   initialContent="# Hello"
 *   onSave={async (content) => await saveAnswer(content)}
 *   autoSave={true}
 * />
 * ```
 */
export function AnswerEditor({
  initialContent = '',
  onSave,
  isSaving = false,
  disabled = false,
  autoSave = true,
  autoSaveDelay = 1000,
  onCancel,
}: AnswerEditorProps) {
  const [content, setContent] = useState(initialContent);

  // Auto-save hook
  const { status: autoSaveStatus, forceSave, hasUnsavedChanges } = useAutoSave(
    content,
    onSave,
    {
      debounceMs: autoSaveDelay,
      enabled: autoSave && !disabled,
    }
  );

  // Update content when initialContent changes (e.g., on reload)
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleChange = useCallback((value: string | undefined) => {
    setContent(value ?? '');
  }, []);

  // Manual save (also used for Ctrl+S)
  const handleManualSave = useCallback(async () => {
    if (autoSave) {
      await forceSave();
    } else {
      await onSave(content);
    }
  }, [autoSave, forceSave, onSave, content]);

  // ============================================
  // STABLE REFS PATTERN FOR KEYBOARD SHORTCUTS
  // ============================================
  // Using refs to hold latest callback values prevents
  // re-registration of event listeners on every render
  
  const handleManualSaveRef = useRef(handleManualSave);
  const onCancelRef = useRef(onCancel);

  // Keep refs updated with latest values
  useEffect(() => {
    handleManualSaveRef.current = handleManualSave;
  });

  useEffect(() => {
    onCancelRef.current = onCancel;
  });

  // Keyboard shortcuts - registered only once on mount
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        void handleManualSaveRef.current();
      }
      // Escape to cancel (if onCancel provided)
      if (e.key === 'Escape' && onCancelRef.current) {
        onCancelRef.current();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []); // Empty deps = listener registered only once

  // Determine display status
  const displayStatus = isSaving ? 'saving' : autoSaveStatus;

  return (
    <div className="answer-editor" data-color-mode="auto">
      <div className="answer-editor__header">
        <div className="answer-editor__info">
          <span className="answer-editor__label">Write your answer in Markdown</span>
          <SaveStatus status={displayStatus} />
          {!autoSave && hasUnsavedChanges && (
            <span className="answer-editor__unsaved">Unsaved changes</span>
          )}
        </div>
        <div className="answer-editor__actions">
          {onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={disabled || isSaving}
            >
              Cancel
            </Button>
          )}
          {!autoSave && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => { void handleManualSave(); }}
              disabled={disabled || isSaving || !hasUnsavedChanges}
              isLoading={isSaving}
            >
              Save Answer
            </Button>
          )}
        </div>
      </div>
      
      <Suspense fallback={<EditorSkeleton />}>
        <MDEditor
          value={content}
          onChange={handleChange}
          height={400}
          preview="live"
          hideToolbar={false}
          enableScroll={true}
          textareaProps={{
            placeholder: 'Write your answer here using Markdown...\n\n# Heading\n**Bold** and *italic* text\n```code blocks```\n- Lists',
            disabled: disabled || isSaving,
          }}
        />
      </Suspense>
      
      <div className="answer-editor__footer">
        <span className="answer-editor__char-count">
          {content.length.toLocaleString()} characters
        </span>
        {autoSave && (
          <span className="answer-editor__hint">
            Auto-saves after you stop typing • Ctrl+S to save now
          </span>
        )}
      </div>
    </div>
  );
}
