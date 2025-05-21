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
export declare function createStore<T>(initialState: T): Store<T>;
/**
 * Creates a derived store based on a selector function
 * @param store The source store
 * @param selector A function to derive values from the source store
 * @returns A store with the derived state
 */
export declare function createDerivedStore<T, U>(store: Store<T>, selector: (state: T) => U): Store<U>;
//# sourceMappingURL=state.d.ts.map