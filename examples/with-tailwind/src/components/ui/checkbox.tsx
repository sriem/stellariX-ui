import React, { useEffect, useState } from 'react';
import { createCheckbox } from '@stellarix-ui/checkbox';
import { reactAdapter } from '@stellarix-ui/react';
import { cn } from '../../lib/utils';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'onChange'> {
  checked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean | 'indeterminate') => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, indeterminate, onCheckedChange, ...props }, ref) => {
    const checkbox = createCheckbox({
      ...props,
      checked: checked || false,
      indeterminate: indeterminate || false,
      onChange: onCheckedChange,
    });

    const [state, setState] = useState(() => checkbox.state.getState());

    useEffect(() => {
      const unsubscribe = checkbox.state.subscribe(setState);
      return unsubscribe;
    }, []);

    const ReactCheckbox = checkbox.connect(reactAdapter);

    return (
      <ReactCheckbox
        ref={ref}
        className={cn(
          'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
          'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground',
          className
        )}
        data-state={
          state.indeterminate ? 'indeterminate' : state.checked ? 'checked' : 'unchecked'
        }
        {...props}
      >
        <span className="flex items-center justify-center text-current">
          {state.indeterminate ? (
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
            >
              <path
                d="M3.5 7.5H11.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : state.checked ? (
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
            >
              <path
                d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          ) : null}
        </span>
      </ReactCheckbox>
    );
  }
);

Checkbox.displayName = 'Checkbox';