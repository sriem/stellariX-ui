/**
 * Container Component
 * Main entry point and public API
 */

import { createPrimitive } from '@stellarix/core';
import { createContainerState } from './state';
import { createContainerLogic } from './logic';
import type { ContainerOptions, ContainerState, ContainerEvents } from './types';

/**
 * Creates a container component factory
 * @param options Component options
 * @returns Component factory
 */
export function createContainer(options: ContainerOptions = {}) {
    return createPrimitive<ContainerState, ContainerEvents, ContainerOptions>('Container', {
        initialState: options,
        logicConfig: options,
        metadata: {
            accessibility: {
                role: undefined, // Container has no semantic role
                keyboardShortcuts: [],
                ariaAttributes: [],
                wcagLevel: 'AA',
                patterns: []
            },
            events: {
                supported: [], // Container has no events
                required: [],
                custom: {}
            },
            structure: {
                elements: {
                    'root': {
                        type: 'div',
                        role: undefined, // No ARIA role for layout containers
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
export function createContainerWithImplementation(options: ContainerOptions = {}) {
    const core = createContainer(options);
    
    // Attach the actual implementation
    core.state = createContainerState(options);
    core.logic = createContainerLogic(core.state as any, options);
    
    return core;
}

// Re-export types
export type { 
    ContainerOptions, 
    ContainerState, 
    ContainerEvents, 
    ContainerProps,
    ContainerSize,
    ContainerVariant
} from './types';

export type { ContainerStateStore } from './state';

// Default export for convenience
export default createContainerWithImplementation;