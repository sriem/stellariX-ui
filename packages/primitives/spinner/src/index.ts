import { createPrimitive } from '@stellarix/core';
import { createSpinnerState } from './state.js';
import { createSpinnerLogic } from './logic.js';
import type { SpinnerOptions, SpinnerState, SpinnerEvents } from './types.js';

export function createSpinner(options: SpinnerOptions = {}) {
    return createPrimitive<SpinnerState, SpinnerEvents, SpinnerOptions>('Spinner', {
        initialState: options,
        logicConfig: options,
        metadata: {
            accessibility: {
                role: 'status',
                keyboardShortcuts: [],
                ariaAttributes: ['aria-busy', 'aria-label', 'aria-live'],
                wcagLevel: 'AA',
                patterns: []
            },
            events: {
                supported: [],
                required: [],
                custom: {}
            },
            structure: {
                elements: {
                    'root': {
                        type: 'div',
                        role: 'status',
                        optional: false
                    }
                }
            }
        }
    });
}

// Create the component factory with proper state and logic
export function createSpinnerWithImplementation(options: SpinnerOptions = {}) {
    const core = createSpinner(options);
    
    // Attach the actual implementation
    core.state = createSpinnerState(options);
    core.logic = createSpinnerLogic(core.state as any, options);
    
    return core;
}

// Re-export types
export type { SpinnerOptions, SpinnerState, SpinnerEvents, SpinnerProps, SpinnerSize } from './types.js';
export type { SpinnerStateStore } from './state.js';

// Default export for convenience
export default createSpinnerWithImplementation;