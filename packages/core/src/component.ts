/**
 * Ultra-Generic Component Factory System
 * Enables any framework adapter to be connected to any component
 */

import { createStore, type Store } from './state.js';
import type { LogicLayer } from './logic.js';

/**
 * Component metadata for introspection and tooling
 */
export interface ComponentMetadata {
  name: string;
  version: string;
  accessibility: A11yMetadata;
  events: EventMetadata;
  structure: ComponentStructure;
}

/**
 * Accessibility metadata
 */
export interface A11yMetadata {
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
export interface EventMetadata {
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
export interface ComponentStructure {
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
export interface FrameworkAdapter<TFrameworkComponent = any> {
  name: string;
  version: string;
  createComponent<TState, TLogic extends Record<string, any> = Record<string, any>>(
    core: ComponentCore<TState, TLogic>
  ): TFrameworkComponent;
  optimize?: (component: TFrameworkComponent) => TFrameworkComponent;
}

/**
 * Ultra-generic component core interface
 * This is the heart of the framework-agnostic system
 */
export interface ComponentCore<TState, TLogic extends Record<string, any> = Record<string, any>> {
  state: Store<TState>;
  logic: LogicLayer<TState, TLogic>;
  metadata: ComponentMetadata;
  connect: <TFrameworkComponent>(
    adapter: FrameworkAdapter<TFrameworkComponent>
  ) => TFrameworkComponent;
  destroy: () => void;
}

/**
 * Component factory configuration
 */
export interface ComponentFactoryConfig<TState, TLogic extends Record<string, any>, TOptions> {
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
export function createComponentFactory<
  TState,
  TLogic extends Record<string, any>,
  TOptions = any
>(
  config: ComponentFactoryConfig<TState, TLogic, TOptions>
): (options?: TOptions) => ComponentCore<TState, TLogic> {
  
  return function componentFactory(options = {} as TOptions): ComponentCore<TState, TLogic> {
    // Create state store with initial state
    const initialState = config.createInitialState(options);
    const state = createStore(initialState);

    // Create logic layer connected to state
    const logic = config.createLogic(state, options);
    logic.connect(state);
    logic.initialize();

    // Create component metadata
    const metadata: ComponentMetadata = {
      name: config.name,
      version: config.version || '1.0.0',
      ...config.metadata,
    };

    // Track connections for cleanup
    const connections = new Set<() => void>();

    const componentCore: ComponentCore<TState, TLogic> = {
      state,
      logic,
      metadata,

      /**
       * Connect to any framework adapter
       * This is where the magic happens - one component works with any framework
       */
      connect: <TFrameworkComponent>(
        adapter: FrameworkAdapter<TFrameworkComponent>
      ): TFrameworkComponent => {
        try {
          // Create framework-specific component
          let frameworkComponent = adapter.createComponent(componentCore);

          // Apply adapter optimization if available
          if (adapter.optimize) {
            frameworkComponent = adapter.optimize(frameworkComponent);
          }

          // Track connection for cleanup
          connections.add(() => {
            // Cleanup logic can be added here if needed
          });

          return frameworkComponent;
        } catch (error) {
          throw new Error(
            `Failed to connect ${config.name} to ${adapter.name} adapter: ${(error as Error).message}`
          );
        }
      },

      /**
       * Clean up component resources
       */
      destroy: () => {
        // Cleanup logic layer
        logic.cleanup();

        // Cleanup all adapter connections
        connections.forEach(cleanup => cleanup());
        connections.clear();

        // Run custom cleanup if provided
        if (config.onDestroy) {
          config.onDestroy();
        }
      },
    };

    return componentCore;
  };
}


/**
 * Component builder for complex component construction
 */
export class ComponentBuilder<TState = any, TLogic extends Record<string, any> = Record<string, any>, TOptions = any> {
  private config: Partial<ComponentFactoryConfig<TState, TLogic, TOptions>> = {};

  /**
   * Set component name and version
   */
  withName(name: string, version?: string): this {
    this.config.name = name;
    if (version) this.config.version = version;
    return this;
  }

  /**
   * Set initial state creator
   */
  withInitialState(creator: (options: TOptions) => TState): this {
    this.config.createInitialState = creator;
    return this;
  }

  /**
   * Set logic creator
   */
  withLogic(creator: (state: Store<TState>, options: TOptions) => LogicLayer<TState, TLogic>): this {
    this.config.createLogic = creator;
    return this;
  }

  /**
   * Set component metadata
   */
  withMetadata(metadata: Omit<ComponentMetadata, 'name' | 'version'>): this {
    this.config.metadata = metadata;
    return this;
  }

  /**
   * Set cleanup handler
   */
  withCleanup(cleanup: () => void): this {
    this.config.onDestroy = cleanup;
    return this;
  }

  /**
   * Build the component factory
   */
  build(): (options?: TOptions) => ComponentCore<TState, TLogic> {
    // Validate required config
    if (!this.config.name) {
      throw new Error('Component name is required');
    }
    if (!this.config.createInitialState) {
      throw new Error('Initial state creator is required');
    }
    if (!this.config.createLogic) {
      throw new Error('Logic creator is required');
    }
    if (!this.config.metadata) {
      throw new Error('Component metadata is required');
    }

    return createComponentFactory(this.config as ComponentFactoryConfig<TState, TLogic, TOptions>);
  }
}

/**
 * Utility for creating component metadata
 */
export function createComponentMetadata(config: {
  accessibility: Partial<A11yMetadata>;
  events: Partial<EventMetadata>;
  structure: Partial<ComponentStructure>;
}): Omit<ComponentMetadata, 'name' | 'version'> {
  return {
    accessibility: {
      wcagLevel: 'AA',
      patterns: [],
      ...config.accessibility,
    },
    events: {
      supported: [],
      required: [],
      custom: {},
      ...config.events,
    },
    structure: {
      elements: {},
      ...config.structure,
    },
  };
}

/**
 * Type helper for component factory return type
 */
export type ComponentFactory<TState, TLogic extends Record<string, any>, TOptions = any> = 
  (options?: TOptions) => ComponentCore<TState, TLogic>;

/**
 * Type helper for extracting state from component core
 */
export type ComponentState<T> = T extends ComponentCore<infer S, any> ? S : never;

/**
 * Type helper for extracting logic from component core
 */
export type ComponentLogic<T> = T extends ComponentCore<any, infer L> ? L : never;

/**
 * Simple function to create a primitive component
 * This is a convenience wrapper around ComponentFactoryBuilder
 */
export function createPrimitive<TState, TLogic extends Record<string, any>, TOptions = any>(
  name: string,
  config: {
    initialState: TOptions;
    logicConfig: TOptions;
    metadata: Omit<ComponentMetadata, 'name' | 'version'>;
  }
): ComponentCore<TState, TLogic> {
  // Create a basic component core that will be enhanced later
  const core: ComponentCore<TState, TLogic> = {
    state: {} as any, // Will be set by the implementation
    logic: {} as any, // Will be set by the implementation
    metadata: {
      name,
      version: '0.0.1',
      ...config.metadata
    },
    connect: function<TFrameworkComponent>(
      adapter: FrameworkAdapter<TFrameworkComponent>
    ): TFrameworkComponent {
      return adapter.createComponent(this);
    },
    destroy: () => {
      // Cleanup will be handled by state and logic
    }
  };
  
  return core;
}

/**
 * Type helper for extracting props from component core
 */
export type ComponentProps<T> = T extends ComponentCore<any, any> ? any : never;