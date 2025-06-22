/**
 * Template Component
 * Main entry point and public API
 */

import { createPrimitive } from '@stellarix/core';
import { createTemplateState } from './state';
import { createTemplateLogic } from './logic';
import type { TemplateOptions, TemplateState, TemplateEvents } from './types';

/**
 * Creates a template component factory
 * @param options Component options
 * @returns Component factory
 */
export function createTemplate(options: TemplateOptions = {}) {
    return createPrimitive<TemplateState, TemplateEvents, TemplateOptions>('Template', {
        initialState: options,
        logicConfig: options,
        metadata: {
            accessibility: {
                role: 'button', // Update based on component type
                keyboardShortcuts: ['Enter', 'Space'],
                ariaAttributes: ['aria-disabled', 'aria-pressed', 'aria-label'],
                wcagLevel: 'AA',
                patterns: []
            },
            events: {
                supported: ['change', 'activeChange', 'focus', 'blur'],
                required: [],
                custom: {}
            },
            structure: {
                elements: {
                    'root': {
                        type: 'div', // Update based on component type
                        role: 'button',
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
export function createTemplateWithImplementation(options: TemplateOptions = {}) {
    const core = createTemplate(options);
    
    // Attach the actual implementation
    core.state = createTemplateState(options);
    core.logic = createTemplateLogic(core.state as any, options);
    
    return core;
}

// Re-export types
export type { 
    TemplateOptions, 
    TemplateState, 
    TemplateEvents, 
    TemplateProps 
} from './types';

export type { TemplateStateStore } from './state';

// Default export for convenience
export default createTemplateWithImplementation;