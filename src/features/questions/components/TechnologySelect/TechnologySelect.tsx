/**
 * TechnologySelect Component
 * 
 * Dropdown for selecting a technology from available options.
 * Fetches technologies using useTechnologies hook.
 */

import { Select } from '@/components/ui/Select';
import { useTechnologies } from '@/features/technologies/hooks';

export interface TechnologySelectProps {
  /** Current selected value (technology ID) */
  value?: string;
  /** Change handler */
  onChange: (value: string | undefined) => void;
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
 * Technology dropdown selector.
 * Fetches available technologies and displays them as options.
 */
export function TechnologySelect({
  value,
  onChange,
  label = 'Technology',
  error,
  disabled = false,
  placeholder = 'Select technology...',
}: TechnologySelectProps) {
  const { data: technologies = [], isLoading } = useTechnologies();

  const options = technologies.map((tech) => ({
    value: tech.Id,
    label: tech.Name,
  }));

  const handleChange = (val: string | number | undefined) => {
    if (val === undefined) {
      onChange(undefined);
    } else {
      onChange(val.toString());
    }
  };

  return (
    <Select
      label={label}
      value={value}
      onChange={handleChange}
      options={options}
      placeholder={isLoading ? 'Loading...' : placeholder}
      error={error}
      disabled={disabled || isLoading}
      isSearchable
      isClearable
      searchDebounceMs={150}
    />
  );
}
