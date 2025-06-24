/**
 * NavigationMenu Component State
 * Reactive state management
 * 
 * 🚨 CRITICAL: ALWAYS use function updater pattern for setState
 * ✅ CORRECT: store.setState((prev: any) => ({ ...prev, field: value }))
 * ❌ WRONG: store.setState({ field: value }) // WILL LOSE OTHER FIELDS!
 */

import { createComponentState } from '@stellarix-ui/core';
import type { Store } from '@stellarix-ui/core';
import type { NavigationMenuState, NavigationMenuItem, NavigationMenuOptions } from './types';

/**
 * NavigationMenu state store type
 */
export type NavigationMenuStateStore = Store<NavigationMenuState>;

/**
 * Default state values
 */
const DEFAULT_STATE: NavigationMenuState = {
    items: [],
    orientation: 'horizontal',
    collapsed: false,
    disabled: false,
    focusedItemId: null,
    activeItemId: null,
    expandedItemIds: [],
    trigger: 'click',
    showMobileMenu: true,
    mobileBreakpoint: 768,
};

/**
 * Creates the navigation menu state store
 * @param options Initial options
 * @returns State store
 */
export function createNavigationMenuState(options: NavigationMenuOptions = {}): NavigationMenuStateStore {
    const initialState: NavigationMenuState = {
        ...DEFAULT_STATE,
        items: options.items || DEFAULT_STATE.items,
        orientation: options.orientation || DEFAULT_STATE.orientation,
        collapsed: options.collapsed ?? DEFAULT_STATE.collapsed,
        disabled: options.disabled ?? DEFAULT_STATE.disabled,
        activeItemId: options.activeItemId ?? DEFAULT_STATE.activeItemId,
        expandedItemIds: options.expandedItemIds || DEFAULT_STATE.expandedItemIds,
        trigger: options.trigger || DEFAULT_STATE.trigger,
        showMobileMenu: options.showMobileMenu ?? DEFAULT_STATE.showMobileMenu,
        mobileBreakpoint: options.mobileBreakpoint ?? DEFAULT_STATE.mobileBreakpoint,
    };
    
    const store = createComponentState('NavigationMenu', initialState) as any;
    
    // Add convenience methods for state updates
    // ALWAYS use function updater pattern to preserve other state fields
    
    /**
     * Set navigation items
     */
    store.setItems = (items: NavigationMenuItem[]) => {
        store.setState((prev: NavigationMenuState) => ({ ...prev, items }));
    };
    
    /**
     * Set focused item ID
     */
    store.setFocusedItemId = (itemId: string | null) => {
        store.setState((prev: NavigationMenuState) => ({ ...prev, focusedItemId: itemId }));
    };
    
    /**
     * Set active item ID
     */
    store.setActiveItemId = (itemId: string | null) => {
        store.setState((prev: NavigationMenuState) => ({ ...prev, activeItemId: itemId }));
    };
    
    /**
     * Set expanded item IDs
     */
    store.setExpandedItemIds = (expandedItemIds: string[]) => {
        store.setState((prev: NavigationMenuState) => ({ ...prev, expandedItemIds }));
    };
    
    /**
     * Toggle expanded state of an item
     */
    store.toggleExpanded = (itemId: string) => {
        store.setState((prev: NavigationMenuState) => {
            const expandedItemIds = prev.expandedItemIds.includes(itemId)
                ? prev.expandedItemIds.filter(id => id !== itemId)
                : [...prev.expandedItemIds, itemId];
            return { ...prev, expandedItemIds };
        });
    };
    
    /**
     * Expand an item
     */
    store.expandItem = (itemId: string) => {
        store.setState((prev: NavigationMenuState) => {
            if (prev.expandedItemIds.includes(itemId)) return prev;
            return { ...prev, expandedItemIds: [...prev.expandedItemIds, itemId] };
        });
    };
    
    /**
     * Collapse an item
     */
    store.collapseItem = (itemId: string) => {
        store.setState((prev: NavigationMenuState) => ({
            ...prev,
            expandedItemIds: prev.expandedItemIds.filter(id => id !== itemId)
        }));
    };
    
    /**
     * Set collapsed state
     */
    store.setCollapsed = (collapsed: boolean) => {
        store.setState((prev: NavigationMenuState) => ({ ...prev, collapsed }));
    };
    
    /**
     * Toggle collapsed state
     */
    store.toggleCollapsed = () => {
        store.setState((prev: NavigationMenuState) => ({ ...prev, collapsed: !prev.collapsed }));
    };
    
    /**
     * Set disabled state
     */
    store.setDisabled = (disabled: boolean) => {
        store.setState((prev: NavigationMenuState) => ({ ...prev, disabled }));
    };
    
    /**
     * Update a specific item
     */
    store.updateItem = (itemId: string, updates: Partial<NavigationMenuItem>) => {
        store.setState((prev: NavigationMenuState) => ({
            ...prev,
            items: updateItemRecursive(prev.items, itemId, updates)
        }));
    };
    
    /**
     * Reset to initial state
     */
    store.reset = () => {
        store.setState(() => initialState);
    };
    
    return store as NavigationMenuStateStore;
}

/**
 * Helper function to recursively update an item in the tree
 */
function updateItemRecursive(
    items: NavigationMenuItem[],
    targetId: string,
    updates: Partial<NavigationMenuItem>
): NavigationMenuItem[] {
    return items.map(item => {
        if (item.id === targetId) {
            return { ...item, ...updates };
        }
        if (item.children) {
            return {
                ...item,
                children: updateItemRecursive(item.children, targetId, updates)
            };
        }
        return item;
    });
}

// Extend the Store type to include our custom methods
declare module '@stellarix-ui/core' {
    interface Store<T> {
        setItems?: (items: NavigationMenuItem[]) => void;
        setFocusedItemId?: (itemId: string | null) => void;
        setActiveItemId?: (itemId: string | null) => void;
        setExpandedItemIds?: (expandedItemIds: string[]) => void;
        toggleExpanded?: (itemId: string) => void;
        expandItem?: (itemId: string) => void;
        collapseItem?: (itemId: string) => void;
        setCollapsed?: (collapsed: boolean) => void;
        toggleCollapsed?: () => void;
        setDisabled?: (disabled: boolean) => void;
        updateItem?: (itemId: string, updates: Partial<NavigationMenuItem>) => void;
        reset?: () => void;
    }
}