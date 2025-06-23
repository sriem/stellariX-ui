/**
 * Tooltip Component State
 * State management using the core state system
 * 
 * 🚨 CRITICAL WARNING: setState PARTIAL UPDATE PREVENTION
 * 
 * ❌ FORBIDDEN:
 * - state.setState({ field: value }) // WILL NOT WORK - loses other fields!
 * - store.setState({ field: value }) // CAUSES NaN/undefined errors!
 * 
 * ✅ ONLY CORRECT PATTERN:
 * - store.setState((prev: any) => ({ ...prev, field: value }))
 * - ALWAYS use function updater with spread operator
 * 
 * WHY: The core setState expects either a full state object or a function updater.
 * Partial objects cause the state to lose all other fields, resulting in NaN/undefined errors.
 */

import { createComponentState } from '@stellarix-ui/core';
import type { TooltipState, TooltipOptions, TooltipPlacement } from './types';

/**
 * Initial state factory
 * Creates the initial state with defaults
 */
function createInitialState(options: TooltipOptions = {}): TooltipState {
    return {
        visible: options.controlled ? (options.visible ?? false) : false,
        placement: options.placement || 'top',
        content: options.content || null,
        focused: false,
        disabled: options.disabled || false,
        position: null
    };
}

/**
 * Create the tooltip state store
 * @param options Component options
 * @returns State store with typed methods
 */
export function createTooltipState(options: TooltipOptions = {}) {
    const store = createComponentState('Tooltip', createInitialState(options));
    
    return {
        ...store,
        
        // Helper methods for state updates
        setVisible(visible: boolean) {
            store.setState((prev: TooltipState) => ({ ...prev, visible }));
        },
        
        setPlacement(placement: TooltipPlacement) {
            store.setState((prev: TooltipState) => ({ ...prev, placement }));
        },
        
        setContent(content: string | null) {
            store.setState((prev: TooltipState) => ({ ...prev, content }));
        },
        
        setFocused(focused: boolean) {
            store.setState((prev: TooltipState) => ({ ...prev, focused }));
        },
        
        setDisabled(disabled: boolean) {
            store.setState((prev: TooltipState) => ({ ...prev, disabled }));
        },
        
        setPosition(position: { x: number; y: number } | null) {
            store.setState((prev: TooltipState) => ({ ...prev, position }));
        },
        
        // Utility methods
        show() {
            store.setState((prev: TooltipState) => ({ ...prev, visible: true }));
        },
        
        hide() {
            store.setState((prev: TooltipState) => ({ ...prev, visible: false }));
        },
        
        toggle() {
            store.setState((prev: TooltipState) => ({ ...prev, visible: !prev.visible }));
        }
    };
}

/**
 * Type for the tooltip state store
 */
export type TooltipStateStore = ReturnType<typeof createTooltipState>;