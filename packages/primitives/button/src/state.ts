/**
 * Button State Module
 */

import { createStore } from '@stellarix/core';
import { ButtonState, ButtonOptions } from './types';

/**
 * Creates the button state
 * @param options Button options
 * @returns Button state store
 */
export function createButtonState(options: ButtonOptions = {}) {
    // Default values
    const initialState: ButtonState = {
        variant: options.variant || 'default',
        size: options.size || 'md',
        loading: options.loading || false,
        disabled: options.disabled || false,
        pressed: false,
        focused: false,
        hovered: false,
        dataAttributes: {},
        ariaAttributes: {
            'aria-label': options.ariaLabel,
            'aria-disabled': options.disabled ? 'true' : undefined,
            'aria-pressed': undefined,
        },
    };

    // Create the store
    const store = createStore<ButtonState>(initialState);

    return store;
} 