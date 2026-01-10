/**
 * UI Stores Module (Zustand)
 * 
 * Global UI state management using Zustand.
 * Stores user preferences, theme, modal states, etc.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/core/config';

type Theme = 'light' | 'dark' | 'system';

interface UIState {
  /** Current theme setting */
  theme: Theme;
  
  /** Sidebar collapsed state */
  sidebarCollapsed: boolean;
  
  /** Actions */
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
}

/**
 * UI Store
 * 
 * Manages global UI state with persistence.
 * Theme preference is persisted to localStorage.
 */
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      sidebarCollapsed: false,
      
      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },
      
      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },
    }),
    {
      name: STORAGE_KEYS.theme,
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme);
        }
      },
    }
  )
);

/**
 * Apply theme to document
 */
function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  
  if (theme === 'system') {
    // Remove data-theme to let CSS handle system preference
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', theme);
  }
}

/**
 * Initialize theme on app load
 * Call this in App component
 */
export function initializeTheme(): void {
  const state = useUIStore.getState();
  applyTheme(state.theme);
}
