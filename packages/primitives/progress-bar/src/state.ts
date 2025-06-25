/**
 * ProgressBar Component State Management
 * Manages progress value, variant, and display state
 */

import { createComponentState } from '@stellarix-ui/core';
import type { ProgressBarState, ProgressBarOptions } from './types';

/**
 * Extended state store with component-specific methods
 */
export interface ProgressBarStateStore {
    // Core state methods
    getState: () => ProgressBarState;
    setState: (updater: (prev: ProgressBarState) => ProgressBarState) => void;
    subscribe: (listener: (state: ProgressBarState) => void) => () => void;
    derive: <U>(selector: (state: ProgressBarState) => U) => {
        get: () => U;
        subscribe: (listener: (value: U) => void) => () => void;
    };
    
    // Component-specific methods
    setValue: (value: number) => void;
    setMax: (max: number) => void;
    setVariant: (variant: 'default' | 'success' | 'warning' | 'error' | 'info') => void;
    setShowLabel: (showLabel: boolean) => void;
    setIndeterminate: (isIndeterminate: boolean) => void;
    setDisabled: (disabled: boolean) => void;
    increment: (amount?: number) => void;
    decrement: (amount?: number) => void;
    setProgress: (value: number, max?: number) => void;
    reset: () => void;
    
    // Computed properties
    getPercentage: () => number;
    isComplete: () => boolean;
}

/**
 * Creates the progress bar component state
 * @param options Initial options
 * @returns Extended state store
 */
export function createProgressBarState(options: ProgressBarOptions = {}): ProgressBarStateStore {
    // Define initial state
    const initialState: ProgressBarState = {
        value: options.value ?? 0,
        max: options.max ?? 100,
        variant: options.variant ?? 'default',
        showLabel: options.showLabel ?? false,
        isIndeterminate: options.isIndeterminate ?? false,
        disabled: options.disabled ?? false,
    };
    
    // Create the core state store
    const store = createComponentState('ProgressBar', initialState);
    
    // Track if complete callback has been called
    let wasComplete = initialState.value >= initialState.max;
    
    // Extend with component-specific methods
    const extendedStore: ProgressBarStateStore = {
        ...store,
        
        // Convenience setters
        setValue: (value: number) => {
            const clampedValue = Math.max(0, Math.min(value, store.getState().max));
            store.setState((prev) => {
                const newState = { ...prev, value: clampedValue };
                
                // Check for completion
                if (options.onComplete && !wasComplete && clampedValue >= prev.max) {
                    wasComplete = true;
                    options.onComplete();
                } else if (clampedValue < prev.max) {
                    wasComplete = false;
                }
                
                // Trigger onChange
                if (options.onChange && prev.value !== clampedValue) {
                    const percentage = Math.round((clampedValue / prev.max) * 100);
                    options.onChange(clampedValue, percentage);
                }
                
                return newState;
            });
        },
        
        setMax: (max: number) => {
            const clampedMax = Math.max(1, max);
            store.setState((prev) => {
                const clampedValue = Math.min(prev.value, clampedMax);
                return { ...prev, max: clampedMax, value: clampedValue };
            });
        },
        
        setVariant: (variant: 'default' | 'success' | 'warning' | 'error' | 'info') => {
            store.setState((prev) => ({ ...prev, variant }));
        },
        
        setShowLabel: (showLabel: boolean) => {
            store.setState((prev) => ({ ...prev, showLabel }));
        },
        
        setIndeterminate: (isIndeterminate: boolean) => {
            store.setState((prev) => ({ ...prev, isIndeterminate }));
        },
        
        setDisabled: (disabled: boolean) => {
            store.setState((prev) => ({ ...prev, disabled }));
        },
        
        increment: (amount: number = 1) => {
            const state = store.getState();
            extendedStore.setValue(state.value + amount);
        },
        
        decrement: (amount: number = 1) => {
            const state = store.getState();
            extendedStore.setValue(state.value - amount);
        },
        
        setProgress: (value: number, max?: number) => {
            if (max !== undefined) {
                extendedStore.setMax(max);
            }
            extendedStore.setValue(value);
        },
        
        // Reset to initial state
        reset: () => {
            wasComplete = false;
            store.setState(() => initialState);
        },
        
        // Computed properties
        getPercentage: () => {
            const state = store.getState();
            if (state.isIndeterminate) return 0;
            return Math.round((state.value / state.max) * 100);
        },
        
        isComplete: () => {
            const state = store.getState();
            return state.value >= state.max;
        },
    };
    
    return extendedStore;
}