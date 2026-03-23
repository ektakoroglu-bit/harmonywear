'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  placeholder?: string;
  options: string[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, placeholder, options, id, required, disabled, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-charcoal mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            required={required}
            disabled={disabled}
            className={cn(
              'w-full border rounded-lg px-3.5 py-2.5 text-sm text-charcoal appearance-none',
              'bg-white transition-colors duration-200 cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-rose-blush focus:border-transparent',
              'disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400',
              error ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className={cn(
              'absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors',
              disabled ? 'text-gray-300' : 'text-gray-400'
            )}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
