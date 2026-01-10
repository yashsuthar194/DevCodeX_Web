/**
 * DevCodeX Environment Configuration
 * 
 * Type-safe access to environment variables.
 * All env vars should be accessed through this module.
 */

/**
 * Environment configuration interface
 */
interface Environment {
  /** API base URL */
  API_BASE_URL: string;
  
  /** Current environment mode */
  MODE: 'development' | 'production' | 'test';
  
  /** Is development environment */
  IS_DEV: boolean;
  
  /** Is production environment */
  IS_PROD: boolean;
  
  /** App name */
  APP_NAME: string;
  
  /** App version */
  APP_VERSION: string;
}

/**
 * Get environment variable with fallback
 */
function getEnvVar(key: string, fallback = ''): string {
  return import.meta.env[key] as string ?? fallback;
}

/**
 * Validated environment configuration
 */
export const env: Environment = {
  API_BASE_URL: getEnvVar('VITE_API_BASE_URL', 'http://localhost:5151/api'),
  MODE: (import.meta.env.MODE as Environment['MODE']) || 'development',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  APP_NAME: getEnvVar('VITE_APP_NAME', 'DevCodeX'),
  APP_VERSION: getEnvVar('VITE_APP_VERSION', '0.0.0'),
};

/**
 * Validate required environment variables
 * Call this early in app initialization
 */
export function validateEnv(): void {
  const required: (keyof Environment)[] = ['API_BASE_URL'];
  
  for (const key of required) {
    if (!env[key]) {
      console.warn(`Missing required environment variable: ${key}`);
    }
  }
}
