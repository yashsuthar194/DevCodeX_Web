/**
 * QuestionFilters Component
 * 
 * Filter bar for questions list with technology and difficulty dropdowns.
 */

import { useCallback } from 'react';
import type { DifficultyLevel, QuestionFilters as FilterType } from '@/types';
import { TechnologySelect } from '../TechnologySelect';
import { DifficultySelect } from '../DifficultySelect';
import './QuestionFilters.css';

export interface QuestionFiltersProps {
  /** Current filter values */
  filters: FilterType;
  /** Filter change handler */
  onChange: (filters: FilterType) => void;
}

/**
 * Filter bar component for questions list.
 * 
 * @example
 * ```tsx
 * const [filters, setFilters] = useState<QuestionFilters>({});
 * <QuestionFilters filters={filters} onChange={setFilters} />
 * ```
 */
export function QuestionFilters({ filters, onChange }: QuestionFiltersProps) {
  const handleTechnologyChange = useCallback((technologyId: string | undefined) => {
    onChange({ ...filters, technologyId });
  }, [onChange, filters]);

  const handleDifficultyChange = useCallback((difficultyLevel: DifficultyLevel | undefined) => {
    onChange({ ...filters, difficultyLevel });
  }, [onChange, filters]);

  return (
    <div className="question-filters">
      <TechnologySelect
        value={filters.technologyId}
        onChange={handleTechnologyChange}
        label="Technology"
        placeholder="All Technologies"
      />
      <DifficultySelect
        value={filters.difficultyLevel}
        onChange={handleDifficultyChange}
        label="Difficulty"
        placeholder="All Levels"
      />
    </div>
  );
}
