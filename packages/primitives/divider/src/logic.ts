/**
 * Divider Component Logic
 * Business logic and event handling
 * 
 * 🚨 CRITICAL: NEVER call state.getState() in this file!
 * ✅ Use currentState parameter in interactions
 * ✅ Use state parameter in a11y functions
 */

import { LogicLayerBuilder } from '@stellarix-ui/core';
import type { LogicLayer } from '@stellarix-ui/core';
import type { DividerState, DividerEvents, DividerOptions } from './types';
import type { DividerStateStore } from './state';

/**
 * Creates the divider component logic
 * @param state State store to connect to
 * @param options Component options
 * @returns Logic layer for the component
 */
export function createDividerLogic(
    state: DividerStateStore,
    options: DividerOptions = {}
): LogicLayer<DividerState, DividerEvents> {
    
    return new LogicLayerBuilder<DividerState, DividerEvents>()
        // Divider has no events to handle
        .withA11y('root', (state) => {
            const a11yProps: Record<string, any> = {
                'role': 'separator',
            };
            
            // Add orientation for vertical dividers
            if (state.orientation === 'vertical') {
                a11yProps['aria-orientation'] = 'vertical';
            }
            
            // Add label if provided
            if (options.label) {
                a11yProps['aria-label'] = options.label;
            }
            
            return a11yProps;
        })
        .withA11y('label', () => ({
            'aria-hidden': 'true',
        }))
        .build();
}