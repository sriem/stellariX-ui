/**
 * State Management System
 * Framework-agnostic reactive state management
 */

export interface Store<T> {
    getState: () => T;
    setState: (updater: T | ((prev: T) => T)) => void;
    subscribe: (listener: (state: T) => void) => () => void;
}

/**
 * Creates a reactive store with the given initial state
 * @param initialState The initial state
 * @returns A store object with methods to get, set, and subscribe to state
 */
export function createStore<T>(initialState: T): Store<T> {
    let state = initialState;
    const listeners = new Set<(state: T) => void>();

    const getState = () => state;

    const setState = (updater: T | ((prev: T) => T)) => {
        state = typeof updater === 'function'
            ? (updater as ((prev: T) => T))(state)
            : updater;

        listeners.forEach(listener => listener(state));
    };

    const subscribe = (listener: (state: T) => void) => {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    };

    return {
        getState,
        setState,
        subscribe,
    };
}

/**
 * Creates a derived store based on a selector function
 * @param store The source store
 * @param selector A function to derive values from the source store
 * @returns A store with the derived state
 */
export function createDerivedStore<T, U>(
    store: Store<T>,
    selector: (state: T) => U
): Store<U> {
    const derivedStore = createStore<U>(selector(store.getState()));

    store.subscribe(state => {
        const newDerivedState = selector(state);
        derivedStore.setState(newDerivedState);
    });

    return derivedStore;
}

/**
 * Creates a component state store with debugging support
 * @param name Component name for debugging
 * @param initialState Initial state
 * @returns Enhanced store with derive method
 */
export function createComponentState<T>(
    name: string,
    initialState: T
): Store<T> & { derive: <U>(selector: (state: T) => U) => { get: () => U; subscribe: (listener: (value: U) => void) => () => void } } {
    const store = createStore(initialState);
    
    // Add debugging in development
    if (process.env.NODE_ENV === 'development') {
        store.subscribe((state) => {
            console.debug(`[${name}] State updated:`, state);
        });
    }
    
    // Add derive method
    const derive = <U>(selector: (state: T) => U) => {
        let derivedValue = selector(store.getState());
        const derivedListeners = new Set<(value: U) => void>();
        
        store.subscribe((newState) => {
            const newValue = selector(newState);
            if (!Object.is(newValue, derivedValue)) {
                derivedValue = newValue;
                derivedListeners.forEach(listener => listener(derivedValue));
            }
        });
        
        return {
            get: () => derivedValue,
            subscribe: (listener: (value: U) => void) => {
                derivedListeners.add(listener);
                return () => derivedListeners.delete(listener);
            }
        };
    };
    
    return {
        ...store,
        derive
    };
} 