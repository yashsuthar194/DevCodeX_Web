/**
 * DevCodeX Root Application Component
 * 
 * Main application shell that wraps all content with providers
 * and renders the router outlet.
 */

import { Providers } from '@/app/providers';
import { AppRoutes } from '@/app/routes';
import { validateEnv } from '@/core/config';
import { useEffect } from 'react';

/**
 * Root application component
 */
export function App() {
  // Validate environment on mount
  useEffect(() => {
    validateEnv();
  }, []);

  return (
    <Providers>
      <AppRoutes />
    </Providers>
  );
}

export default App;
