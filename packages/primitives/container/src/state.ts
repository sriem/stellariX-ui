/**
 * Container Component State Management
 * Ultra-generic state implementation
 */

import { createComponentState } from '@stellarix/core';
import type { ContainerState, ContainerOptions, ContainerSize } from './types';

/**
 * Size presets for max-width
 */
const SIZE_PRESETS: Record<ContainerSize, string> = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    full: '100%',
};

/**
 * Extended state store with component-specific methods
 */
export interface ContainerStateStore {
    // Core state methods
    getState: () => ContainerState;
    setState: (updates: Partial<ContainerState>) => void;
    subscribe: (listener: (state: ContainerState) => void) => () => void;
    derive: <U>(selector: (state: ContainerState) => U) => {
        get: () => U;
        subscribe: (listener: (value: U) => void) => () => void;
    };
    
    // Component-specific methods
    setSize: (size: ContainerSize) => void;
    setVariant: (variant: ContainerState['variant']) => void;
    setMaxWidth: (maxWidth: string | undefined) => void;
    setPadding: (padding: string | undefined) => void;
    
    // Computed properties
    getComputedMaxWidth: () => string;
    getComputedStyles: () => Record<string, any>;
}

/**
 * Creates the container component state
 * @param options Initial options
 * @returns Extended state store
 */
export function createContainerState(options: ContainerOptions = {}): ContainerStateStore {
    // Define initial state
    const initialState: ContainerState = {
        size: options.size ?? 'md',
        variant: options.variant ?? 'default',
        maxWidth: options.maxWidth,
        padding: options.padding ?? '1rem',
    };
    
    // Create the core state store
    const store = createComponentState('Container', initialState);
    
    // Extend with component-specific methods
    const extendedStore: ContainerStateStore = {
        ...store,
        
        // Convenience setters
        setSize: (size: ContainerSize) => {
            store.setState({ size });
        },
        
        setVariant: (variant: ContainerState['variant']) => {
            store.setState({ variant });
        },
        
        setMaxWidth: (maxWidth: string | undefined) => {
            store.setState({ maxWidth });
        },
        
        setPadding: (padding: string | undefined) => {
            store.setState({ padding });
        },
        
        // Computed properties
        getComputedMaxWidth: () => {
            const state = store.getState();
            
            // Custom maxWidth overrides size preset
            if (state.maxWidth) {
                return state.maxWidth;
            }
            
            // Fluid variant has no max-width
            if (state.variant === 'fluid') {
                return '100%';
            }
            
            // Use size preset
            return SIZE_PRESETS[state.size];
        },
        
        getComputedStyles: () => {
            const state = store.getState();
            const maxWidth = extendedStore.getComputedMaxWidth();
            const center = options.center !== false; // Default true
            
            const styles: Record<string, any> = {
                maxWidth,
                padding: state.padding,
                width: '100%',
            };
            
            // Center the container by default
            if (center && state.variant !== 'fluid') {
                styles.marginLeft = 'auto';
                styles.marginRight = 'auto';
            }
            
            // Responsive variant adds responsive padding
            if (state.variant === 'responsive') {
                styles.paddingLeft = 'clamp(1rem, 5vw, 3rem)';
                styles.paddingRight = 'clamp(1rem, 5vw, 3rem)';
            }
            
            return styles;
        },
    };
    
    return extendedStore;
}