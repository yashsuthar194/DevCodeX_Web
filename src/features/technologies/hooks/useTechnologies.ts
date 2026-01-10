/**
 * useTechnologies Hook
 * 
 * TanStack Query hook for fetching all technologies.
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/core/config';
import { technologyService } from '../api/technologyService';

/**
 * Hook to fetch all technologies
 */
export function useTechnologies() {
  return useQuery({
    queryKey: QUERY_KEYS.technologies.list(),
    queryFn: async () => {
      const response = await technologyService.getAll();
      if (response.Status === 'Succeeded') {
        return response.Data ?? [];
      }
      throw new Error(response.Message ?? 'Failed to fetch technologies');
    },
  });
}
