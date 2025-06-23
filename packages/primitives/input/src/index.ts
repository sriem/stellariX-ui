/**
 * Input Component
 * Main entry point and public API
 */

import { createPrimitive } from '@stellarix/core';
import { createInputState } from './state';
import { createInputLogic } from './logic';
import type { InputOptions, InputState, InputEvents } from './types';

/**
 * Creates a input component factory
 * @param options Component options
 * @returns Component factory
 */
export function createInput(options: InputOptions = {}) {
    return createPrimitive<InputState, InputEvents, InputOptions>('Input', {
        initialState: options,
        logicConfig: options,
        metadata: {
            accessibility: {
                role: 'textbox',
                keyboardShortcuts: ['Enter'],
                ariaAttributes: ['aria-invalid', 'aria-required', 'aria-disabled', 'aria-readonly', 'aria-describedby'],
                wcagLevel: 'AA',
                patterns: ['form-input', 'text-input']
            },
            events: {
                supported: ['change', 'input', 'focus', 'blur', 'keydown', 'submit'],
                required: [],
                custom: {
                    'submit': {
                        description: 'Triggered when Enter key is pressed'
                    }
                }
            },
            structure: {
                elements: {
                    'root': {
                        type: 'input',
                        role: 'textbox',
                        optional: false
                    }
                }
            }
        }
    });
}

/**
 * Create the component with actual implementation
 * This connects the state and logic layers
 */
export function createInputWithImplementation(options: InputOptions = {}) {
    const core = createInput(options);
    
    // Attach the actual implementation
    core.state = createInputState(options);
    core.logic = createInputLogic(core.state as any, options);
    
    return core;
}

// Re-export types
export type { 
    InputOptions, 
    InputState, 
    InputEvents, 
    InputProps 
} from './types';

export type { InputStateStore } from './state';

// Default export for convenience
export default createInputWithImplementation;