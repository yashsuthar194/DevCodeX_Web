/**
 * useAnswer Hook
 * 
 * TanStack Query hook for fetching a single answer by question ID.
 * Supports 1:1 Question-Answer relationship.
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/core/config';
import { answerService } from '../api/answerService';

/**
 * Hook to fetch the answer for a specific question (1:1 relationship)
 */
export function useAnswer(questionId: string | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEYS.answers.all, 'byQuestion', questionId],
    queryFn: async () => {
      if (!questionId) throw new Error('Question ID is required');
      
      const response = await answerService.getByQuestionId(questionId);
      if (response.Status === 'Succeeded') {
        return response.Data;
      }
      throw new Error(response.Message ?? 'Failed to fetch answer');
    },
    enabled: !!questionId,
  });
}
