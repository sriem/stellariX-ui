import { createComponentLogic } from '@stellarix/core';
import { generateComponentId } from '@stellarix/utils';
import type { ButtonState, ButtonEvents, ButtonOptions } from './types.js';
import type { ButtonStateStore } from './state.js';

export function createButtonLogic(
    state: ButtonStateStore,
    options: ButtonOptions
) {
    const componentId = generateComponentId('button');
    
    return createComponentLogic<ButtonState, ButtonEvents>('Button', {
        events: {
            click: (payload: { event: MouseEvent }) => {
                const currentState = state.getState();
                
                // Don't handle click if disabled or loading
                if (currentState.disabled || currentState.loading) {
                    payload.event.preventDefault();
                    return;
                }
                
                // Call external onClick handler
                if (options.onClick) {
                    options.onClick(payload.event);
                }
            },
            
            focus: (payload: { event: FocusEvent }) => {
                state.setFocused(true);
                
                if (options.onFocus) {
                    options.onFocus(payload.event);
                }
            },
            
            blur: (payload: { event: FocusEvent }) => {
                state.setFocused(false);
                
                if (options.onBlur) {
                    options.onBlur(payload.event);
                }
            },
            
            keydown: (payload: { event: KeyboardEvent }) => {
                const currentState = state.getState();
                
                // Handle Space and Enter keys
                if (payload.event.key === ' ' || payload.event.key === 'Enter') {
                    if (!currentState.disabled && !currentState.loading) {
                        payload.event.preventDefault();
                        
                        // Simulate click
                        if (options.onClick) {
                            const syntheticEvent = new MouseEvent('click', {
                                bubbles: true,
                                cancelable: true
                            });
                            options.onClick(syntheticEvent);
                        }
                    }
                }
            }
        },
        
        a11y: {
            root: (state) => ({
                role: 'button',
                'aria-pressed': state.pressed,
                'aria-disabled': state.disabled,
                'aria-busy': state.loading,
                tabIndex: state.disabled ? -1 : 0,
                id: componentId
            })
        },
        
        interactions: {
            root: (_currentState) => ({
                onClick: (event: MouseEvent) => {
                    // This will trigger the 'click' event handler
                    return event;
                },
                onFocus: (event: FocusEvent) => {
                    // This will trigger the 'focus' event handler
                    return event;
                },
                onBlur: (event: FocusEvent) => {
                    // This will trigger the 'blur' event handler
                    return event;
                },
                onKeyDown: (event: KeyboardEvent) => {
                    // This will trigger the 'keydown' event handler
                    return event;
                },
                onMouseDown: (_event: MouseEvent) => {
                    const currentState = state.getState();
                    if (!currentState.disabled && !currentState.loading) {
                        state.setPressed(true);
                    }
                },
                onMouseUp: (_event: MouseEvent) => {
                    state.setPressed(false);
                },
                onMouseLeave: (_event: MouseEvent) => {
                    state.setPressed(false);
                }
            })
        }
    });
}