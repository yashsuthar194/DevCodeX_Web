/**
 * DifficultyBadge Component
 * 
 * Badge displaying question difficulty level with semantic colors.
 * Follows WCAG 2.2 AA color contrast requirements.
 */

import { Badge, type BadgeProps } from '@/components/ui/Badge';
import { DifficultyLevel, getDifficultyLabel } from '@/types';
import './DifficultyBadge.css';

export interface DifficultyBadgeProps extends Omit<BadgeProps, 'variant' | 'children'> {
  /** Difficulty level value */
  level: DifficultyLevel;
}

/**
 * Get badge variant based on difficulty level
 */
function getVariant(level: DifficultyLevel): BadgeProps['variant'] {
  switch (level) {
    case DifficultyLevel.Beginner:
      return 'success';
    case DifficultyLevel.Intermediate:
      return 'info';
    case DifficultyLevel.Advanced:
      return 'warning';
    case DifficultyLevel.Expert:
      return 'error';
    default:
      return 'default';
  }
}

/**
 * DifficultyBadge component for displaying question difficulty.
 * 
 * @example
 * ```tsx
 * <DifficultyBadge level={DifficultyLevel.Intermediate} />
 * ```
 */
export function DifficultyBadge({ level, ...props }: DifficultyBadgeProps) {
  return (
    <Badge 
      variant={getVariant(level)} 
      size="sm" 
      isPill
      {...props}
    >
      {getDifficultyLabel(level)}
    </Badge>
  );
}
