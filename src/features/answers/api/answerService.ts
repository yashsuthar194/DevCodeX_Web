/**
 * Answer Service
 * 
 * Service for Answer CRUD operations.
 * Uses functional object pattern with direct API calls.
 * 
 * NOTE: Answer is always created when Question is created (via API).
 * So the web only needs to call UPDATE (PUT) for answers.
 * 
 * @see DevCodeX_API/Controllers/AnswerController.cs
 */

import { get, post, put, del } from '@/core/api';
import { API_ENDPOINTS } from '@/core/config';
import type { ApiResponse } from '@/core/api';
import type { 
  Answer, 
  SaveAnswerRequest,
  AnswerDetailDto,
  PaginationParams 
} from '@/types';

/**
 * Answer Service - Functional object for API operations
 */
export const answerService = {
  /**
   * Get all answers (no pagination)
   */
  getAll: (): Promise<ApiResponse<Answer[]>> => 
    get<Answer[]>(API_ENDPOINTS.answers),

  /**
   * Get paginated list with filters (POST to /list)
   */
  getList: (filter: PaginationParams): Promise<ApiResponse<Answer[]>> =>
    post<Answer[]>(`${API_ENDPOINTS.answers}/list`, filter),

  /**
   * Get answer by ID
   */
  getById: (id: string): Promise<ApiResponse<AnswerDetailDto>> =>
    get<AnswerDetailDto>(`${API_ENDPOINTS.answers}/${id}`),

  /**
   * Update existing answer
   * NOTE: This is the primary method used for saving answers,
   * since Answer is created when Question is created.
   */
  update: (id: string, data: SaveAnswerRequest): Promise<ApiResponse<Answer>> =>
    put<Answer>(`${API_ENDPOINTS.answers}/${id}`, data),

  /**
   * Delete answer
   */
  delete: (id: string): Promise<ApiResponse<boolean>> =>
    del<boolean>(`${API_ENDPOINTS.answers}/${id}`),
};

