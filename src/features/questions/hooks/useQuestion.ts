/**
 * useQuestion Hook
 * 
 * TanStack Query hook for fetching a single question by ID.
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/core/config';
import { questionService } from '../api/questionService';

/**
 * Hook to fetch a single question by ID (includes related data)
 */
export function useQuestion(id: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.questions.detail(id ?? ''),
    queryFn: async () => {
      if (!id) throw new Error('Question ID is required');
      
      const response = await questionService.getById(id);
      if (response.Status === 'Succeeded') {
        return response.Data;
      }
      throw new Error(response.Message ?? 'Failed to fetch question');
    },
    enabled: !!id,
  });
}
