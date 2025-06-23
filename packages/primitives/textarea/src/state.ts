/**
 * Textarea Component State Management
 * Ultra-generic state implementation for multi-line text input
 */

import { createComponentState } from '@stellarix-ui/core';
import type { TextareaState, TextareaOptions } from './types';

/**
 * Extended state store with textarea-specific methods
 */
export interface TextareaStateStore {
    // Core state methods
    getState: () => TextareaState;
    setState: (updates: Partial<TextareaState>) => void;
    subscribe: (listener: (state: TextareaState) => void) => () => void;
    derive: <U>(selector: (state: TextareaState) => U) => {
        get: () => U;
        subscribe: (listener: (value: U) => void) => () => void;
    };
    
    // Textarea-specific methods
    setValue: (value: string) => void;
    setFocused: (focused: boolean) => void;
    setDisabled: (disabled: boolean) => void;
    setReadonly: (readonly: boolean) => void;
    setError: (error: boolean) => void;
    setRows: (rows: number) => void;
    
    // Computed properties
    isInteractive: () => boolean;
    isEmpty: () => boolean;
    getCharCount: () => number;
    getLineCount: () => number;
}

/**
 * Creates the textarea component state
 * @param options Initial options
 * @returns Extended state store
 */
export function createTextareaState(options: TextareaOptions = {}): TextareaStateStore {
    // Define initial state
    const initialState: TextareaState = {
        value: options.value ?? '',
        focused: false,
        disabled: options.disabled ?? false,
        readonly: options.readonly ?? false,
        error: options.error ?? false,
        rows: options.rows ?? 4,
        minRows: options.minRows ?? 2,
        maxRows: options.maxRows ?? 10,
    };
    
    // Create the core state store
    const store = createComponentState('Textarea', initialState);
    
    // Extend with component-specific methods
    const extendedStore: TextareaStateStore = {
        ...store,
        
        // Convenience setters
        setValue: (value: string) => {
            store.setState((prev: any) => ({ ...prev, value }));
        },
        
        setFocused: (focused: boolean) => {
            store.setState((prev: any) => ({ ...prev, focused }));
        },
        
        setDisabled: (disabled: boolean) => {
            store.setState((prev: any) => ({ ...prev, disabled }));
        },
        
        setReadonly: (readonly: boolean) => {
            store.setState((prev: any) => ({ ...prev, readonly }));
        },
        
        setError: (error: boolean) => {
            store.setState((prev: any) => ({ ...prev, error }));
        },
        
        setRows: (rows: number) => {
            const currentState = store.getState();
            // Clamp rows between min and max
            const clampedRows = Math.max(currentState.minRows, Math.min(currentState.maxRows, rows));
            // Use function updater pattern like Button does
            store.setState((prev: any) => ({ ...prev, rows: clampedRows }));
        },
        
        // Computed properties
        isInteractive: () => {
            const state = store.getState();
            return !state.disabled && !state.readonly;
        },
        
        isEmpty: () => {
            const state = store.getState();
            return state.value.trim().length === 0;
        },
        
        getCharCount: () => {
            const state = store.getState();
            return state.value.length;
        },
        
        getLineCount: () => {
            const state = store.getState();
            return state.value.split('\n').length;
        },
    };
    
    return extendedStore;
}