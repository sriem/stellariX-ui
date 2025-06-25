/**
 * StellarIX Vue 3.5+ Adapter
 * 
 * A comprehensive Vue 3.5+ adapter for StellarIX UI components
 * Features the latest Vue 3.5+ Composition API patterns and TypeScript support
 */

// Main adapter exports
export {
    vueAdapter,
    connectToVue,
    createStellarIXProvider,
    STELLARIX_CONFIG_KEY
} from './adapter';

// Composables exports
export {
    useStellarIXState,
    useStellarIXLogic,
    useStellarIXRef,
    useStellarIXModel,
    useStellarIXLifecycle,
    useStellarIXComponent,
    useStellarIXCompound,
    useStellarIXPortal,
    useStellarIXCollection
} from './composables';

// Types exports
export type {
    VueComponent,
    VueComponentProps,
    VueComponentEmits,
    VueComponentInstance,
    VueTemplateRef,
    VueExtractProps,
    VueAdapterConfig,
    VueComposableReturn,
    VueEventHandler,
    VueModelValue,
    VueDirective,
    VueComponentWithModel,
    VueGenericComponent,
    VueCompoundComponent,
    VueTransitionProps,
    VuePortalProps,
    VueProps,
    VueEmits,
    VueSlots
} from './types';

// Convenience factory functions for common components
import type { ComponentCore } from '@stellarix-ui/core';
import { connectToVue } from './adapter';

/**
 * Create a Vue Button component from StellarIX core
 */
export function createVueButton<TState, TLogic extends Record<string, any>>(core: ComponentCore<TState, TLogic>) {
    return connectToVue(core);
}

/**
 * Create a Vue Input component from StellarIX core
 */
export function createVueInput<TState, TLogic extends Record<string, any>>(core: ComponentCore<TState, TLogic>) {
    return connectToVue(core);
}

/**
 * Create a Vue Checkbox component from StellarIX core
 */
export function createVueCheckbox<TState, TLogic extends Record<string, any>>(core: ComponentCore<TState, TLogic>) {
    return connectToVue(core);
}

/**
 * Create a Vue Select component from StellarIX core
 */
export function createVueSelect<TState, TLogic extends Record<string, any>>(core: ComponentCore<TState, TLogic>) {
    return connectToVue(core);
}

/**
 * Create a Vue Dialog component from StellarIX core
 */
export function createVueDialog<TState, TLogic extends Record<string, any>>(core: ComponentCore<TState, TLogic>) {
    return connectToVue(core);
}

/**
 * Create a Vue Menu component from StellarIX core
 */
export function createVueMenu<TState, TLogic extends Record<string, any>>(core: ComponentCore<TState, TLogic>) {
    return connectToVue(core);
}

/**
 * Create a Vue Tabs component from StellarIX core
 */
export function createVueTabs<TState, TLogic extends Record<string, any>>(core: ComponentCore<TState, TLogic>) {
    return connectToVue(core);
}

/**
 * Create a Vue Stepper component from StellarIX core
 */
export function createVueStepper<TState, TLogic extends Record<string, any>>(core: ComponentCore<TState, TLogic>) {
    return connectToVue(core);
}

/**
 * Create a Vue Popover component from StellarIX core
 */
export function createVuePopover<TState, TLogic extends Record<string, any>>(core: ComponentCore<TState, TLogic>) {
    return connectToVue(core);
}

/**
 * Create a Vue Tooltip component from StellarIX core
 */
export function createVueTooltip<TState, TLogic extends Record<string, any>>(core: ComponentCore<TState, TLogic>) {
    return connectToVue(core);
}

/**
 * Version information
 */
export const version = '0.0.1';