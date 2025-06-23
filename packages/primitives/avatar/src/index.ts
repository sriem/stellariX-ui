/**
 * Avatar Component
 * Main entry point and public API
 */

import { createPrimitive } from '@stellarix/core';
import { createAvatarState } from './state';
import { createAvatarLogic } from './logic';
import type { AvatarOptions, AvatarState, AvatarEvents } from './types';

/**
 * Creates an avatar component factory
 * @param options Component options
 * @returns Component factory
 */
export function createAvatar(options: AvatarOptions = {}) {
    return createPrimitive<AvatarState, AvatarEvents, AvatarOptions>('Avatar', {
        initialState: options,
        logicConfig: options,
        metadata: {
            accessibility: {
                role: 'img',
                keyboardShortcuts: [],
                ariaAttributes: ['aria-label'],
                wcagLevel: 'AA',
                patterns: []
            },
            events: {
                supported: ['load', 'error', 'click'],
                required: [],
                custom: {}
            },
            structure: {
                elements: {
                    'root': {
                        type: 'div',
                        role: 'presentation',
                        optional: false
                    },
                    'image': {
                        type: 'img',
                        role: 'img',
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
export function createAvatarWithImplementation(options: AvatarOptions = {}) {
    const core = createAvatar(options);
    
    // Attach the actual implementation
    core.state = createAvatarState(options);
    core.logic = createAvatarLogic(core.state as any, options);
    
    return core;
}

// Re-export types
export type { 
    AvatarOptions, 
    AvatarState, 
    AvatarEvents, 
    AvatarProps,
    AvatarVariant,
    AvatarSize,
    AvatarShape
} from './types';

export type { AvatarStateStore } from './state';

// Default export for convenience
export default createAvatarWithImplementation;