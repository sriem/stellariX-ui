/**
 * Divider Component State Management
 * Ultra-generic state implementation
 */

import { createComponentState } from '@stellarix/core';
import type { DividerState, DividerOptions, DividerOrientation, DividerVariant, DividerLabelPosition } from './types';

/**
 * Extended state store with component-specific methods
 */
export interface DividerStateStore {
    // Core state methods
    getState: () => DividerState;
    setState: (updater: DividerState | ((prev: DividerState) => DividerState)) => void;
    subscribe: (listener: (state: DividerState) => void) => () => void;
    derive: <U>(selector: (state: DividerState) => U) => {
        get: () => U;
        subscribe: (listener: (value: U) => void) => () => void;
    };
    
    // Component-specific methods
    setOrientation: (orientation: DividerOrientation) => void;
    setVariant: (variant: DividerVariant) => void;
    setLabelPosition: (position: DividerLabelPosition) => void;
    updateLabel: (hasLabel: boolean) => void;
    
    // Computed properties
    isHorizontal: () => boolean;
    isVertical: () => boolean;
}

/**
 * Creates the divider component state
 * @param options Initial options
 * @returns Extended state store
 */
export function createDividerState(options: DividerOptions = {}): DividerStateStore {
    // Define initial state
    const initialState: DividerState = {
        orientation: options.orientation ?? 'horizontal',
        variant: options.variant ?? 'solid',
        hasLabel: Boolean(options.label),
        labelPosition: options.labelPosition ?? 'center',
    };
    
    // Create the core state store
    const store = createComponentState('Divider', initialState);
    
    // Extend with component-specific methods
    const extendedStore: DividerStateStore = {
        ...store,
        
        // Convenience setters
        setOrientation: (orientation: DividerOrientation) => {
            store.setState(prev => ({ ...prev, orientation }));
        },
        
        setVariant: (variant: DividerVariant) => {
            store.setState(prev => ({ ...prev, variant }));
        },
        
        setLabelPosition: (position: DividerLabelPosition) => {
            store.setState(prev => ({ ...prev, labelPosition: position }));
        },
        
        updateLabel: (hasLabel: boolean) => {
            store.setState(prev => ({ ...prev, hasLabel }));
        },
        
        // Computed properties
        isHorizontal: () => {
            const state = store.getState();
            return state.orientation === 'horizontal';
        },
        
        isVertical: () => {
            const state = store.getState();
            return state.orientation === 'vertical';
        },
    };
    
    return extendedStore;
}