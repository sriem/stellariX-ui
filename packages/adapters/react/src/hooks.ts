/**
 * React Adapter Hooks
 */

import { useRef, useState, useEffect, useCallback } from 'react';
import { Store, LogicLayer } from '@stellarix/core';
import { ReactState, ReactLogic } from './types';

/**
 * Hook to use a StellarIX store in React components
 * @param store The store to use
 * @returns React state hook result
 */
export function useStore<T>(store: Store<T>): ReactState<T> {
    const [state, setState] = useState<T>(store.getState());

    useEffect(() => {
        const unsubscribe = store.subscribe(newState => {
            setState(newState);
        });

        return unsubscribe;
    }, [store]);

    const set = useCallback(
        (updater: T | ((prev: T) => T)) => {
            store.setState(updater);
        },
        [store]
    );

    const subscribe = useCallback(
        (callback: (state: T) => void) => {
            return store.subscribe(callback);
        },
        [store]
    );

    return {
        value: state,
        set,
        subscribe,
    };
}

/**
 * Hook to use a StellarIX logic layer in React components
 * @param logicLayer The logic layer to use
 * @param store The state store
 * @returns React logic hook result
 */
export function useLogic<S, E = Record<string, any>>(
    logicLayer: LogicLayer<S, E>,
    store: Store<S>
): ReactLogic<S, E> {
    const state = useStore(store);

    const trigger = useCallback(
        <K extends keyof E>(event: K, payload?: E[K]) => {
            logicLayer.handleEvent(event, payload);
        },
        [logicLayer]
    );

    const getA11yProps = useCallback(
        (elementId: string) => {
            return logicLayer.getA11yProps(elementId);
        },
        [logicLayer]
    );

    const getHandlers = useCallback(
        (elementId: string) => {
            return logicLayer.getInteractionHandlers(elementId);
        },
        [logicLayer]
    );

    return {
        state,
        trigger,
        getA11yProps,
        getHandlers,
    };
} 