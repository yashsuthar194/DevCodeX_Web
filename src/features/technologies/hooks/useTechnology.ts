/**
 * useTechnology Hook
 * 
 * TanStack Query hook for fetching a single technology by ID.
 */

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/core/config';
import { technologyService } from '../api/technologyService';

/**
 * Hook to fetch a single technology by ID
 * 
 * @param id - Technology ID (GUID)
 */
export function useTechnology(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.technologies.detail(id),
    queryFn: async () => {
      const response = await technologyService.getById(id);
      if (response.Status === 'Succeeded') {
        return response.Data;
      }
      throw new Error(response.Message ?? 'Failed to fetch technology');
    },
    enabled: !!id,
  });
}
