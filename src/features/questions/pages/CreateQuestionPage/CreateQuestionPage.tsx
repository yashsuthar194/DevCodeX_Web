/**
 * CreateQuestionPage
 * 
 * Page wrapper for creating a new question.
 */

import { useNavigate } from 'react-router';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/feedback/Toast';
import { useCreateQuestion } from '../../hooks';
import { QuestionForm } from '../../components';
import type { CreateQuestionRequest } from '@/types';
import './CreateQuestionPage.css';

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
 * Page for creating a new question.
 */
export default function CreateQuestionPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const createQuestion = useCreateQuestion();

  const handleBack = () => {
    void navigate('/questions');
  };

  const handleSubmit = async (data: CreateQuestionRequest) => {
    try {
      const response = await createQuestion.mutateAsync(data);
      if (response.Status === 'Succeeded' && response.Data) {
        addToast({ variant: 'success', title: 'Question created successfully' });
        void navigate(`/questions/${response.Data.Id}`);
      } else {
        addToast({ variant: 'error', title: response.Message ?? 'Failed to create question' });
      }
    } catch {
      addToast({ variant: 'error', title: 'An error occurred while creating the question' });
    }
  };

  return (
    <div className="page">
      {/* SEO: Page title */}
      <title>Create Question | DevCodeX</title>
      <meta 
        name="description" 
        content="Create a new interview question for your preparation collection." 
      />

      <div className="page__header">
        <div className="create-question__nav">
          <Button variant="ghost" onClick={handleBack} leftIcon={BackIcon}>
            Back to Questions
          </Button>
        </div>
        <h1>Create Question</h1>
        <p>Add a new interview question to your collection.</p>
      </div>

      <section className="page__section">
        <Card>
          <CardBody>
            <QuestionForm
              onSubmit={(data) => { void handleSubmit(data); }}
              onCancel={handleBack}
              isLoading={createQuestion.isPending}
              submitLabel="Create Question"
            />
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
