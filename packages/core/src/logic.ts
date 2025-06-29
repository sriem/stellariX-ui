/**
 * Logic Layer
 * Ultra-generic behavioral logic and accessibility system for any framework
 */

import type { Store } from './state.js';

/**
 * Ultra-generic logic interface
 * Designed to be adaptable to any framework or use case
 */
export interface LogicLayer<TState = any, TEvents extends Record<string, any> = Record<string, any>> {
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
export type EventHandler<TState, TPayload = any> = (
  state: TState,
  payload: TPayload
) => Partial<TState> | null | void;

/**
 * Accessibility props generator function type
 */
export type A11yPropsGenerator<TState> = (state: TState) => Record<string, any>;

/**
 * Interaction handler generator function type
 */
export type InteractionHandler<TState> = (
  state: TState,
  event: any
) => string | null;

/**
 * Logic layer configuration
 */
export interface LogicLayerConfig<TState, TEvents> {
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
export function createLogicLayer<
  TState = any,
  TEvents extends Record<string, any> = Record<string, any>
>(
  config: LogicLayerConfig<TState, TEvents> = {}
): LogicLayer<TState, TEvents> {
  let connectedStore: Store<TState> | null = null;
  let isInitialized = false;

  const {
    eventHandlers = {},
    a11yConfig = {},
    interactionConfig = {},
    onInitialize,
    onCleanup,
  } = config;

  const handleEvent = (event: string, payload?: any): void => {
    if (!connectedStore) {
      console.warn(`Logic layer not connected. Event "${event}" ignored.`);
      return;
    }

    const handler = (eventHandlers as any)[event];
    if (handler) {
      const currentState = connectedStore.getState();
      const stateUpdate = handler(currentState, payload);

      if (stateUpdate && typeof stateUpdate === 'object') {
        connectedStore.setState(prev => ({
          ...prev,
          ...stateUpdate,
        }));
      }
    }
  };

  const getA11yProps = (elementId: string): Record<string, any> => {
    if (!connectedStore) {
      return {};
    }

    const a11yGenerator = a11yConfig[elementId];
    if (a11yGenerator) {
      return a11yGenerator(connectedStore.getState());
    }
    return {};
  };

  const getInteractionHandlers = (elementId: string): Record<string, Function> => {
    if (!connectedStore) {
      return {};
    }

    const elementConfig = interactionConfig[elementId] || {};
    const result: Record<string, Function> = {};

    Object.entries(elementConfig).forEach(([eventName, eventHandler]) => {
      result[eventName] = (event: any) => {
        if (connectedStore) {
          const eventType = eventHandler(connectedStore.getState(), event);
          if (eventType) {
            handleEvent(eventType, event);
          }
        }
      };
    });

    return result;
  };

  const initialize = (): void => {
    if (isInitialized || !connectedStore) {
      return;
    }

    if (onInitialize) {
      onInitialize(connectedStore);
    }

    isInitialized = true;
  };

  const cleanup = (): void => {
    if (!isInitialized) {
      return;
    }

    if (onCleanup) {
      onCleanup();
    }

    connectedStore = null;
    isInitialized = false;
  };

  const connect = (stateStore: Store<TState>): void => {
    if (connectedStore) {
      cleanup();
    }

    connectedStore = stateStore;
  };

  return {
    handleEvent,
    getA11yProps,
    getInteractionHandlers,
    initialize,
    cleanup,
    connect,
  };
}

/**
 * Logic layer builder for complex configurations
 */
export class LogicLayerBuilder<TState = any, TEvents extends Record<string, any> = Record<string, any>> {
  private config: LogicLayerConfig<TState, TEvents> = {};

  /**
   * Add event handler
   */
  onEvent<K extends keyof TEvents>(
    event: K,
    handler: EventHandler<TState, TEvents[K]>
  ): this {
    if (!this.config.eventHandlers) {
      this.config.eventHandlers = {};
    }
    this.config.eventHandlers[event] = handler;
    return this;
  }

