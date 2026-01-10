/**
 * Header Component
 * 
 * Top navigation bar with branding, theme toggle, and mobile menu.
 */

import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { IconButton } from '@/components/ui/IconButton';
import { Link } from 'react-router';
import './Header.css';

export interface HeaderProps {
  /** Callback when mobile menu button is clicked */
  onMenuToggle: () => void;
  /** Whether sidebar is open */
  isSidebarOpen: boolean;
}

/**
 * Application header with logo, theme toggle, and mobile navigation.
 */
export function Header({ onMenuToggle, isSidebarOpen }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__left">
        {/* Mobile menu button */}
        <IconButton
          aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isSidebarOpen}
          aria-controls="sidebar-nav"
          className="header__menu-button"
          onClick={onMenuToggle}
          icon={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isSidebarOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          }
        />

        {/* Logo */}
        <Link to="/" className="header__logo">
          <svg
            className="header__logo-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
            <line x1="12" y1="2" x2="12" y2="22" />
          </svg>
          <span className="header__logo-text">DevCodeX</span>
        </Link>
      </div>

      <div className="header__right">
        <ThemeToggle />
      </div>
    </header>
  );
}
