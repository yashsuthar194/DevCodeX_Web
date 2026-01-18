/**
 * Technology Service
 * 
 * Service for Technology CRUD operations.
 * Uses functional object pattern with direct API calls.
 * 
 * @see DevCodeX_API/Controllers/TechnologyController.cs
 */

import { get, post, put, del } from '@/core/api';
import { API_ENDPOINTS } from '@/core/config';
import type { ApiResponse } from '@/core/api';
import type { 
  Technology,
  TechnologyListDto,
  CreateTechnologyRequest, 
  UpdateTechnologyRequest,
  TechnologyListFilter 
} from '@/types';

/**
 * Technology Service - Functional object for API operations
 */
export const technologyService = {
  /**
   * Get all technologies (no pagination)
   */
  getAll: (): Promise<ApiResponse<Technology[]>> => 
    get<Technology[]>(API_ENDPOINTS.technologies),

  /**
   * Get paginated list with filters (POST to /list)
   * Returns TechnologyListDto with QuestionCount
   */
  getList: (filter: TechnologyListFilter): Promise<ApiResponse<TechnologyListDto[]>> =>
    post<TechnologyListDto[]>(`${API_ENDPOINTS.technologies}/list`, filter),

  /**
   * Get technology by ID
   */
  getById: (id: string): Promise<ApiResponse<Technology>> =>
    get<Technology>(`${API_ENDPOINTS.technologies}/${id}`),

  /**
   * Create new technology
   */
  create: (data: CreateTechnologyRequest): Promise<ApiResponse<Technology>> =>
    post<Technology>(API_ENDPOINTS.technologies, data),

  /**
   * Update existing technology
   */
  update: (id: string, data: UpdateTechnologyRequest): Promise<ApiResponse<Technology>> =>
    put<Technology>(`${API_ENDPOINTS.technologies}/${id}`, data),

  /**
   * Delete technology
   */
  delete: (id: string): Promise<ApiResponse<boolean>> =>
    del<boolean>(`${API_ENDPOINTS.technologies}/${id}`),
};
