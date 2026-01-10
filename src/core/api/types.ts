/**
 * DevCodeX API Response Types
 * 
 * These types match the C# Response<T> class from the backend.
 * @see DevCodeX_API/Data/Responses/Response.cs
 */

/**
 * API response status values
 */
export type ResponseStatus = 'Succeeded' | 'Failed';

/**
 * Pagination metadata returned from list endpoints
 * Matches C# PaginationMeta class
 */
export interface PaginationMeta {
  /** Current page number (1-indexed) */
  PageIndex: number;
  
  /** Number of items per page */
  PageSize: number;
  
  /** Total number of items */
  TotalCount: number;
  
  /** Total number of pages */
  TotalPages: number;
  
  /** Whether there is a next page */
  HasNextPage: boolean;
  
  /** Whether there is a previous page */
  HasPreviousPage: boolean;
}

/**
 * Standard API response wrapper matching backend Response<T> class.
 * 
 * @template T - The type of data returned in the response
 * 
 * @example
 * ```typescript
 * const response: ApiResponse<Question[]> = await questionService.getAll();
 * if (response.IsSuccess) {
 *   console.log(response.Data);
 * }
 * ```
 */
export interface ApiResponse<T> {
  /** Response status: 'Succeeded' or 'Failed' */
  Status: ResponseStatus;
  
  /** Indicates if the operation was successful */
  IsSuccess: boolean;
  
  /** HTTP status code (e.g., 200, 400, 404, 500) */
  StatusCode: number;
  
  /** Optional message providing additional context */
  Message?: string;
  
  /** Response data payload */
  Data?: T;
  
  /** Pagination metadata (for list endpoints) */
  Pagination?: PaginationMeta;
}

/**
 * Error response structure for failed API calls
 */
export interface ApiError {
  status: 'Failed';
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Type guard to check if response is successful
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { Data: T } {
  return response.Status === 'Succeeded' && response.Data !== undefined;
}

/**
 * Type guard to check if response is an error
 */
export function isErrorResponse<T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { Message: string } {
  return response.Status === 'Failed';
}

/**
 * Type guard to check if response has pagination
 */
export function hasPagination<T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { Pagination: PaginationMeta } {
  return response.Pagination !== undefined;
}
