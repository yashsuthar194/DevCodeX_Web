/**
 * QuestionDetailPage
 * 
 * Displays detailed view of a single question with answer.
 * Supports inline answer editing without navigating away.
 */

import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/Button';
import { Badge, DIFFICULTY_VARIANTS, DIFFICULTY_LABELS } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';
import { Skeleton } from '@/components/feedback/Skeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { useToast } from '@/components/feedback/Toast';
import { useQuestion } from '../../hooks';
import { MarkdownPreview, AnswerEditor, useSaveAnswer } from '@/features/answers';
import './QuestionDetailPage.css';

/**
 * Back arrow icon
 */
const BackIcon = (
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
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

/**
 * Edit icon
 */
const EditIcon = (
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
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

/**
 * Question detail page component with inline answer editing.
 */
export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const { data: question, isLoading, error, refetch } = useQuestion(id);
  const saveAnswer = useSaveAnswer();
  
  // Inline editing state
  const [isEditingAnswer, setIsEditingAnswer] = useState(false);

  const handleBack = () => {
    void navigate('/questions');
  };

  const handleEditQuestion = () => {
    void navigate(`/questions/${id}/edit`);
  };

  const handleEditAnswer = () => {
    setIsEditingAnswer(true);
  };

  const handleCancelEdit = () => {
    setIsEditingAnswer(false);
  };

  const handleSaveAnswer = useCallback(async (content: string) => {
    if (!id || !question?.AnswerId) return;
    
    try {
      const response = await saveAnswer.mutateAsync({
        questionId: id,
        answerId: question.AnswerId,
        content,
      });
      
      if (response.Status === 'Succeeded') {
        // Refetch question to update the displayed answer
        void refetch();
      } else {
        addToast({ variant: 'error', title: response.Message ?? 'Failed to save answer' });
      }
    } catch {
      addToast({ variant: 'error', title: 'An error occurred while saving the answer' });
    }
  }, [id, question?.AnswerId, saveAnswer, refetch, addToast]);

  if (isLoading) {
    return (
      <div className="page">
        <div className="question-detail__nav">
          <Skeleton variant="rectangular" width={100} height={36} />
        </div>
        <div className="question-detail__content">
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="rectangular" height={24} width={120} />
          <Skeleton variant="rectangular" height={200} />
        </div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="page">
        <div className="question-detail__nav">
          <Button variant="ghost" onClick={handleBack} leftIcon={BackIcon}>
            Back to Questions
          </Button>
        </div>
        <EmptyState
          title="Question not found"
          description="The question you're looking for doesn't exist or has been deleted."
          action={{ label: 'Go to Questions', onClick: handleBack }}
          icon={
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          }
        />
      </div>
    );
  }

  // Get answer content from question DTO
  const answerContent = question.AnswerContent ?? '';
  const hasAnswer = answerContent.length > 0;

  return (
    <div className="page">
      {/* SEO: React 19 native metadata */}
      <title>{question.Title} | DevCodeX</title>
      <meta 
        name="description" 
        content={question.Description ?? `Interview question: ${question.Title}`} 
      />

      <nav className="question-detail__nav" aria-label="Breadcrumb">
        <Button variant="ghost" onClick={handleBack} leftIcon={BackIcon}>
          Back to Questions
        </Button>
      </nav>

      <article className="question-detail__content">
        <header className="question-detail__header">
          <h1 className="question-detail__title">{question.Title}</h1>
          <div className="question-detail__badges">
            <Badge variant={DIFFICULTY_VARIANTS[question.DifficultyLevel]}>
              {DIFFICULTY_LABELS[question.DifficultyLevel]}
            </Badge>
            {question.TechnologyName && (
              <Badge variant="info">{question.TechnologyName}</Badge>
            )}
          </div>
        </header>

        {question.Description && (
          <section className="question-detail__description">
            <h2>Description</h2>
            <p>{question.Description}</p>
          </section>
        )}

        {/* Answer Section with Inline Editing */}
        <section className="question-detail__answer">
          <Card>
            <div className="question-detail__answer-header">
              {!isEditingAnswer && hasAnswer && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleEditAnswer}
                  leftIcon={EditIcon}
                >
                  Edit
                </Button>
              )}
            </div>
            <CardBody>
              {isEditingAnswer ? (
                <AnswerEditor
                  initialContent={answerContent}
                  onSave={handleSaveAnswer}
                  onCancel={handleCancelEdit}
                  autoSave={true}
                  autoSaveDelay={1000}
                />
              ) : hasAnswer ? (
                <MarkdownPreview content={answerContent} />
              ) : (
                <EmptyState
                  title="No answer yet"
                  description="This question doesn't have an answer. Click below to add one."
                  action={{ label: 'Write Answer', onClick: handleEditAnswer }}
                />
              )}
            </CardBody>
          </Card>
        </section>

        <div className="question-detail__actions">
          <Button variant="primary" onClick={handleEditQuestion} leftIcon={EditIcon}>
            Edit Question
          </Button>
          <Button variant="outline" onClick={handleBack}>
            Back to List
          </Button>
        </div>
      </article>
    </div>
  );
}
