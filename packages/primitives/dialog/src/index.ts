/**
 * Dialog Component
 * Framework-agnostic dialog/modal implementation
 */

import { createPrimitive } from '@stellarix-ui/core';
import { createDialogState } from './state';
import { createDialogLogic } from './logic';
import type { DialogOptions, DialogState, DialogEvents } from './types';

/**
 * Creates a dialog component instance
 * @param options Configuration options
 * @returns Dialog component instance
 */
export function createDialog(options: DialogOptions = {}) {
    return createPrimitive<DialogState, DialogEvents, DialogOptions>('Dialog', {
        initialState: options,
        logicConfig: options,
        metadata: {
            accessibility: {
                role: 'dialog',
                keyboardShortcuts: ['Escape'],
                ariaAttributes: ['aria-modal', 'aria-labelledby', 'aria-describedby'],
                wcagLevel: 'AA',
                patterns: ['focus-trap']
            },
            events: {
                supported: ['open', 'close', 'backdrop-click'],
                required: [],
                custom: {}
            },
            structure: {
                elements: {
                    'root': {
                        type: 'div',
                        role: 'dialog',
                        optional: false
                    },
                    'backdrop': {
                        type: 'div',
                        role: 'presentation',
                        optional: true
                    }
                }
            }
        }
    });
}

// Create the component factory with proper state and logic
export function createDialogWithImplementation(options: DialogOptions = {}) {
    const core = createDialog(options);
    
    // Attach the actual implementation
    core.state = createDialogState(options);
    core.logic = createDialogLogic(core.state as any, options);
    
    // Connect and initialize the logic layer
    core.logic.connect(core.state as any);
    core.logic.initialize();
    
    return core;
}

// Test alias for factory function
export const createDialogFactory = createDialogWithImplementation;

// Re-export types
export type { 
    DialogState, 
    DialogOptions, 
    DialogEvents, 
    DialogProps 
} from './types';

// Re-export component factory
export { createDialogState } from './state';
export { createDialogLogic } from './logic';
export type { DialogStateStore } from './state';

// Default export for convenience
export default createDialogWithImplementation; 