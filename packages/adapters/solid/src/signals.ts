import { createSignal, createEffect, createMemo, onCleanup, batch } from 'solid-js';
import type { Store } from '@stellarix-ui/core';

export function createSignalFromStore<T>(store: Store<T>) {
  const [state, setState] = createSignal(store.getState());
  
  const unsubscribe = store.subscribe((newState) => {
    batch(() => {
      setState(() => newState);
    });
  });
  
  onCleanup(unsubscribe);
  
  return state;
}

export function syncStoreToSignal<T>(
  store: Store<T>,
  signal: () => T,
  setter: (value: T) => void
) {
  createEffect(() => {
    const currentState = signal();
    const storeState = store.getState();
    
    if (currentState !== storeState) {
      store.setState(() => currentState);
    }
  });
  
  const unsubscribe = store.subscribe((newState) => {
    const currentSignal = signal();
    if (newState !== currentSignal) {
      batch(() => {
        setter(() => newState);
      });
    }
  });
  
  onCleanup(unsubscribe);
}

export function createDerivedStore<T, D>(
  store: Store<T>,
  derive: (state: T) => D
): () => D {
  const state = createSignalFromStore(store);
  return createMemo(() => derive(state()));
}

export function createStoreEffect<T>(
  store: Store<T>,
  effect: (state: T) => void | (() => void)
) {
  const state = createSignalFromStore(store);
  
  createEffect(() => {
    const cleanup = effect(state());
    if (typeof cleanup === 'function') {
      onCleanup(cleanup);
    }
  });
}