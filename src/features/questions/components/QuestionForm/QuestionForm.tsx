/* eslint-disable @typescript-eslint/no-misused-promises */
/**
 * QuestionForm Component
 * 
 * Form for creating and editing questions.
 * Uses React Hook Form with Zod validation.
 */

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { TechnologySelect } from '../TechnologySelect';
import { DifficultySelect } from '../DifficultySelect';
import { DifficultyLevel, type Question, type CreateQuestionRequest } from '@/types';
import './QuestionForm.css';

/**
 * Zod schema for question validation
 * Matches backend validation rules
 */
const questionSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be 200 characters or less'),
  description: z
    .string()
    .max(2000, 'Description must be 2000 characters or less')
    .optional()
    .or(z.literal('')),
  technologyId: z
    .string()
    .uuid('Please select a technology'),
  difficultyLevel: z
    .number()
    .min(1, 'Please select a difficulty level')
    .max(4, 'Invalid difficulty level'),
});

type QuestionFormData = z.infer<typeof questionSchema>;

export interface QuestionFormProps {
  /** Initial values for edit mode */
  defaultValues?: Partial<Question>;
  /** Submit callback */
  onSubmit: (data: CreateQuestionRequest) => void;
  /** Cancel callback */
  onCancel?: () => void;
  /** Loading state */
  isLoading?: boolean;
  /** Submit button text */
  submitLabel?: string;
}

/**
 * Form component for creating/editing questions.
 * 
 * @example
 * ```tsx
 * <QuestionForm
 *   onSubmit={(data) => createQuestion(data)}
 *   onCancel={() => navigate(-1)}
 *   isLoading={isPending}
 * />
 * ```
 */
export function QuestionForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = 'Save Question',
}: QuestionFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: defaultValues?.Title ?? '',
      description: defaultValues?.Description ?? '',
      technologyId: defaultValues?.TechnologyId ?? '',
      difficultyLevel: defaultValues?.DifficultyLevel ?? DifficultyLevel.Beginner,
    },
  });

  const handleFormSubmit = (data: QuestionFormData) => {
    onSubmit({
      Title: data.title,
      Description: data.description ?? undefined,
      TechnologyId: data.technologyId,
      DifficultyLevel: data.difficultyLevel as typeof DifficultyLevel[keyof typeof DifficultyLevel],
    });
  };

  return (
    <form 
      className="question-form" 
      onSubmit={(e) => { void handleSubmit(handleFormSubmit)(e); }}
      noValidate
    >
      <div className="question-form__field">
        <Input
          id="title"
          label="Question Title"
          placeholder="e.g., Explain the difference between var, let, and const"
          error={errors.title?.message}
          disabled={isLoading}
          {...register('title')}
        />
      </div>

      <div className="question-form__row">
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <div className="question-form__field">
          <Controller
            name="technologyId"
            control={control}
            render={({ field }) => (
              <TechnologySelect
                label="Technology"
                value={field.value}
                onChange={(val) => void field.onChange(val ?? '')}
                error={errors.technologyId?.message}
                disabled={isLoading}
              />
            )}
          />
        </div>

        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <div className="question-form__field">
          <Controller
            name="difficultyLevel"
            control={control}
            render={({ field }) => (
              <DifficultySelect
                label="Difficulty Level"
                value={field.value as typeof DifficultyLevel[keyof typeof DifficultyLevel]}
                onChange={(val) => void field.onChange(val ?? DifficultyLevel.Beginner)}
                error={errors.difficultyLevel?.message}
                disabled={isLoading}
              />
            )}
          />
        </div>
      </div>

      <div className="question-form__field">
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              id="description"
              label="Description"
              placeholder="Add additional context, code snippets, or clarifying details..."
              hint="Optional. Max 2000 characters."
              minRows={4}
              maxLength={2000}
              showCharCount
              error={errors.description?.message}
              disabled={isLoading}
              value={field.value ?? ''}
              onChange={(value) => { field.onChange(value); }}
            />
          )}
        />
      </div>

      <div className="question-form__actions">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
