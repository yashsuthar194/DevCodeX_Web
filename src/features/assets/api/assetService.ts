/**
 * Asset Service
 * 
 * Service for Asset CRUD operations.
 * Uses functional object pattern with direct API calls.
 * 
 * @see DevCodeX_API/Controllers/AssetController.cs
 */

import { get, post, put, del } from '@/core/api';
import { API_ENDPOINTS } from '@/core/config';
import type { ApiResponse } from '@/core/api';
import type { 
  Asset, 
  CreateAssetRequest,
  UpdateAssetRequest,
  PaginationParams 
} from '@/types';

/**
 * Asset Service - Functional object for API operations
 */
export const assetService = {
  /**
   * Get all assets (no pagination)
   */
  getAll: (): Promise<ApiResponse<Asset[]>> => 
    get<Asset[]>(API_ENDPOINTS.assets),

  /**
   * Get paginated list with filters (POST to /list)
   */
  getList: (filter: PaginationParams): Promise<ApiResponse<Asset[]>> =>
    post<Asset[]>(`${API_ENDPOINTS.assets}/list`, filter),

  /**
   * Get asset by ID
   */
  getById: (id: string): Promise<ApiResponse<Asset>> =>
    get<Asset>(`${API_ENDPOINTS.assets}/${id}`),

  /**
   * Create new asset
   */
  create: (data: CreateAssetRequest): Promise<ApiResponse<Asset>> =>
    post<Asset>(API_ENDPOINTS.assets, data),

  /**
   * Update existing asset
   */
  update: (id: string, data: UpdateAssetRequest): Promise<ApiResponse<Asset>> =>
    put<Asset>(`${API_ENDPOINTS.assets}/${id}`, data),

  /**
   * Delete asset
   */
  delete: (id: string): Promise<ApiResponse<boolean>> =>
    del<boolean>(`${API_ENDPOINTS.assets}/${id}`),
};
