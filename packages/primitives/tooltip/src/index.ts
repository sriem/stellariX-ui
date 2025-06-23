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
    
    // Create and return component core
    return new ComponentCore({
        state,
        logic,
        options
    });
}

/**
 * Tooltip component type
 */
export type Tooltip = ReturnType<typeof createTooltip>;