  /**
   * Add accessibility config for element
   */
  withA11y(elementId: string, generator: A11yPropsGenerator<TState>): this {
    if (!this.config.a11yConfig) {
      this.config.a11yConfig = {};
    }
    this.config.a11yConfig[elementId] = generator;
    return this;
  }

  /**
   * Add interaction handler for element
   */
  withInteraction(
    elementId: string,
    eventName: string,
    handler: InteractionHandler<TState>
  ): this {
    if (!this.config.interactionConfig) {
      this.config.interactionConfig = {};
    }
    if (!this.config.interactionConfig[elementId]) {
      this.config.interactionConfig[elementId] = {};
    }
    this.config.interactionConfig[elementId][eventName] = handler;
    return this;
  }

  /**
   * Add initialization logic
   */
  onInitialize(callback: (stateStore: Store<TState>) => void): this {
    this.config.onInitialize = callback;
    return this;
  }

  /**
   * Add cleanup logic
   */
  onCleanup(callback: () => void): this {
    this.config.onCleanup = callback;
    return this;
  }

  /**
   * Build the logic layer
   */
  build(): LogicLayer<TState, TEvents> {
    return createLogicLayer(this.config);
  }
}

/**
 * Legacy compatibility - will be deprecated
 * @deprecated Use createLogicLayer instead
 */
export interface LogicLayer_Legacy<StateType, EventsType = Record<string, any>> {
  handleEvent: (event: keyof EventsType, payload?: any) => void;
  getA11yProps: (elementId: string, state: StateType) => Record<string, any>;
  getInteractionHandlers: (elementId: string) => Record<string, (event: any) => void>;
}

/**
 * Component logic configuration for easier component creation
 */
export interface ComponentLogicConfig<TState, TEvents> {
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
export function createComponentLogic<TState, TEvents extends Record<string, any>>(
  _componentName: string,
  config: ComponentLogicConfig<TState, TEvents>
): LogicLayer<TState, TEvents> {
  // Create a simple logic layer without complex subscriptions
  const eventHandlers: any = {};
  const a11yConfig: any = {};
  const interactionConfig: any = {};
  
  // Convert events to handlers
  if (config.events) {
    Object.entries(config.events).forEach(([event, handler]) => {
      eventHandlers[event] = (_state: TState, payload: any) => {
        if (handler) {
          handler(payload);
        }
        return null;
      };
    });
  }
  
  // Set up a11y config
  if (config.a11y) {
    Object.entries(config.a11y).forEach(([elementId, generator]) => {
      a11yConfig[elementId] = generator;
    });
  }
  
  // Set up interaction config - simplified to avoid circular deps
  if (config.interactions) {
    Object.entries(config.interactions).forEach(([elementId, _getHandlers]) => {
      interactionConfig[elementId] = {};
      // We'll populate this when we have state
    });
  }
  
  return createLogicLayer<TState, TEvents>({
    eventHandlers,
    a11yConfig,
    interactionConfig,
    onInitialize: (store) => {
      // Set up interactions with actual state
      if (config.interactions) {
        Object.entries(config.interactions).forEach(([elementId, getHandlers]) => {
          const handlers = getHandlers(store.getState());
          Object.entries(handlers).forEach(([eventName, _handler]) => {
            if (!interactionConfig[elementId]) {
              interactionConfig[elementId] = {};
            }
            interactionConfig[elementId][eventName] = () => eventName;
          });
        });
      }
      
      // Simple state change listener without circular deps
      if (config.onStateChange) {
        let prevState = store.getState();
        const unsubscribe = store.subscribe((newState) => {
          // Add safety check to prevent infinite loops
          if (newState !== prevState) {
            try {
              config.onStateChange!(newState, prevState);
              prevState = newState;
            } catch (error) {
              console.error('Error in onStateChange:', error);
            }
          }
        });
        // Store unsubscribe for cleanup
        (store as any).__logicUnsubscribe = unsubscribe;
      }
    },
    onCleanup: () => {
      // Cleanup any subscriptions
    }
  });
}