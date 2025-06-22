/**
 * Input Component Logic
 * Business logic and event handling
 */

import { createComponentLogic } from '@stellarix/core';
import type { LogicLayer } from '@stellarix/core';
import type { InputState, InputEvents, InputOptions } from './types';
import type { InputStateStore } from './state';

/**
 * Creates the input component logic
 * @param state State store to connect to
 * @param options Component options
 * @returns Logic layer for the component
 */
export function createInputLogic(
    state: InputStateStore,
    options: InputOptions = {}
): LogicLayer<InputState, InputEvents> {
    // Cache the previous value for change detection - get it once at initialization
    let previousValue = '';
    
    return createComponentLogic<InputState, InputEvents>('Input', {
        // Event handlers
        events: {
            change: (payload: { value: string; previousValue: string }) => {
                // Update state
                state.setValue(payload.value);
                
                // Call user callback if provided
                if (options.onChange) {
                    options.onChange(payload.value);
                }
            },
            
            input: (payload: { value: string }) => {
                // Update state
                state.setValue(payload.value);
                
                // Call user callback if provided
                if (options.onInput) {
                    options.onInput(payload.value);
                }
            },
            
            focus: (payload: { event: FocusEvent }) => {
                // Update focus state
                state.setFocused(true);
                
                // Call user callback if provided
                if (options.onFocus) {
                    options.onFocus(payload.event);
                }
            },
            
            blur: (payload: { event: FocusEvent }) => {
                // Update focus state
                state.setFocused(false);
                
                // Call user callback if provided
                if (options.onBlur) {
                    options.onBlur(payload.event);
                }
            },
            
            keydown: (payload: { event: KeyboardEvent }) => {
                // Handle Enter key for submit
                if (payload.event.key === 'Enter') {
                    // Trigger submit event with current value
                    // The actual handleEvent call will be done by the component
                }
                
                // Call user callback if provided
                if (options.onKeyDown) {
                    options.onKeyDown(payload.event);
                }
            },
            
            submit: (payload: { value: string }) => {
                // Submit is handled by the form or parent component
                // This event is just for notification
            },
        },
        
        // Accessibility props generator
        a11y: {
            root: (state) => ({
                'aria-invalid': state.error || undefined,
                'aria-required': state.required || undefined,
                'aria-disabled': state.disabled || undefined,
                'aria-readonly': state.readonly || undefined,
                'aria-describedby': state.errorMessage ? `${options.id}-error` : undefined,
            }),
        },
        
        // Interaction handlers generator
        interactions: {
            root: (currentState, handleEvent) => ({
                onChange: (event: Event) => {
                    // Check state here to avoid processing when disabled/readonly
                    if (currentState.disabled || currentState.readonly) {
                        return;
                    }
                    
                    const target = event.target as HTMLInputElement;
                    const newValue = target.value;
                    
                    if (newValue !== previousValue) {
                        handleEvent('change', { 
                            value: newValue, 
                            previousValue 
                        });
                        previousValue = newValue;
                    }
                },
                
                onInput: (event: Event) => {
                    // Check state here to avoid processing when disabled/readonly
                    if (currentState.disabled || currentState.readonly) {
                        return;
                    }
                    
                    const target = event.target as HTMLInputElement;
                    handleEvent('input', { value: target.value });
                },
                
                onFocus: (event: FocusEvent) => {
                    handleEvent('focus', { event });
                },
                
                onBlur: (event: FocusEvent) => {
                    handleEvent('blur', { event });
                },
                
                onKeyDown: (event: KeyboardEvent) => {
                    handleEvent('keydown', { event });
                    
                    // Handle Enter key for submit
                    if (event.key === 'Enter' && !currentState.disabled && !currentState.readonly) {
                        handleEvent('submit', { value: currentState.value });
                    }
                },
            }),
        },
        
        // State change handler (optional)
        onStateChange: (newState, prevState) => {
            // Handle value changes that didn't come through events
            if (newState.value !== previousValue) {
                previousValue = newState.value;
                
                // Don't trigger onChange here as it should only fire on user input
            }
        },
    });
}