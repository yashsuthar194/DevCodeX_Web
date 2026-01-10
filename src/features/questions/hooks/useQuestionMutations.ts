/**
 * Question Mutation Hooks
 * 
 * TanStack Query mutation hooks for create, update, and delete operations.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/core/config';
import { questionService } from '../api/questionService';
import type { CreateQuestionRequest, UpdateQuestionRequest } from '@/types';

/**
 * Hook to create a new question
 */
export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuestionRequest) => questionService.create(data),
    onSuccess: (response) => {
      if (response.Status === 'Succeeded') {
        void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.questions.all });
      }
    },
  });
}

/**
 * Hook to update an existing question
 */
export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateQuestionRequest }) =>
      questionService.update(id, data),
    onSuccess: (response, { id }) => {
      if (response.Status === 'Succeeded') {
        void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.questions.all });
        void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.questions.detail(id) });
      }
    },
  });
}

/**
 * Hook to delete a question
 */
export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => questionService.delete(id),
    onSuccess: (response) => {
      if (response.Status === 'Succeeded') {
        void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.questions.all });
      }
    },
  });
}
