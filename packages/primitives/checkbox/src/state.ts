/**
 * Checkbox Component State Management
 * Ultra-generic state implementation
 */

import { createComponentState } from '@stellarix/core';
import type { CheckboxState, CheckboxOptions, CheckboxCheckedState } from './types';

/**
 * Extended state store with component-specific methods
 */
export interface CheckboxStateStore {
    // Core state methods
    getState: () => CheckboxState;
    setState: (updates: Partial<CheckboxState>) => void;
    subscribe: (listener: (state: CheckboxState) => void) => () => void;
    derive: <U>(selector: (state: CheckboxState) => U) => {
        get: () => U;
        subscribe: (listener: (value: U) => void) => () => void;
    };
    
    // Component-specific methods
    setChecked: (checked: CheckboxCheckedState) => void;
    setDisabled: (disabled: boolean) => void;
    setFocused: (focused: boolean) => void;
    setRequired: (required: boolean) => void;
    setError: (error: boolean, errorMessage?: string) => void;
    toggle: () => void;
    
    // Computed properties
    isInteractive: () => boolean;
}

/**
 * Creates the checkbox component state
 * @param options Initial options
 * @returns Extended state store
 */
export function createCheckboxState(options: CheckboxOptions = {}): CheckboxStateStore {
    // Define initial state
    const initialState: CheckboxState = {
        checked: options.checked ?? false,
        disabled: options.disabled ?? false,
        focused: false,
        required: options.required ?? false,
        error: false,
        errorMessage: undefined,
    };
    
    // Create the core state store
    const store = createComponentState('Checkbox', initialState);
    
    // Extend with component-specific methods
    const extendedStore: CheckboxStateStore = {
        ...store,
        
        // Convenience setters
        setChecked: (checked: CheckboxCheckedState) => {
            store.setState({ checked });
        },
        
        setDisabled: (disabled: boolean) => {
            store.setState({ disabled });
        },
        
        setFocused: (focused: boolean) => {
            store.setState({ focused });
        },
        
        setRequired: (required: boolean) => {
            store.setState({ required });
        },
        
        setError: (error: boolean, errorMessage?: string) => {
            store.setState({ error, errorMessage });
        },
        
        // Toggle checked state
        toggle: () => {
            const currentState = store.getState();
            
            // If indeterminate, toggle to checked
            // If checked, toggle to unchecked
            // If unchecked, toggle to checked
            let newChecked: CheckboxCheckedState;
            if (currentState.checked === 'indeterminate') {
                newChecked = true;
            } else {
                newChecked = !currentState.checked;
            }
            
            store.setState({ checked: newChecked });
        },
        
        // Computed properties
        isInteractive: () => {
            const state = store.getState();
            return !state.disabled;
        },
    };
    
    return extendedStore;
}