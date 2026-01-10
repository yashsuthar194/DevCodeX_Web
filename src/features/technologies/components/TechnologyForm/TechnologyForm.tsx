/**
 * TechnologyForm Component
 * 
 * Form for creating and editing technologies.
 * Uses React Hook Form with Zod validation.
 */

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { TechnologyTypeSelect } from '../TechnologyTypeSelect';
import { TechnologyType, type Technology, type CreateTechnologyRequest } from '@/types';
import './TechnologyForm.css';

/**
 * Zod schema for technology validation
 * Matches backend validation rules
 */
const technologySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less'),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .or(z.literal('')),
  technologyType: z
    .number()
    .min(0, 'Technology type is required')
    .max(5, 'Invalid technology type'),
});

type TechnologyFormData = z.infer<typeof technologySchema>;

export interface TechnologyFormProps {
  /** Initial values for edit mode */
  defaultValues?: Partial<Technology>;
  /** Submit callback */
  onSubmit: (data: CreateTechnologyRequest) => void;
  /** Cancel callback */
  onCancel?: () => void;
  /** Loading state */
  isLoading?: boolean;
  /** Submit button text */
  submitLabel?: string;
}

/**
 * Form component for creating/editing technologies.
 * 
 * @example
 * ```tsx
 * <TechnologyForm
 *   onSubmit={(data) => createTechnology(data)}
 *   onCancel={() => closeModal()}
 *   isLoading={isPending}
 * />
 * ```
 */
export function TechnologyForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = 'Save',
}: TechnologyFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TechnologyFormData>({
    resolver: zodResolver(technologySchema),
    defaultValues: {
      name: defaultValues?.Name ?? '',
      description: defaultValues?.Description ?? '',
      technologyType: defaultValues?.TechnologyType ?? TechnologyType.Language,
    },
  });

  const handleFormSubmit = (data: TechnologyFormData) => {
    onSubmit({
      Name: data.name,
      Description: data.description ?? undefined,
      TechnologyType: data.technologyType as typeof TechnologyType[keyof typeof TechnologyType],
    });
  };

  return (
    <form 
      className="technology-form" 
      onSubmit={(e) => { void handleSubmit(handleFormSubmit)(e); }}
      noValidate
    >
      <div className="technology-form__field">
        <Input
          id="name"
          label="Name"
          placeholder="e.g., React, TypeScript, PostgreSQL"
          error={errors.name?.message}
          disabled={isLoading}
          {...register('name')}
        />
      </div>

      <div className="technology-form__field">
        <Controller
          name="technologyType"
          control={control}
          render={({ field }) => (
            <TechnologyTypeSelect
              label="Type"
              value={field.value as typeof TechnologyType[keyof typeof TechnologyType]}
              onChange={field.onChange}
              error={errors.technologyType?.message}
              disabled={isLoading}
            />
          )}
        />
      </div>

      <div className="technology-form__field">
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              id="description"
              label="Description"
              placeholder="Brief description of this technology..."
              hint="Optional. Max 500 characters."
              minRows={3}
              maxLength={500}
              showCharCount
              error={errors.description?.message}
              disabled={isLoading}
              value={field.value ?? ''}
              onChange={(value) => { void field.onChange(value); }}
            />
          )}
        />
      </div>

      <div className="technology-form__actions">
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
