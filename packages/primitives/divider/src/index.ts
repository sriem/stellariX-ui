/**
 * Divider Component
 * Main entry point and public API
 */

import { createPrimitive } from '@stellarix/core';
import { createDividerState } from './state';
import { createDividerLogic } from './logic';
import type { DividerOptions, DividerState, DividerEvents } from './types';

/**
 * Creates a divider component factory
 * @param options Component options
 * @returns Component factory
 */
export function createDivider(options: DividerOptions = {}) {
    return createPrimitive<DividerState, DividerEvents, DividerOptions>('Divider', {
        initialState: options,
        logicConfig: options,
        metadata: {
            accessibility: {
                role: 'separator',
                keyboardShortcuts: [],
                ariaAttributes: ['aria-orientation', 'aria-label'],
                wcagLevel: 'AA',
                patterns: ['divider', 'separator']
            },
            events: {
                supported: [],
                required: [],
                custom: {}
            },
            structure: {
                elements: {
                    'root': {
                        type: 'hr',
                        role: 'separator',
                        optional: false
                    },
                    'label': {
                        type: 'span',
                        role: 'presentation',
                        optional: true
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
export function createDividerWithImplementation(options: DividerOptions = {}) {
    const core = createDivider(options);
    
    // Attach the actual implementation
    core.state = createDividerState(options);
    core.logic = createDividerLogic(core.state as any, options);
    
    return core;
}

// Re-export types
export type { 
    DividerOptions, 
    DividerState, 
    DividerEvents, 
    DividerProps,
    DividerOrientation,
    DividerVariant,
    DividerLabelPosition
} from './types';

export type { DividerStateStore } from './state';

// Default export for convenience
export default createDividerWithImplementation;