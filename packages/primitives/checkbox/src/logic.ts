/**
 * Checkbox Component Logic
 * Business logic and event handling
 * 
 * 🚨 CRITICAL WARNING: NEVER call state.getState() in this file!
 * 
 * ❌ FORBIDDEN PATTERNS:
 * - const currentState = state.getState(); // CAUSES INFINITE LOOPS!
 * - state.getState() inside event handlers
 * - state.getState() inside getA11yProps()
 * - state.getState() inside getInteractionHandlers()
 * 
 * ✅ CORRECT PATTERNS:
 * - Use (currentState, handleEvent) parameters in interactions
 * - Use (state) parameter in a11y functions
 * - Call state setters directly: state.setChecked(), state.setDisabled()
 * 
 * WHY: Calling state.getState() in reactive contexts creates circular dependencies
 * that cause infinite loops and crash the application.
 */

import { LogicLayerBuilder } from '@stellarix-ui/core';
import type { LogicLayer } from '@stellarix-ui/core';
import type { CheckboxState, CheckboxEvents, CheckboxOptions } from './types';
import type { CheckboxStateStore } from './state';

/**
 * Creates the checkbox component logic
 * @param state State store to connect to
 * @param options Component options
 * @returns Logic layer for the component
 */
export function createCheckboxLogic(
    state: CheckboxStateStore,
    options: CheckboxOptions = {}
): LogicLayer<CheckboxState, CheckboxEvents> {
    // Create a simpler logic layer using the builder approach
    return new LogicLayerBuilder<CheckboxState, CheckboxEvents>()
        .withA11y('root', (state) => ({
            role: 'checkbox',
            'aria-checked': state.checked === 'indeterminate' ? 'mixed' : state.checked,
            'aria-disabled': state.disabled ? 'true' : undefined,
            'aria-required': state.required ? 'true' : undefined,
            'aria-invalid': state.error ? 'true' : undefined,
            'aria-describedby': state.error && state.errorMessage ? `${options.id || 'checkbox'}-error` : undefined,
            tabIndex: state.disabled ? -1 : 0,
        }))
        .withInteraction('root', 'onClick', (currentState, event: MouseEvent) => {
            // Prevent interaction if disabled
            if (currentState.disabled) {
                event.preventDefault();
                return null;
            }
            
            // NEVER call state.getState() - use currentState parameter
            // Calculate new checked state based on current state
            const previousChecked = currentState.checked;
            let newChecked: CheckboxState['checked'];
            if (previousChecked === 'indeterminate') {
                newChecked = true;
            } else {
                newChecked = !previousChecked;
            }
            
            // Toggle the checkbox using state method
            state.setChecked(newChecked);
            
            // Call user callback directly (don't rely on event forwarding)
            if (options.onChange) {
                options.onChange(newChecked);
            }
            
            // Return null (no additional events)
            return null;
        })
        .withInteraction('root', 'onKeyDown', (currentState, event: KeyboardEvent) => {
            // Prevent interaction if disabled
            if (currentState.disabled) {
                return null;
            }
            
            // Handle space key to toggle
            if (event.code === 'Space') {
                event.preventDefault();
                
                // Calculate new checked state based on current state
                const previousChecked = currentState.checked;
                let newChecked: CheckboxState['checked'];
                if (previousChecked === 'indeterminate') {
                    newChecked = true;
                } else {
                    newChecked = !previousChecked;
                }
                
                // Update the checkbox state
                state.setChecked(newChecked);
                
                // Call user callback directly (don't rely on event forwarding)
                if (options.onChange) {
                    options.onChange(newChecked);
                }
            }
            return null;
        })
        .withInteraction('root', 'onFocus', (currentState, event: FocusEvent) => {
            // Update focus state
            state.setFocused(true);
            
            // Call user callback if provided
            if (options.onFocus) {
                options.onFocus(event);
            }
            
            return null;
        })
        .withInteraction('root', 'onBlur', (currentState, event: FocusEvent) => {
            // Update focus state
            state.setFocused(false);
            
            // Call user callback if provided
            if (options.onBlur) {
                options.onBlur(event);
            }
            
            return null;
        })
        .build();
}