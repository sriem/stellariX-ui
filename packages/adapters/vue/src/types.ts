/**
 * Vue 3.5+ Types for StellarIX UI
 * Uses latest Vue 3.5+ patterns and TypeScript features
 */

import type { 
    ComponentPublicInstance, 
    DefineComponent, 
    ExtractPropTypes,
    ComponentOptionsMixin,
    VNodeProps,
    AllowedComponentProps,
    ComputedOptions,
    MethodOptions,
    EmitsOptions,
    SlotsType,
    DefineSetupFnComponent
} from 'vue';

/**
 * Base Vue component props that all StellarIX components accept
 */
export interface VueComponentProps {
    /**
     * CSS class name for styling
     */
    class?: string;
    
    /**
     * Inline styles
     */
    style?: string | Record<string, any>;
    
    /**
     * Element ID
     */
    id?: string;
    
    /**
     * ARIA label for accessibility
     */
    'aria-label'?: string;
    
    /**
     * ARIA labelledby for accessibility
     */
    'aria-labelledby'?: string;
    
    /**
     * ARIA describedby for accessibility
     */
    'aria-describedby'?: string;
    
    /**
     * Test ID for testing
     */
    'data-testid'?: string;
}

/**
 * Vue slot props for compound components
 */
export interface VueSlotProps {
    /**
     * Default slot content
     */
    default?: any;
    
    /**
     * Named slots for specific component parts
     */
    [key: string]: any;
}

/**
 * Vue component emit events
 */
export interface VueComponentEmits {
    /**
     * Generic event emission
     */
    (event: string, ...args: any[]): void;
}

/**
 * Enhanced Vue component type with StellarIX integration
 * Supports Vue 3.5+ features including:
 * - Generic components
 * - Enhanced prop typing
 * - Better emit typing
 * - Slot typing
 */
export type VueComponent<
    TProps extends Record<string, any> = {},
    TEmits extends EmitsOptions = {},
    TSlots extends SlotsType = {}
> = DefineSetupFnComponent<
    TProps & VueComponentProps,
    TEmits,
    TSlots,
    VNodeProps & AllowedComponentProps
>;

/**
 * Vue component instance type
 */
export type VueComponentInstance<T = {}> = ComponentPublicInstance<T & VueComponentProps>;

/**
 * Vue ref type for template refs
 */
export type VueTemplateRef<T = HTMLElement> = T | ComponentPublicInstance | null;

/**
 * Props type extraction utility
 */
export type VueExtractProps<T> = T extends VueComponent<infer P> ? P : never;

/**
 * Vue adapter configuration
 */
export interface VueAdapterConfig {
    /**
     * Enable Vue DevTools integration
     */
    devtools?: boolean;
    
    /**
     * Enable production optimizations
     */
    production?: boolean;
    
    /**
     * Custom render function for complex components
     */
    customRender?: boolean;
}

/**
 * Vue composable return type
 */
export interface VueComposableReturn<TState = any, TLogic = any> {
    /**
     * Reactive state
     */
    state: TState;
    
    /**
     * Logic functions
     */
    logic: TLogic;
    
    /**
     * Computed properties
     */
    computed: ComputedOptions;
    
    /**
     * Event handlers
     */
    handlers: MethodOptions;
}

/**
 * Vue event handler type
 */
export type VueEventHandler<T = Event> = (event: T) => void | Promise<void>;

/**
 * Vue model value type for v-model support
 */
export interface VueModelValue<T = any> {
    modelValue: T;
    'onUpdate:modelValue': (value: T) => void;
}

/**
 * Vue directive type for custom directives
 */
export interface VueDirective {
    name: string;
    value?: any;
    arg?: string;
    modifiers?: Record<string, boolean>;
}

/**
 * Enhanced component props with v-model support
 */
export type VueComponentWithModel<T, TModel = any> = T & VueModelValue<TModel>;

/**
 * Vue 3.5+ generic component type
 */
export type VueGenericComponent<T = any> = DefineComponent<
    {},
    {},
    {},
    ComputedOptions,
    MethodOptions,
    ComponentOptionsMixin,
    ComponentOptionsMixin,
    {},
    string,
    VNodeProps & AllowedComponentProps,
    Readonly<ExtractPropTypes<{}>>,
    {},
    {},
    {},
    SlotsType<{ default: { item: T } }>
>;

/**
 * Vue compound component type for complex components like Select, Dialog, etc.
 */
export interface VueCompoundComponent<TProps extends Record<string, any> = Record<string, any>> {
    Root: VueComponent<TProps>;
    [key: string]: VueComponent<any>;
}

/**
 * Vue transition component props
 */
export interface VueTransitionProps {
    name?: string;
    enter?: string;
    enterActive?: string;
    enterTo?: string;
    leave?: string;
    leaveActive?: string;
    leaveTo?: string;
    duration?: number | { enter: number; leave: number };
    onBeforeEnter?: (el: Element) => void;
    onEnter?: (el: Element, done: () => void) => void;
    onAfterEnter?: (el: Element) => void;
    onBeforeLeave?: (el: Element) => void;
    onLeave?: (el: Element, done: () => void) => void;
    onAfterLeave?: (el: Element) => void;
}

/**
 * Vue portal component props for overlays
 */
export interface VuePortalProps {
    to?: string | Element;
    disabled?: boolean;
}

/**
 * Export utility types
 */
export type VueProps<T> = T extends VueComponent<infer P> ? P : never;
export type VueEmits<T> = T extends VueComponent<any, infer E> ? E : never;
export type VueSlots<T> = T extends VueComponent<any, any, infer S> ? S : never;