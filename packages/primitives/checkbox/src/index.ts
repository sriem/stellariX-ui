/**
 * Checkbox Component
 * Main entry point and public API
 */

import { createPrimitive } from '@stellarix-ui/core';
import { createCheckboxState } from './state';
import { createCheckboxLogic } from './logic';
import type { CheckboxOptions, CheckboxState, CheckboxEvents } from './types';

/**
 * Creates a checkbox component factory
 * @param options Component options
 * @returns Component factory
 */
export function createCheckbox(options: CheckboxOptions = {}) {
    return createPrimitive<CheckboxState, CheckboxEvents, CheckboxOptions>('Checkbox', {
        initialState: options,
        logicConfig: options,
        metadata: {
            accessibility: {
                role: 'checkbox',
                keyboardShortcuts: ['Space'],
                ariaAttributes: ['aria-checked', 'aria-disabled', 'aria-required', 'aria-invalid', 'aria-describedby'],
                wcagLevel: 'AA',
                patterns: ['checkbox']
            },
            events: {
                supported: ['change', 'focus', 'blur', 'keydown'],
                required: [],
                custom: {}
            },
            structure: {
                elements: {
                    'root': {
                        type: 'input',
                        role: 'checkbox',
                        optional: false
                    }
                }
            }
        }
    });
}

/**
 * Create the checkbox component with actual implementation
 * This connects the state and logic layers
 */
export function createCheckboxWithImplementation(options: CheckboxOptions = {}) {
    const core = createCheckbox(options);
    
    // Attach the actual implementation
    core.state = createCheckboxState(options);
    core.logic = createCheckboxLogic(core.state as any, options);
    
    // Store options for adapter access
    (core as any).options = options;
    
    return core;
}

// Test alias for factory function
export const createCheckboxFactory = createCheckboxWithImplementation;

// Re-export types
export type { 
    CheckboxOptions, 
    CheckboxState, 
    CheckboxEvents, 
    CheckboxProps,
    CheckboxCheckedState
} from './types';

export type { CheckboxStateStore } from './state';

// Default export for convenience
export default createCheckboxWithImplementation;