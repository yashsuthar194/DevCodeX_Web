/**
 * useQuestions Hook
 * 
 * TanStack Query hook for fetching questions with optional filters.
 * Uses POST /list endpoint for paginated results.
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/core/config';
import { questionService } from '../api/questionService';
import type { QuestionListFilter, QuestionFilters } from '@/types';

/**
 * Transform camelCase filters from UI to PascalCase for API
 */
const createApiFilter = (
  filters?: QuestionFilters,
  pagination?: { pageIndex?: number; pageSize?: number }
): QuestionListFilter => ({
  PageIndex: pagination?.pageIndex ?? 1,
  PageSize: pagination?.pageSize ?? 10,
  TechnologyId: filters?.technologyId,
  DifficultyLevel: filters?.difficultyLevel,
});

/**
 * Hook to fetch questions with optional filters
 */
export function useQuestions(
  filters?: QuestionFilters,
  pagination?: { pageIndex?: number; pageSize?: number }
) {
  return useQuery({
    queryKey: QUERY_KEYS.questions.list({ ...filters, ...pagination } as Record<string, unknown> | undefined),
    queryFn: async () => {
      const response = await questionService.getList(createApiFilter(filters, pagination));
      if (response.IsSuccess) {
        return response.Data ?? [];
      }
      throw new Error(response.Message ?? 'Failed to fetch questions');
    },
  });
}

