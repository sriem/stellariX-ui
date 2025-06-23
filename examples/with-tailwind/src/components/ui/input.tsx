import React, { useEffect, useState } from 'react';
import { createInput } from '@stellarix-ui/input';
import { reactAdapter } from '@stellarix-ui/react';
import { cn } from '../../lib/utils';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  error?: boolean;
  errorMessage?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-8 px-2 text-sm',
  md: 'h-10 px-3',
  lg: 'h-12 px-4 text-lg',
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, errorMessage, size = 'md', ...props }, ref) => {
    const input = createInput({
      ...props,
      type,
      error: error || false,
    });

    const [state, setState] = useState(() => input.state.getState());

    useEffect(() => {
      const unsubscribe = input.state.subscribe(setState);
      return unsubscribe;
    }, []);

    const ReactInput = input.connect(reactAdapter);

    return (
      <div className="w-full">
        <ReactInput
          ref={ref}
          className={cn(
            'flex w-full rounded-md border bg-background text-sm ring-offset-background transition-colors',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            sizeClasses[size],
            state.error || error
              ? 'border-destructive focus-visible:ring-destructive'
              : 'border-input focus-visible:ring-ring',
            state.focused && !state.error && !error && 'border-ring',
            className
          )}
          {...props}
        />
        {(errorMessage || (state.error && errorMessage)) && (
          <p className="mt-1 text-sm text-destructive">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';