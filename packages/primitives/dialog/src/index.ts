/**
 * Dialog Component
 * Framework-agnostic dialog/modal implementation
 */

import { createComponent } from '@stellarix/core';
import { createDialogState } from './state';
import { createDialogLogic } from './logic';
import type { DialogOptions, DialogState, DialogEvents } from './types';

/**
 * Creates a dialog component instance
 * @param options Configuration options
 * @returns Dialog component instance
 */
export function createDialog(options: DialogOptions = {}) {
    const state = createDialogState(options);
    const logic = createDialogLogic(state, options);
    
    return createComponent<DialogState, DialogEvents>({
        name: 'Dialog',
        state,
        logic,
    });
}

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