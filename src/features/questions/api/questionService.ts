/**
 * Question Service
 * 
 * Service for Question CRUD operations.
 * Uses functional object pattern with direct API calls.
 * 
 * @see DevCodeX_API/Controllers/QuestionController.cs
 */

import { get, post, put, del } from '@/core/api';
import { API_ENDPOINTS } from '@/core/config';
import type { ApiResponse } from '@/core/api';
import type { 
  Question, 
  CreateQuestionRequest, 
  UpdateQuestionRequest,
  QuestionListFilter,
  QuestionDetailDto,
} from '@/types';

/**
 * Question Service - Functional object for API operations
 */
export const questionService = {
  /**
   * Get all questions (no pagination)
   */
  getAll: (): Promise<ApiResponse<Question[]>> => 
    get<Question[]>(API_ENDPOINTS.questions),

  /**
   * Get paginated list with filters (POST to /list)
   */
  getList: (filter: QuestionListFilter): Promise<ApiResponse<Question[]>> =>
    post<Question[]>(`${API_ENDPOINTS.questions}/list`, filter),

  /**
   * Get question by ID (returns detail DTO with answer)
   */
  getById: (id: string): Promise<ApiResponse<QuestionDetailDto>> =>
    get<QuestionDetailDto>(`${API_ENDPOINTS.questions}/${id}`),

  /**
   * Create new question
   */
  create: (data: CreateQuestionRequest): Promise<ApiResponse<Question>> =>
    post<Question>(API_ENDPOINTS.questions, data),

  /**
   * Update existing question
   */
  update: (id: string, data: UpdateQuestionRequest): Promise<ApiResponse<Question>> =>
    put<Question>(`${API_ENDPOINTS.questions}/${id}`, data),

  /**
   * Delete question
   */
  delete: (id: string): Promise<ApiResponse<boolean>> =>
    del<boolean>(`${API_ENDPOINTS.questions}/${id}`),
};
