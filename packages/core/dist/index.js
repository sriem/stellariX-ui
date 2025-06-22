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
function createLogicLayer(store, handlers, a11yConfig = {}, interactionConfig = {}) {
  const handleEvent = (event, payload) => {
    const handler = handlers[event];
    if (handler) {
      const currentState = store.getState();
      const stateUpdate = handler(currentState, payload);
      if (stateUpdate) {
        store.setState((prev) => ({
          ...prev,
          ...stateUpdate
        }));
      }
    }
  };
  const getA11yProps = (elementId) => {
    const a11yGenerator = a11yConfig[elementId];
    if (a11yGenerator) {
      return a11yGenerator(store.getState());
    }
    return {};
  };
  const getInteractionHandlers = (elementId) => {
    const elementConfig = interactionConfig[elementId] || {};
    const result = {};
    Object.entries(elementConfig).forEach(([eventName, eventHandler]) => {
      result[eventName] = (event) => {
        const eventType = eventHandler(store.getState(), event);
        if (eventType) {
          handleEvent(eventType, event);
        }
      };
    });
    return result;
  };
  return {
    handleEvent,
    getA11yProps,
    getInteractionHandlers
  };
}

// src/index.ts
var VERSION = "0.0.1";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VERSION,
  createDerivedStore,
  createLogicLayer,
  createStore
});
//# sourceMappingURL=index.js.map