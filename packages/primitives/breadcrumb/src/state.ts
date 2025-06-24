/**
 * Breadcrumb Component State
 * State management for the breadcrumb component
 * 
 * 🚨 CRITICAL WARNING: setState PARTIAL UPDATE PREVENTION
 * 
 * ❌ FORBIDDEN PATTERNS:
 * - state.setState({ field: value }) // WILL NOT WORK!
 * - store.setState({ field: value }) // CAUSES undefined errors!
 * 
 * ✅ ONLY CORRECT PATTERN:
 * - store.setState((prev) => ({ ...prev, field: value }))
 * 
 * WHY: The core setState expects either a full state object or a function updater.
 * Partial objects cause the state to lose all other fields.
 */

import { createComponentState } from '@stellarix-ui/core';
import type { BreadcrumbState, BreadcrumbOptions, BreadcrumbItem } from './types';

/**
 * Default breadcrumb state
 */
const DEFAULT_STATE: BreadcrumbState = {
    items: [],
    separator: '/',
    maxItems: undefined,
    disabled: false,
    focusedIndex: -1,
    showHomeIcon: false,
};

/**
 * Creates a reactive state store for the breadcrumb component
 * @param options Initial options for the component
 * @returns State store with getter and update methods
 */
export function createBreadcrumbState(options: BreadcrumbOptions = {}) {
    // Initialize state with options
    const initialState: BreadcrumbState = {
        ...DEFAULT_STATE,
        items: options.items || DEFAULT_STATE.items,
        separator: options.separator || DEFAULT_STATE.separator,
        maxItems: options.maxItems,
        disabled: options.disabled || DEFAULT_STATE.disabled,
        showHomeIcon: options.showHomeIcon || DEFAULT_STATE.showHomeIcon,
    };
    
    const store = createComponentState('Breadcrumb', initialState);
    
    return {
        ...store,
        
        // Convenience methods for state updates
        // ALWAYS use function updater pattern to preserve other state fields
        
        /**
         * Set the breadcrumb items
         */
        setItems: (items: BreadcrumbItem[]) => {
            store.setState((prev: BreadcrumbState) => ({ ...prev, items }));
        },
        
        /**
         * Add an item to the breadcrumb
         */
        addItem: (item: BreadcrumbItem) => {
            store.setState((prev: BreadcrumbState) => ({
                ...prev,
                items: [...prev.items, item]
            }));
        },
        
        /**
         * Remove an item by id
         */
        removeItem: (id: string) => {
            store.setState((prev: BreadcrumbState) => ({
                ...prev,
                items: prev.items.filter(item => item.id !== id)
            }));
        },
        
        /**
         * Update an item by id
         */
        updateItem: (id: string, updates: Partial<BreadcrumbItem>) => {
            store.setState((prev: BreadcrumbState) => ({
                ...prev,
                items: prev.items.map(item => 
                    item.id === id ? { ...item, ...updates } : item
                )
            }));
        },
        
        /**
         * Set the focused item index
         */
        setFocusedIndex: (index: number) => {
            store.setState((prev: BreadcrumbState) => ({ ...prev, focusedIndex: index }));
        },
        
        /**
         * Set disabled state
         */
        setDisabled: (disabled: boolean) => {
            store.setState((prev: BreadcrumbState) => ({ ...prev, disabled }));
        },
        
        /**
         * Set the separator
         */
        setSeparator: (separator: string) => {
            store.setState((prev: BreadcrumbState) => ({ ...prev, separator }));
        },
        
        /**
         * Set max items for truncation
         */
        setMaxItems: (maxItems: number | undefined) => {
            store.setState((prev: BreadcrumbState) => ({ ...prev, maxItems }));
        },
        
        /**
         * Set whether to show home icon
         */
        setShowHomeIcon: (showHomeIcon: boolean) => {
            store.setState((prev: BreadcrumbState) => ({ ...prev, showHomeIcon }));
        },
        
        /**
         * Clear all items
         */
        clearItems: () => {
            store.setState((prev: BreadcrumbState) => ({ ...prev, items: [] }));
        },
        
        /**
         * Set current/active item by id
         */
        setCurrentItem: (id: string) => {
            store.setState((prev: BreadcrumbState) => ({
                ...prev,
                items: prev.items.map(item => ({
                    ...item,
                    current: item.id === id
                }))
            }));
        }
    };
}

/**
 * Type for the breadcrumb state store
 */
export type BreadcrumbStateStore = ReturnType<typeof createBreadcrumbState>;