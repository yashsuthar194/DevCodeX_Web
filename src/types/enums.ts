/**
 * DevCodeX Enum Definitions
 * 
 * These enums use specific integer values to match the C# backend.
 * Using const objects with type unions for TypeScript 5.9+ compatibility.
 * 
 * @see database-schema.md for backend enum definitions
 */

/**
 * Question difficulty levels
 * Values match backend DifficultyLevel enum exactly
 */
export const DifficultyLevel = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Expert: 4,
} as const;

export type DifficultyLevel = (typeof DifficultyLevel)[keyof typeof DifficultyLevel];

/**
 * Technology classification types
 */
export const TechnologyType = {
  Language: 1,
  Framework: 2,
  Library: 3,
  Database: 4,
  Tool: 5,
} as const;

export type TechnologyType = (typeof TechnologyType)[keyof typeof TechnologyType];

/**
 * Helper to get display label for DifficultyLevel
 */
export function getDifficultyLabel(level: DifficultyLevel): string {
  const labels: Record<DifficultyLevel, string> = {
    [DifficultyLevel.Beginner]: 'Beginner',
    [DifficultyLevel.Intermediate]: 'Intermediate',
    [DifficultyLevel.Advanced]: 'Advanced',
    [DifficultyLevel.Expert]: 'Expert',
  };
  return labels[level];
}

/**
 * Helper to get display label for TechnologyType
 */
export function getTechnologyTypeLabel(type: TechnologyType): string {
  const labels: Record<TechnologyType, string> = {
    [TechnologyType.Language]: 'Language',
    [TechnologyType.Framework]: 'Framework',
    [TechnologyType.Database]: 'Database',
    [TechnologyType.Tool]: 'Tool',
    [TechnologyType.Library]: 'Library',
  };
  return labels[type];
}

/**
 * Get all difficulty levels as options for dropdowns
 */
export function getDifficultyOptions(): { value: DifficultyLevel; label: string }[] {
  return [
    { value: DifficultyLevel.Beginner, label: 'Beginner' },
    { value: DifficultyLevel.Intermediate, label: 'Intermediate' },
    { value: DifficultyLevel.Advanced, label: 'Advanced' },
    { value: DifficultyLevel.Expert, label: 'Expert' },
  ];
}

/**
 * Get all technology types as options for dropdowns
 */
export function getTechnologyTypeOptions(): { value: TechnologyType; label: string }[] {
  return [
    { value: TechnologyType.Language, label: 'Language' },
    { value: TechnologyType.Framework, label: 'Framework' },
    { value: TechnologyType.Database, label: 'Database' },
    { value: TechnologyType.Tool, label: 'Tool' },
    { value: TechnologyType.Library, label: 'Library' },
  ];
}
