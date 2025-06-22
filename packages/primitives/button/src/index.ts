/**
 * Button Component
 * A framework-agnostic button component
 */

import { ComponentFactory } from '@stellarix/core';
import { createButtonState } from './state';
import { createButtonLogic } from './logic';
import { ButtonState, ButtonEvents, ButtonOptions } from './types';

export * from './types';

/**
 * Creates a button component
 * @param options Button options
 * @returns Button component factory
 */
export function createButton(options: ButtonOptions = {}): ComponentFactory<ButtonState, ButtonEvents, ButtonOptions> {
    // Create state
    const state = createButtonState(options);

    // Create logic
    const logic = createButtonLogic(state, options);

    // Return component factory
    return {
        state,
        logic,
        options,
        connect: (adapter) => adapter.createComponent(state, logic, (props) => {
            const { state, getA11yProps, getHandlers } = props;

            // Extract data attributes
            const dataAttrs = Object.entries(state.dataAttributes || {}).reduce((acc, [key, value]) => {
                acc[`data-${key}`] = value;
                return acc;
            }, {} as Record<string, string>);

            // Determine button appearance based on state
            const variant = state.variant;
            const size = state.size;
            const isDisabled = state.disabled;
            const isLoading = state.loading;

            // Get a11y props and handlers
            const a11yProps = getA11yProps('button');
            const handlers = getHandlers('button');

            // Return component implementation
            return {
                type: 'button',
                props: {
                    ...a11yProps,
                    ...handlers,
                    ...dataAttrs,
                    disabled: isDisabled || isLoading,
                    type: options.type || 'button',
                    'data-variant': variant,
                    'data-size': size,
                    'data-loading': isLoading ? 'true' : undefined,
                    'data-disabled': isDisabled ? 'true' : undefined,
                    'data-pressed': state.pressed ? 'true' : undefined,
                    'data-focused': state.focused ? 'true' : undefined,
                },
            };
        }),
    };
} 