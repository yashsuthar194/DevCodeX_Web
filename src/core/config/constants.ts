/**
 * DevCodeX Application Constants
 * 
 * Centralized constants used throughout the application.
 */

/**
 * Query keys for TanStack Query
 * Using arrays for proper cache invalidation
 */
export const QUERY_KEYS = {
  questions: {
    all: ['questions'] as const,
    list: (filters?: Record<string, unknown>) => [...QUERY_KEYS.questions.all, 'list', filters] as const,
    detail: (id: string) => [...QUERY_KEYS.questions.all, 'detail', id] as const,
  },
  technologies: {
    all: ['technologies'] as const,
    list: () => [...QUERY_KEYS.technologies.all, 'list'] as const,
    detail: (id: string) => [...QUERY_KEYS.technologies.all, 'detail', id] as const,
  },
  answers: {
    all: ['answers'] as const,
    byQuestion: (questionId: string) => [...QUERY_KEYS.answers.all, 'byQuestion', questionId] as const,
    detail: (id: string) => [...QUERY_KEYS.answers.all, 'detail', id] as const,
  },
  assets: {
    all: ['assets'] as const,
    byParent: (parentId: string) => [...QUERY_KEYS.assets.all, 'byParent', parentId] as const,
  },
} as const;

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  questions: '/question',
  technologies: '/technology',
  answers: '/answer',
  assets: '/asset',
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  theme: 'devcodex_theme',
  authToken: 'auth_token',
  user: 'devcodex_user',
} as const;

/**
 * Default pagination settings
 */
export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],
} as const;

/**
 * TanStack Query default options
 */
export const QUERY_DEFAULTS = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  retry: 1,
  refetchOnWindowFocus: false,
} as const;
