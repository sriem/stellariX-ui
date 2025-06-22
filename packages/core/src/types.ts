/**
 * Common Types
 * Type definitions shared across the library
 */

import type { Store } from './state';
import type { LogicLayer } from './logic';

/**
 * Framework adapter interface
 */
export interface FrameworkAdapter<HostElement = any> {
    /**
     * Adapts a state layer to the framework's reactivity system
     */
    adaptState<T>(store: Store<T>): any;

    /**
     * Adapts a logic layer to the framework's event system
     */
    adaptLogic<S, E extends Record<string, any>>(logicLayer: LogicLayer<S, E>): any;

    /**
     * Renders a component to a host element
     */
    renderToHost(node: any, hostElement: HostElement): void;

    /**
     * Creates a component from state and logic
     */
    createComponent<S, E extends Record<string, any>>(
        state: Store<S>,
        logic: LogicLayer<S, E>,
        render: (props: any) => any
    ): any;
}

/**
 * Component factory type
 */
export interface ComponentFactory<
    StateType,
    EventsType extends Record<string, any> = Record<string, any>,
    OptionsType = Record<string, any>
> {
    /**
     * Component state store
     */
    state: Store<StateType>;

    /**
     * Component logic layer
     */
    logic: LogicLayer<StateType, EventsType>;

    /**
     * Connects the component to a framework
     */
    connect: <A extends FrameworkAdapter>(adapter: A) => ReturnType<A['createComponent']>;

    /**
     * Component options
     */
    options: OptionsType;
}

/**
 * Base component state shared by all components
 */
export interface BaseComponentState {
    /**
     * Whether the component is disabled
     */
    disabled?: boolean;

    /**
     * Whether the component has focus
     */
    focused?: boolean;

    /**
     * Whether the component is hovered
     */
    hovered?: boolean;

    /**
     * Component data attributes
     */
    dataAttributes?: Record<string, string>;
}

/**
 * Base component options shared by all components
 */
export interface BaseComponentOptions {
    /**
     * Component ID
     */
    id?: string;

    /**
     * Initial disabled state
     */
    disabled?: boolean;

    /**
     * Callback when component state changes
     */
    onStateChange?: (state: any) => void;
} 