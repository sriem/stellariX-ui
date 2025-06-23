/**
 * Badge Component Logic
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
 * - Call state setters directly: state.setContent(), state.setVisible()
 * - Test via callbacks, not state inspection
 * 
 * WHY: Calling state.getState() in reactive contexts creates circular dependencies
 * that cause infinite loops and crash the application. This has been proven 8+ times.
 * 
 * PROVEN WORKING PATTERN (Checkbox component - 30/30 tests passing):
 */

import { LogicLayerBuilder } from '@stellarix-ui/core';
import type { LogicLayer } from '@stellarix-ui/core';
import type { BadgeState, BadgeEvents, BadgeOptions } from './types';
import type { BadgeStateStore } from './state';

/**
 * Creates the badge component logic using proven LogicLayerBuilder pattern
 * @param state State store to connect to
 * @param options Component options
 * @returns Logic layer for the component
 */
export function createBadgeLogic(
    state: BadgeStateStore,
    options: BadgeOptions = {}
): LogicLayer<BadgeState, BadgeEvents> {
    return new LogicLayerBuilder<BadgeState, BadgeEvents>()
        .onEvent('contentChange', (currentState, payload: any) => {
            // Extract content from payload
            let newContent: string | number = '';
            if (payload && typeof payload === 'object' && 'content' in payload) {
                newContent = payload.content;
            }
            
            // Store previous content for callback
            const previousContent = currentState.content;
            
            // Update state
            state.setContent(newContent);
            
            // Call user callback if provided
            if (options.onContentChange) {
                options.onContentChange(newContent);
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
        .withA11y('root', (state) => {
            const ariaProps: Record<string, any> = {};
            
            // Only add aria-label if content is meaningful
            if (state.type !== 'dot' && state.content) {
                const displayContent = state.type === 'numeric' && typeof state.content === 'number' && state.max && state.content > state.max 
                    ? `${state.max}+` 
                    : state.content.toString();
                ariaProps['aria-label'] = `Badge: ${displayContent}`;
            }
            
            // Add role based on type
            if (state.type === 'status') {
                ariaProps.role = 'status';
            }
            
            // Hide from screen readers if not visible
            if (!state.visible || (state.content === 0 && !state.showZero) || (state.content === '' && state.type !== 'dot')) {
                ariaProps['aria-hidden'] = 'true';
            }
            
            return ariaProps;
        })
        .build();
}