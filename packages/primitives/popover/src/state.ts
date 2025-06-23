/**
 * Popover Component State
 * State management using the ultra-generic architecture
 * 
 * 🚨 CRITICAL: NEVER use setState({ field: value }) - ALWAYS use:
 * store.setState((prev: any) => ({ ...prev, field: value }))
 */

import { createStore } from '@stellarix-ui/core';
import type { PopoverState, PopoverOptions, PopoverPlacement } from './types';

/**
 * Default state values
 */
const defaultState: PopoverState = {
    open: false,
    placement: 'bottom',
    triggerElement: null,
    contentElement: null,
    focused: false,
    disabled: false,
};

/**
 * State store interface for type safety
 */
export interface PopoverStateStore {
    getState: () => PopoverState;
    setState: (updater: PopoverState | ((prev: PopoverState) => PopoverState)) => void;
    subscribe: (listener: (state: PopoverState) => void) => () => void;
    
    // Convenience methods for updating state
    setOpen: (open: boolean) => void;
    setPlacement: (placement: PopoverPlacement) => void;
    setTriggerElement: (element: HTMLElement | null) => void;
    setContentElement: (element: HTMLElement | null) => void;
    setFocused: (focused: boolean) => void;
    setDisabled: (disabled: boolean) => void;
}

/**
 * Creates a popover state store
 * @param options Initial configuration options
 * @returns State store with methods for managing popover state
 */
export function createPopoverState(options: PopoverOptions = {}): PopoverStateStore {
    // Create the base store with initial state
    const store = createStore<PopoverState>({
        ...defaultState,
        open: options.open ?? defaultState.open,
        placement: options.placement ?? defaultState.placement,
        disabled: options.disabled ?? defaultState.disabled,
    });
    
    // Create convenience methods that properly use the function updater pattern
    const setOpen = (open: boolean) => {
        store.setState((prev: PopoverState) => ({ ...prev, open }));
    };
    
    const setPlacement = (placement: PopoverPlacement) => {
        store.setState((prev: PopoverState) => ({ ...prev, placement }));
    };
    
    const setTriggerElement = (triggerElement: HTMLElement | null) => {
        store.setState((prev: PopoverState) => ({ ...prev, triggerElement }));
    };
    
    const setContentElement = (contentElement: HTMLElement | null) => {
        store.setState((prev: PopoverState) => ({ ...prev, contentElement }));
    };
    
    const setFocused = (focused: boolean) => {
        store.setState((prev: PopoverState) => ({ ...prev, focused }));
    };
    
    const setDisabled = (disabled: boolean) => {
        store.setState((prev: PopoverState) => ({ ...prev, disabled }));
    };
    
    // Return the enhanced store
    return {
        ...store,
        setOpen,
        setPlacement,
        setTriggerElement,
        setContentElement,
        setFocused,
        setDisabled,
    };
}