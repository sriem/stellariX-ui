/**
 * Template Component
 * Main entry point and public API
 */

import { createTemplateState } from './state';
import { createTemplateLogic } from './logic';
import type { TemplateOptions, TemplateState, TemplateEvents } from './types';
import type { ComponentCore } from '@stellarix-ui/core';

/**
 * Creates a template component
 * @param options Component options
 * @returns Component instance
 */
export function createTemplate(options: TemplateOptions = {}): ComponentCore<TemplateState, TemplateEvents> {
    const state = createTemplateState(options);
    const logic = createTemplateLogic(state, options);
    
    // Connect logic to state
    logic.connect(state);
    logic.initialize();
    
    return {
        state,
        logic,
        metadata: {
            name: 'Template',
            version: '1.0.0',
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
        },
        connect: (adapter: any) => {
            return adapter.createComponent({
                state,
                logic,
                metadata: {
                    name: 'Template',
                    version: '1.0.0'
                }
            });
        }
    };
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
export default createTemplate;