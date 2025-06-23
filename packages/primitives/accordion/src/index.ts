/**
 * Accordion Component
 * Main entry point and public API
 */

import { createPrimitive } from '@stellarix-ui/core';
import { createAccordionState } from './state.js';
import { createAccordionLogic } from './logic.js';
import type { AccordionOptions, AccordionState, AccordionEvents } from './types.js';

/**
 * Creates an accordion component factory
 * @param options Component options
 * @returns Component factory
 */
export function createAccordion(options: AccordionOptions = {}) {
    return createPrimitive<AccordionState, AccordionEvents, AccordionOptions>('Accordion', {
        initialState: options,
        logicConfig: options,
        metadata: {
            accessibility: {
                roles: ['region', 'button'],
                keyboardSupport: ['Enter', 'Space', 'ArrowDown', 'ArrowUp', 'Home', 'End'],
                ariaAttributes: ['aria-expanded', 'aria-controls', 'aria-disabled', 'aria-labelledby', 'aria-hidden'],
                wcagLevel: 'AA'
            },
            events: {
                supported: ['expandedChange', 'itemToggle', 'itemFocus', 'itemBlur'],
                required: [],
                bubbles: ['itemFocus', 'itemBlur']
            },
            structure: {
                elements: ['root', 'trigger', 'panel'],
                compound: true
            }
        }
    });
}

/**
 * Create the component with actual implementation
 * This connects the state and logic layers
 */
export function createAccordionWithImplementation(options: AccordionOptions = {}) {
    const core = createAccordion(options);
    
    // Attach the actual implementation
    core.state = createAccordionState(options);
    core.logic = createAccordionLogic(core.state as any, options);
    
    return core;
}

// Re-export types
export type { 
    AccordionOptions, 
    AccordionState, 
    AccordionEvents, 
    AccordionProps,
    AccordionItem
} from './types.js';

export type { AccordionStateStore } from './state.js';
export type { AccordionLogic } from './logic.js';

// Default export for convenience
export default createAccordionWithImplementation;