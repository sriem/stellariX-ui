/**
 * Textarea Component
 * Multi-line text input component with autogrow support
 */

import { createPrimitive } from '@stellarix-ui/core';
import { createTextareaState } from './state';
import { createTextareaLogic } from './logic';
import type { TextareaOptions, TextareaState, TextareaEvents } from './types';

/**
 * Creates a textarea component factory
 * @param options Component options
 * @returns Component factory
 */
export function createTextarea(options: TextareaOptions = {}) {
    return createPrimitive<TextareaState, TextareaEvents, TextareaOptions>('Textarea', {
        initialState: options,
        logicConfig: options,
        metadata: {
            accessibility: {
                role: 'textbox',
                keyboardShortcuts: ['Tab', 'Enter', 'ArrowKeys'],
                ariaAttributes: ['aria-disabled', 'aria-readonly', 'aria-invalid', 'aria-required', 'aria-multiline'],
                wcagLevel: 'AA',
                patterns: ['textarea']
            },
            events: {
                supported: ['change', 'focus', 'blur', 'input'],
                required: [],
                custom: {}
            },
            structure: {
                elements: {
                    'root': {
                        type: 'textarea',
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
export function createTextareaWithImplementation(options: TextareaOptions = {}) {
    const core = createTextarea(options);
    
    // Attach the actual implementation
    core.state = createTextareaState(options);
    core.logic = createTextareaLogic(core.state as any, options);
    
    return core;
}

// Re-export types
export type { 
    TextareaOptions, 
    TextareaState, 
    TextareaEvents, 
    TextareaProps,
    TextareaVariant,
    TextareaResize
} from './types';

export type { TextareaStateStore } from './state';

// Default export for convenience
export default createTextareaWithImplementation;