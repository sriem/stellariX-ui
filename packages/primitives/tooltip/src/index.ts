/**
 * Tooltip Component Public API
 * Exports all public types and functions
 */

import { ComponentCore } from '@stellarix-ui/core';
import { createTooltipState } from './state';
import { createTooltipLogic } from './logic';
import type { TooltipState, TooltipOptions, TooltipEvents, TooltipPlacement } from './types';

// Re-export types
export type {
    TooltipState,
    TooltipOptions,
    TooltipEvents,
    TooltipPlacement,
    TooltipProps
} from './types';

// Re-export state store type
export type { TooltipStateStore } from './state';

/**
 * Creates a new tooltip component instance
 * @param options Component configuration options
 * @returns Component core instance
 */
export function createTooltip(options: TooltipOptions = {}) {
    // Create state store
    const state = createTooltipState(options);
    
    // Create logic layer
    const logic = createTooltipLogic(state, options);
    
    // Connect and initialize the logic
    logic.connect(state);
    logic.initialize();
    
    // Create and return component core
    return {
        state,
        logic,
        metadata: {
            name: 'Tooltip',
            accessibility: {
                role: 'tooltip',
                wcagLevel: 'AA',
                keyboardShortcuts: ['Escape'],
                ariaAttributes: ['aria-describedby', 'role']
            },
            events: {
                supported: ['show', 'hide', 'focus', 'blur'],
                required: [],
                custom: {}
            },
            structure: {
                elements: {
                    root: { type: 'div', role: 'tooltip', optional: false }
                }
            }
        },
        connect: (adapter: any) => adapter.createComponent(this),
        destroy: () => logic.cleanup(),
        options
    };
}

/**
 * Creates a tooltip component with implementation (alias for tests)
 */
export const createTooltipWithImplementation = createTooltip;
export const createTooltipFactory = createTooltip;

/**
 * Tooltip component type
 */
export type Tooltip = ReturnType<typeof createTooltip>;