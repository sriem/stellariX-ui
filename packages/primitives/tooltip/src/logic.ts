/**
 * Tooltip Component Logic
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
 * - Call state setters directly: state.setVisible(), state.setContent()
 * 
 * WHY: Calling state.getState() in reactive contexts creates circular dependencies
 * that cause infinite loops and crash the application.
 */

import { LogicLayerBuilder } from '@stellarix/core';
import type { LogicLayer } from '@stellarix/core';
import type { TooltipState, TooltipEvents, TooltipOptions } from './types';
import type { TooltipStateStore } from './state';

/**
 * Creates the tooltip component logic
 * @param state State store to connect to
 * @param options Component options
 * @returns Logic layer for the component
 */
export function createTooltipLogic(
    state: TooltipStateStore,
    options: TooltipOptions = {}
): LogicLayer<TooltipState, TooltipEvents> {
    // Set up timers for delays
    let showTimer: ReturnType<typeof setTimeout> | null = null;
    let hideTimer: ReturnType<typeof setTimeout> | null = null;
    
    const showDelay = options.showDelay ?? 200;
    const hideDelay = options.hideDelay ?? 0;
    
    // Helper to clear timers
    const clearTimers = () => {
        if (showTimer) {
            clearTimeout(showTimer);
            showTimer = null;
        }
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }
    };
    
    // Helper to show tooltip with delay
    const showWithDelay = () => {
        clearTimers();
        if (showDelay > 0) {
            showTimer = setTimeout(() => {
                state.show();
            }, showDelay);
        } else {
            state.show();
        }
    };
    
    // Helper to hide tooltip with delay
    const hideWithDelay = () => {
        clearTimers();
        if (hideDelay > 0) {
            hideTimer = setTimeout(() => {
                state.hide();
            }, hideDelay);
        } else {
            state.hide();
        }
    };
    
    // Create logic layer using builder
    return new LogicLayerBuilder<TooltipState, TooltipEvents>()
        .onEvent('visibilityChange', (currentState, payload: any) => {
            // Extract visibility from payload
            const visible = payload && typeof payload === 'object' && 'visible' in payload 
                ? payload.visible 
                : currentState.visible;
            
            // Call user callback if provided
            if (options.onVisibilityChange) {
                options.onVisibilityChange(visible);
            }
            return null;
        })
        .onEvent('focus', (currentState, payload: any) => {
            // Update focus state
            state.setFocused(true);
            
            // Show tooltip on focus if not controlled and not disabled
            if (!options.controlled && !currentState.disabled) {
                showWithDelay();
            }
            
            return null;
        })
        .onEvent('blur', (currentState, payload: any) => {
            // Update focus state
            state.setFocused(false);
            
            // Hide tooltip on blur if not controlled
            if (!options.controlled && !currentState.disabled) {
                hideWithDelay();
            }
            
            return null;
        })
        .onEvent('mouseenter', (currentState, payload: any) => {
            // Show tooltip on mouse enter if not controlled and not disabled
            if (!options.controlled && !currentState.disabled) {
                showWithDelay();
            }
            
            return null;
        })
        .onEvent('mouseleave', (currentState, payload: any) => {
            // Hide tooltip on mouse leave if not controlled
            if (!options.controlled && !currentState.disabled) {
                hideWithDelay();
            }
            
            return null;
        })
        .withA11y('trigger', (state) => ({
            'aria-describedby': state.visible && state.content ? `${options.id || 'tooltip'}-content` : undefined,
            tabIndex: state.disabled ? -1 : 0,
        }))
        .withA11y('content', (state) => ({
            role: 'tooltip',
            id: state.content ? `${options.id || 'tooltip'}-content` : undefined,
            'aria-hidden': !state.visible ? 'true' : undefined,
        }))
        .withInteraction('trigger', 'onMouseEnter', (currentState, event: MouseEvent) => {
            if (currentState.disabled) {
                return null;
            }
            return 'mouseenter';
        })
        .withInteraction('trigger', 'onMouseLeave', (currentState, event: MouseEvent) => {
            if (currentState.disabled) {
                return null;
            }
            return 'mouseleave';
        })
        .withInteraction('trigger', 'onFocus', (currentState, event: FocusEvent) => {
            if (currentState.disabled) {
                return null;
            }
            return 'focus';
        })
        .withInteraction('trigger', 'onBlur', (currentState, event: FocusEvent) => {
            if (currentState.disabled) {
                return null;
            }
            return 'blur';
        })
        .build();
}