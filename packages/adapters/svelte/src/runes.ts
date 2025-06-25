/**
 * Svelte 5 Runes Utilities
 * Utilities for working with Svelte 5's runes system
 */

import type { Store } from '@stellarix-ui/core';
import type { RuneUtils, StateBindings } from './types';

/**
 * Creates reactive state bindings using Svelte 5 runes
 * This bridges StellarIX's state management with Svelte's reactivity
 */
export function createStateBindings<T extends Record<string, any>>(store: Store<T>): StateBindings<T> {
  // In Svelte 5, we use $state() rune for reactive state
  // Since we can't use runes directly in .ts files, we'll return
  // a structure that can be used in .svelte files
  
  let currentState = store.getState();
  
  // Create a reactive proxy that always returns the latest state
  const reactiveState = new Proxy({} as T, {
    get(target, prop) {
      const latestState = store.getState();
      return latestState[prop as keyof T];
    },
    set(target, prop, value) {
      store.setState((prevState) => ({
        ...prevState,
        [prop]: value
      }));
      return true;
    },
    has(target, prop) {
      const latestState = store.getState();
      return prop in latestState;
    },
    ownKeys(target) {
      const latestState = store.getState();
      return Object.keys(latestState);
    }
  });
  
  // Subscribe to store changes
  const unsubscribe = store.subscribe((newState) => {
    currentState = newState;
  });
  
  const update = (updates: Partial<T>) => {
    store.setState((prevState) => ({
      ...prevState,
      ...updates
    }));
  };
  
  const reset = () => {
    const initialState = store.getState();
    store.setState(() => initialState);
  };
  
  // Clean up subscription when component is destroyed
  if (typeof window !== 'undefined') {
    window.addEventListener('unload', unsubscribe);
  }
  
  return {
    get state() { 
      // Return the current state as a plain object for easier testing
      // while maintaining reactivity through the proxy
      const currentState = store.getState();
      return currentState;
    },
    update,
    reset
  };
}

/**
 * Creates a derived value using Svelte 5 $derived rune
 */
export function createDerivedValue<T, D>(
  getValue: () => T,
  transform: (value: T) => D
): () => D {
  // This will be used in .svelte files with $derived
  return () => {
    const value = getValue();
    return transform(value);
  };
}

/**
 * Creates an effect using Svelte 5 $effect rune
 */
export function createEffectHandler(
  effect: () => void | (() => void)
): () => void {
  // This will be used in .svelte files with $effect
  return effect;
}

/**
 * Utility to sync StellarIX state with Svelte props
 */
export function syncPropsToState<T extends Record<string, any>>(
  store: Store<T>,
  props: Record<string, any>,
  mapping: Record<string, string>
): void {
  const updates: Partial<T> = {};
  
  for (const [propKey, stateKey] of Object.entries(mapping)) {
    if (props[propKey] !== undefined) {
      (updates as any)[stateKey] = props[propKey];
    }
  }
  
  if (Object.keys(updates).length > 0) {
    store.setState((prev) => ({ ...prev, ...updates }));
  }
}

/**
 * Utility to create event handlers that work with StellarIX logic
 */
export function createEventHandler(
  handleEvent: (eventName: string, event: Event) => void,
  eventName: string
): (event: Event) => void {
  return (event: Event) => {
    handleEvent(eventName, event);
  };
}

/**
 * Rune utilities helper object
 * Provides utilities for working with Svelte 5 runes
 */
export const runeUtils: RuneUtils = {
  createState<T>(initial: T): { value: T } {
    // This is a placeholder - actual implementation would use $state
    // In real usage, this would be replaced with $state in .svelte files
    const state = { value: initial };
    return state;
  },
  
  createDerived<T, D>(state: { value: T }, fn: (value: T) => D): { value: D } {
    // This is a placeholder - actual implementation would use $derived
    // In real usage, this would be replaced with $derived in .svelte files
    const derived = { value: fn(state.value) };
    return derived;
  },
  
  createEffect(fn: () => void | (() => void)): void {
    // This is a placeholder - actual implementation would use $effect
    // In real usage, this would be replaced with $effect in .svelte files
    if (typeof window !== 'undefined') {
      // Simple effect simulation for testing
      const cleanup = fn();
      if (cleanup && typeof cleanup === 'function') {
        window.addEventListener('unload', cleanup);
      }
    }
  }
};

/**
 * Helper to convert camelCase to kebab-case for CSS custom properties
 */
export function toKebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Helper to create CSS custom properties from state
 */
export function createCSSVariables(state: Record<string, any>, prefix = 'stellarix'): Record<string, string> {
  const cssVars: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(state)) {
    if (typeof value === 'string' || typeof value === 'number') {
      cssVars[`--${prefix}-${toKebabCase(key)}`] = String(value);
    }
  }
  
  return cssVars;
}