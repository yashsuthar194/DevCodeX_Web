/**
 * Answers Feature Exports
 */

// API
export { answerService } from './api';

// Hooks (NOTE: useAnswer removed - Answer ID now comes from QuestionDetailDto)
export { useSaveAnswer, useDeleteAnswer, useAutoSave } from './hooks';
export type { AutoSaveStatus } from './hooks';

// Components
export { AnswerEditor, MarkdownPreview, SaveStatus } from './components';
export type { AnswerEditorProps, MarkdownPreviewProps, SaveStatusProps } from './components';

