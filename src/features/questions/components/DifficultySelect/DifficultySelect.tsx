/**
 * DifficultySelect Component
 * 
 * Dropdown for selecting question difficulty level.
 */

import { Select } from '@/components/ui/Select';
import { getDifficultyOptions, type DifficultyLevel } from '@/types';

export interface DifficultySelectProps {
  /** Current selected value */
  value?: DifficultyLevel;
  /** Change handler */
  onChange: (value: DifficultyLevel | undefined) => void;
  /** Label text */
  label?: string;
  /** Error message */
  error?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Placeholder text */
  placeholder?: string;
}

/**
 * Difficulty level dropdown selector.
 */
export function DifficultySelect({
  value,
  onChange,
  label = 'Difficulty',
  error,
  disabled = false,
  placeholder = 'Select difficulty...',
}: DifficultySelectProps) {
  const options = getDifficultyOptions().map((opt) => ({
    value: opt.value,
    label: opt.label,
  }));

  const handleChange = (val: string | number | undefined) => {
    if (val === undefined) {
      onChange(undefined);
    } else {
      // value is already a number in this case
      onChange(val as DifficultyLevel);
    }
  };

  return (
    <Select
      label={label}
      value={value}
      onChange={handleChange}
      options={options}
      placeholder={placeholder}
      error={error}
      disabled={disabled}
      isClearable
    />
  );
}
