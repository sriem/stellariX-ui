/**
 * ProgressBar Component
 * Main entry point and public API
 */

import { createProgressBarState } from './state';
import { createProgressBarLogic } from './logic';
import type { ProgressBarOptions, ProgressBarState, ProgressBarEvents } from './types';
import type { ComponentCore } from '@stellarix-ui/core';
import type { ProgressBarStateStore } from './state';

/**
 * Helper methods for ProgressBar component
 */
export interface ProgressBarHelpers {
    setValue: (value: number) => void;
    increment: (amount?: number) => void;
    decrement: (amount?: number) => void;
    setProgress: (value: number, max?: number) => void;
    reset: () => void;
    getPercentage: () => number;
    isComplete: () => boolean;
}

/**
 * Creates a progress bar component
 * @param options Component options
 * @returns Component instance with helper methods
 */
export function createProgressBar(
    options: ProgressBarOptions = {}
): ComponentCore<ProgressBarState, ProgressBarEvents> & ProgressBarHelpers {
    const state = createProgressBarState(options);
    const logic = createProgressBarLogic(state, options);
    
    // Connect logic to state
    logic.connect(state);
    logic.initialize();
    
    const helpers: ProgressBarHelpers = {
        setValue: (value: number) => state.setValue(value),
        increment: (amount?: number) => state.increment(amount),
        decrement: (amount?: number) => state.decrement(amount),
        setProgress: (value: number, max?: number) => state.setProgress(value, max),
        reset: () => state.reset(),
        getPercentage: () => state.getPercentage(),
        isComplete: () => state.isComplete(),
    };
    
    return {
        state,
        logic,
        metadata: {
            name: 'ProgressBar',
            version: '1.0.0',
            accessibility: {
                role: 'progressbar',
                keyboardShortcuts: [],
                ariaAttributes: [
                    'aria-valuenow', 
                    'aria-valuemin', 
                    'aria-valuemax', 
                    'aria-valuetext',
                    'aria-busy',
                    'aria-disabled'
                ],
                wcagLevel: 'AA',
                patterns: ['Progress Indicator']
            },
            events: {
                supported: ['change', 'complete', 'variantChange'],
                required: [],
                custom: {}
            },
            structure: {
                elements: {
                    'root': {
                        type: 'div',
                        role: 'progressbar',
                        optional: false
                    },
                    'track': {
                        type: 'div',
                        role: 'none',
                        optional: false
                    },
                    'fill': {
                        type: 'div',
                        role: 'none',
                        optional: false
                    },
                    'label': {
                        type: 'span',
                        role: 'none',
                        optional: true
                    }
                }
            }
        },
        connect: (adapter: any) => {
            return adapter.createComponent({
                state,
                logic,
                metadata: {
                    name: 'ProgressBar',
                    version: '1.0.0'
                }
            });
        },
        destroy: () => {
            logic.cleanup();
        },
        ...helpers
    };
}

// Re-export types
export type { 
    ProgressBarOptions, 
    ProgressBarState, 
    ProgressBarEvents, 
    ProgressBarProps 
} from './types';

export type { ProgressBarStateStore } from './state';

// Default export for convenience
export default createProgressBar;