/**
 * Input Component Logic
 * Business logic and event handling
 * 
 * 🚨 CRITICAL: NEVER call state.getState() in this file!
 * ✅ Use currentState parameter in interactions
 * ✅ Use state parameter in a11y functions
 */

import { LogicLayerBuilder } from '@stellarix-ui/core';
import type { LogicLayer } from '@stellarix-ui/core';
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
    // Cache the previous value for change detection
    let previousValue = '';
    
    const baseLogic = new LogicLayerBuilder<InputState, InputEvents>()
        // Event handlers
        .onEvent('change', (currentState, payload: any) => {
            // Don't process if disabled or readonly
            if (currentState.disabled || currentState.readonly) {
                return null;
            }
            
            const value = payload?.value !== undefined ? payload.value : payload;
            const prevValue = payload?.previousValue !== undefined ? payload.previousValue : previousValue;
            
            // Update state
            state.setValue(value);
            previousValue = value;
            
            // Call user callback if provided
            if (options.onChange) {
                options.onChange(value);
            }
            
            return null;
        })
        .onEvent('input', (currentState, payload: any) => {
            // Don't process if disabled or readonly
            if (currentState.disabled || currentState.readonly) {
                return null;
            }
            
            const value = payload?.value !== undefined ? payload.value : payload;
            
            // Update state
            state.setValue(value);
            
            // Call user callback if provided
            if (options.onInput) {
                options.onInput(value);
            }
            
            return null;
        })
        .onEvent('focus', (_currentState, payload: any) => {
            const event = payload?.event ? payload.event : payload;
            
            // Update focus state
            state.setFocused(true);
            
            // Call user callback if provided
            if (options.onFocus) {
                options.onFocus(event);
            }
            
            return null;
        })
        .onEvent('blur', (_currentState, payload: any) => {
            const event = payload?.event ? payload.event : payload;
            
            // Update focus state
            state.setFocused(false);
            
            // Call user callback if provided
            if (options.onBlur) {
                options.onBlur(event);
            }
            
            return null;
        })
        .onEvent('keydown', (_currentState, payload: any) => {
            const event = payload?.event ? payload.event : payload;
            
            // Call user callback if provided
            if (options.onKeyDown) {
                options.onKeyDown(event);
            }
            
            return null;
        })
        .onEvent('submit', (_currentState, payload: any) => {
            const value = payload?.value !== undefined ? payload.value : payload;
            
            // Submit is handled by the form or parent component
            // This event is just for notification
            if (options.onSubmit) {
                options.onSubmit(value);
            }
            
            return null;
        })
        // A11y props
        .withA11y('root', (state) => {
            const a11yProps: Record<string, any> = {};
            
            if (state.error) a11yProps['aria-invalid'] = 'true';
            if (state.required) a11yProps['aria-required'] = 'true';
            if (state.disabled) a11yProps['aria-disabled'] = 'true';
            if (state.readonly) a11yProps['aria-readonly'] = 'true';
            if (state.errorMessage && options.id) {
                a11yProps['aria-describedby'] = `${options.id}-error`;
            }
            
            return a11yProps;
        })
        // Interaction handlers
        .withInteraction('root', 'onChange', (currentState, event) => {
            // Check state here to avoid processing when disabled/readonly
            if (currentState.disabled || currentState.readonly) {
                return null;
            }
            
            const target = event.target as HTMLInputElement;
            const newValue = target.value;
            
            if (newValue !== previousValue) {
                // Update state immediately
                state.setValue(newValue);
                previousValue = newValue;
                
                // Call user callback if provided
                if (options.onChange) {
                    options.onChange(newValue);
                }
                
                return null;
            }
            
            return null;
        })
        .withInteraction('root', 'onInput', (currentState, event) => {
            // Check state here to avoid processing when disabled/readonly
            if (currentState.disabled || currentState.readonly) {
                return null;
            }
            
            const target = event.target as HTMLInputElement;
            state.setValue(target.value);
            
            // Call user callback if provided
            if (options.onInput) {
                options.onInput(target.value);
            }
            
            return null;
        })
        .withInteraction('root', 'onFocus', (currentState, event) => {
            state.setFocused(true);
            
            // Call user callback if provided
            if (options.onFocus) {
                options.onFocus(event);
            }
            
            return null;
        })
        .withInteraction('root', 'onBlur', (currentState, event) => {
            state.setFocused(false);
            
            // Call user callback if provided
            if (options.onBlur) {
                options.onBlur(event);
            }
            
            return null;
        })
        .withInteraction('root', 'onKeyDown', (currentState, event) => {
            // Call user callback if provided
            if (options.onKeyDown) {
                options.onKeyDown(event);
            }
            
            // Handle Enter key for submit
            if (event.key === 'Enter' && !currentState.disabled && !currentState.readonly) {
                if (options.onSubmit) {
                    options.onSubmit(currentState.value);
                }
            }
            
            return null;
        })
        .build();
    
    return baseLogic;
}