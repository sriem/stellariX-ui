/**
 * Breadcrumb Component
 * Ultra-generic breadcrumb implementation that can be adapted to any framework
 */

import { createBreadcrumbState } from './state';
import { createBreadcrumbLogic } from './logic';
import type { BreadcrumbState, BreadcrumbEvents, BreadcrumbOptions } from './types';
import type { ComponentCore } from '@stellarix-ui/core';

/**
 * Creates a breadcrumb component
 * @param options Configuration options for the breadcrumb
 * @returns Component instance
 */
export function createBreadcrumb(
    options: BreadcrumbOptions = {}
): ComponentCore<BreadcrumbState, BreadcrumbEvents> & { options: BreadcrumbOptions } {
    const state = createBreadcrumbState(options);
    const logic = createBreadcrumbLogic(state, options);
    
    // Connect logic to state
    logic.connect(state);
    logic.initialize();
    
    const core: ComponentCore<BreadcrumbState, BreadcrumbEvents> & { options: BreadcrumbOptions } = {
        id: options.id || 'breadcrumb',
        state,
        logic,
        options, // Store options for adapter access
        metadata: {
            name: 'Breadcrumb',
            version: '1.0.0',
            accessibility: {
                role: 'navigation',
                label: 'Breadcrumb',
                ariaAttributes: ['aria-label', 'aria-current'],
                wcagLevel: 'AA',
                patterns: ['navigation']
            },
            events: {
                supported: ['itemClick', 'itemsChange', 'itemFocus', 'keyNavigation'],
                required: [],
                custom: {
                    itemClick: { description: 'Fired when an item is clicked' },
                    itemsChange: { description: 'Fired when items are updated' },
                    itemFocus: { description: 'Fired when a breadcrumb item receives focus' },
                    keyNavigation: { description: 'Fired when keyboard navigation occurs' }
                }
            },
            structure: {
                elements: {
                    'root': {
                        type: 'nav',
                        role: 'navigation',
                        optional: false
                    },
                    'list': {
                        type: 'ol',
                        role: 'list',
                        optional: false
                    },
                    'item': {
                        type: 'li',
                        role: 'listitem',
                        optional: false
                    },
                    'link': {
                        type: 'a',
                        role: 'link',
                        optional: false
                    }
                }
            }
        },
        connect: (adapter: any) => {
            return adapter.createComponent(core);
        },
        destroy: () => {
            logic.cleanup();
        }
    };
    
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