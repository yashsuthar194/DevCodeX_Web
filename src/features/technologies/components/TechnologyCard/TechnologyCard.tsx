/**
 * TechnologyCard Component
 * 
 * Displays technology information in a hoverable card format.
 * Uses GPU-accelerated animations and follows WCAG 2.2 AA compliance.
 */

import { type HTMLAttributes, memo, useCallback } from 'react';
import clsx from 'clsx';
import { Card, CardBody, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/IconButton';
import { getTechnologyTypeLabel } from '@/types';
import type { Technology } from '@/types';
import './TechnologyCard.css';

export interface TechnologyCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /** Technology data to display */
  technology: Technology;
  /** Callback when card is clicked */
  onClick?: (technology: Technology) => void;
  /** Callback when edit button is clicked */
  onEdit?: (technology: Technology) => void;
  /** Callback when delete button is clicked */
  onDelete?: (technology: Technology) => void;
  /** Show action buttons */
  showActions?: boolean;
}

/**
 * Get badge variant based on technology type
 */
function getTypeVariant(type: number): 'primary' | 'success' | 'info' | 'warning' | 'default' {
  // Using explicit numbers matching Backend/Enum values
  // Language=1, Framework=2, Library=3, Database=4
  if (type === 1) return 'primary';    // Language
  if (type === 2) return 'success';    // Framework
  if (type === 3) return 'warning';    // Library
  if (type === 4) return 'info';       // Database
  if (type === 5) return 'default';    // Tool (Frontend only)
  return 'primary';
}

/**
 * Delete icon SVG
 */
const EditIcon = (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

/**
 * Delete icon SVG
 */
const DeleteIcon = (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

/**
 * TechnologyCard component for displaying technology items.
 * 
 * @example
 * ```tsx
 * <TechnologyCard
 *   technology={technology}
 *   onClick={(t) => navigate(`/technologies/${t.id}`)}
 *   onEdit={(t) => openEditModal(t)}
 *   onDelete={(t) => openDeleteConfirm(t)}
 * />
 * ```
 */
export const TechnologyCard = memo(function TechnologyCard({
  technology,
  onClick,
  onEdit,
  onDelete,
  showActions = true,
  className,
  ...props
}: TechnologyCardProps) {
  const handleCardClick = useCallback(() => {
    onClick?.(technology);
  }, [onClick, technology]);

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(technology);
  }, [onEdit, technology]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(technology);
  }, [onDelete, technology]);

  return (
    <Card
      isHoverable
      isClickable={!!onClick}
      onClick={handleCardClick}
      className={clsx('technology-card', className)}
      padding="none"
      {...props}
    >
      <CardBody className="technology-card__body">
        <div className="technology-card__header">
          <h3 className="technology-card__name">{technology.Name}</h3>
          <Badge 
            variant={getTypeVariant(technology.TechnologyType)} 
            size="sm"
            isPill
          >
            {getTechnologyTypeLabel(technology.TechnologyType)}
          </Badge>
        </div>
        
        {technology.Description && (
          <p className="technology-card__description">
            {technology.Description}
          </p>
        )}
      </CardBody>

      {showActions && (onEdit || onDelete) && (
        <CardFooter className="technology-card__footer">
          {onEdit && (
            <IconButton
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              aria-label={`Edit ${technology.Name}`}
              title="Edit"
              icon={EditIcon}
            />
          )}
          {onDelete && (
            <IconButton
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              aria-label={`Delete ${technology.Name}`}
              title="Delete"
              icon={DeleteIcon}
              className="text-destructive"
            />
          )}
        </CardFooter>
      )}
    </Card>
  );
});
