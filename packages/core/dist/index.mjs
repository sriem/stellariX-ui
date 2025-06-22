// src/state.ts
function createStore(initialState) {
  let state = initialState;
  const listeners = /* @__PURE__ */ new Set();
  const getState = () => state;
  const setState = (updater) => {
    state = typeof updater === "function" ? updater(state) : updater;
    listeners.forEach((listener) => listener(state));
  };
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };
  return {
    getState,
    setState,
    subscribe
  };
}
function createDerivedStore(store, selector) {
  const derivedStore = createStore(selector(store.getState()));
  store.subscribe((state) => {
    const newDerivedState = selector(state);
    derivedStore.setState(newDerivedState);
  });
  return derivedStore;
}
function createComponentState(name, initialState) {
  const store = createStore(initialState);
  if (process.env.NODE_ENV === "development") {
    store.subscribe((state) => {
      console.debug(`[${name}] State updated:`, state);
    });
  }
  const derive = (selector) => {
    let derivedValue = selector(store.getState());
    const derivedListeners = /* @__PURE__ */ new Set();
    store.subscribe((newState) => {
      const newValue = selector(newState);
      if (!Object.is(newValue, derivedValue)) {
        derivedValue = newValue;
        derivedListeners.forEach((listener) => listener(derivedValue));
      }
    });
    return {
      get: () => derivedValue,
      subscribe: (listener) => {
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

// src/logic.ts
function createLogicLayer(config = {}) {
  let connectedStore = null;
  let isInitialized = false;
  const {
    eventHandlers = {},
    a11yConfig = {},
    interactionConfig = {},
    onInitialize,
    onCleanup
  } = config;
  const handleEvent = (event, payload) => {
    if (!connectedStore) {
      console.warn(`Logic layer not connected. Event "${event}" ignored.`);
      return;
    }
    const handler = eventHandlers[event];
    if (handler) {
      const currentState = connectedStore.getState();
      const stateUpdate = handler(currentState, payload);
      if (stateUpdate && typeof stateUpdate === "object") {
        connectedStore.setState((prev) => ({
          ...prev,
          ...stateUpdate
        }));
      }
    }
  };
  const getA11yProps = (elementId) => {
    if (!connectedStore) {
      return {};
    }
    const a11yGenerator = a11yConfig[elementId];
    if (a11yGenerator) {
      return a11yGenerator(connectedStore.getState());
    }
    return {};
  };
  const getInteractionHandlers = (elementId) => {
    if (!connectedStore) {
      return {};
    }
    const elementConfig = interactionConfig[elementId] || {};
    const result = {};
    Object.entries(elementConfig).forEach(([eventName, eventHandler]) => {
      result[eventName] = (event) => {
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
  const initialize = () => {
    if (isInitialized || !connectedStore) {
      return;
    }
    if (onInitialize) {
      onInitialize(connectedStore);
    }
    isInitialized = true;
  };
  const cleanup = () => {
    if (!isInitialized) {
      return;
    }
    if (onCleanup) {
      onCleanup();
    }
    connectedStore = null;
    isInitialized = false;
  };
  const connect = (stateStore) => {
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
    connect
  };
}
var LogicLayerBuilder = class {
  config = {};
  /**
   * Add event handler
   */
  onEvent(event, handler) {
    if (!this.config.eventHandlers) {
      this.config.eventHandlers = {};
    }
    this.config.eventHandlers[event] = handler;
    return this;
  }
  /**
   * Add accessibility config for element
   */
  withA11y(elementId, generator) {
    if (!this.config.a11yConfig) {
      this.config.a11yConfig = {};
    }
    this.config.a11yConfig[elementId] = generator;
    return this;
  }
  /**
   * Add interaction handler for element
   */
  withInteraction(elementId, eventName, handler) {
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
  onInitialize(callback) {
    this.config.onInitialize = callback;
    return this;
  }
  /**
   * Add cleanup logic
   */
  onCleanup(callback) {
    this.config.onCleanup = callback;
    return this;
  }
  /**
   * Build the logic layer
   */
  build() {
    return createLogicLayer(this.config);
  }
};
function createComponentLogic(_componentName, config) {
  const eventHandlers = {};
  const a11yConfig = {};
  const interactionConfig = {};
  if (config.events) {
    Object.entries(config.events).forEach(([event, handler]) => {
      eventHandlers[event] = (_state, payload) => {
        if (handler) {
          handler(payload);
        }
        return null;
      };
    });
  }
  if (config.a11y) {
    Object.entries(config.a11y).forEach(([elementId, generator]) => {
      a11yConfig[elementId] = generator;
    });
  }
  if (config.interactions) {
    Object.entries(config.interactions).forEach(([elementId, _getHandlers]) => {
      interactionConfig[elementId] = {};
    });
  }
  return createLogicLayer({
    eventHandlers,
    a11yConfig,
    interactionConfig,
    onInitialize: (store) => {
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
      if (config.onStateChange) {
        let prevState = store.getState();
        const unsubscribe = store.subscribe((newState) => {
          if (newState !== prevState) {
            try {
              config.onStateChange(newState, prevState);
              prevState = newState;
            } catch (error) {
              console.error("Error in onStateChange:", error);
            }
          }
        });
        store.__logicUnsubscribe = unsubscribe;
      }
    },
    onCleanup: () => {
    }
  });
}

// src/component.ts
function createComponentFactory(config) {
  return function componentFactory(options = {}) {
    const initialState = config.createInitialState(options);
    const state = createStore(initialState);
    const logic = config.createLogic(state, options);
    logic.connect(state);
    logic.initialize();
    const metadata = {
      name: config.name,
      version: config.version || "1.0.0",
      ...config.metadata
    };
    const connections = /* @__PURE__ */ new Set();
    const componentCore = {
      state,
      logic,
      metadata,
      /**
       * Connect to any framework adapter
       * This is where the magic happens - one component works with any framework
       */
      connect: (adapter) => {
        try {
          let frameworkComponent = adapter.createComponent(componentCore);
          if (adapter.optimize) {
            frameworkComponent = adapter.optimize(frameworkComponent);
          }
          connections.add(() => {
          });
          return frameworkComponent;
        } catch (error) {
          throw new Error(
            `Failed to connect ${config.name} to ${adapter.name} adapter: ${error.message}`
          );
        }
      },
      /**
       * Clean up component resources
       */
      destroy: () => {
        logic.cleanup();
        connections.forEach((cleanup) => cleanup());
        connections.clear();
        if (config.onDestroy) {
          config.onDestroy();
        }
      }
    };
    return componentCore;
  };
}
var ComponentBuilder = class {
  config = {};
  /**
   * Set component name and version
   */
  withName(name, version) {
    this.config.name = name;
    if (version)
      this.config.version = version;
    return this;
  }
  /**
   * Set initial state creator
   */
  withInitialState(creator) {
    this.config.createInitialState = creator;
    return this;
  }
  /**
   * Set logic creator
   */
  withLogic(creator) {
    this.config.createLogic = creator;
    return this;
  }
  /**
   * Set component metadata
   */
  withMetadata(metadata) {
    this.config.metadata = metadata;
    return this;
  }
  /**
   * Set cleanup handler
   */
  withCleanup(cleanup) {
    this.config.onDestroy = cleanup;
    return this;
  }
  /**
   * Build the component factory
   */
  build() {
    if (!this.config.name) {
      throw new Error("Component name is required");
    }
    if (!this.config.createInitialState) {
      throw new Error("Initial state creator is required");
    }
    if (!this.config.createLogic) {
      throw new Error("Logic creator is required");
    }
    if (!this.config.metadata) {
      throw new Error("Component metadata is required");
    }
    return createComponentFactory(this.config);
  }
};
function createComponentMetadata(config) {
  return {
    accessibility: {
      wcagLevel: "AA",
      patterns: [],
      ...config.accessibility
    },
    events: {
      supported: [],
      required: [],
      custom: {},
      ...config.events
    },
    structure: {
      elements: {},
      ...config.structure
    }
  };
}
function createPrimitive(name, config) {
  const core = {
    state: {},
    // Will be set by the implementation
    logic: {},
    // Will be set by the implementation
    metadata: {
      name,
      version: "0.0.1",
      ...config.metadata
    },
    connect: function(adapter) {
      return adapter.createComponent(this);
    },
    destroy: () => {
    }
  };
  return core;
}

// src/index.ts
var VERSION = "0.0.1";
export {
  ComponentBuilder,
  LogicLayerBuilder,
  VERSION,
  createComponentFactory,
  createComponentLogic,
  createComponentMetadata,
  createComponentState,
  createDerivedStore,
  createLogicLayer,
  createPrimitive,
  createStore
};
//# sourceMappingURL=index.mjs.map