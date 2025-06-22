/**
 * State Management System
 * Framework-agnostic reactive state management
 */
interface Store<T> {
    getState: () => T;
    setState: (updater: T | ((prev: T) => T)) => void;
    subscribe: (listener: (state: T) => void) => () => void;
}
/**
 * Creates a reactive store with the given initial state
 * @param initialState The initial state
 * @returns A store object with methods to get, set, and subscribe to state
 */
declare function createStore<T>(initialState: T): Store<T>;
/**
 * Creates a derived store based on a selector function
 * @param store The source store
 * @param selector A function to derive values from the source store
 * @returns A store with the derived state
 */
declare function createDerivedStore<T, U>(store: Store<T>, selector: (state: T) => U): Store<U>;

/**
 * Logic Layer
 * Ultra-generic behavioral logic and accessibility system for any framework
 */

/**
 * Ultra-generic logic interface
 * Designed to be adaptable to any framework or use case
 */
interface LogicLayer<TState = any, TEvents extends Record<string, any> = Record<string, any>> {
    handleEvent(event: keyof TEvents | string, payload?: any): void;
    getA11yProps(elementId: string): Record<string, any>;
    getInteractionHandlers(elementId: string): Record<string, Function>;
    initialize(): void;
    cleanup(): void;
    connect(stateStore: Store<TState>): void;
}
/**
 * Event handler function type
 */
type EventHandler<TState, TPayload = any> = (state: TState, payload: TPayload) => Partial<TState> | null | void;
/**
 * Accessibility props generator function type
 */
type A11yPropsGenerator<TState> = (state: TState) => Record<string, any>;
/**
 * Interaction handler generator function type
 */
type InteractionHandler<TState> = (state: TState, event: any) => string | null;
/**
 * Logic layer configuration
 */
interface LogicLayerConfig<TState, TEvents> {
    /**
     * Event handlers mapping
     */
    eventHandlers?: {
        [K in keyof TEvents]?: EventHandler<TState, TEvents[K]>;
    };
    /**
     * Accessibility configuration for elements
     */
    a11yConfig?: {
        [elementId: string]: A11yPropsGenerator<TState>;
    };
    /**
     * Interaction configuration for elements
     */
    interactionConfig?: {
        [elementId: string]: {
            [eventName: string]: InteractionHandler<TState>;
        };
    };
    /**
     * Custom initialization logic
     */
    onInitialize?: (stateStore: Store<TState>) => void;
    /**
     * Custom cleanup logic
     */
    onCleanup?: () => void;
}
/**
 * Creates an ultra-generic logic layer
 * Can be adapted to any framework or component system
 */
declare function createLogicLayer<TState = any, TEvents extends Record<string, any> = Record<string, any>>(config?: LogicLayerConfig<TState, TEvents>): LogicLayer<TState, TEvents>;
/**
 * Logic layer builder for complex configurations
 */
declare class LogicLayerBuilder<TState = any, TEvents extends Record<string, any> = Record<string, any>> {
    private config;
    /**
     * Add event handler
     */
    onEvent<K extends keyof TEvents>(event: K, handler: EventHandler<TState, TEvents[K]>): this;
    /**
     * Add accessibility config for element
     */
    withA11y(elementId: string, generator: A11yPropsGenerator<TState>): this;
    /**
     * Add interaction handler for element
     */
    withInteraction(elementId: string, eventName: string, handler: InteractionHandler<TState>): this;
    /**
     * Add initialization logic
     */
    onInitialize(callback: (stateStore: Store<TState>) => void): this;
    /**
     * Add cleanup logic
     */
    onCleanup(callback: () => void): this;
    /**
     * Build the logic layer
     */
    build(): LogicLayer<TState, TEvents>;
}
/**
 * Legacy compatibility - will be deprecated
 * @deprecated Use createLogicLayer instead
 */
interface LogicLayer_Legacy<StateType, EventsType = Record<string, any>> {
    handleEvent: (event: keyof EventsType, payload?: any) => void;
    getA11yProps: (elementId: string, state: StateType) => Record<string, any>;
    getInteractionHandlers: (elementId: string) => Record<string, (event: any) => void>;
}

/**
 * Common Types
 * Type definitions shared across the library
 */

/**
 * Framework adapter interface
 */
interface FrameworkAdapter<HostElement = any> {
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
    createComponent<S, E extends Record<string, any>>(state: Store<S>, logic: LogicLayer<S, E>, render: (props: any) => any): any;
}
/**
 * Component factory type
 */
interface ComponentFactory<StateType, EventsType extends Record<string, any> = Record<string, any>, OptionsType = Record<string, any>> {
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
interface BaseComponentState {
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
interface BaseComponentOptions {
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

/**
 * StellarIX UI Core
 * Framework-agnostic implementation of UI components
 */

declare const VERSION = "0.0.1";

export { type A11yPropsGenerator, type BaseComponentOptions, type BaseComponentState, type ComponentFactory, type EventHandler, type FrameworkAdapter, type InteractionHandler, type LogicLayer, LogicLayerBuilder, type LogicLayerConfig, type LogicLayer_Legacy, type Store, VERSION, createDerivedStore, createLogicLayer, createStore };
