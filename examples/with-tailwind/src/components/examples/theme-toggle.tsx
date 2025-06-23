import React, { useEffect, useState } from 'react';
import { createToggle } from '@stellarix-ui/toggle';
import { reactAdapter } from '@stellarix-ui/react';
import { cn } from '../../lib/utils';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggle = createToggle({
    checked: isDark,
    onChange: setIsDark,
  });

  const [state, setState] = useState(() => toggle.state.getState());

  useEffect(() => {
    const unsubscribe = toggle.state.subscribe(setState);
    return unsubscribe;
  }, []);

  const Toggle = toggle.connect(reactAdapter);

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm">☀️</span>
      <Toggle
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
          state.checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
            state.checked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </Toggle>
      <span className="text-sm">🌙</span>
    </div>
  );
}