/**
 * Spinner Component State Management
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
import type { SpinnerState, SpinnerOptions, SpinnerSize } from './types';

/**
 * Extended state store with component-specific methods
 */
export interface SpinnerStateStore {
    // Core state methods
    getState: () => SpinnerState;
    setState: (updates: Partial<SpinnerState>) => void;
    subscribe: (listener: (state: SpinnerState) => void) => () => void;
    derive: <U>(selector: (state: SpinnerState) => U) => {
        get: () => U;
        subscribe: (listener: (value: U) => void) => () => void;
    };
    
    // Component-specific methods
    start: () => void;
    stop: () => void;
    setSize: (size: SpinnerSize) => void;
    setColor: (color: string | undefined) => void;
    setLabel: (label: string) => void;
    setSpeed: (speed: number) => void;
}

/**
 * Creates the spinner component state
 * @param options Initial options
 * @returns Extended state store
 */
export function createSpinnerState(options: SpinnerOptions = {}): SpinnerStateStore {
    // Define initial state
    const initialState: SpinnerState = {
        spinning: options.spinning ?? true,
        size: options.size ?? 'md',
        color: options.color,
        label: options.label ?? 'Loading...',
        speed: options.speed ?? 750,
    };
    
    // Create the core state store
    const store = createComponentState('Spinner', initialState);
    
    // Extend with component-specific methods
    const extendedStore: SpinnerStateStore = {
        ...store,
        
        // Start spinning
        start: () => {
            store.setState((prev: SpinnerState) => ({ ...prev, spinning: true }));
        },
        
        // Stop spinning
        stop: () => {
            store.setState((prev: SpinnerState) => ({ ...prev, spinning: false }));
        },
        
        // Convenience setters
        setSize: (size: SpinnerSize) => {
            store.setState((prev: SpinnerState) => ({ ...prev, size }));
        },
        
        setColor: (color: string | undefined) => {
            store.setState((prev: SpinnerState) => ({ ...prev, color }));
        },
        
        setLabel: (label: string) => {
            store.setState((prev: SpinnerState) => ({ ...prev, label }));
        },
        
        setSpeed: (speed: number) => {
            store.setState((prev: SpinnerState) => ({ ...prev, speed }));
        },
    };
    
    return extendedStore;
}