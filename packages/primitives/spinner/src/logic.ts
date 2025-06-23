/**
 * Spinner Component Logic
 * Business logic and event handling
 */

import type { LogicLayer } from '@stellarix-ui/core';
import type { SpinnerState, SpinnerEvents, SpinnerOptions } from './types';
import type { SpinnerStateStore } from './state';

/**
 * Creates the spinner component logic
 * @param state State store to connect to
 * @param options Component options
 * @returns Logic layer for the component
 */
export function createSpinnerLogic(
    state: SpinnerStateStore,
    options: SpinnerOptions = {}
): LogicLayer<SpinnerState, SpinnerEvents> {
    // Spinner has no events or interactions - it's purely visual
    // We need to implement a minimal LogicLayer interface
    
    let connectedStore: SpinnerStateStore | null = null;
    let initialized = false;

    return {
        componentType: 'Spinner',

        connect: (stateStore: any) => {
            connectedStore = stateStore;
        },

        disconnect: () => {
            connectedStore = null;
        },

        initialize: () => {
            if (initialized) return () => {};
            initialized = true;

            // Spinner doesn't need initialization
            return () => {
                initialized = false;
            };
        },

        handleEvent: (eventType: keyof SpinnerEvents, payload: any) => {
            // Spinner has no events
        },

        getInteractionHandlers: (elementType: string) => {
            // Spinner has no interactions
            // Return static props - the component should read state directly
            return {
                // No event handlers needed
                // But we can provide static DOM attributes
                role: 'status',
            };
        },

        getA11yProps: (elementType: string) => {
            // Return static accessibility props
            // The component should read dynamic state values directly
            return {
                role: 'status',
                'aria-live': 'polite',
            };
        },

        getElementMetadata: () => ({
            root: {
                type: 'div',
                role: 'status',
                optional: false,
            },
        }),

        getEventMetadata: () => ({
            supported: [],
            required: [],
            custom: {},
        }),
    };
}