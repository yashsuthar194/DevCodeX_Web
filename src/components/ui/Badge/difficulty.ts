/**
 * Difficulty Level utilities
 * 
 * Maps DifficultyLevel enum values to Badge variants and labels.
 */

import type { BadgeProps } from './Badge';

/**
 * Pre-configured badge variants for difficulty levels.
 * Maps DifficultyLevel enum values to colors.
 */
export const DIFFICULTY_VARIANTS: Record<number, BadgeProps['variant']> = {
  1: 'success',  // Beginner - Green
  2: 'info',     // Intermediate - Blue
  3: 'warning',  // Advanced - Amber
  4: 'error',    // Expert - Red
};

export const DIFFICULTY_LABELS: Record<number, string> = {
  1: 'Beginner',
  2: 'Intermediate',
  3: 'Advanced',
  4: 'Expert',
};
