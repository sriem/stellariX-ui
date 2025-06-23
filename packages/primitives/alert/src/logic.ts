/**
 * Alert Component Logic
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
 * - Call state setters directly: state.setVisible(), state.dismiss()
 * - Test via callbacks, not state inspection
 * 
 * WHY: Calling state.getState() in reactive contexts creates circular dependencies
 * that cause infinite loops and crash the application. This has been proven 8+ times.
 * 
 * PROVEN WORKING PATTERN (Checkbox component - 30/30 tests passing):
 */

import { LogicLayerBuilder } from '@stellarix-ui/core';
import type { LogicLayer } from '@stellarix-ui/core';
import type { AlertState, AlertEvents, AlertOptions } from './types';
import type { AlertStateStore } from './state';

/**
 * Creates the alert component logic using proven LogicLayerBuilder pattern
 * @param state State store to connect to
 * @param options Component options
 * @returns Logic layer for the component
 */
export function createAlertLogic(
    state: AlertStateStore,
    options: AlertOptions = {}
): LogicLayer<AlertState, AlertEvents> {
    return new LogicLayerBuilder<AlertState, AlertEvents>()
        .onEvent('dismiss', (currentState, payload: any) => {
            // Check if alert can be dismissed
            if (!currentState.dismissible || !currentState.visible) {
                return null;
            }
            
            // Extract reason from payload if provided
            const reason = payload && typeof payload === 'object' && 'reason' in payload 
                ? payload.reason 
                : 'user';
            
            // Update state
            state.dismiss();
            
            // Call user callback if provided
            if (options.onDismiss) {
                options.onDismiss();
            }
            return null;
        })
        .onEvent('visibilityChange', (currentState, payload: any) => {
            // Extract visibility from payload
            let visible = false;
            if (payload && typeof payload === 'object' && 'visible' in payload) {
                visible = payload.visible;
            }
            
            // Update state
            state.setVisible(visible);
            
            // Call user callback if provided
            if (options.onVisibilityChange) {
                options.onVisibilityChange(visible);
            }
            return null;
        })
        .onEvent('close', (currentState, payload: any) => {
            // Handle close button click - extract event from payload if needed
            const event = payload && payload.event ? payload.event : payload;
            if (event && typeof event.preventDefault === 'function') {
                event.preventDefault();
            }
            
            // Check if alert can be dismissed
            if (!currentState.dismissible || !currentState.visible) {
                return null;
            }
            
            // Dismiss the alert directly
            state.dismiss();
            if (options.onDismiss) {
                options.onDismiss();
            }
            return null;
        })
        .withA11y('root', (state) => ({
            role: 'alert',
            'aria-live': state.variant === 'error' ? 'assertive' : 'polite',
            'aria-atomic': 'true',
            'aria-hidden': !state.visible ? 'true' : undefined,
        }))
        .withA11y('closeButton', (state) => ({
            'aria-label': 'Close alert',
            type: 'button',
            tabIndex: state.dismissible && state.visible && !state.dismissing ? 0 : -1,
        }))
        .withInteraction('closeButton', 'onClick', (currentState, event: MouseEvent) => {
            // Prevent interaction if not dismissible or not visible
            if (!currentState.dismissible || !currentState.visible || currentState.dismissing) {
                event.preventDefault();
                return null;
            }
            
            // Return event type to trigger
            return 'close';
        })
        .withInteraction('closeButton', 'onKeyDown', (currentState, event: KeyboardEvent) => {
            // Handle Enter and Space keys
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                
                // Check if alert can be dismissed
                if (!currentState.dismissible || !currentState.visible || currentState.dismissing) {
                    return null;
                }
                
                // Dismiss the alert directly
                state.dismiss();
                if (options.onDismiss) {
                    options.onDismiss();
                }
                return null;
            }
            return null;
        })
        .build();
}