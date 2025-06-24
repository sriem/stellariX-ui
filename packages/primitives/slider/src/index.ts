/**
 * Slider Component
 * Main entry point and public API
 */

import { createPrimitive } from '@stellarix-ui/core';
import { createSliderState } from './state';
import { createSliderLogic } from './logic';
import type { SliderOptions, SliderState, SliderEvents } from './types';

/**
 * Creates a slider component factory
 * @param options Component options
 * @returns Component factory
 */
export function createSlider(options: SliderOptions = {}) {
    return createPrimitive<SliderState, SliderEvents, SliderOptions>('Slider', {
        initialState: options,
        logicConfig: options,
        metadata: {
            accessibility: {
                role: 'slider',
                keyboardShortcuts: ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'],
                ariaAttributes: ['aria-valuemin', 'aria-valuemax', 'aria-valuenow', 'aria-orientation', 'aria-disabled'],
                wcagLevel: 'AA',
                patterns: ['keyboard-navigation', 'range-input']
            },
            events: {
                supported: ['change', 'dragStart', 'dragEnd', 'focus', 'blur'],
                required: [],
                custom: {
                    'change': 'Fired when slider value changes',
                    'dragStart': 'Fired when user starts dragging',
                    'dragEnd': 'Fired when user stops dragging'
                }
            },
            structure: {
                elements: {
                    'root': {
                        type: 'div',
                        role: 'none',
                        optional: false
                    },
                    'track': {
                        type: 'div',
                        role: 'none',
                        optional: false
                    },
                    'thumb': {
                        type: 'div',
                        role: 'slider',
                        optional: false
                    },
                    'thumbMin': {
                        type: 'div',
                        role: 'slider',
                        optional: true // Only for range sliders
                    },
                    'thumbMax': {
                        type: 'div',
                        role: 'slider',
                        optional: true // Only for range sliders
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
export function createSliderWithImplementation(options: SliderOptions = {}) {
    const core = createSlider(options);
    
    // Attach the actual implementation
    core.state = createSliderState(options);
    core.logic = createSliderLogic(core.state as any, options);
    
    return core;
}

// Re-export types
export type { 
    SliderOptions, 
    SliderState, 
    SliderEvents, 
    SliderProps 
} from './types';

export type { SliderStateStore } from './state';

// Default export for convenience
export default createSliderWithImplementation;