/**
 * Questions Feature Module
 *
 * Public exports for the questions feature.
 */

// API
export { questionService } from './api';

// Hooks
export {
  useQuestions,
  useQuestion,
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
} from './hooks';

// Components
export {
  DifficultyBadge,
  DifficultySelect,
  TechnologySelect,
  QuestionCard,
  QuestionFilters,
  QuestionForm,
} from './components';

// Pages (lazy loaded via routes.tsx)
// export { QuestionsPage, QuestionDetailPage, CreateQuestionPage, EditQuestionPage } from './pages';
