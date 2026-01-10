/**
 * SidebarLink Component
 * 
 * Navigation link for sidebar with active state.
 */

import { type ReactNode } from 'react';
import { NavLink } from 'react-router';
import clsx from 'clsx';
import './SidebarLink.css';

export interface SidebarLinkProps {
  /** Route path */
  to: string;
  /** Optional icon */
  icon?: ReactNode;
  /** Link text */
  children: ReactNode;
  /** Callback when link is clicked */
  onClick?: () => void;
}

/**
 * Navigation link with active state styling.
 */
export function SidebarLink({ to, icon, children, onClick }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx('sidebar-link', isActive && 'sidebar-link--active')
      }
      onClick={onClick}
    >
      {icon && <span className="sidebar-link__icon">{icon}</span>}
      <span className="sidebar-link__text">{children}</span>
    </NavLink>
  );
}
