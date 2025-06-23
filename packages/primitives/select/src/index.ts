/**
 * Select Component
 * Framework-agnostic dropdown select component with search and keyboard navigation
 */

import { createPrimitive } from '@stellarix-ui/core';
import { createSelectState } from './state.js';
import { createSelectLogic } from './logic.js';
import type { SelectOptions, SelectState, SelectEvents } from './types.js';

/**
 * Creates a select component instance
 */
export function createSelect(options: SelectOptions = {}) {
    return createPrimitive<SelectState, SelectEvents, SelectOptions>('Select', {
        initialState: options,
        logicConfig: options,
        metadata: {
            accessibility: {
                roles: ['combobox', 'listbox', 'option'],
                keyboardSupport: [
                    'Enter', 'Space', 'ArrowDown', 'ArrowUp', 
                    'Home', 'End', 'Escape', 'Tab', 'Type to search'
                ],
                ariaAttributes: [
                    'aria-expanded', 'aria-haspopup', 'aria-controls',
                    'aria-activedescendant', 'aria-disabled', 'aria-readonly',
                    'aria-selected', 'aria-labelledby', 'aria-hidden'
                ],
                wcagLevel: 'AA'
            },
            events: {
                supported: [
                    'change', 'open', 'close', 'focus', 'blur', 
                    'search', 'optionSelect', 'navigate'
                ],
                required: [],
                bubbles: ['change', 'focus', 'blur']
            },
            structure: {
                elements: ['trigger', 'listbox', 'option', 'clear'],
                compound: true
            }
        }
    });
}

/**
 * Create the component with full implementation
 */
export function createSelectWithImplementation(options: SelectOptions = {}) {
    const core = createSelect(options);
    
    // Attach the actual implementation
    core.state = createSelectState(options);
    core.logic = createSelectLogic(core.state as any, options);
    
    return core;
}

// Re-export types
export type { 
    SelectOptions, 
    SelectState, 
    SelectEvents, 
    SelectProps,
    SelectOption
} from './types.js';
export type { SelectStateStore } from './state.js';

// Default export for convenience
export default createSelectWithImplementation;