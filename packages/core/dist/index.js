"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  LogicLayerBuilder: () => LogicLayerBuilder,
  VERSION: () => VERSION,
  createDerivedStore: () => createDerivedStore,
  createLogicLayer: () => createLogicLayer,
  createStore: () => createStore
});
module.exports = __toCommonJS(src_exports);

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

// src/index.ts
var VERSION = "0.0.1";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LogicLayerBuilder,
  VERSION,
  createDerivedStore,
  createLogicLayer,
  createStore
});
//# sourceMappingURL=index.js.map