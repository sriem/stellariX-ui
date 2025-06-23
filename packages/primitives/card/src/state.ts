/**
 * Card Component State Management
 * Ultra-generic state implementation
 */

import { createComponentState } from '@stellarix-ui/core';
import type { CardState, CardOptions, CardVariant, CardPadding } from './types';

/**
 * Extended state store with card-specific methods
 */
export interface CardStateStore {
    // Core state methods
    getState: () => CardState;
    setState: (updates: Partial<CardState>) => void;
    subscribe: (listener: (state: CardState) => void) => () => void;
    derive: <U>(selector: (state: CardState) => U) => {
        get: () => U;
        subscribe: (listener: (value: U) => void) => () => void;
    };
    
    // Card-specific methods
    setVariant: (variant: CardVariant) => void;
    setInteractive: (interactive: boolean) => void;
    setHovered: (hovered: boolean) => void;
    setFocused: (focused: boolean) => void;
    setSelected: (selected: boolean) => void;
    setDisabled: (disabled: boolean) => void;
    setPadding: (padding: CardPadding) => void;
    setHasHeader: (hasHeader: boolean) => void;
    setHasFooter: (hasFooter: boolean) => void;
    setHasMedia: (hasMedia: boolean) => void;
    toggleSelection: () => void;
    reset: () => void;
    
    // Computed properties
    isClickable: () => boolean;
    isHighlighted: () => boolean;
}

/**
 * Creates the card component state
 * @param options Initial options
 * @returns Extended state store
 */
export function createCardState(options: CardOptions = {}): CardStateStore {
    // Define initial state
    const initialState: CardState = {
        variant: options.variant ?? 'simple',
        interactive: options.interactive ?? false,
        hovered: false,
        focused: false,
        selected: options.selected ?? false,
        disabled: options.disabled ?? false,
        padding: options.padding ?? 'md',
        hasHeader: options.hasHeader ?? false,
        hasFooter: options.hasFooter ?? false,
        hasMedia: options.hasMedia ?? false,
    };
    
    // Create the core state store
    const store = createComponentState('Card', initialState);
    
    // Extend with card-specific methods
    const extendedStore: CardStateStore = {
        ...store,
        
        // Convenience setters
        setVariant: (variant: CardVariant) => {
            store.setState(prev => ({ ...prev, variant }));
        },
        
        setInteractive: (interactive: boolean) => {
            store.setState(prev => ({ ...prev, interactive }));
        },
        
        setHovered: (hovered: boolean) => {
            store.setState(prev => ({ ...prev, hovered }));
        },
        
        setFocused: (focused: boolean) => {
            store.setState(prev => ({ ...prev, focused }));
        },
        
        setSelected: (selected: boolean) => {
            store.setState(prev => ({ ...prev, selected }));
        },
        
        setDisabled: (disabled: boolean) => {
            store.setState(prev => ({ ...prev, disabled }));
        },
        
        setPadding: (padding: CardPadding) => {
            store.setState(prev => ({ ...prev, padding }));
        },
        
        setHasHeader: (hasHeader: boolean) => {
            store.setState(prev => ({ ...prev, hasHeader }));
        },
        
        setHasFooter: (hasFooter: boolean) => {
            store.setState(prev => ({ ...prev, hasFooter }));
        },
        
        setHasMedia: (hasMedia: boolean) => {
            store.setState(prev => ({ ...prev, hasMedia }));
        },
        
        // Toggle selection state
        toggleSelection: () => {
            const currentState = store.getState();
            store.setState(prev => ({ ...prev, selected: !currentState.selected }));
        },
        
        // Reset to initial state
        reset: () => {
            store.setState(initialState);
        },
        
        // Computed properties
        isClickable: () => {
            const state = store.getState();
            return state.interactive && !state.disabled;
        },
        
        isHighlighted: () => {
            const state = store.getState();
            return state.selected || state.hovered || state.focused;
        },
    };
    
    return extendedStore;
}