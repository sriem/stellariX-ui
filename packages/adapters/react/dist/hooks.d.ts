/**
 * React Adapter Hooks
 */
import { Store, LogicLayer } from '@stellarix/core';
import { ReactState, ReactLogic } from './types';
/**
 * Hook to use a StellarIX store in React components
 * @param store The store to use
 * @returns React state hook result
 */
export declare function useStore<T>(store: Store<T>): ReactState<T>;
/**
 * Hook to use a StellarIX logic layer in React components
 * @param logicLayer The logic layer to use
 * @param store The state store
 * @returns React logic hook result
 */
export declare function useLogic<S, E = Record<string, any>>(logicLayer: LogicLayer<S, E>, store: Store<S>): ReactLogic<S, E>;
//# sourceMappingURL=hooks.d.ts.map