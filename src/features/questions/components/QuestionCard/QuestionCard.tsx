/**
 * QuestionCard Component
 * 
 * Displays question information in a hoverable card format.
 * Uses GPU-accelerated animations and follows WCAG 2.2 AA compliance.
 */

import { type HTMLAttributes, memo, useCallback } from 'react';
import clsx from 'clsx';
import { Card, CardBody, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/IconButton';
import { getTechnologyTypeLabel } from '@/types';
import type { Question } from '@/types';
import { DifficultyBadge } from '../DifficultyBadge';
import './QuestionCard.css';

export interface QuestionCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  /** Question data to display */
  question: Question;
  /** Callback when card is clicked */
  onClick?: (question: Question) => void;
  /** Callback when edit button is clicked */
  onEdit?: (question: Question) => void;
  /** Callback when delete button is clicked */
  onDelete?: (question: Question) => void;
  /** Show action buttons */
  showActions?: boolean;
}

/**
 * Get badge variant based on technology type
 */
function getTechTypeVariant(type: number): 'primary' | 'success' | 'info' | 'warning' | 'default' {
  if (type === 1) return 'primary';    // Language
  if (type === 2) return 'success';    // Framework
  if (type === 3) return 'warning';    // Library
  if (type === 4) return 'info';       // Database
  if (type === 5) return 'default';    // Tool
  return 'primary';
}

/**
 * Edit icon SVG
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
 * QuestionCard component for displaying question items.
 * 
 * @example
 * ```tsx
 * <QuestionCard
 *   question={question}
 *   onClick={(q) => navigate(`/questions/${q.Id}`)}
 *   onEdit={(q) => openEditModal(q)}
 *   onDelete={(q) => openDeleteConfirm(q)}
 * />
 * ```
 */
export const QuestionCard = memo(function QuestionCard({
  question,
  onClick,
  onEdit,
  onDelete,
  showActions = true,
  className,
  ...props
}: QuestionCardProps) {
  const handleCardClick = useCallback(() => {
    onClick?.(question);
  }, [onClick, question]);

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(question);
  }, [onEdit, question]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(question);
  }, [onDelete, question]);

  return (
    <Card
      isHoverable
      isClickable={!!onClick}
      onClick={handleCardClick}
      className={clsx('question-card', className)}
      padding="none"
      {...props}
    >
      <CardBody className="question-card__body">
        <div className="question-card__header">
          <h3 className="question-card__title">{question.Title}</h3>
          <DifficultyBadge level={question.DifficultyLevel} />
        </div>
        
        {question.Description && (
          <p className="question-card__description">
            {question.Description.length > 150 
              ? `${question.Description.substring(0, 150)}...` 
              : question.Description}
          </p>
        )}

        <div className="question-card__meta">
          {question.Technology && (
            <Badge 
              variant={getTechTypeVariant(question.Technology.TechnologyType)} 
              size="sm"
            >
              {question.Technology.Name}
            </Badge>
          )}
          {!question.Technology && question.TechnologyId && (
            <Badge variant="default" size="sm">
              {getTechnologyTypeLabel(1)}
            </Badge>
          )}
        </div>
      </CardBody>

      {showActions && (onEdit || onDelete) && (
        <CardFooter className="question-card__footer">
          {onEdit && (
            <IconButton
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              aria-label={`Edit ${question.Title}`}
              title="Edit"
              icon={EditIcon}
            />
          )}
          {onDelete && (
            <IconButton
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              aria-label={`Delete ${question.Title}`}
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
