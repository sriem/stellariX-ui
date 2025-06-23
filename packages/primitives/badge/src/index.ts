/**
 * Badge Component
 * Main entry point and public API
 */

import { createPrimitive } from '@stellarix/core';
import { createBadgeState } from './state';
import { createBadgeLogic } from './logic';
import type { BadgeOptions, BadgeState, BadgeEvents } from './types';

/**
 * Creates a badge component factory
 * @param options Component options
 * @returns Component factory
 */
export function createBadge(options: BadgeOptions = {}) {
    return createPrimitive<BadgeState, BadgeEvents, BadgeOptions>('Badge', {
        initialState: options,
        logicConfig: options,
        metadata: {
            accessibility: {
                role: 'status',
                keyboardShortcuts: [],
                ariaAttributes: ['aria-label', 'aria-hidden'],
                wcagLevel: 'AA',
                patterns: ['status-indicator']
            },
            events: {
                supported: ['contentChange', 'visibilityChange'],
                required: [],
                custom: {
                    'contentChange': 'Fired when badge content changes',
                    'visibilityChange': 'Fired when badge visibility changes'
                }
            },
            structure: {
                elements: {
                    'root': {
                        type: 'span',
                        role: 'status',
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
export function createBadgeWithImplementation(options: BadgeOptions = {}) {
    const core = createBadge(options);
    
    // Attach the actual implementation
    core.state = createBadgeState(options);
    core.logic = createBadgeLogic(core.state as any, options);
    
    return core;
}

// Re-export types
export type { 
    BadgeOptions, 
    BadgeState, 
    BadgeEvents, 
    BadgeProps,
    BadgeVariant,
    BadgeType
} from './types';

export type { BadgeStateStore } from './state';

// Default export for convenience
export default createBadgeWithImplementation;