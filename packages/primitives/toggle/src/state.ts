/**
 * Toggle Component State Management
 * Ultra-generic state implementation
 */

import { createComponentState } from '@stellarix/core';
import type { ToggleState, ToggleOptions } from './types';

/**
 * Extended state store with toggle-specific methods
 */
export interface ToggleStateStore {
    // Core state methods
    getState: () => ToggleState;
    setState: (updates: Partial<ToggleState>) => void;
    subscribe: (listener: (state: ToggleState) => void) => () => void;
    derive: <U>(selector: (state: ToggleState) => U) => {
        get: () => U;
        subscribe: (listener: (value: U) => void) => () => void;
    };
    
    // Toggle-specific methods
    setChecked: (checked: boolean) => void;
    setFocused: (focused: boolean) => void;
    setDisabled: (disabled: boolean) => void;
    toggle: () => void;
    reset: () => void;
    
    // Computed properties
    isInteractive: () => boolean;
}

/**
 * Creates the toggle component state
 * @param options Initial options
 * @returns Extended state store
 */
export function createToggleState(options: ToggleOptions = {}): ToggleStateStore {
    // Define initial state
    const initialState: ToggleState = {
        checked: options.checked ?? false,
        focused: false,
        disabled: options.disabled ?? false,
    };
    
    // Create the core state store
    const store = createComponentState('Toggle', initialState);
    
    // Extend with toggle-specific methods
    const extendedStore: ToggleStateStore = {
        ...store,
        
        // Convenience setters
        setChecked: (checked: boolean) => {
            store.setState(prev => ({ ...prev, checked }));
        },
        
        setFocused: (focused: boolean) => {
            store.setState(prev => ({ ...prev, focused }));
        },
        
        setDisabled: (disabled: boolean) => {
            store.setState(prev => ({ ...prev, disabled }));
        },
        
        // Toggle checked state
        toggle: () => {
            const currentState = store.getState();
            store.setState(prev => ({ ...prev, checked: !currentState.checked }));
        },
        
        // Reset to initial state
        reset: () => {
            store.setState(initialState);
        },
        
        // Computed properties
        isInteractive: () => {
            const state = store.getState();
            return !state.disabled;
        },
    };
    
    return extendedStore;
}