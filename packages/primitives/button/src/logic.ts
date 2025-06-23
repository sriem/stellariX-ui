/**
 * Button logic layer implementation
 * 
 * 🚨 CRITICAL: NEVER call state.getState() in this file!
 * ✅ Use currentState parameter in interactions
 * ✅ Use state parameter in a11y functions
 * ✅ Call state setters directly
 */

import { LogicLayerBuilder } from '@stellarix-ui/core';
import { generateComponentId } from '@stellarix-ui/utils';
import type { ButtonState, ButtonEvents, ButtonOptions } from './types.js';
import type { ButtonStateStore } from './state.js';

export function createButtonLogic(
    state: ButtonStateStore,
    options: ButtonOptions = {}
) {
    const componentId = generateComponentId('button');
    
    return new LogicLayerBuilder<ButtonState, ButtonEvents>()
        .onEvent('click', (_currentState, payload: any) => {
            // Extract event from payload
            const event = payload && payload.event ? payload.event : payload;
            
            // Call external onClick handler
            if (options.onClick) {
                options.onClick(event);
            }
            return null;
        })
        .onEvent('focus', (_currentState, payload: any) => {
            // Update focus state
            state.setFocused(true);
            
            // Extract event from payload
            const event = payload && payload.event ? payload.event : payload;
            
            if (options.onFocus) {
                options.onFocus(event);
            }
            return null;
        })
        .onEvent('blur', (_currentState, payload: any) => {
            // Update focus state
            state.setFocused(false);
            
            // Extract event from payload
            const event = payload && payload.event ? payload.event : payload;
            
            if (options.onBlur) {
                options.onBlur(event);
            }
            return null;
        })
        .onEvent('keydown', (_currentState, payload: any) => {
            // Extract event from payload
            const event = payload && payload.event ? payload.event : payload;
            
            // Handle Space and Enter keys
            if (event.key === ' ' || event.key === 'Enter') {
                event.preventDefault();
                
                // Simulate click
                if (options.onClick) {
                    const syntheticEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true
                    });
                    options.onClick(syntheticEvent);
                }
            }
            return null;
        })
        .withA11y('root', (state) => ({
            role: 'button',
            'aria-pressed': state.pressed,
            'aria-disabled': state.disabled,
            'aria-busy': state.loading,
            tabIndex: state.disabled ? -1 : 0,
            id: componentId
        }))
        .withInteraction('root', 'onClick', (currentState, event: MouseEvent) => {
            // Prevent interaction if disabled or loading
            if (currentState.disabled || currentState.loading) {
                event.preventDefault();
                return null;
            }
            
            // Trigger click event
            return 'click';
        })
        .withInteraction('root', 'onFocus', (_currentState, _event: FocusEvent) => {
            // Always allow focus events
            return 'focus';
        })
        .withInteraction('root', 'onBlur', (_currentState, _event: FocusEvent) => {
            // Always allow blur events
            return 'blur';
        })
        .withInteraction('root', 'onKeyDown', (currentState, event: KeyboardEvent) => {
            // Prevent interaction if disabled or loading
            if (currentState.disabled || currentState.loading) {
                // For keyboard events on disabled buttons, we prevent default
                if (event.key === ' ' || event.key === 'Enter') {
                    event.preventDefault();
                }
                return null;
            }
            
            // Trigger keydown event
            return 'keydown';
        })
        .withInteraction('root', 'onMouseDown', (currentState, _event: MouseEvent) => {
            if (!currentState.disabled && !currentState.loading) {
                state.setPressed(true);
            }
            return null;
        })
        .withInteraction('root', 'onMouseUp', (_currentState, _event: MouseEvent) => {
            state.setPressed(false);
            return null;
        })
        .withInteraction('root', 'onMouseLeave', (_currentState, _event: MouseEvent) => {
            state.setPressed(false);
            return null;
        })
        .build();
}