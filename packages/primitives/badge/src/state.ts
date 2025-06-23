/**
 * Badge Component State Management
 * Ultra-generic state implementation
 */

import { createComponentState } from '@stellarix/core';
import type { BadgeState, BadgeOptions, BadgeVariant, BadgeType } from './types';

/**
 * Extended state store with badge-specific methods
 */
export interface BadgeStateStore {
    // Core state methods
    getState: () => BadgeState;
    setState: (updates: Partial<BadgeState>) => void;
    subscribe: (listener: (state: BadgeState) => void) => () => void;
    derive: <U>(selector: (state: BadgeState) => U) => {
        get: () => U;
        subscribe: (listener: (value: U) => void) => () => void;
    };
    
    // Badge-specific methods
    setVariant: (variant: BadgeVariant) => void;
    setType: (type: BadgeType) => void;
    setContent: (content: string | number) => void;
    setVisible: (visible: boolean) => void;
    setMax: (max: number) => void;
    setShowZero: (showZero: boolean) => void;
    show: () => void;
    hide: () => void;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
    
    // Computed properties
    getDisplayContent: () => string;
    shouldDisplay: () => boolean;
}

/**
 * Creates the badge component state
 * @param options Initial options
 * @returns Extended state store
 */
export function createBadgeState(options: BadgeOptions = {}): BadgeStateStore {
    // Define initial state
    const initialState: BadgeState = {
        variant: options.variant ?? 'default',
        type: options.type ?? 'numeric',
        content: options.content ?? '',
        visible: options.visible ?? true,
        max: options.max ?? 99,
        showZero: options.showZero ?? false,
    };
    
    // Create the core state store
    const store = createComponentState('Badge', initialState);
    
    // Extend with badge-specific methods
    const extendedStore: BadgeStateStore = {
        ...store,
        
        // Convenience setters
        setVariant: (variant: BadgeVariant) => {
            store.setState(prev => ({ ...prev, variant }));
        },
        
        setType: (type: BadgeType) => {
            store.setState(prev => ({ ...prev, type }));
        },
        
        setContent: (content: string | number) => {
            store.setState(prev => ({ ...prev, content }));
        },
        
        setVisible: (visible: boolean) => {
            store.setState(prev => ({ ...prev, visible }));
        },
        
        setMax: (max: number) => {
            store.setState(prev => ({ ...prev, max }));
        },
        
        setShowZero: (showZero: boolean) => {
            store.setState(prev => ({ ...prev, showZero }));
        },
        
        // Show the badge
        show: () => {
            store.setState(prev => ({ ...prev, visible: true }));
        },
        
        // Hide the badge
        hide: () => {
            store.setState(prev => ({ ...prev, visible: false }));
        },
        
        // Increment numeric content
        increment: () => {
            const state = store.getState();
            if (typeof state.content === 'number') {
                store.setState(prev => ({ ...prev, content: (prev.content as number) + 1 }));
            }
        },
        
        // Decrement numeric content
        decrement: () => {
            const state = store.getState();
            if (typeof state.content === 'number' && state.content > 0) {
                store.setState(prev => ({ ...prev, content: (prev.content as number) - 1 }));
            }
        },
        
        // Reset to initial state
        reset: () => {
            store.setState(initialState);
        },
        
        // Computed properties
        getDisplayContent: () => {
            const state = store.getState();
            
            // For dot type, content is not displayed
            if (state.type === 'dot') {
                return '';
            }
            
            // For numeric type with max value
            if (state.type === 'numeric' && typeof state.content === 'number' && state.max) {
                return state.content > state.max ? `${state.max}+` : state.content.toString();
            }
            
            // Default string representation
            return state.content.toString();
        },
        
        shouldDisplay: () => {
            const state = store.getState();
            
            // Not visible
            if (!state.visible) {
                return false;
            }
            
            // Handle zero content
            if (state.content === 0 || state.content === '0') {
                return state.showZero;
            }
            
            // Handle empty content
            if (state.content === '') {
                return state.type === 'dot'; // Dots can be shown without content
            }
            
            return true;
        },
    };
    
    return extendedStore;
}