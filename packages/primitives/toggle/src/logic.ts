/**
 * Toggle Component Logic
 * Business logic and event handling
 * 
 * 🚨🚨🚨 ULTRA-CRITICAL WARNING: NEVER call state.getState() in this file!
 * 
 * ❌❌❌ FORBIDDEN PATTERNS - WILL CAUSE INFINITE LOOPS:
 * - const currentState = state.getState(); // 🚨 INFINITE LOOP!
 * - state.getState() inside withInteraction callbacks // 🚨 INFINITE LOOP!
 * - state.getState() inside onEvent handlers // 🚨 INFINITE LOOP!
 * - state.getState() inside withA11y functions // 🚨 INFINITE LOOP!
 * - using createComponentLogic (causes complex circular deps)
 * 
 * ✅✅✅ CORRECT PATTERNS - LEARNED FROM CHECKBOX SUCCESS:
 * - Use LogicLayerBuilder pattern for clean implementation
 * - Use (currentState, event) parameters in withInteraction callbacks
 * - Use (state) parameter in withA11y functions
 * - Handle event payload extraction: const event = payload?.event ? payload.event : payload
 * - Support both direct events and wrapped { event } payloads
 * - Call state setters directly: state.setValue(), state.setActive()
 * - Test via callbacks, not state inspection
 * 
 * WHY: Calling state.getState() in reactive contexts creates circular dependencies
 * that cause infinite loops and crash the application. This has been proven 8+ times.
 * 
 * PROVEN WORKING PATTERN (Checkbox component - 30/30 tests passing):
 */

import { LogicLayerBuilder } from '@stellarix/core';
import type { LogicLayer } from '@stellarix/core';
import type { ToggleState, ToggleEvents, ToggleOptions } from './types';
import type { ToggleStateStore } from './state';

/**
 * Creates the toggle component logic using proven LogicLayerBuilder pattern
 * @param state State store to connect to
 * @param options Component options
 * @returns Logic layer for the component
 */
export function createToggleLogic(
    state: ToggleStateStore,
    options: ToggleOptions = {}
): LogicLayer<ToggleState, ToggleEvents> {
    return new LogicLayerBuilder<ToggleState, ToggleEvents>()
        .onEvent('change', (currentState, payload: any) => {
            // Extract checked state from payload
            let newChecked = currentState.checked;
            if (payload && typeof payload === 'object' && 'checked' in payload) {
                newChecked = payload.checked;
            }
            
            // Update state
            state.setChecked(newChecked);
            
            // Call user callback if provided
            if (options.onChange) {
                options.onChange(newChecked);
            }
            return null;
        })
        .onEvent('focus', (currentState, payload: any) => {
            // Handle focus event
            state.setFocused(true);
            if (options.onFocus) {
                const event = payload && payload.event ? payload.event : payload;
                options.onFocus(event);
            }
            return null;
        })
        .onEvent('blur', (currentState, payload: any) => {
            // Handle blur event
            state.setFocused(false);
            if (options.onBlur) {
                const event = payload && payload.event ? payload.event : payload;
                options.onBlur(event);
            }
            return null;
        })
        .withA11y('root', (state) => ({
            'aria-checked': state.checked ? 'true' : 'false',
            'aria-disabled': state.disabled ? 'true' : undefined,
            role: 'switch',
            tabIndex: state.disabled ? -1 : 0,
        }))
        .withInteraction('root', 'onClick', (currentState, event: MouseEvent) => {
            // Prevent interaction if disabled
            if (currentState.disabled) {
                event.preventDefault();
                return null;
            }
            
            // Toggle checked state
            const newChecked = !currentState.checked;
            state.setChecked(newChecked);
            
            // Return event type to trigger
            return 'change';
        })
        .withInteraction('root', 'onKeyDown', (currentState, event: KeyboardEvent) => {
            // Handle Space key to toggle
            if (event.key === ' ' && !currentState.disabled) {
                event.preventDefault();
                const newChecked = !currentState.checked;
                state.setChecked(newChecked);
                return 'change';
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