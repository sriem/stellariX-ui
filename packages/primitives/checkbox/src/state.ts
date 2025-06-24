/**
 * Checkbox Component State Management
 * Ultra-generic state implementation
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
 */

import { createComponentState } from '@stellarix-ui/core';
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
        error: options.error ?? false,
        errorMessage: options.errorMessage,
    };
    
    // Create the core state store
    const store = createComponentState('Checkbox', initialState);
    
    // Extend with component-specific methods
    const extendedStore: CheckboxStateStore = {
        ...store,
        
        // Convenience setters
        setChecked: (checked: CheckboxCheckedState) => {
            store.setState((prev: CheckboxState) => ({ ...prev, checked }));
        },
        
        setDisabled: (disabled: boolean) => {
            store.setState((prev: CheckboxState) => ({ ...prev, disabled }));
        },
        
        setFocused: (focused: boolean) => {
            store.setState((prev: CheckboxState) => ({ ...prev, focused }));
        },
        
        setRequired: (required: boolean) => {
            store.setState((prev: CheckboxState) => ({ ...prev, required }));
        },
        
        setError: (error: boolean, errorMessage?: string) => {
            store.setState((prev: CheckboxState) => ({ ...prev, error, errorMessage }));
        },
        
        // Toggle checked state
        toggle: () => {
            store.setState((prev: CheckboxState) => {
                // If indeterminate, toggle to checked
                // If checked, toggle to unchecked
                // If unchecked, toggle to checked
                let newChecked: CheckboxCheckedState;
                if (prev.checked === 'indeterminate') {
                    newChecked = true;
                } else {
                    newChecked = !prev.checked;
                }
                
                return { ...prev, checked: newChecked };
            });
        },
        
        // Computed properties
        isInteractive: () => {
            const state = store.getState();
            return !state.disabled;
        },
    };
    
    return extendedStore;
}