/**
 * Sidebar Component
 * 
 * Main navigation sidebar with GPU-accelerated animations.
 */

import { SidebarLink } from '../SidebarLink';
import './Sidebar.css';

export interface SidebarProps {
  /** Whether sidebar is open (mobile) */
  isOpen: boolean;
  /** Callback to close sidebar */
  onClose: () => void;
}

/**
 * Application sidebar with navigation links.
 * Uses GPU-accelerated transform for slide animation.
 */
export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className={`sidebar-backdrop ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        id="sidebar-nav"
        className={`sidebar ${isOpen ? 'open' : ''}`}
        aria-label="Main navigation"
      >
        <nav className="sidebar__nav">
          <div className="sidebar__section">
            <h2 className="sidebar__section-title">Menu</h2>
            <ul className="sidebar__links">
              <li>
                <SidebarLink
                  to="/"
                  onClick={onClose}
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  }
                >
                  Dashboard
                </SidebarLink>
              </li>
              <li>
                <SidebarLink
                  to="/questions"
                  onClick={onClose}
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  }
                >
                  Questions
                </SidebarLink>
              </li>
              <li>
                <SidebarLink
                  to="/technologies"
                  onClick={onClose}
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                  }
                >
                  Technologies
                </SidebarLink>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
}
