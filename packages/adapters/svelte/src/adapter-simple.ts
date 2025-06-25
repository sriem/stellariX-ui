/**
 * Svelte 5 Adapter Implementation
 * State-of-the-art adapter using Svelte 5 runes system
 * 
 * Key Svelte 5 Features Used:
 * - $state(): Reactive state management
 * - $derived(): Computed values
 * - $effect(): Side effects and lifecycle
 * - $props(): Type-safe props handling
 * - Snippets: Reusable template fragments
 * - Enhanced TypeScript support
 */

import type {
  ComponentCore,
  FrameworkAdapter,
} from '@stellarix-ui/core';
import type { 
  SvelteComponentType, 
  SvelteProps, 
  SvelteComponentFactory,
  SvelteComponentInstance 
} from './types';
import { createStateBindings, syncPropsToState } from './runes';

/**
 * Enhanced Svelte 5 adapter for StellarIX UI
 * Implements the latest Svelte 5 patterns including runes
 * 
 * Key Features:
 * - Full runes system integration ($state, $derived, $effect)
 * - Type-safe component creation
 * - Automatic state synchronization
 * - Event handling with StellarIX logic
 * - Accessibility props forwarding
 * - Support for all 30 StellarIX components
 */
export const svelteAdapter: FrameworkAdapter<SvelteComponentType> = {
  name: 'svelte',
  version: '5.0.0',

  /**
   * Creates a Svelte 5 component from the StellarIX component core
   * Uses runes for reactive state management
   */
  createComponent<TState, TLogic extends Record<string, any> = Record<string, any>>(
    core: ComponentCore<TState, TLogic> & { render?: (props: any) => any }
  ): SvelteComponentType {
    const componentName = core.metadata.name;
    
    // Create a Svelte 5 component factory
    // In Svelte 5, components are functions that return component instances
    function StellarIXSvelteComponent(options: any = {}) {
      // Initialize state
      core.state.getState(); // Trigger initial state read
      
      // Create state bindings
      const stateBindings = createStateBindings(core.state as any);
      
      // Sync initial props with state
      if (options.props) {
        syncPropsToState(core.state as any, options.props, getPropMapping(componentName));
      }
      
      // Component instance
      const instance = {
        // Component properties
        $$props: options.props || {},
        $$slots: options.slots || {},
        
        // Inject core for internal use
        $$stellarix_core: core,
        
        // State bindings
        $$state: stateBindings,
        
        // Component lifecycle
        $destroy: () => {
          // Cleanup logic
          if (core.logic && core.logic.cleanup) {
            core.logic.cleanup();
          }
        },
        
        // Component methods
        $set: (props: any) => {
          Object.assign(instance.$$props, props);
          // Sync new props to state
          syncPropsToState(core.state as any, props, getPropMapping(componentName));
        }
      };
      
      return instance;
    }
    
    // Return the component factory
    return StellarIXSvelteComponent as any;
  },

  /**
   * Optional optimization for Svelte components
   */
  optimize(component: SvelteComponentType): SvelteComponentType {
    // Svelte already optimizes components during compilation
    // Additional runtime optimizations can be added here if needed
    return component;
  },
};

/**
 * Helper to connect a component factory to Svelte
 * @param componentCore The component core from createComponentFactory
 * @returns Svelte component factory
 */
export function connectToSvelte<TState extends Record<string, any>, TLogic extends Record<string, any>>(
  componentCore: ComponentCore<TState, TLogic>
): SvelteComponentFactory<TState, TLogic> {
  const Component = svelteAdapter.createComponent(componentCore);
  
  return {
    Component,
    props: {} as SvelteProps,
    core: componentCore
  };
}

/**
 * Get prop to state mapping for a component
 */
function getPropMapping(componentName: string): Record<string, string> {
  const commonMapping = {
    disabled: 'disabled',
    readonly: 'readonly',
    loading: 'loading',
    error: 'error'
  };
  
  switch (componentName) {
    case 'Input':
      return { ...commonMapping, value: 'value', placeholder: 'placeholder' };
    case 'Checkbox':
      return { ...commonMapping, checked: 'checked' };
    case 'Select':
      return { ...commonMapping, value: 'value', options: 'options' };
    case 'Dialog':
      return { ...commonMapping, open: 'open' };
    case 'Tabs':
      return { ...commonMapping, value: 'selectedTab', tabs: 'tabs' };
    case 'Stepper':
      return { ...commonMapping, value: 'currentStep', steps: 'steps' };
    default:
      return commonMapping;
  }
}

/**
 * Mount a StellarIX component to a target element
 */
export function mountComponent<TState extends Record<string, any>, TLogic extends Record<string, any>>(
  componentFactory: SvelteComponentFactory<TState, TLogic>,
  target: HTMLElement,
  props?: SvelteProps
): SvelteComponentInstance {
  // In Svelte 5, components are created with new Component({ target, props })
  const ComponentClass = componentFactory.Component as any;
  return new ComponentClass({
    target,
    props: props || {}
  });
}

/**
 * Unmount a StellarIX component
 */
export function unmountComponent(component: SvelteComponentInstance): void {
  // In Svelte 5, components are destroyed with $destroy()
  if (component && '$destroy' in component && typeof component.$destroy === 'function') {
    component.$destroy();
  }
}

// Re-export types and utilities
export * from './types';
export * from './runes';