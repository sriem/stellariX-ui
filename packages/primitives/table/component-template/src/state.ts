/**
 * Template Component State Management
 * Ultra-generic state implementation
 */

import { createComponentState } from '@stellarix-ui/core';
import type { TemplateState, TemplateOptions } from './types';

/**
 * Extended state store with component-specific methods
 */
export interface TemplateStateStore {
    // Core state methods
    getState: () => TemplateState;
    setState: (updates: Partial<TemplateState>) => void;
    subscribe: (listener: (state: TemplateState) => void) => () => void;
    derive: <U>(selector: (state: TemplateState) => U) => {
        get: () => U;
        subscribe: (listener: (value: U) => void) => () => void;
    };
    
    // Component-specific methods
    setActive: (active: boolean) => void;
    setValue: (value: string) => void;
    setDisabled: (disabled: boolean) => void;
    toggle: () => void;
    reset: () => void;
    
    // Computed properties
    isInteractive: () => boolean;
}

/**
 * Creates the template component state
 * @param options Initial options
 * @returns Extended state store
 */
export function createTemplateState(options: TemplateOptions = {}): TemplateStateStore {
    // Define initial state
    const initialState: TemplateState = {
        active: options.active ?? false,
        value: options.value ?? '',
        disabled: options.disabled ?? false,
    };
    
    // Create the core state store
    const store = createComponentState('Template', initialState);
    
    // Extend with component-specific methods
    const extendedStore: TemplateStateStore = {
        ...store,
        
        // Convenience setters
        setActive: (active: boolean) => {
            store.setState({ active });
        },
        
        setValue: (value: string) => {
            store.setState({ value });
        },
        
        setDisabled: (disabled: boolean) => {
            store.setState({ disabled });
        },
        
        // Toggle active state
        toggle: () => {
            const currentState = store.getState();
            store.setState({ active: !currentState.active });
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