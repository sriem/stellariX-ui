/**
 * React Adapter Hooks
 * State-of-the-art React 19 hooks for StellarIX UI
 */

import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import type { Store, LogicLayer } from '@stellarix/core';
import type { ReactLogic } from './types';

/**
 * Hook to use a StellarIX store in React components
 * Provides reactive state updates with React 19 optimizations
 * @param store The store to use
 * @returns React state with value and setters
 */
export function useStore<T>(store: Store<T>): T {
    const [state, setState] = useState<T>(() => store.getState());

    useEffect(() => {
        // Set initial state in case it changed
        setState(store.getState());
        
        // Subscribe to store changes
        const unsubscribe = store.subscribe(newState => {
            setState(newState);
        });

        return unsubscribe;
    }, [store]);

    return state;
}

/**
 * Hook to use a StellarIX logic layer in React components
 * Provides access to event handlers and accessibility props
 * @param logicLayer The logic layer to use
 * @param store The state store (for reactive updates)
 * @returns React logic interface
 */
export function useLogic<S, E extends Record<string, any> = Record<string, any>>(
    logicLayer: LogicLayer<S, E>,
    store: Store<S>
): ReactLogic<S, E> {
    // Ensure we have the latest state for re-renders
    const state = useStore(store);

    // Memoize event handler to prevent unnecessary re-renders
    const handleEvent = useCallback(
        (event: keyof E | string, payload?: any) => {
            logicLayer.handleEvent(event, payload);
        },
        [logicLayer]
    );

    // Memoize accessibility props getter
    const getA11yProps = useCallback(
        (elementId: string) => {
            return logicLayer.getA11yProps(elementId);
        },
        [logicLayer]
    );

    // Memoize interaction handlers getter
    const getInteractionHandlers = useCallback(
        (elementId: string) => {
            return logicLayer.getInteractionHandlers(elementId);
        },
        [logicLayer]
    );

    // Return memoized logic interface
    return useMemo(() => ({
        state,
        handleEvent,
        getA11yProps,
        getInteractionHandlers,
    }), [state, handleEvent, getA11yProps, getInteractionHandlers]);
}

/**
 * Hook for managing refs with React 19 patterns
 * Supports both callback refs and ref objects
 */
export function useStellarIXRef<T extends HTMLElement = HTMLElement>() {
    const ref = useRef<T>(null);
    
    // React 19 allows direct ref prop usage
    // This hook provides utilities for ref management
    const setRef = useCallback((element: T | null) => {
        if (ref.current !== element) {
            ref.current = element;
        }
    }, []);

    return [ref, setRef] as const;
}

/**
 * Hook for managing focus with React 19 patterns
 * Provides focus management utilities
 */
export function useStellarIXFocus<T extends HTMLElement = HTMLElement>() {
    const [ref, setRef] = useStellarIXRef<T>();
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleFocus = () => setIsFocused(true);
        const handleBlur = () => setIsFocused(false);

        element.addEventListener('focus', handleFocus);
        element.addEventListener('blur', handleBlur);

        // Check initial focus state
        if (document.activeElement === element) {
            setIsFocused(true);
        }

        return () => {
            element.removeEventListener('focus', handleFocus);
            element.removeEventListener('blur', handleBlur);
        };
    }, [ref]);

    const focus = useCallback(() => {
        ref.current?.focus();
    }, [ref]);

    const blur = useCallback(() => {
        ref.current?.blur();
    }, [ref]);

    return { ref: setRef, isFocused, focus, blur };
}

/**
 * Hook for keyboard navigation
 * Provides keyboard event handling utilities
 */
export function useStellarIXKeyboard(
    handlers: Record<string, (event: KeyboardEvent) => void>
) {
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        const handler = handlers[event.key];
        if (handler) {
            handler(event);
        }
    }, [handlers]);

    return { onKeyDown: handleKeyDown };
}