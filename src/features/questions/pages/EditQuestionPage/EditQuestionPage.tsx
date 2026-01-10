/**
 * EditQuestionPage
 * 
 * Page wrapper for editing an existing question.
 * Includes AnswerEditor for 1:1 question-answer management.
 */

import { useParams, useNavigate } from 'react-router';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/feedback/Skeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { useToast } from '@/components/feedback/Toast';
import { useQuestion, useUpdateQuestion } from '../../hooks';
import { QuestionForm } from '../../components';
import { useSaveAnswer, AnswerEditor } from '@/features/answers';
import type { CreateQuestionRequest } from '@/types';
import './EditQuestionPage.css';

/**
 * Back icon SVG
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
 * Page for editing an existing question.
 */
export default function EditQuestionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const { data: question, isLoading, error } = useQuestion(id);
  const updateQuestion = useUpdateQuestion();
  const saveAnswer = useSaveAnswer();

  const handleBack = () => {
    if (id) {
      void navigate(`/questions/${id}`);
    } else {
      void navigate('/questions');
    }
  };

  const handleBackToList = () => {
    void navigate('/questions');
  };

  const handleSubmit = async (data: CreateQuestionRequest) => {
    if (!id) return;
    
    try {
      const response = await updateQuestion.mutateAsync({ 
        id, 
        data: {
          Title: data.Title,
          Description: data.Description,
          TechnologyId: data.TechnologyId,
          DifficultyLevel: data.DifficultyLevel,
        } 
      });
      if (response.Status === 'Succeeded') {
        addToast({ variant: 'success', title: 'Question updated successfully' });
        void navigate(`/questions/${id}`);
      } else {
        addToast({ variant: 'error', title: response.Message ?? 'Failed to update question' });
      }
    } catch {
      addToast({ variant: 'error', title: 'An error occurred while updating the question' });
    }
  };

  const handleSaveAnswer = async (content: string) => {
    if (!id || !question?.AnswerId) return;
    
    try {
      const response = await saveAnswer.mutateAsync({
        questionId: id,
        answerId: question.AnswerId,
        content,
      });
      
      if (response.Status === 'Succeeded') {
        addToast({ variant: 'success', title: 'Answer saved successfully' });
      } else {
        addToast({ variant: 'error', title: response.Message ?? 'Failed to save answer' });
      }
    } catch {
      addToast({ variant: 'error', title: 'An error occurred while saving the answer' });
    }
  };

  if (isLoading) {
    return (
      <div className="page">
        <title>Loading... | DevCodeX</title>
        <div className="page__header">
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="text" width="40%" height={20} />
        </div>
        <div className="page__section mt-4">
          <Skeleton variant="rectangular" height={300} />
        </div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="page">
        <title>Question Not Found | DevCodeX</title>
        <EmptyState
          title="Question not found"
          description="The question you're trying to edit doesn't exist or has been deleted."
          action={{ label: 'Back to Questions', onClick: handleBackToList }}
        />
      </div>
    );
  }

  return (
    <div className="page">
      {/* SEO: Dynamic page title */}
      <title>Edit: {question.Title} | DevCodeX</title>
      <meta 
        name="description" 
        content={`Edit interview question: ${question.Title}`} 
      />

      <div className="page__header">
        <div className="edit-question__nav">
          <Button variant="ghost" onClick={handleBack} leftIcon={BackIcon}>
            Back to Question
          </Button>
        </div>
        <h1>Edit Question</h1>
        <p>Update the question details and answer below.</p>
      </div>

      {/* Question Form */}
      <section className="page__section">
        <Card>
          <CardBody>
            <QuestionForm
              defaultValues={question}
              onSubmit={(data) => { void handleSubmit(data); }}
              onCancel={handleBack}
              isLoading={updateQuestion.isPending}
              submitLabel="Save Changes"
            />
          </CardBody>
        </Card>
      </section>

      {/* Answer Editor */}
      <section className="page__section edit-question__answer-section">
        <Card>
          <div className="edit-question__answer-header">
            <p className="edit-question__answer-hint">
              Write the answer in Markdown format. Supports code blocks, tables, and more.
            </p>
          </div>
          <CardBody>
            <AnswerEditor
              initialContent={question.AnswerContent ?? ''}
              onSave={handleSaveAnswer}
              isSaving={saveAnswer.isPending}
            />
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
