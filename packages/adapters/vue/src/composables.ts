/**
 * Vue 3.5+ Composables for StellarIX UI
 * Uses latest Vue 3.5+ Composition API patterns
 */

import { 
    ref, 
    reactive, 
    computed, 
    watch, 
    onMounted, 
    onUnmounted, 
    onUpdated,
    useTemplateRef,
    toRef,
    toRefs,
    unref,
    shallowReactive,
    type Ref,
    type ComputedRef,
    type UnwrapRef,
    type MaybeRef,
    type WatchStopHandle
} from 'vue';

import type { ComponentCore } from '@stellarix-ui/core';
import type { VueComposableReturn, VueEventHandler } from './types';

/**
 * Vue 3.5+ composable for StellarIX state management
 * Provides reactive state integration with StellarIX core
 */
export function useStellarIXState<TState>(
    coreState: TState
): Ref<UnwrapRef<TState>> {
    // For objects, use reactive to allow deep mutations
    // For primitives, use ref
    if (coreState && typeof coreState === 'object' && !Array.isArray(coreState)) {
        const reactiveState = reactive({ ...coreState as Record<string, any> });
        return ref(reactiveState) as Ref<UnwrapRef<TState>>;
    } else {
        return ref(coreState) as Ref<UnwrapRef<TState>>;
    }
}

/**
 * Vue 3.5+ composable for StellarIX logic integration
 * Provides reactive access to component logic and event handling
 */
export function useStellarIXLogic<TLogic extends Record<string, any>>(
    coreLogic: TLogic
) {
    // Create reactive wrapper around core logic
    const logic = reactive({ ...coreLogic });
    
    // Enhance event handlers to work with Vue events
    const handleEvent = (eventName: string, ...args: any[]) => {
        if (logic.handleEvent && typeof logic.handleEvent === 'function') {
            return logic.handleEvent(eventName, ...args);
        }
    };
    
    // Get accessibility props with Vue-friendly format
    const getA11yProps = (element: string) => {
        if (logic.getA11yProps && typeof logic.getA11yProps === 'function') {
            const props = logic.getA11yProps(element);
            
            // Convert to Vue-friendly prop names
            if (props && typeof props === 'object') {
                const vueProps: Record<string, any> = {};
                Object.entries(props).forEach(([key, value]) => {
                    // Convert camelCase to kebab-case for HTML attributes
                    const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                    vueProps[kebabKey] = value;
                });
                return vueProps;
            }
            
            return props;
        }
        return {};
    };
    
    // Get interaction handlers with Vue event format
    const getInteractionHandlers = (element: string) => {
        if (logic.getInteractionHandlers && typeof logic.getInteractionHandlers === 'function') {
            const handlers = logic.getInteractionHandlers(element);
            
            if (handlers && typeof handlers === 'object') {
                const vueHandlers: Record<string, VueEventHandler> = {};
                
                Object.entries(handlers).forEach(([event, handler]) => {
                    // Convert to Vue event format (e.g., onClick -> @click)
                    const vueEvent = event.replace(/^on/, '').toLowerCase();
                    vueHandlers[vueEvent] = (vueEvent: Event) => {
                        if (typeof handler === 'function') {
                            const result = handler(vueEvent);
                            // If handler returns an event name, trigger it
                            if (result && typeof result === 'string') {
                                handleEvent(result, vueEvent);
                            }
                        }
                    };
                });
                
                return vueHandlers;
            }
            
            return handlers;
        }
        return {};
    };
    
    return {
        ...logic,
        handleEvent,
        getA11yProps,
        getInteractionHandlers,
    };
}

/**
 * Vue 3.5+ composable for template refs with proper typing
 * Uses the new useTemplateRef from Vue 3.5+
 */
export function useStellarIXRef<T extends Element = HTMLElement>(
    name: string
): Ref<T | null> {
    return useTemplateRef<T>(name);
}

/**
 * Vue 3.5+ composable for v-model support
 * Provides two-way binding with StellarIX components
 */
export function useStellarIXModel<T>(
    props: any,
    emit: any,
    key = 'modelValue'
): ComputedRef<T> {
    return computed({
        get: () => props[key],
        set: (value: T) => emit(`update:${key}`, value)
    });
}

/**
 * Vue 3.5+ composable for component lifecycle integration
 * Connects Vue lifecycle to StellarIX component lifecycle
 */
export function useStellarIXLifecycle<TState, TLogic extends Record<string, any>>(
    core: ComponentCore<TState, TLogic>,
    options: {
        onMount?: () => void;
        onUnmount?: () => void;
        onUpdate?: () => void;
    } = {}
) {
    const { onMount, onUnmount, onUpdate } = options;
    
    // Only set up lifecycle hooks if we're in a Vue component context
    try {
        onMounted(() => {
            // Initialize logic layer
            if (core.logic.initialize && typeof core.logic.initialize === 'function') {
                core.logic.initialize();
            }
            
            // Custom mount handler
            if (onMount) {
                onMount();
            }
        });
        
        onUpdated(() => {
            // Handle component updates (logic layer doesn't have update method by default)
            // Custom update handler
            if (onUpdate) {
                onUpdate();
            }
        });
        
        onUnmounted(() => {
            // Cleanup component using the destroy method
            if (core.destroy && typeof core.destroy === 'function') {
                core.destroy();
            }
            
            // Custom unmount handler
            if (onUnmount) {
                onUnmount();
            }
        });
    } catch (error) {
        // Lifecycle hooks are called outside of setup context
        // This is okay for testing environments
        console.warn('Lifecycle hooks called outside of Vue component setup context');
    }
}

/**
 * Vue 3.5+ composable for reactive component integration
 * Combines state, logic, and lifecycle management
 */
