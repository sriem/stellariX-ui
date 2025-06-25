/**
 * Svelte 5 Adapter Types
 * Type definitions for the Svelte adapter
 */

// Svelte 5 types - components are now functions, not classes
import type { ComponentCore } from '@stellarix-ui/core';

/**
 * Svelte component type with proper Svelte 5 typing
 * In Svelte 5, components are functions that return component instances
 */
export type SvelteComponentType = (options?: any) => SvelteComponentInstance;

/**
 * Props that can be passed to Svelte components
 */
export interface SvelteProps extends Record<string, any> {
  class?: string;
  style?: string | Record<string, any>;
  id?: string;
  'data-testid'?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  disabled?: boolean;
  readonly?: boolean;
  children?: any;
}

/**
 * Svelte adapter configuration
 */
export interface SvelteAdapterConfig {
  /**
   * Custom mount target for components
   */
  target?: HTMLElement | string;
  
  /**
   * Enable debug mode
   */
  debug?: boolean;
  
  /**
   * Custom CSS classes prefix
   */
  classPrefix?: string;
}

/**
 * Svelte component instance
 */
export interface SvelteComponentInstance {
  $$props: any;
  $$slots: any;
  $destroy: () => void;
  $set: (props: any) => void;
  $on?: (event: string, handler: Function) => void;
}

/**
 * Svelte component instance with StellarIX integration
 */
export interface StellarIXSvelteComponent extends SvelteComponentInstance {
  // Additional StellarIX-specific methods can be added here
  $$stellarix_core?: ComponentCore<any, any>;
}

/**
 * Component state bindings for Svelte's runes
 */
export interface StateBindings<T> {
  /**
   * The reactive state object
   */
  state: T;
  
  /**
   * Update function for the state
   */
  update: (updates: Partial<T>) => void;
  
  /**
   * Reset state to initial values
   */
  reset: () => void;
}

/**
 * Event handler bindings
 */
export interface EventBindings {
  [eventName: string]: (event: Event) => void;
}

/**
 * A11y bindings for components
 */
export interface A11yBindings {
  [key: string]: Record<string, any>;
}

/**
 * Svelte component factory result
 */
export interface SvelteComponentFactory<TState, TLogic extends Record<string, any> = Record<string, any>> {
  /**
   * The Svelte component class
   */
  Component: SvelteComponentType;
  
  /**
   * Props definition for TypeScript
   */
  props: SvelteProps;
  
  /**
   * Core reference for advanced usage
   */
  core: ComponentCore<TState, TLogic>;
}

/**
 * Rune utilities type definitions
 */
export interface RuneUtils {
  /**
   * Create a reactive state rune
   */
  createState<T>(initial: T): { value: T };
  
  /**
   * Create a derived state rune
   */
  createDerived<T, D>(state: { value: T }, fn: (value: T) => D): { value: D };
  
  /**
   * Create an effect rune
   */
  createEffect(fn: () => void | (() => void)): void;
}

/**
 * Component render context for Svelte
 */
export interface SvelteRenderContext {
  /**
   * Component props
   */
  props: SvelteProps;
  
  /**
   * State bindings
   */
  state: StateBindings<any>;
  
  /**
   * Event bindings
   */
  events: EventBindings;
  
  /**
   * A11y bindings
   */
  a11y: A11yBindings;
  
  /**
   * Slot content
   */
  slots?: Record<string, any>;
}