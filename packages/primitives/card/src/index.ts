/**
 * Card Component
 * Main entry point and public API
 */

import { createPrimitive } from '@stellarix-ui/core';
import { createCardState } from './state';
import { createCardLogic } from './logic';
import type { CardOptions, CardState, CardEvents } from './types';

/**
 * Creates a card component factory
 * @param options Component options
 * @returns Component factory
 */
export function createCard(options: CardOptions = {}) {
    return createPrimitive<CardState, CardEvents, CardOptions>('Card', {
        initialState: options,
        logicConfig: options,
        metadata: {
            accessibility: {
                role: 'article',
                keyboardShortcuts: ['Enter', 'Space'],
                ariaAttributes: ['aria-disabled', 'aria-pressed', 'aria-checked'],
                wcagLevel: 'AA',
                patterns: []
            },
            events: {
                supported: ['click', 'selectionChange', 'focus', 'blur', 'hover'],
                required: [],
                custom: {}
            },
            structure: {
                elements: {
                    'root': {
                        type: 'article',
                        role: 'article',
                        optional: false
                    },
                    'header': {
                        type: 'header',
                        role: 'heading',
                        optional: true
                    },
                    'media': {
                        type: 'div',
                        role: 'img',
                        optional: true
                    },
                    'content': {
                        type: 'div',
                        role: 'region',
                        optional: false
                    },
                    'footer': {
                        type: 'footer',
                        role: 'contentinfo',
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
export function createCardWithImplementation(options: CardOptions = {}) {
    const core = createCard(options);
    
    // Attach the actual implementation
    core.state = createCardState(options);
    core.logic = createCardLogic(core.state as any, options);
    
    return core;
}

// Re-export types
export type { 
    CardOptions, 
    CardState, 
    CardEvents, 
    CardProps,
    CardVariant,
    CardPadding
} from './types';

export type { CardStateStore } from './state';

// Default export for convenience
export default createCardWithImplementation;