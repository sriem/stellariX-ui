/**
 * Menu Component State Management
 * Ultra-generic state implementation
 * 
 * 🚨 CRITICAL: Always use setState((prev) => ({ ...prev, field: value }))
 * NEVER use setState({ field: value }) - it will lose other state fields!
 */

import { createComponentState } from '@stellarix-ui/core';
import type { MenuState, MenuOptions, MenuItem } from './types';

/**
 * Extended state store with component-specific methods
 */
export interface MenuStateStore {
    // Core state methods
    getState: () => MenuState;
    setState: (updater: (prev: MenuState) => MenuState) => void;
    subscribe: (listener: (state: MenuState) => void) => () => void;
    derive: <U>(selector: (state: MenuState) => U) => {
        get: () => U;
        subscribe: (listener: (value: U) => void) => () => void;
    };
    
    // Component-specific methods
    setOpen: (open: boolean) => void;
    setActiveIndex: (index: number) => void;
    setItems: (items: MenuItem[]) => void;
    setSearchQuery: (query: string) => void;
    setFocused: (focused: boolean) => void;
    setSelectedId: (id?: string) => void;
    pushSubmenu: (itemId: string) => void;
    popSubmenu: () => void;
    clearSubmenuStack: () => void;
    
    // Navigation methods
    navigateUp: () => void;
    navigateDown: () => void;
    navigateToFirst: () => void;
    navigateToLast: () => void;
    
    // Computed properties
    getCurrentItems: () => MenuItem[];
    getActiveItem: () => MenuItem | undefined;
    isInSubmenu: () => boolean;
}

/**
 * Creates the menu component state
 * @param options Initial options
 * @returns Extended state store
 */
export function createMenuState(options: MenuOptions = {}): MenuStateStore {
    // Define initial state
    const initialState: MenuState = {
        open: options.open ?? false,
        activeIndex: -1,
        items: options.items ?? [],
        searchQuery: '',
        searchTimeout: 0,
        focused: false,
        selectedId: undefined,
        submenuStack: [],
    };
    
    // Create the core state store
    const store = createComponentState('Menu', initialState);
    
    // Helper to get current items based on submenu stack
    const getCurrentItemsHelper = (state: MenuState): MenuItem[] => {
        if (state.submenuStack.length === 0) {
            return state.items;
        }
        
        // Navigate through submenu stack
        let currentItems = state.items;
        for (const itemId of state.submenuStack) {
            const item = currentItems.find(i => i.id === itemId);
            if (item?.items) {
                currentItems = item.items;
            }
        }
        return currentItems;
    };
    
    // Helper to find non-disabled items
    const findEnabledIndex = (items: MenuItem[], startIndex: number, direction: 'forward' | 'backward'): number => {
        const len = items.length;
        if (len === 0) return -1;
        
        let index = startIndex;
        let checked = 0;
        
        while (checked < len) {
            if (direction === 'forward') {
                index = (index + 1) % len;
            } else {
                index = (index - 1 + len) % len;
            }
            
            if (!items[index].disabled) {
                return index;
            }
            checked++;
        }
        
        return -1; // All items disabled
    };
    
    // Extend with component-specific methods
    const extendedStore: MenuStateStore = {
        ...store,
        
        // Override setState to use updater pattern
        setState: (updater: (prev: MenuState) => MenuState) => {
            store.setState((prev: any) => updater(prev));
        },
        
        // Convenience setters
        setOpen: (open: boolean) => {
            store.setState((prev: any) => ({ ...prev, open }));
        },
        
        setActiveIndex: (activeIndex: number) => {
            store.setState((prev: any) => ({ ...prev, activeIndex }));
        },
        
        setItems: (items: MenuItem[]) => {
            store.setState((prev: any) => ({ ...prev, items }));
        },
        
        setSearchQuery: (searchQuery: string) => {
            store.setState((prev: any) => ({ 
                ...prev, 
                searchQuery,
                searchTimeout: Date.now()
            }));
        },
        
        setFocused: (focused: boolean) => {
            store.setState((prev: any) => ({ ...prev, focused }));
        },
        
        setSelectedId: (selectedId?: string) => {
            store.setState((prev: any) => ({ ...prev, selectedId }));
        },
        
        pushSubmenu: (itemId: string) => {
            store.setState((prev: any) => ({ 
                ...prev, 
                submenuStack: [...prev.submenuStack, itemId],
                activeIndex: -1 // Reset active index when entering submenu
            }));
        },
        
        popSubmenu: () => {
            store.setState((prev: any) => ({ 
                ...prev, 
                submenuStack: prev.submenuStack.slice(0, -1),
                activeIndex: -1 // Reset active index when leaving submenu
            }));
        },
        
        clearSubmenuStack: () => {
            store.setState((prev: any) => ({ 
                ...prev, 
                submenuStack: [],
                activeIndex: -1
            }));
        },
        
        // Navigation methods
        navigateUp: () => {
            const state = store.getState();
            const currentItems = getCurrentItemsHelper(state);
            if (currentItems.length === 0) return;
            
            const newIndex = findEnabledIndex(
                currentItems,
                state.activeIndex === -1 ? currentItems.length : state.activeIndex,
                'backward'
            );
            
            if (newIndex !== -1) {
                store.setState((prev: any) => ({ ...prev, activeIndex: newIndex }));
            }
        },
        
        navigateDown: () => {
            const state = store.getState();
            const currentItems = getCurrentItemsHelper(state);
            if (currentItems.length === 0) return;
            
            const newIndex = findEnabledIndex(
                currentItems,
                state.activeIndex,
                'forward'
            );
            
            if (newIndex !== -1) {
                store.setState((prev: any) => ({ ...prev, activeIndex: newIndex }));
            }
        },
        
        navigateToFirst: () => {
            const state = store.getState();
            const currentItems = getCurrentItemsHelper(state);
            if (currentItems.length === 0) return;
            
            // Find first enabled item
            for (let i = 0; i < currentItems.length; i++) {
                if (!currentItems[i].disabled) {
                    store.setState((prev: any) => ({ ...prev, activeIndex: i }));
                    return;
                }
            }
        },
        
        navigateToLast: () => {
            const state = store.getState();
            const currentItems = getCurrentItemsHelper(state);
            if (currentItems.length === 0) return;
            
            // Find last enabled item
            for (let i = currentItems.length - 1; i >= 0; i--) {
                if (!currentItems[i].disabled) {
                    store.setState((prev: any) => ({ ...prev, activeIndex: i }));
                    return;
                }
            }
        },
        
        // Computed properties
        getCurrentItems: () => {
            const state = store.getState();
            return getCurrentItemsHelper(state);
        },
        
        getActiveItem: () => {
            const state = store.getState();
            const currentItems = getCurrentItemsHelper(state);
            return state.activeIndex >= 0 && state.activeIndex < currentItems.length
                ? currentItems[state.activeIndex]
                : undefined;
        },
        
        isInSubmenu: () => {
            const state = store.getState();
            return state.submenuStack.length > 0;
        },
    };
    
    return extendedStore;
}