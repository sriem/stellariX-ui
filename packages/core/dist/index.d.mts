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
 * Contains behavioral logic and accessibility requirements
 */

interface LogicLayer<StateType, EventsType = Record<string, any>> {
    handleEvent: (event: keyof EventsType, payload?: any) => void;
    getA11yProps: (elementId: string, state: StateType) => Record<string, any>;
    getInteractionHandlers: (elementId: string) => Record<string, (event: any) => void>;
}
/**
 * Creates a logic layer connected to a state store
 * @param store The state store to connect to
 * @param handlers Event handlers mapping
 * @returns A logic layer object
 */
declare function createLogicLayer<StateType, EventsType extends Record<string, any> = Record<string, any>>(store: Store<StateType>, handlers: {
    [K in keyof EventsType]?: (state: StateType, payload: EventsType[K]) => Partial<StateType> | null;
}, a11yConfig?: {
    [elementId: string]: (state: StateType) => Record<string, any>;
}, interactionConfig?: {
    [elementId: string]: {
        [eventName: string]: (state: StateType, event: any) => keyof EventsType | null;
    };
}): LogicLayer<StateType, EventsType>;

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
    adaptLogic<S, E>(logicLayer: LogicLayer<S, E>): any;
    /**
     * Renders a component to a host element
     */
    renderToHost(node: any, hostElement: HostElement): void;
    /**
     * Creates a component from state and logic
     */
    createComponent<S, E>(state: Store<S>, logic: LogicLayer<S, E>, render: (props: any) => any): any;
}
/**
 * Component factory type
 */
interface ComponentFactory<StateType, EventsType = Record<string, any>, OptionsType = Record<string, any>> {
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

export { type BaseComponentOptions, type BaseComponentState, type ComponentFactory, type FrameworkAdapter, type LogicLayer, type Store, VERSION, createDerivedStore, createLogicLayer, createStore };
