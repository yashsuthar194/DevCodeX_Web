/**
 * Technology Mutation Hooks
 * 
 * TanStack Query mutation hooks for create, update, and delete operations.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/core/config';
import { technologyService } from '../api/technologyService';
import type { CreateTechnologyRequest, UpdateTechnologyRequest } from '@/types';

/**
 * Hook to create a new technology
 */
export function useCreateTechnology() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTechnologyRequest) => technologyService.create(data),
    onSuccess: (response) => {
      if (response.Status === 'Succeeded') {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.technologies.all });
      }
    },
  });
}

/**
 * Hook to update an existing technology
 */
export function useUpdateTechnology() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTechnologyRequest }) =>
      technologyService.update(id, data),
    onSuccess: (response, { id }) => {
      if (response.Status === 'Succeeded') {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.technologies.all });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.technologies.detail(id) });
      }
    },
  });
}

/**
 * Hook to delete a technology
 */
export function useDeleteTechnology() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => technologyService.delete(id),
    onSuccess: (response) => {
      if (response.Status === 'Succeeded') {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.technologies.all });
      }
    },
  });
}
