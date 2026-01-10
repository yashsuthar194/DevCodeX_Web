/**
 * QuestionsPage
 * 
 * Main questions list page with filtering and CRUD operations.
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/feedback/Skeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog';
import { useToast } from '@/components/feedback/Toast';
import { useQuestions, useDeleteQuestion } from '../../hooks';
import { QuestionCard, QuestionFilters } from '../../components';
import type { Question, QuestionFilters as FilterType } from '@/types';
import './QuestionsPage.css';

/**
 * Add icon SVG
 */
const AddIcon = (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

/**
 * Questions list page with filtering and CRUD.
 */
export default function QuestionsPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [filters, setFilters] = useState<FilterType>({});
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);
  
  const { data: questions = [], isLoading, error } = useQuestions(filters);
  const deleteQuestion = useDeleteQuestion();

  const handleCardClick = useCallback((question: Question) => {
    void navigate(`/questions/${question.Id}`);
  }, [navigate]);

  const handleEdit = useCallback((question: Question) => {
    void navigate(`/questions/${question.Id}/edit`);
  }, [navigate]);

  const handleDeleteClick = useCallback((question: Question) => {
    setQuestionToDelete(question);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!questionToDelete) return;
    
    try {
      const response = await deleteQuestion.mutateAsync(questionToDelete.Id);
      if (response.Status === 'Succeeded') {
        addToast({ variant: 'success', title: 'Question deleted successfully' });
      } else {
        addToast({ variant: 'error', title: response.Message ?? 'Failed to delete question' });
      }
    } catch {
      addToast({ variant: 'error', title: 'An error occurred while deleting' });
    } finally {
      setQuestionToDelete(null);
    }
  }, [questionToDelete, deleteQuestion, addToast]);

  const handleDeleteClose = useCallback(() => {
    setQuestionToDelete(null);
  }, []);

  const handleAddQuestion = useCallback(() => {
    void navigate('/questions/new');
  }, [navigate]);

  return (
    <div className="page">
      {/* SEO: React 19 native metadata */}
      <title>Questions | DevCodeX</title>
      <meta 
        name="description" 
        content="Browse and manage interview questions for software engineering roles." 
      />

      <div className="page__header">
        <div className="questions-page__title-row">
          <div>
            <h1>Questions</h1>
            <p>Browse and manage interview questions.</p>
          </div>
          <Button 
            variant="primary" 
            onClick={handleAddQuestion}
            leftIcon={AddIcon}
          >
            Add Question
          </Button>
        </div>
      </div>

      <section className="page__section">
        <QuestionFilters filters={filters} onChange={setFilters} />
      </section>

      <section className="page__section mt-4">
        {isLoading && (
          <div className="questions-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={160} />
            ))}
          </div>
        )}

        {error && (
          <EmptyState
            title="Error loading questions"
            description="Something went wrong while fetching questions. Please try again."
            icon={
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            }
          />
        )}

        {!isLoading && !error && questions.length === 0 && (
          <EmptyState
            title="No questions found"
            description={
              filters.technologyId || filters.difficultyLevel
                ? "No questions match your filters. Try adjusting them."
                : "Get started by adding your first interview question."
            }
            action={
              !filters.technologyId && !filters.difficultyLevel
                ? { label: 'Add Question', onClick: handleAddQuestion }
                : undefined
            }
          />
        )}

        {!isLoading && !error && questions.length > 0 && (
          <div className="questions-grid">
            {questions.map((question) => (
              <QuestionCard
                key={question.Id}
                question={question}
                onClick={handleCardClick}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </section>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={!!questionToDelete}
        onClose={handleDeleteClose}
        onConfirm={() => { void handleDeleteConfirm(); }}
        title="Delete Question"
        message={`Are you sure you want to delete "${questionToDelete?.Title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={deleteQuestion.isPending}
      />
    </div>
  );
}
