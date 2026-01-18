/**
 * useTechnologies Hook
 * 
 * TanStack Query hook for fetching all technologies with QuestionCount.
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/core/config';
import { technologyService } from '../api/technologyService';

/**
 * Hook to fetch all technologies with question counts
 */
export function useTechnologies() {
  return useQuery({
    queryKey: QUERY_KEYS.technologies.list(),
    queryFn: async () => {
      // Use getList to get TechnologyListDto with QuestionCount
      const response = await technologyService.getList({
        PageIndex: 1,
        PageSize: 100, // Get all technologies
      });
      if (response.Status === 'Succeeded') {
        return response.Data ?? [];
      }
      throw new Error(response.Message ?? 'Failed to fetch technologies');
    },
  });
}
