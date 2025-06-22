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
  const getA11yProps = (elementId, state) => {
    const a11yGenerator = a11yConfig[elementId];
    if (a11yGenerator) {
      return a11yGenerator(state || store.getState());
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
export {
  VERSION,
  createDerivedStore,
  createLogicLayer,
  createStore
};
//# sourceMappingURL=index.mjs.map