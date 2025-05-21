/**
 * React Adapter Implementation
 */
import { FrameworkAdapter, ComponentFactory } from '@stellarix/core';
import { ReactComponent } from './types';
/**
 * React adapter for StellarIX UI
 */
export declare const reactAdapter: FrameworkAdapter<HTMLElement>;
/**
 * Connect a component factory to React
 * @param factory Component factory
 * @returns React component
 */
export declare function connectToReact<S, E, O>(factory: ComponentFactory<S, E, O>): ReactComponent;
//# sourceMappingURL=adapter.d.ts.map