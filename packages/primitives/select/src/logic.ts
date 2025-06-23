/**
 * Template Component Logic
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
import type { TemplateState, TemplateEvents, TemplateOptions } from './types';
import type { TemplateStateStore } from './state';

/**
 * Creates the template component logic using proven LogicLayerBuilder pattern
 * @param state State store to connect to
 * @param options Component options
 * @returns Logic layer for the component
 */
export function createTemplateLogic(
    state: TemplateStateStore,
    options: TemplateOptions = {}
): LogicLayer<TemplateState, TemplateEvents> {
    return new LogicLayerBuilder<TemplateState, TemplateEvents>()
        .onEvent('change', (currentState, payload: any) => {
            // Extract value from payload if provided, otherwise use current state
            let newValue = currentState.value;
            if (payload && typeof payload === 'object' && 'value' in payload) {
                newValue = payload.value;
            }
            
            // Update state
            state.setValue(newValue);
            
            // Call user callback if provided
            if (options.onChange) {
                options.onChange(newValue);
            }
            return null;
        })
        .onEvent('activeChange', (currentState, payload: any) => {
            // Extract active state from payload
            let newActive = currentState.active;
            if (payload && typeof payload === 'object' && 'active' in payload) {
                newActive = payload.active;
            }
            
            // Update state
            state.setActive(newActive);
            
            // Call user callback if provided
            if (options.onActiveChange) {
                options.onActiveChange(newActive);
            }
            return null;
        })
        .onEvent('focus', (currentState, payload: any) => {
            // Handle focus event - extract event from payload if needed
            if (options.onFocus) {
                const event = payload && payload.event ? payload.event : payload;
                options.onFocus(event);
            }
            return null;
        })
        .onEvent('blur', (currentState, payload: any) => {
            // Handle blur event - extract event from payload if needed
            if (options.onBlur) {
                const event = payload && payload.event ? payload.event : payload;
                options.onBlur(event);
            }
            return null;
        })
        .withA11y('root', (state) => ({
            'aria-disabled': state.disabled ? 'true' : undefined,
            'aria-pressed': state.active ? 'true' : undefined,
            'aria-label': `Template component with value: ${state.value}`,
            tabIndex: state.disabled ? -1 : 0,
        }))
        .withInteraction('root', 'onClick', (currentState, event: MouseEvent) => {
            // Prevent interaction if disabled
            if (currentState.disabled) {
                event.preventDefault();
                return null;
            }
            
            // Calculate new active state
            const newActive = !currentState.active;
            
            // Update state
            state.setActive(newActive);
            
            // Return event type to trigger
            return 'activeChange';
        })
        .withInteraction('root', 'onFocus', (currentState, event: FocusEvent) => {
            return 'focus';
        })
        .withInteraction('root', 'onBlur', (currentState, event: FocusEvent) => {
            return 'blur';
        })
        .build();
}