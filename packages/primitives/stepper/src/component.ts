/**
 * Component creation helper
 * Creates a component with state and logic
 */

import type { ComponentCore } from '@stellarix-ui/core';

export interface Component<TState, TEvents> extends ComponentCore<TState, TEvents> {
  id: string;
}

/**
 * Creates a component instance
 */
export function createComponent<TState, TEvents>({
  id,
  state,
  logic,
}: {
  id: string;
  state: any;
  logic: any;
}): Component<TState, TEvents> {
  return {
    id,
    state,
    logic,
    metadata: {
      name: 'Stepper',
      version: '0.0.1',
      accessibility: {
        role: 'group',
        wcagLevel: 'AA',
        patterns: ['stepper'],
        keyboardShortcuts: ['Arrow keys', 'Home', 'End', 'Enter', 'Space'],
        ariaAttributes: ['aria-label', 'aria-current', 'aria-disabled', 'aria-invalid'],
      },
      events: {
        supported: ['stepChange', 'stepClick', 'validationStart', 'validationComplete', 'complete'],
        required: [],
        custom: {},
      },
      structure: {
        elements: {
          root: { type: 'div', role: 'group' },
          list: { type: 'ol', role: 'list' },
          step: { type: 'li', role: 'listitem' },
          stepButton: { type: 'button', role: 'button' },
        },
      },
    },
    connect: function <TFrameworkComponent>(adapter: any): TFrameworkComponent {
      return adapter.createComponent(this);
    },
    destroy: () => {
      // Cleanup handled by state and logic
    },
  };
}