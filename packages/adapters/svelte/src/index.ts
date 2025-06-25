/**
 * StellarIX UI Svelte 5 Adapter
 * Framework adapter for Svelte 5 with runes support
 */

// Main adapter and connection function
export { svelteAdapter, connectToSvelte, mountComponent, unmountComponent } from './adapter';

// Rune utilities
export { 
  createStateBindings, 
  createDerivedValue, 
  createEffectHandler,
  syncPropsToState,
  createEventHandler,
  runeUtils,
  toKebabCase,
  createCSSVariables
} from './runes';

// Types
export type {
  SvelteComponentType,
  SvelteProps,
  SvelteAdapterConfig,
  StellarIXSvelteComponent,
  StateBindings,
  EventBindings,
  A11yBindings,
  SvelteComponentFactory,
  RuneUtils,
  SvelteRenderContext
} from './types';

// Version
export const VERSION = '0.0.1';