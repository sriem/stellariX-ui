/**
 * Popover Component
 * A floating overlay component that appears next to a trigger element
 */

import type { ComponentCore } from '@stellarix/core';
import { createPopoverState } from './state';
import { createPopoverLogic } from './logic';
import type { PopoverState, PopoverOptions, PopoverEvents } from './types';

// Re-export types
export type { 
    PopoverState, 
    PopoverOptions, 
    PopoverEvents, 
    PopoverProps,
    PopoverPlacement,
    PopoverPosition 
} from './types';

export { createPopoverState } from './state';
export { createPopoverLogic } from './logic';

/**
 * Creates a popover component
 * @param options Configuration options
 * @returns Component core with state and logic
 */
export function createPopover(options: PopoverOptions = {}): ComponentCore<PopoverState, PopoverEvents> {
    // Create state store
    const state = createPopoverState(options);
    
    // Create logic layer
    const logic = createPopoverLogic(state, options);
    
    // Connect logic to state
    logic.connect(state);
    
    // Initialize logic
    logic.initialize();
    
    // Return component core
    return {
        state,
        logic,
        metadata: {
            name: 'popover',
            version: '0.1.0',
            accessibility: {
                role: 'dialog',
                wcagLevel: 'AA',
                patterns: ['popup', 'dialog'],
                keyboardShortcuts: ['Escape'],
                ariaAttributes: ['aria-expanded', 'aria-haspopup', 'aria-controls', 'aria-hidden']
            },
            events: {
                supported: ['click', 'keydown', 'focus', 'blur'],
                required: [],
                custom: {
                    openChange: {
                        description: 'Fired when the popover open state changes'
                    },
                    placementChange: {
                        description: 'Fired when the popover placement changes'
                    }
                }
            },
            structure: {
                elements: {
                    trigger: {
                        type: 'button',
                        role: 'button'
                    },
                    content: {
                        type: 'div',
                        role: 'dialog'
                    }
                }
            }
        },
        connect: function<TFrameworkComponent>(
            adapter: any
        ): TFrameworkComponent {
            return adapter.createComponent(this);
        },
        destroy: () => {
            logic.cleanup();
        }
    };
}