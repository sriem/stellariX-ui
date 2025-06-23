/**
 * Textarea Component Logic
 * Business logic and event handling for multi-line text input
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
 * - Call state setters directly: state.setValue(), state.setFocused()
 * - Test via callbacks, not state inspection
 * 
 * WHY: Calling state.getState() in reactive contexts creates circular dependencies
 * that cause infinite loops and crash the application. This has been proven 8+ times.
 * 
 * PROVEN WORKING PATTERN (Checkbox component - 30/30 tests passing):
 */

import { LogicLayerBuilder } from '@stellarix-ui/core';
import type { LogicLayer } from '@stellarix-ui/core';
import type { TextareaState, TextareaEvents, TextareaOptions, TextareaVariant } from './types';
import type { TextareaStateStore } from './state';

/**
 * Calculate the number of rows needed for autogrow textarea
 * @param value Current text value
 * @param minRows Minimum number of rows
 * @param maxRows Maximum number of rows
 * @returns Number of rows to display
 */
function calculateRows(value: string, minRows: number, maxRows: number): number {
    const lineCount = value.split('\n').length;
    // Account for wrapped lines (rough estimate - 80 chars per line)
    const longLines = value.split('\n').filter(line => line.length > 80).length;
    const estimatedRows = lineCount + longLines;
    
    return Math.max(minRows, Math.min(maxRows, estimatedRows));
}

/**
 * Creates the textarea component logic using proven LogicLayerBuilder pattern
 * @param state State store to connect to
 * @param options Component options
 * @returns Logic layer for the component
 */
export function createTextareaLogic(
    state: TextareaStateStore,
    options: TextareaOptions = {}
): LogicLayer<TextareaState, TextareaEvents> {
    return new LogicLayerBuilder<TextareaState, TextareaEvents>()
        .onEvent('change', (currentState, payload: any) => {
            // Extract value from payload if provided
            let newValue = currentState.value;
            if (payload && typeof payload === 'object' && 'value' in payload) {
                newValue = payload.value;
            } else if (typeof payload === 'string') {
                newValue = payload;
            }
            
            // Update state
            state.setValue(newValue);
            
            // For autogrow variant, calculate and update rows
            if (options.variant === 'autogrow') {
                const newRows = calculateRows(newValue, currentState.minRows, currentState.maxRows);
                state.setRows(newRows);
            }
            
            // Call user callback if provided
            if (options.onChange) {
                options.onChange(newValue);
            }
            return null;
        })
        .onEvent('focus', (currentState, payload: any) => {
            // Update focus state
            state.setFocused(true);
            
            // Call user callback if provided
            if (options.onFocus) {
                options.onFocus();
            }
            return null;
        })
        .onEvent('blur', (currentState, payload: any) => {
            // Update focus state
            state.setFocused(false);
            
            // Call user callback if provided
            if (options.onBlur) {
                options.onBlur();
            }
            return null;
        })
        .onEvent('input', (currentState, payload: any) => {
            // Extract value from payload
            let newValue = currentState.value;
            if (payload && typeof payload === 'object' && 'value' in payload) {
                newValue = payload.value;
            } else if (typeof payload === 'string') {
                newValue = payload;
            }
            
            // Update state
            state.setValue(newValue);
            
            // For autogrow variant, calculate and update rows
            if (options.variant === 'autogrow') {
                const newRows = calculateRows(newValue, currentState.minRows, currentState.maxRows);
                state.setRows(newRows);
            }
            
            return null;
        })
        .withA11y('root', (state) => ({
            'aria-disabled': state.disabled ? 'true' : undefined,
            'aria-readonly': state.readonly ? 'true' : undefined,
            'aria-invalid': state.error ? 'true' : undefined,
            'aria-required': options.required ? 'true' : undefined,
            'aria-multiline': 'true',
            rows: state.rows,
            disabled: state.disabled || undefined,
            readOnly: state.readonly || undefined,
            required: options.required || undefined,
            placeholder: options.placeholder,
            maxLength: options.maxLength,
        }))
        .withInteraction('root', 'onChange', (currentState, event: Event) => {
            // Prevent interaction if disabled or readonly
            if (currentState.disabled || currentState.readonly) {
                event.preventDefault();
                return null;
            }
            
            // Get the new value from the textarea
            const target = event.target as HTMLTextAreaElement;
            const newValue = target.value;
            
            // Update state
            state.setValue(newValue);
            
            // Return event type to trigger
            return 'change';
        })
        .withInteraction('root', 'onInput', (currentState, event: Event) => {
            // Prevent interaction if disabled or readonly
            if (currentState.disabled || currentState.readonly) {
                event.preventDefault();
                return null;
            }
            
            // Get the new value from the textarea
            const target = event.target as HTMLTextAreaElement;
            const newValue = target.value;
            
            // Update state immediately for autogrow
            state.setValue(newValue);
            
            // Return event type to trigger
            return 'input';
        })
        .withInteraction('root', 'onFocus', (currentState, event: FocusEvent) => {
            // Prevent focus if disabled
            if (currentState.disabled) {
                event.preventDefault();
                return null;
            }
            
            return 'focus';
        })
        .withInteraction('root', 'onBlur', (currentState, event: FocusEvent) => {
            return 'blur';
        })
        .build();
}