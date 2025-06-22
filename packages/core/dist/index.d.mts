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
 * Creates a component state store with debugging support
 * @param name Component name for debugging
 * @param initialState Initial state
 * @returns Enhanced store with derive method
 */
declare function createComponentState<T>(name: string, initialState: T): Store<T> & {
    derive: <U>(selector: (state: T) => U) => {
        get: () => U;
        subscribe: (listener: (value: U) => void) => () => void;
    };
};

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
 * Component logic configuration for easier component creation
 */
interface ComponentLogicConfig<TState, TEvents> {
    events?: {
        [K in keyof TEvents]?: (payload: TEvents[K]) => void;
    };
    a11y?: {
        [elementId: string]: (state: TState) => Record<string, any>;
    };
    interactions?: {
        [elementId: string]: (state: TState) => Record<string, Function>;
    };
    onStateChange?: (newState: TState, prevState: TState) => void;
}
/**
 * Creates component logic with a simpler API
 * IMPORTANT: This is a simplified wrapper - avoid complex nested subscriptions
 */
declare function createComponentLogic<TState, TEvents extends Record<string, any>>(_componentName: string, config: ComponentLogicConfig<TState, TEvents>): LogicLayer<TState, TEvents>;

/**
 * Common Types
 * Type definitions shared across the library
 */

/**
 * Legacy Framework adapter interface
 * @deprecated Use FrameworkAdapter from component.ts instead
 */
interface LegacyFrameworkAdapter<HostElement = any> {
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
 * Legacy Component factory type
 * @deprecated Use ComponentFactory from component.ts instead
 */
interface LegacyComponentFactory<StateType, EventsType extends Record<string, any> = Record<string, any>, OptionsType = Record<string, any>> {
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
    connect: <A extends LegacyFrameworkAdapter>(adapter: A) => ReturnType<A['createComponent']>;
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
 * Ultra-Generic Component Factory System
 * Enables any framework adapter to be connected to any component
 */

/**
 * Component metadata for introspection and tooling
 */
interface ComponentMetadata {
    name: string;
    version: string;
    accessibility: A11yMetadata;
    events: EventMetadata;
    structure: ComponentStructure;
}
/**
 * Accessibility metadata
 */
interface A11yMetadata {
    role?: string;
    label?: string;
    description?: string;
    keyboardShortcuts?: string[];
    ariaAttributes?: string[];
    wcagLevel: 'A' | 'AA' | 'AAA';
    patterns: string[];
}
/**
 * Event metadata
 */
interface EventMetadata {
    supported: string[];
    required: string[];
    custom: {
        [eventName: string]: {
            description: string;
            payload?: any;
        };
    };
}
/**
 * Component structure metadata
 */
interface ComponentStructure {
    elements: {
        [elementId: string]: {
            type: string;
            role?: string;
            optional?: boolean;
        };
    };
    slots?: string[];
    variants?: string[];
    sizes?: string[];
}
/**
 * Framework adapter interface - ultra-minimal for maximum extensibility
 */
interface FrameworkAdapter<TFrameworkComponent = any> {
    name: string;
    version: string;
    createComponent<TState, TLogic extends Record<string, any> = Record<string, any>>(core: ComponentCore<TState, TLogic>): TFrameworkComponent;
    optimize?: (component: TFrameworkComponent) => TFrameworkComponent;
}
/**
 * Ultra-generic component core interface
 * This is the heart of the framework-agnostic system
 */
interface ComponentCore<TState, TLogic extends Record<string, any> = Record<string, any>> {
    state: Store<TState>;
    logic: LogicLayer<TState, TLogic>;
    metadata: ComponentMetadata;
    connect: <TFrameworkComponent>(adapter: FrameworkAdapter<TFrameworkComponent>) => TFrameworkComponent;
    destroy: () => void;
}
/**
 * Component factory configuration
 */
interface ComponentFactoryConfig<TState, TLogic extends Record<string, any>, TOptions> {
    name: string;
    version?: string;
    createInitialState: (options: TOptions) => TState;
    createLogic: (state: Store<TState>, options: TOptions) => LogicLayer<TState, TLogic>;
    metadata: Omit<ComponentMetadata, 'name' | 'version'>;
    onDestroy?: () => void;
}
/**
 * Creates an ultra-generic component factory
 * This function is the foundation of the entire component system
 */
declare function createComponentFactory<TState, TLogic extends Record<string, any>, TOptions = any>(config: ComponentFactoryConfig<TState, TLogic, TOptions>): (options?: TOptions) => ComponentCore<TState, TLogic>;
/**
 * Component builder for complex component construction
 */
declare class ComponentBuilder<TState = any, TLogic extends Record<string, any> = Record<string, any>, TOptions = any> {
    private config;
    /**
     * Set component name and version
     */
    withName(name: string, version?: string): this;
    /**
     * Set initial state creator
     */
    withInitialState(creator: (options: TOptions) => TState): this;
    /**
     * Set logic creator
     */
    withLogic(creator: (state: Store<TState>, options: TOptions) => LogicLayer<TState, TLogic>): this;
    /**
     * Set component metadata
     */
    withMetadata(metadata: Omit<ComponentMetadata, 'name' | 'version'>): this;
    /**
     * Set cleanup handler
     */
    withCleanup(cleanup: () => void): this;
    /**
     * Build the component factory
     */
    build(): (options?: TOptions) => ComponentCore<TState, TLogic>;
}
/**
 * Utility for creating component metadata
 */
declare function createComponentMetadata(config: {
    accessibility: Partial<A11yMetadata>;
    events: Partial<EventMetadata>;
    structure: Partial<ComponentStructure>;
}): Omit<ComponentMetadata, 'name' | 'version'>;
/**
 * Type helper for component factory return type
 */
type ComponentFactory<TState, TLogic extends Record<string, any>, TOptions = any> = (options?: TOptions) => ComponentCore<TState, TLogic>;
/**
 * Type helper for extracting state from component core
 */
type ComponentState<T> = T extends ComponentCore<infer S, any> ? S : never;
/**
 * Type helper for extracting logic from component core
 */
type ComponentLogic<T> = T extends ComponentCore<any, infer L> ? L : never;
/**
 * Simple function to create a primitive component
 * This is a convenience wrapper around ComponentFactoryBuilder
 */
declare function createPrimitive<TState, TLogic extends Record<string, any>, TOptions = any>(name: string, config: {
    initialState: TOptions;
    logicConfig: TOptions;
    metadata: Omit<ComponentMetadata, 'name' | 'version'>;
}): ComponentCore<TState, TLogic>;
/**
 * Type helper for extracting props from component core
 */
type ComponentProps<T> = T extends ComponentCore<any, any> ? any : never;

/**
 * StellarIX UI Core
 * Framework-agnostic implementation of UI components
 */

declare const VERSION = "0.0.1";

export { type A11yMetadata, type A11yPropsGenerator, type BaseComponentOptions, type BaseComponentState, ComponentBuilder, type ComponentCore, type ComponentFactory, type ComponentFactoryConfig, type ComponentLogic, type ComponentLogicConfig, type ComponentMetadata, type ComponentProps, type ComponentState, type ComponentStructure, type EventHandler, type EventMetadata, type FrameworkAdapter, type InteractionHandler, type LegacyComponentFactory, type LegacyFrameworkAdapter, type LogicLayer, LogicLayerBuilder, type LogicLayerConfig, type LogicLayer_Legacy, type Store, VERSION, createComponentFactory, createComponentLogic, createComponentMetadata, createComponentState, createDerivedStore, createLogicLayer, createPrimitive, createStore };
