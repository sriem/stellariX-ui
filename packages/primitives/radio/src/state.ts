/**
 * Radio Component State Management
 * Ultra-generic state implementation
 */

import { createComponentState } from '@stellarix/core';
import type { RadioState, RadioOptions } from './types';

/**
 * Extended state store with component-specific methods
 */
export interface RadioStateStore {
    // Core state methods
    getState: () => RadioState;
    setState: (updates: Partial<RadioState>) => void;
    subscribe: (listener: (state: RadioState) => void) => () => void;
    derive: <U>(selector: (state: RadioState) => U) => {
        get: () => U;
        subscribe: (listener: (value: U) => void) => () => void;
    };
    
    // Component-specific methods
    setChecked: (checked: boolean) => void;
    setDisabled: (disabled: boolean) => void;
    setFocused: (focused: boolean) => void;
    setRequired: (required: boolean) => void;
    setError: (error: boolean, errorMessage?: string) => void;
    
    // Computed properties
    isInteractive: () => boolean;
}

/**
 * Creates the radio component state
 * @param options Initial options
 * @returns Extended state store
 */
export function createRadioState(options: RadioOptions): RadioStateStore {
    // Define initial state
    const initialState: RadioState = {
        checked: options.checked ?? false,
        disabled: options.disabled ?? false,
        focused: false,
        required: options.required ?? false,
        error: false,
        errorMessage: undefined,
        value: options.value,
        name: options.name,
    };
    
    // Create the core state store
    const store = createComponentState('Radio', initialState);
    
    // Extend with component-specific methods
    const extendedStore: RadioStateStore = {
        ...store,
        
        // Convenience setters
        setChecked: (checked: boolean) => {
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
        
        // Computed properties
        isInteractive: () => {
            const state = store.getState();
            return !state.disabled;
        },
    };
    
    return extendedStore;
}