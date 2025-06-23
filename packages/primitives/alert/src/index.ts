/**
 * Alert Component
 * Main entry point and public API
 */

import { createPrimitive } from '@stellarix/core';
import { createAlertState } from './state';
import { createAlertLogic } from './logic';
import type { AlertOptions, AlertState, AlertEvents } from './types';

/**
 * Creates an alert component factory
 * @param options Component options
 * @returns Component factory
 */
export function createAlert(options: AlertOptions = {}) {
    return createPrimitive<AlertState, AlertEvents, AlertOptions>('Alert', {
        initialState: options,
        logicConfig: options,
        metadata: {
            accessibility: {
                role: 'alert',
                keyboardShortcuts: ['Escape'],
                ariaAttributes: ['aria-live', 'aria-atomic', 'aria-hidden'],
                wcagLevel: 'AA',
                patterns: ['live-region', 'dismissible']
            },
            events: {
                supported: ['dismiss', 'visibilityChange', 'close'],
                required: [],
                custom: {
                    'dismiss': 'Fired when alert is dismissed',
                    'visibilityChange': 'Fired when visibility changes',
                    'close': 'Fired when close button is clicked'
                }
            },
            structure: {
                elements: {
                    'root': {
                        type: 'div',
                        role: 'alert',
                        optional: false
                    },
                    'closeButton': {
                        type: 'button',
                        role: 'button',
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
export function createAlertWithImplementation(options: AlertOptions = {}) {
    const core = createAlert(options);
    
    // Attach the actual implementation
    core.state = createAlertState(options);
    core.logic = createAlertLogic(core.state as any, options);
    
    return core;
}

// Re-export types
export type { 
    AlertOptions, 
    AlertState, 
    AlertEvents, 
    AlertProps,
    AlertVariant
} from './types';

export type { AlertStateStore } from './state';

// Default export for convenience
export default createAlertWithImplementation;