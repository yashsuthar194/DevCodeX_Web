/**
 * TechnologyTypeSelect Component
 * 
 * Specialized Select component for TechnologyType enum.
 * Pre-populated with technology type options.
 */

import { Select } from '@/components/ui/Select';
import { getTechnologyTypeOptions, type TechnologyType } from '@/types';

export interface TechnologyTypeSelectProps {
  /** Current selected value */
  value?: TechnologyType;
  /** Callback when value changes */
  onChange: (value: TechnologyType | undefined) => void;
  /** Optional label */
  label?: string;
  /** Error message */
  error?: string;
  /** Hint text */
  hint?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Additional class name */
  className?: string;
}

/**
 * Select component pre-configured with TechnologyType options.
 * 
 * @example
 * ```tsx
 * <TechnologyTypeSelect
 *   label="Technology Type"
 *   value={form.technologyType}
 *   onChange={(value) => form.setValue('technologyType', value)}
 * />
 * ```
 */
export function TechnologyTypeSelect({
  value,
  onChange,
  label = 'Technology Type',
  error,
  hint,
  disabled,
  className,
}: TechnologyTypeSelectProps) {
  const options = getTechnologyTypeOptions();

  const handleChange = (newValue: string | number | undefined) => {
    if (newValue === undefined) {
      onChange(undefined);
    } else {
      onChange(newValue as TechnologyType);
    }
  };

  return (
    <Select
      options={options}
      value={value}
      onChange={handleChange}
      label={label}
      error={error}
      hint={hint}
      disabled={disabled}
      className={className}
      placeholder="Select type..."
      isClearable
    />
  );
}
