/**
 * Breadcrumb Component
 * Ultra-generic breadcrumb implementation that can be adapted to any framework
 */

import { createPrimitive } from '@stellarix-ui/core';
import type { ComponentCore } from '@stellarix-ui/core';
import { createBreadcrumbState } from './state';
import { createBreadcrumbLogic } from './logic';
import type { BreadcrumbState, BreadcrumbEvents, BreadcrumbOptions, BreadcrumbItem } from './types';

/**
 * Creates a breadcrumb component
 * @param options Configuration options for the breadcrumb
 * @returns Component instance
 */
export function createBreadcrumb(
    options: BreadcrumbOptions = {}
): ComponentCore<BreadcrumbState, BreadcrumbEvents> {
    const core = createPrimitive<BreadcrumbState, BreadcrumbEvents, BreadcrumbOptions>('Breadcrumb', {
        initialState: options,
        logicConfig: options,
        metadata: {
            accessibility: {
                role: 'navigation',
                label: 'Breadcrumb',
                ariaAttributes: ['aria-label', 'aria-current'],
                wcagLevel: 'AA',
                patterns: ['navigation']
            },
            events: {
                supported: ['click', 'keydown'],
                required: [],
                custom: {}
            },
            structure: {
                elements: {
                    'root': {
                        type: 'nav',
                        role: 'navigation'
                    },
                    'list': {
                        type: 'ol',
                        role: 'list'
                    },
                    'item': {
                        type: 'li',
                        role: 'listitem'
                    }
                }
            }
        }
    });
    
    // Create state store
    const state = createBreadcrumbState(options);
    
    // Create logic layer
    const logic = createBreadcrumbLogic(state, options);
    
    // Attach state and logic to core
    core.state = state;
    core.logic = logic;
    
    return core;
}

// Re-export types
export type {
    BreadcrumbState,
    BreadcrumbEvents,
    BreadcrumbOptions,
    BreadcrumbItem,
    BreadcrumbProps,
} from './types';

// Re-export state and logic creators for advanced use cases
export { createBreadcrumbState } from './state';
export { createBreadcrumbLogic } from './logic';