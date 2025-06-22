/**
 * Container Component Logic
 * Business logic and event handling
 */

import { createComponentLogic } from '@stellarix/core';
import type { LogicLayer } from '@stellarix/core';
import type { ContainerState, ContainerEvents, ContainerOptions } from './types';
import type { ContainerStateStore } from './state';

/**
 * Creates the container component logic
 * @param state State store to connect to
 * @param options Component options
 * @returns Logic layer for the component
 */
export function createContainerLogic(
    state: ContainerStateStore,
    options: ContainerOptions = {}
): LogicLayer<ContainerState, ContainerEvents> {
    return createComponentLogic<ContainerState, ContainerEvents>('Container', {
        // Container has no events as it's a layout component
        events: {},
        
        // Accessibility props generator
        a11y: {
            root: (_state) => ({
                // Container doesn't need specific ARIA attributes
                // It's a layout component that doesn't have semantic meaning
            }),
        },
        
        // Container has no interaction handlers
        interactions: {
            root: (_state, _handleEvent) => ({}),
        },
        
        // No state change handling needed for container
        onStateChange: undefined,
    });
}