export function useStellarIXComponent<TState, TLogic extends Record<string, any>>(
    core: ComponentCore<TState, TLogic>,
    options: {
        modelKey?: string;
        lifecycleOptions?: Parameters<typeof useStellarIXLifecycle>[1];
    } = {}
) {
    const { modelKey = 'modelValue', lifecycleOptions = {} } = options;
    
    // Set up reactive state - handle both Store interface and plain state
    const initialState = typeof core.state === 'object' && 'getState' in core.state 
        ? core.state.getState() 
        : core.state;
    const state = useStellarIXState(initialState);
    
    // Set up logic integration
    const logic = useStellarIXLogic(core.logic);
    
    // Set up lifecycle
    useStellarIXLifecycle(core, lifecycleOptions);
    
    // Create computed properties for common component states
    const computedProps = {
        disabled: computed(() => {
            if (state.value && typeof state.value === 'object' && 'disabled' in state.value) {
                return (state.value as any).disabled;
            }
            return false;
        }),
        
        loading: computed(() => {
            if (state.value && typeof state.value === 'object' && 'loading' in state.value) {
                return (state.value as any).loading;
            }
            return false;
        }),
        
        error: computed(() => {
            if (state.value && typeof state.value === 'object' && 'error' in state.value) {
                return (state.value as any).error;
            }
            return null;
        })
    };
    
    // Create common event handlers
    const handlers = {
        handleFocus: (event: FocusEvent) => {
            logic.handleEvent('focus', event);
        },
        
        handleBlur: (event: FocusEvent) => {
            logic.handleEvent('blur', event);
        },
        
        handleClick: (event: MouseEvent) => {
            logic.handleEvent('click', event);
        },
        
        handleKeydown: (event: KeyboardEvent) => {
            logic.handleEvent('keydown', event);
        },
        
        handleInput: (event: Event) => {
            logic.handleEvent('input', event);
        },
        
        handleChange: (event: Event) => {
            logic.handleEvent('change', event);
        }
    };
    
    return {
        state,
        logic,
        computed: computedProps,
        handlers
    };
}

/**
 * Vue 3.5+ composable for compound components
 * Manages complex components with multiple parts (Select, Dialog, Menu, etc.)
 */
export function useStellarIXCompound<TState, TLogic extends Record<string, any>>(
    core: ComponentCore<TState, TLogic>,
    parts: string[]
) {
    // Use simplified approach without full lifecycle integration
    const initialState = typeof core.state === 'object' && 'getState' in core.state 
        ? core.state.getState() 
        : core.state;
    const state = useStellarIXState(initialState);
    const logic = useStellarIXLogic(core.logic);
    
    // Create refs for each compound part
    const refs: Record<string, Ref<Element | null>> = {};
    parts.forEach(part => {
        refs[part] = useStellarIXRef(part);
    });
    
    // Create a11y props getters for each part
    const a11y: Record<string, () => any> = {};
    parts.forEach(part => {
        a11y[part] = () => logic.getA11yProps(part);
    });
    
    // Create interaction handlers for each part
    const interactions: Record<string, () => any> = {};
    parts.forEach(part => {
        interactions[part] = () => logic.getInteractionHandlers(part);
    });
    
    return {
        state,
        logic,
        refs,
        a11y,
        interactions
    };
}

/**
 * Vue 3.5+ composable for portal rendering
 * Handles rendering components in different DOM locations
 */
export function useStellarIXPortal(target: MaybeRef<string | Element | null> = 'body') {
    const targetElement = ref<Element | null>(null);
    
    onMounted(() => {
        const targetValue = unref(target);
        
        if (typeof targetValue === 'string') {
            targetElement.value = document.querySelector(targetValue);
        } else if (targetValue instanceof Element) {
            targetElement.value = targetValue;
        } else {
            targetElement.value = document.body;
        }
    });
    
    return {
        targetElement: computed(() => targetElement.value)
    };
}

/**
 * Vue 3.5+ composable for collection management
 * Handles lists of items with reactive updates
 */
export function useStellarIXCollection(
    items: MaybeRef<any[]>,
    options: {
        keyField?: string;
        filterFn?: (item: any, query: string) => boolean;
        sortFn?: (a: any, b: any) => number;
    } = {}
) {
    const { keyField = 'id', filterFn, sortFn } = options;
    
    const searchQuery = ref('');
    const selectedItems = ref<any[]>([]);
    
    // Filtered items based on search query
    const filteredItems = computed(() => {
        const itemsValue = unref(items);
        const query = searchQuery.value.toLowerCase();
        if (!query || !filterFn) return itemsValue;
        
        return itemsValue.filter(item => filterFn(item, query));
    });
    
    // Sorted and filtered items
    const processedItems = computed(() => {
        const itemsToProcess = filteredItems.value;
        if (!sortFn) return itemsToProcess;
        
        return [...itemsToProcess].sort(sortFn);
    });
    
    // Selection management
    const selectItem = (item: any) => {
        const key = item[keyField];
        const exists = selectedItems.value.find(selected => selected[keyField] === key);
        
        if (exists) {
            selectedItems.value = selectedItems.value.filter(selected => selected[keyField] !== key);
        } else {
            selectedItems.value.push(item);
        }
    };
    
    const isSelected = (item: any) => {
        const key = item[keyField];
        return selectedItems.value.some(selected => selected[keyField] === key);
    };
    
    const clearSelection = () => {
        selectedItems.value = [];
    };
    
    return {
        items: processedItems,
        searchQuery,
        selectedItems: computed(() => selectedItems.value),
        selectItem,
        isSelected,
        clearSelection
    };
}