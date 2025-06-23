/**
 * Radio Component Logic
 * Business logic and event handling using proven LogicLayerBuilder pattern
 * 
 * 🚨🚨🚨 ULTRA-CRITICAL WARNING: NEVER call state.getState() in this file!
 * 
 * ❌❌❌ FORBIDDEN PATTERNS - WILL CAUSE INFINITE LOOPS:
 * - const currentState = state.getState(); // 🚨 INFINITE LOOP!
 * - state.getState() inside withInteraction callbacks // 🚨 INFINITE LOOP!
 * - state.getState() inside onEvent handlers // 🚨 INFINITE LOOP!
 * - state.getState() inside withA11y functions // 🚨 INFINITE LOOP!
 * 
 * ✅✅✅ CORRECT PATTERNS - PROVEN FROM CHECKBOX SUCCESS (30/30 tests):
 * - Use LogicLayerBuilder pattern for clean implementation
 * - Use (currentState, event) parameters in withInteraction callbacks
 * - Use (state) parameter in withA11y functions
 * - Handle event payload extraction: const event = payload?.event ? payload.event : payload
 * - Support both direct events and wrapped { event } payloads
 * - Call state setters directly: state.setChecked(), state.setDisabled()
 * - Test via callbacks, not state inspection
 */

import { LogicLayerBuilder } from '@stellarix-ui/core';
import type { LogicLayer } from '@stellarix-ui/core';
import type { RadioState, RadioEvents, RadioOptions } from './types';
import type { RadioStateStore } from './state';

/**
 * Creates the radio component logic using proven LogicLayerBuilder pattern
 * @param state State store to connect to
 * @param options Component options
 * @returns Logic layer for the component
 */
export function createRadioLogic(
    state: RadioStateStore,
    options: RadioOptions
): LogicLayer<RadioState, RadioEvents> {
    return new LogicLayerBuilder<RadioState, RadioEvents>()
        .onEvent('change', (currentState, payload: any) => {
            // Extract checked and value from payload if provided, otherwise use current state
            let newChecked = currentState.checked;
            let value = currentState.value;
            
            if (payload && typeof payload === 'object') {
                if ('checked' in payload) newChecked = payload.checked;
                if ('value' in payload) value = payload.value;
            }
            
            // Update state
            state.setChecked(newChecked);
            
            // Call user callback if provided
            if (options.onChange) {
                options.onChange(newChecked, value);
            }
            return null;
        })
        .onEvent('focus', (currentState, payload: any) => {
            // Update focus state
            state.setFocused(true);
            
            // Handle focus event - extract event from payload if needed
            if (options.onFocus) {
                const event = payload && payload.event ? payload.event : payload;
                options.onFocus(event);
            }
            return null;
        })
        .onEvent('blur', (currentState, payload: any) => {
            // Update focus state
            state.setFocused(false);
            
            // Handle blur event - extract event from payload if needed
            if (options.onBlur) {
                const event = payload && payload.event ? payload.event : payload;
                options.onBlur(event);
            }
            return null;
        })
        .onEvent('keydown', (currentState, payload: any) => {
            // Handle keydown events for arrow key navigation within radio group
            // This is for future radio group functionality
            return null;
        })
        .withA11y('root', (state) => ({
            role: 'radio',
            'aria-checked': state.checked,
            'aria-disabled': state.disabled ? 'true' : undefined,
            'aria-required': state.required ? 'true' : undefined,
            'aria-invalid': state.error ? 'true' : undefined,
            'aria-describedby': state.error && state.errorMessage ? `${options.id || 'radio'}-error` : undefined,
            tabIndex: state.disabled ? -1 : 0,
        }))
        .withInteraction('root', 'onClick', (currentState, event: MouseEvent) => {
            // Prevent interaction if disabled
            if (currentState.disabled) {
                event.preventDefault();
                return null;
            }
            
            // Radio buttons should only be checked, not unchecked on click
            // (Unlike checkboxes, radio buttons are mutually exclusive)
            if (!currentState.checked) {
                // Set to checked
                state.setChecked(true);
                
                // Call user callback if provided
                if (options.onChange) {
                    options.onChange(true, currentState.value);
                }
                
                // Return event type to trigger change event
                return 'change';
            }
            
            // If already checked, do nothing (radio behavior)
            return null;
        })
        .withInteraction('root', 'onKeyDown', (currentState, event: KeyboardEvent) => {
            // Prevent interaction if disabled
            if (currentState.disabled) {
                return null;
            }
            
            // Handle space key to select radio (like clicking)
            if (event.code === 'Space') {
                event.preventDefault();
                
                if (!currentState.checked) {
                    state.setChecked(true);
                    
                    // Call user callback if provided
                    if (options.onChange) {
                        options.onChange(true, currentState.value);
                    }
                    
                    return 'change';
                }
            }
            
            // Handle arrow keys for radio group navigation (future feature)
            if (event.code === 'ArrowUp' || event.code === 'ArrowDown' || 
                event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
                // For now, just trigger keydown event
                return 'keydown';
            }
            
            return null;
        })
        .withInteraction('root', 'onFocus', (currentState, event: FocusEvent) => {
            return 'focus';
        })
        .withInteraction('root', 'onBlur', (currentState, event: FocusEvent) => {
            return 'blur';
        })
        .build();
}