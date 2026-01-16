/**
 * DevCodeX API Client
 *
 * Centralized Axios instance with request/response interceptors.
 * Handles authentication, error transformation, and request configuration.
 *
 * @see docs/architecture/api-layer.md for detailed documentation
 */

import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import type { ApiResponse, ApiError } from "./types";
import { env } from "@/core/config/env";

/**
 * Create and configure the Axios instance
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: env.VITE_API_BASE_URL,
    timeout: 300000, // 30 seconds
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Request Interceptor
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Add auth token if available
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Log requests in development
      if (env.IS_DEV) {
        console.debug(
          `[API] ${config.method?.toUpperCase() ?? "UNKNOWN"} ${config.url ?? ""}`,
        );
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    },
  );

  // Response Interceptor
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Return only the data from successful responses
      return response;
    },
    (error: AxiosError<ApiResponse<unknown>>) => {
      // Transform error into consistent format
      const apiError = transformError(error);
      return Promise.reject(new Error(apiError.message));
    },
  );

  return client;
};

/**
 * Get authentication token from storage
 * TODO: Implement actual auth token retrieval
 */
function getAuthToken(): string | null {
  // Placeholder for auth implementation
  // Will be replaced when authentication is implemented
  return localStorage.getItem("auth_token");
}

/**
 * Transform Axios error into consistent ApiError format
 */
function transformError(error: AxiosError<ApiResponse<unknown>>): ApiError {
  if (error.response) {
    // Server responded with error status
    return {
      status: "Failed",
      statusCode: error.response.status,
      message:
        error.response.data?.Message ??
        getDefaultErrorMessage(error.response.status),
      errors: undefined, // Message is usually enough, but if there's validation errors they might be in Data or a specific field
    };
  }

  if (error.request) {
    // Request made but no response received
    return {
      status: "Failed",
      statusCode: 0,
      message: "Network error. Please check your connection.",
    };
  }

  // Something happened in setting up the request
  return {
    status: "Failed",
    statusCode: 0,
    message: error.message || "An unexpected error occurred.",
  };
}

/**
 * Get default error message based on HTTP status code
 */
function getDefaultErrorMessage(statusCode: number): string {
  const messages: Record<number, string> = {
    400: "Bad request. Please check your input.",
    401: "Unauthorized. Please log in again.",
    403: "Forbidden. You do not have permission.",
    404: "Resource not found.",
    422: "Validation error. Please check your data.",
    429: "Too many requests. Please try again later.",
    500: "Server error. Please try again later.",
    502: "Bad gateway. Please try again later.",
    503: "Service unavailable. Please try again later.",
  };

  return messages[statusCode] || "Something went wrong.";
}

/**
 * Configured Axios client instance
 */
export const apiClient = createApiClient();

/**
 * Helper function for GET requests with typed response
 */
export async function get<T>(
  url: string,
  params?: Record<string, unknown>,
): Promise<ApiResponse<T>> {
  const response = await apiClient.get<ApiResponse<T>>(url, { params });
  return response.data;
}

/**
 * Helper function for POST requests with typed response
 */
export async function post<T, D = unknown>(
  url: string,
  data?: D,
): Promise<ApiResponse<T>> {
  const response = await apiClient.post<ApiResponse<T>>(url, data);
  return response.data;
}

/**
 * Helper function for PUT requests with typed response
 */
export async function put<T, D = unknown>(
  url: string,
  data?: D,
): Promise<ApiResponse<T>> {
  const response = await apiClient.put<ApiResponse<T>>(url, data);
  return response.data;
}

/**
 * Helper function for PATCH requests with typed response
 */
export async function patch<T, D = unknown>(
  url: string,
  data?: D,
): Promise<ApiResponse<T>> {
  const response = await apiClient.patch<ApiResponse<T>>(url, data);
  return response.data;
}

/**
 * Helper function for DELETE requests with typed response
 */
export async function del<T>(url: string): Promise<ApiResponse<T>> {
  const response = await apiClient.delete<ApiResponse<T>>(url);
  return response.data;
}
