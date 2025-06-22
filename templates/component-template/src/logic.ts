/**
 * Template Component Logic
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
 * - Call state setters directly: state.setValue(), state.setActive()
 * 
 * WHY: Calling state.getState() in reactive contexts creates circular dependencies
 * that cause infinite loops and crash the application.
 */

import { createComponentLogic } from '@stellarix/core';
import type { LogicLayer } from '@stellarix/core';
import type { TemplateState, TemplateEvents, TemplateOptions } from './types';
import type { TemplateStateStore } from './state';

/**
 * Creates the template component logic
 * @param state State store to connect to
 * @param options Component options
 * @returns Logic layer for the component
 */
export function createTemplateLogic(
    state: TemplateStateStore,
    options: TemplateOptions = {}
): LogicLayer<TemplateState, TemplateEvents> {
    // Cache the previous value for change detection
    let previousValue = state.getState().value;
    
    return createComponentLogic<TemplateState, TemplateEvents>('Template', {
        // Event handlers
        events: {
            change: (payload: { value: string; previousValue: string }) => {
                const currentState = state.getState();
                
                // Don't process if disabled
                if (currentState.disabled) {
                    return;
                }
                
                // Update state
                state.setValue(payload.value);
                
                // Call user callback if provided
                if (options.onChange) {
                    options.onChange(payload.value);
                }
            },
            
            activeChange: (payload: { active: boolean }) => {
                const currentState = state.getState();
                
                // Don't process if disabled
                if (currentState.disabled) {
                    return;
                }
                
                // Update state
                state.setActive(payload.active);
                
                // Call user callback if provided
                if (options.onActiveChange) {
                    options.onActiveChange(payload.active);
                }
            },
            
            focus: (payload: { event: FocusEvent }) => {
                // Handle focus event
                // Could update internal focus state if needed
            },
            
            blur: (payload: { event: FocusEvent }) => {
                // Handle blur event
                // Could trigger validation, etc.
            },
        },
        
        // Accessibility props generator
        a11y: {
            root: (state) => ({
                'aria-disabled': state.disabled,
                'aria-pressed': state.active,
                'aria-label': `Template component with value: ${state.value}`,
            }),
        },
        
        // Interaction handlers generator
        interactions: {
            root: (state, handleEvent) => ({
                onClick: (event: MouseEvent) => {
                    if (!state.disabled) {
                        handleEvent('activeChange', { active: !state.active });
                    }
                },
                
                onFocus: (event: FocusEvent) => {
                    handleEvent('focus', { event });
                },
                
                onBlur: (event: FocusEvent) => {
                    handleEvent('blur', { event });
                },
            }),
        },
        
        // State change handler (optional)
        onStateChange: (newState, prevState) => {
            // Detect value changes
            if (newState.value !== previousValue) {
                const oldValue = previousValue;
                previousValue = newState.value;
                
                // Trigger change event
                if (options.onChange) {
                    options.onChange(newState.value);
                }
            }
        },
    });
}