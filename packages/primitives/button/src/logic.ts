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
                // Call external onClick handler - disabled/loading checks done at interaction level
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
                // Handle Space and Enter keys - disabled/loading checks done at interaction level
                if (payload.event.key === ' ' || payload.event.key === 'Enter') {
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
            root: (currentState, handleEvent) => ({
                onClick: (event: MouseEvent) => {
                    // Check disabled/loading state here
                    if (currentState.disabled || currentState.loading) {
                        event.preventDefault();
                        return;
                    }
                    handleEvent('click', { event });
                },
                onFocus: (event: FocusEvent) => {
                    handleEvent('focus', { event });
                },
                onBlur: (event: FocusEvent) => {
                    handleEvent('blur', { event });
                },
                onKeyDown: (event: KeyboardEvent) => {
                    // Check disabled/loading state here
                    if (currentState.disabled || currentState.loading) {
                        return;
                    }
                    handleEvent('keydown', { event });
                },
                onMouseDown: (_event: MouseEvent) => {
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