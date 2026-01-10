/**
 * MainLayout Component
 * 
 * Root layout wrapper with Header, Sidebar, and main content area.
 */

import { type ReactNode, useState } from 'react';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import './MainLayout.css';

export interface MainLayoutProps {
  /** Page content */
  children: ReactNode;
}

/**
 * Main application layout with responsive sidebar.
 * 
 * @example
 * ```tsx
 * <MainLayout>
 *   <h1>Page Title</h1>
 *   <p>Page content</p>
 * </MainLayout>
 * ```
 */
export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="layout">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Header 
        onMenuToggle={handleMenuToggle} 
        isSidebarOpen={isSidebarOpen} 
      />
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={handleSidebarClose} 
      />

      <main id="main-content" className="layout__main">
        <div className="layout__content">
          {children}
        </div>
      </main>
    </div>
  );
}
