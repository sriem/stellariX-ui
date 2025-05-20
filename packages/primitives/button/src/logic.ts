/**
 * Button Logic Module
 */

import { Store, createLogicLayer } from '@stellarix/core';
import { getButtonA11yProps } from '@stellarix/utils';
import { ButtonState, ButtonEvents, ButtonOptions } from './types';

/**
 * Creates the button logic
 * @param store Button state store
 * @param options Button options
 * @returns Button logic layer
 */
export function createButtonLogic(
    store: Store<ButtonState>,
    options: ButtonOptions = {}
) {
    // Event handlers
    const handlers = {
        CLICK: (state: ButtonState, payload: ButtonEvents['CLICK']) => {
            // Call the onClick callback if provided
            if (options.onClick && !state.disabled && !state.loading) {
                options.onClick(payload.originalEvent);
            }

            return null; // No state update needed
        },

        FOCUS: () => {
            return { focused: true };
        },

        BLUR: () => {
            return { focused: false };
        },

        MOUSE_DOWN: () => {
            return { pressed: true };
        },

        MOUSE_UP: () => {
            return { pressed: false };
        },
    };

    // A11y configuration
    const a11yConfig = {
        button: (state: ButtonState) => {
            return {
                role: 'button',
                'aria-disabled': state.disabled ? 'true' : undefined,
                'aria-pressed': state.pressed ? 'true' : undefined,
                ...(state.ariaAttributes || {}),
            };
        },
    };

    // Interaction configuration
    const interactionConfig = {
        button: {
            onClick: (state: ButtonState, event: MouseEvent) => {
                if (state.disabled || state.loading) {
                    event.preventDefault();
                    return null;
                }
                return 'CLICK';
            },
            onKeyDown: (state: ButtonState, event: KeyboardEvent) => {
                if (state.disabled || state.loading) {
                    return null;
                }

                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    return 'CLICK';
                }

                return null;
            },
            onFocus: () => 'FOCUS',
            onBlur: () => 'BLUR',
            onMouseDown: () => 'MOUSE_DOWN',
            onMouseUp: () => 'MOUSE_UP',
        },
    };

    // Create the logic layer
    return createLogicLayer<ButtonState, ButtonEvents>(
        store,
        handlers,
        a11yConfig,
        interactionConfig
    );
} 