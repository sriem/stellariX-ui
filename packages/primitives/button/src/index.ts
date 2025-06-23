import { createPrimitive } from '@stellarix-ui/core';
import { createButtonState } from './state.js';
import { createButtonLogic } from './logic.js';
import type { ButtonOptions, ButtonState, ButtonEvents } from './types.js';

export function createButton(options: ButtonOptions = {}) {
    return createPrimitive<ButtonState, ButtonEvents, ButtonOptions>('Button', {
        initialState: options,
        logicConfig: options,
        metadata: {
            accessibility: {
                role: 'button',
                keyboardShortcuts: ['Enter', 'Space'],
                ariaAttributes: ['aria-pressed', 'aria-disabled', 'aria-busy'],
                wcagLevel: 'AA',
                patterns: []
            },
            events: {
                supported: ['click', 'focus', 'blur', 'keydown'],
                required: [],
                custom: {}
            },
            structure: {
                elements: {
                    'root': {
                        type: 'button',
                        role: 'button',
                        optional: false
                    }
                }
            }
        }
    });
}

// Create the component factory with proper state and logic
export function createButtonWithImplementation(options: ButtonOptions = {}) {
    const core = createButton(options);
    
    // Attach the actual implementation
    core.state = createButtonState(options);
    core.logic = createButtonLogic(core.state as any, options);
    
    // Connect and initialize the logic
    core.logic.connect(core.state);
    core.logic.initialize();
    
    return core;
}

// Re-export types
export type { ButtonOptions, ButtonState, ButtonEvents, ButtonProps } from './types.js';
export type { ButtonStateStore } from './state.js';

// Default export for convenience
export default createButtonWithImplementation;