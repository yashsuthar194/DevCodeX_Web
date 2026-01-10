/**
 * useSaveAnswer Hook
 * 
 * TanStack Query mutation hook for updating an answer.
 * 
 * NOTE: Answer is always created when Question is created (via API).
 * So the web only needs PUT to update, never POST to create.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/core/config';
import { answerService } from '../api/answerService';

interface SaveAnswerParams {
  questionId: string;
  answerId: string;
  content: string;
}

/**
 * Hook to update an answer for a question.
 * 
 * Since Answer is created alongside Question in the API,
 * this hook always uses PUT (update), never POST (create).
 */
export function useSaveAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ questionId, answerId, content }: SaveAnswerParams) => {
      if (!answerId) {
        throw new Error('Answer ID is required. This should always exist since Answer is created with Question.');
      }

      const data = {
        QuestionId: questionId,
        Content: content,
      };

      // Always use PUT - Answer already exists
      return answerService.update(answerId, data);
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries
      void queryClient.invalidateQueries({ 
        queryKey: [...QUERY_KEYS.answers.all, 'byQuestion', variables.questionId] 
      });
      void queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.questions.detail(variables.questionId) 
      });
    },
  });
}

/**
 * Hook to delete an answer
 */
export function useDeleteAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return answerService.delete(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.answers.all });
    },
  });
}
