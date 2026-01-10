/**
 * DevCodeX Filter Types
 * 
 * These types match the C# Filter classes from the backend.
 * Used for paginated list endpoints (POST /list).
 * 
 * @see DevCodeX_API/Data/Shared/Filter.cs
 * @see DevCodeX_API/Data/Filters/QuestionFilter.cs
 */

import type { DifficultyLevel } from './enums';

/**
 * Base pagination/filter parameters
 * Matches C# Filter class
 */
export interface PaginationParams {
  /** Page number (1-indexed), default: 1 */
  PageIndex: number;
  
  /** Number of items per page, default: 10 */
  PageSize: number;
  
  /** Search query string */
  Query?: string;
  
  /** Date filter */
  Date?: string;
}

/**
 * Filter for Question list endpoint
 * Matches C# QuestionFilter class
 */
export interface QuestionListFilter extends PaginationParams {
  /** Filter by technology ID */
  TechnologyId?: string;
  
  /** Filter by difficulty level */
  DifficultyLevel?: DifficultyLevel;
}

/**
 * Filter for Technology list endpoint
 * Uses base pagination only
 */
export type TechnologyListFilter = PaginationParams;

/**
 * Default pagination values
 */
export const DEFAULT_PAGINATION: PaginationParams = {
  PageIndex: 1,
  PageSize: 10,
};
