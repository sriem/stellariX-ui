/**
 * Alert Component State Management
 * Ultra-generic state implementation
 */

import { createComponentState } from '@stellarix/core';
import type { AlertState, AlertOptions, AlertVariant } from './types';

/**
 * Extended state store with alert-specific methods
 */
export interface AlertStateStore {
    // Core state methods
    getState: () => AlertState;
    setState: (updates: Partial<AlertState>) => void;
    subscribe: (listener: (state: AlertState) => void) => () => void;
    derive: <U>(selector: (state: AlertState) => U) => {
        get: () => U;
        subscribe: (listener: (value: U) => void) => () => void;
    };
    
    // Alert-specific methods
    setVisible: (visible: boolean) => void;
    setVariant: (variant: AlertVariant) => void;
    setMessage: (message: string) => void;
    setTitle: (title?: string) => void;
    setDismissible: (dismissible: boolean) => void;
    setDismissing: (dismissing: boolean) => void;
    show: () => void;
    hide: () => void;
    dismiss: () => void;
    reset: () => void;
    
    // Computed properties
    isVisible: () => boolean;
    canDismiss: () => boolean;
}

/**
 * Creates the alert component state
 * @param options Initial options
 * @returns Extended state store
 */
export function createAlertState(options: AlertOptions = {}): AlertStateStore {
    // Define initial state
    const initialState: AlertState = {
        visible: options.visible ?? true,
        variant: options.variant ?? 'info',
        dismissible: options.dismissible ?? false,
        dismissing: false,
        message: options.message ?? '',
        title: options.title,
        showIcon: options.showIcon ?? true,
    };
    
    // Create the core state store
    const store = createComponentState('Alert', initialState);
    
    // Set up auto-close timer if specified
    let autoCloseTimer: number | null = null;
    
    const startAutoCloseTimer = () => {
        if (options.autoClose && options.autoClose > 0) {
            autoCloseTimer = window.setTimeout(() => {
                extendedStore.dismiss();
            }, options.autoClose);
        }
    };
    
    const clearAutoCloseTimer = () => {
        if (autoCloseTimer) {
            window.clearTimeout(autoCloseTimer);
            autoCloseTimer = null;
        }
    };
    
    // Extend with alert-specific methods
    const extendedStore: AlertStateStore = {
        ...store,
        
        // Convenience setters
        setVisible: (visible: boolean) => {
            store.setState(prev => ({ ...prev, visible }));
            if (visible) {
                startAutoCloseTimer();
            } else {
                clearAutoCloseTimer();
            }
        },
        
        setVariant: (variant: AlertVariant) => {
            store.setState(prev => ({ ...prev, variant }));
        },
        
        setMessage: (message: string) => {
            store.setState(prev => ({ ...prev, message }));
        },
        
        setTitle: (title?: string) => {
            store.setState(prev => ({ ...prev, title }));
        },
        
        setDismissible: (dismissible: boolean) => {
            store.setState(prev => ({ ...prev, dismissible }));
        },
        
        setDismissing: (dismissing: boolean) => {
            store.setState(prev => ({ ...prev, dismissing }));
        },
        
        // Show the alert
        show: () => {
            store.setState(prev => ({ ...prev, visible: true, dismissing: false }));
            startAutoCloseTimer();
        },
        
        // Hide the alert
        hide: () => {
            clearAutoCloseTimer();
            store.setState(prev => ({ ...prev, visible: false, dismissing: false }));
        },
        
        // Dismiss the alert (with animation state)
        dismiss: () => {
            const state = store.getState();
            if (state.dismissible && state.visible) {
                clearAutoCloseTimer();
                store.setState(prev => ({ ...prev, dismissing: true }));
                // After animation, hide completely
                setTimeout(() => {
                    store.setState(prev => ({ ...prev, visible: false, dismissing: false }));
                }, 300); // Animation duration
            }
        },
        
        // Reset to initial state
        reset: () => {
            clearAutoCloseTimer();
            store.setState(initialState);
            if (initialState.visible) {
                startAutoCloseTimer();
            }
        },
        
        // Computed properties
        isVisible: () => {
            const state = store.getState();
            return state.visible && !state.dismissing;
        },
        
        canDismiss: () => {
            const state = store.getState();
            return state.dismissible && state.visible && !state.dismissing;
        },
    };
    
    // Start auto-close timer if initially visible
    if (initialState.visible) {
        startAutoCloseTimer();
    }
    
    return extendedStore;
}