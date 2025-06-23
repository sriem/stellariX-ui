/**
 * Toggle Component
 * Main entry point and public API
 */

import { createPrimitive } from '@stellarix/core';
import { createToggleState } from './state';
import { createToggleLogic } from './logic';
import type { ToggleOptions, ToggleState, ToggleEvents } from './types';

/**
 * Creates a toggle component factory
 * @param options Component options
 * @returns Component factory
 */
export function createToggle(options: ToggleOptions = {}) {
    return createPrimitive<ToggleState, ToggleEvents, ToggleOptions>('Toggle', {
        initialState: options,
        logicConfig: options,
        metadata: {
            accessibility: {
                role: 'switch',
                keyboardShortcuts: ['Space'],
                ariaAttributes: ['aria-checked', 'aria-disabled'],
                wcagLevel: 'AA',
                patterns: ['toggle', 'switch']
            },
            events: {
                supported: ['change', 'focus', 'blur'],
                required: [],
                custom: {
                    'change': {
                        description: 'Triggered when toggle state changes'
                    }
                }
            },
            structure: {
                elements: {
                    'root': {
                        type: 'button',
                        role: 'switch',
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
export function createToggleWithImplementation(options: ToggleOptions = {}) {
    const core = createToggle(options);
    
    // Attach the actual implementation
    core.state = createToggleState(options);
    core.logic = createToggleLogic(core.state as any, options);
    
    // Connect and initialize the logic
    core.logic.connect(core.state);
    core.logic.initialize();
    
    // Store options on the core for adapters to access
    (core as any).options = options;
    
    return core;
}

// Re-export types
export type { 
    ToggleOptions, 
    ToggleState, 
    ToggleEvents, 
    ToggleProps 
} from './types';

export type { ToggleStateStore } from './state';

// Default export for convenience
export default createToggleWithImplementation;