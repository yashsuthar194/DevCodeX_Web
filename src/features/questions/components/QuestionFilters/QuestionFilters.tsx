/**
 * QuestionFilters Component
 * 
 * Filter bar for questions list with search, technology and difficulty filters.
 */

import { useState, useCallback, useEffect } from 'react';
import type { DifficultyLevel, QuestionFilters as FilterType } from '@/types';
import { useDebounce } from '@/core/hooks';
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
 * Filter bar component for questions list with search and dropdowns.
 * 
 * @example
 * ```tsx
 * const [filters, setFilters] = useState<QuestionFilters>({});
 * <QuestionFilters filters={filters} onChange={setFilters} />
 * ```
 */
export function QuestionFilters({ filters, onChange }: QuestionFiltersProps) {
  // Local search state for debouncing
  const [searchInput, setSearchInput] = useState(filters.query ?? '');
  const debouncedSearch = useDebounce(searchInput, 300);

  // Update filters when debounced search changes
  useEffect(() => {
    if (debouncedSearch !== filters.query) {
      onChange({ ...filters, query: debouncedSearch || undefined });
    }
  }, [debouncedSearch, filters, onChange]);

  const handleTechnologyChange = useCallback((technologyId: string | undefined) => {
    onChange({ ...filters, technologyId });
  }, [onChange, filters]);

  const handleDifficultyChange = useCallback((difficultyLevel: DifficultyLevel | undefined) => {
    onChange({ ...filters, difficultyLevel });
  }, [onChange, filters]);

  return (
    <div className="question-filters">
      <input
        type="search"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search questions..."
        className="question-filters__search"
        aria-label="Search questions"
      />
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
