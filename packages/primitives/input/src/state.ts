/**
 * Input Component State Management
 * Ultra-generic state implementation
 */

import { createComponentState } from '@stellarix-ui/core';
import type { InputState, InputOptions, InputType, InputSize } from './types';

/**
 * Extended state store with component-specific methods
 */
export interface InputStateStore {
    // Core state methods
    getState: () => InputState;
    setState: (updater: InputState | ((prev: InputState) => InputState)) => void;
    subscribe: (listener: (state: InputState) => void) => () => void;
    derive: <U>(selector: (state: InputState) => U) => {
        get: () => U;
        subscribe: (listener: (value: U) => void) => () => void;
    };
    
    // Component-specific methods
    setValue: (value: string) => void;
    setFocused: (focused: boolean) => void;
    setDisabled: (disabled: boolean) => void;
    setReadonly: (readonly: boolean) => void;
    setError: (error: boolean, message?: string) => void;
    setRequired: (required: boolean) => void;
    setType: (type: InputType) => void;
    setSize: (size: InputSize) => void;
    clear: () => void;
    
    // Computed properties
    isInteractive: () => boolean;
    hasError: () => boolean;
    isEmpty: () => boolean;
    getValidationState: () => 'valid' | 'invalid' | 'none';
}

/**
 * Creates the input component state
 * @param options Initial options
 * @returns Extended state store
 */
export function createInputState(options: InputOptions = {}): InputStateStore {
    // Define initial state
    const initialState: InputState = {
        value: options.value ?? '',
        focused: false,
        disabled: options.disabled ?? false,
        readonly: options.readonly ?? false,
        error: options.error ?? false,
        errorMessage: options.errorMessage,
        required: options.required ?? false,
        type: options.type ?? 'text',
        size: options.size ?? 'md',
    };
    
    // Create the core state store
    const store = createComponentState('Input', initialState);
    
    // Extend with component-specific methods
    const extendedStore: InputStateStore = {
        ...store,
        
        // Convenience setters
        setValue: (value: string) => {
            store.setState(prev => ({ ...prev, value }));
        },
        
        setFocused: (focused: boolean) => {
            store.setState(prev => ({ ...prev, focused }));
        },
        
        setDisabled: (disabled: boolean) => {
            store.setState(prev => ({ ...prev, disabled }));
        },
        
        setReadonly: (readonly: boolean) => {
            store.setState(prev => ({ ...prev, readonly }));
        },
        
        setError: (error: boolean, message?: string) => {
            store.setState(prev => ({ 
                ...prev,
                error, 
                errorMessage: message 
            }));
        },
        
        setRequired: (required: boolean) => {
            store.setState(prev => ({ ...prev, required }));
        },
        
        setType: (type: InputType) => {
            store.setState(prev => ({ ...prev, type }));
        },
        
        setSize: (size: InputSize) => {
            store.setState(prev => ({ ...prev, size }));
        },
        
        clear: () => {
            store.setState(prev => ({ ...prev, value: '' }));
        },
        
        // Computed properties
        isInteractive: () => {
            const state = store.getState();
            return !state.disabled && !state.readonly;
        },
        
        hasError: () => {
            const state = store.getState();
            return state.error;
        },
        
        isEmpty: () => {
            const state = store.getState();
            return state.value.trim() === '';
        },
        
        getValidationState: () => {
            const state = store.getState();
            if (state.error) return 'invalid';
            if (state.value && !state.error) return 'valid';
            return 'none';
        },
    };
    
    return extendedStore;
}