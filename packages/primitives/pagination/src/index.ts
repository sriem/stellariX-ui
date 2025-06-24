/**
 * Pagination Component
 * Main entry point and public API
 */

import { createPrimitive } from '@stellarix-ui/core';
import { createPaginationState } from './state';
import { createPaginationLogic } from './logic';
import type { PaginationOptions, PaginationState, PaginationEvents } from './types';

/**
 * Creates a pagination component factory
 * @param options Component options
 * @returns Component factory
 */
export function createPagination(options: PaginationOptions = {}) {
    return createPrimitive<PaginationState, PaginationEvents, PaginationOptions>('Pagination', {
        initialState: options,
        logicConfig: options,
        metadata: {
            accessibility: {
                role: 'navigation',
                keyboardShortcuts: ['ArrowLeft', 'ArrowRight', 'Home', 'End'],
                ariaAttributes: ['aria-label', 'aria-current', 'aria-disabled', 'aria-live'],
                wcagLevel: 'AA',
                patterns: ['keyboard-navigation', 'focus-management']
            },
            events: {
                supported: ['pageChange', 'itemsPerPageChange', 'navigate'],
                required: [],
                custom: {
                    pageChange: 'Fired when page changes',
                    itemsPerPageChange: 'Fired when items per page changes',
                    navigate: 'Fired when navigation occurs'
                }
            },
            structure: {
                elements: {
                    'root': {
                        type: 'nav',
                        role: 'navigation',
                        optional: false
                    },
                    'firstButton': {
                        type: 'button',
                        role: 'button',
                        optional: false
                    },
                    'previousButton': {
                        type: 'button',
                        role: 'button',
                        optional: false
                    },
                    'pageButton': {
                        type: 'button',
                        role: 'button',
                        optional: false
                    },
                    'nextButton': {
                        type: 'button',
                        role: 'button',
                        optional: false
                    },
                    'lastButton': {
                        type: 'button',
                        role: 'button',
                        optional: false
                    },
                    'pageInfo': {
                        type: 'span',
                        role: 'status',
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
export function createPaginationWithImplementation(options: PaginationOptions = {}) {
    const core = createPagination(options);
    
    // Attach the actual implementation
    core.state = createPaginationState(options);
    core.logic = createPaginationLogic(core.state as any, options);
    
    return core;
}

// Re-export types
export type { 
    PaginationOptions, 
    PaginationState, 
    PaginationEvents, 
    PaginationProps,
    PageInfo 
} from './types';

export type { PaginationStateStore } from './state';

// Re-export helper function
export { getPageNumbers } from './logic';

// Default export for convenience
export default createPaginationWithImplementation;