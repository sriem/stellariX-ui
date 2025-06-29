/**
 * Menu Component Logic
 * Business logic and event handling
 * 
 * 🚨 CRITICAL WARNING: NEVER call state.getState() in this file!
 * 
 * ❌ FORBIDDEN PATTERNS:
 * - const currentState = state.getState(); // CAUSES INFINITE LOOPS!
 * - state.getState() inside event handlers
 * - state.getState() inside getA11yProps()
 * - state.getState() inside getInteractionHandlers()
 * 
 * ✅ CORRECT PATTERNS:
 * - Use (currentState, handleEvent) parameters in interactions
 * - Use (state) parameter in a11y functions
 * - Call state setters directly: state.setOpen(), state.setActiveIndex()
 * 
 * WHY: Calling state.getState() in reactive contexts creates circular dependencies
 * that cause infinite loops and crash the application.
 */

import { LogicLayerBuilder } from '@stellarix-ui/core';
import type { LogicLayer } from '@stellarix-ui/core';
import type { MenuState, MenuEvents, MenuOptions, MenuItem } from './types';
import type { MenuStateStore } from './state';

/**
 * Creates the menu component logic
 * @param state State store to connect to
 * @param options Component options
 * @returns Logic layer for the component
 */
export function createMenuLogic(
    state: MenuStateStore,
    options: MenuOptions = {}
): LogicLayer<MenuState, MenuEvents> {
    // Type-ahead search timeout (default 500ms)
    const typeAheadTimeout = options.typeAheadTimeout ?? 500;
    const typeAheadEnabled = options.typeAhead !== false;
    
    // Helper to handle item selection
    const selectItem = (item: MenuItem) => {
        // Call item's own handler if present
        if (item.onSelect) {
            item.onSelect();
        }
        
        // Call global handler
        if (options.onSelect) {
            options.onSelect(item);
        }
        
        // Update selected ID
        state.setSelectedId(item.id);
        
        // Close menu if configured
        if (options.closeOnSelect !== false && !item.items) {
            state.setOpen(false);
            state.clearSubmenuStack();
            state.setActiveIndex(-1);
        }
    };
    
    // Helper for type-ahead search
    const handleTypeAhead = (char: string, currentState: MenuState) => {
        if (!typeAheadEnabled) return;
        
        const now = Date.now();
        let query = char.toLowerCase();
        
        // Append to existing query if within timeout
        if (now - currentState.searchTimeout < typeAheadTimeout) {
            query = currentState.searchQuery + query;
        }
        
        state.setSearchQuery(query);
        
        // Find matching item
        const currentItems = state.getCurrentItems();
        const startIndex = currentState.activeIndex + 1;
        
        // Search from current position to end
        for (let i = startIndex; i < currentItems.length; i++) {
            const item = currentItems[i];
            if (item && !item.disabled && 
                item.label.toLowerCase().startsWith(query)) {
                state.setActiveIndex(i);
                return;
            }
        }
        
        // Wrap around to beginning
        for (let i = 0; i < startIndex; i++) {
            const item = currentItems[i];
            if (item && !item.disabled && 
                item.label.toLowerCase().startsWith(query)) {
                state.setActiveIndex(i);
                return;
            }
        }
    };
    
    // Create logic layer using the builder
    return new LogicLayerBuilder<MenuState, MenuEvents>()
        .onEvent('open', () => {
            state.setOpen(true);
            if (options.onOpen) {
                options.onOpen();
            }
            return null;
        })
        .onEvent('close', () => {
            state.setOpen(false);
            state.clearSubmenuStack();
            state.setActiveIndex(-1);
            state.setSearchQuery('');
            if (options.onClose) {
                options.onClose();
            }
            return null;
        })
        .onEvent('select', (_, payload) => {
            if (payload && payload.item) {
                selectItem(payload.item);
            }
            return null;
        })
        .onEvent('navigate', (_, payload) => {
            if (payload && typeof payload.index === 'number') {
                state.setActiveIndex(payload.index);
            }
            return null;
        })
        .onEvent('search', (_, payload) => {
            if (payload && payload.query) {
                state.setSearchQuery(payload.query);
            }
            return null;
        })
        .onEvent('focus', () => {
            state.setFocused(true);
            return null;
        })
        .onEvent('blur', () => {
            state.setFocused(false);
            return null;
        })
        .onEvent('keydown', () => {
            // Additional keydown handling if needed
            return null;
        })
        // Menu trigger button
        .withA11y('trigger', (state) => ({
            'aria-haspopup': 'true',
            'aria-expanded': state.open ? 'true' : 'false',
            'aria-controls': options.id ? `${options.id}-menu` : undefined,
            tabIndex: 0,
        }))
        // Menu container
        .withA11y('menu', () => ({
            role: 'menu',
            'aria-labelledby': options.id ? `${options.id}-trigger` : undefined,
            id: options.id ? `${options.id}-menu` : undefined,
            tabIndex: -1,
        }))
        // Menu item - removed, will use helper function instead
        // Trigger interactions
        .withInteraction('trigger', 'onClick', (currentState, event: MouseEvent) => {
            event.preventDefault();
            state.setOpen(!currentState.open);
            
            if (!currentState.open) {
                // Opening - set initial focus
                state.navigateToFirst();
                return 'open';
            } else {
                return 'close';
            }
        })
        .withInteraction('trigger', 'onKeyDown', (currentState, event: KeyboardEvent) => {
            switch (event.key) {
                case 'Enter':
                case ' ':
                case 'ArrowDown':
                    event.preventDefault();
                    if (!currentState.open) {
                        state.setOpen(true);
                        state.navigateToFirst();
                        return 'open';
                    }
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    if (!currentState.open) {
                        state.setOpen(true);
                        state.navigateToLast();
                        return 'open';
                    }
                    break;
            }
            return null;
        })
        // Menu container interactions
        .withInteraction('menu', 'onKeyDown', (currentState, event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowUp':
                    event.preventDefault();
                    state.navigateUp();
                    return 'navigate';
                    
                case 'ArrowDown':
                    event.preventDefault();
                    state.navigateDown();
                    return 'navigate';
                    
                case 'Home':
                    event.preventDefault();
                    state.navigateToFirst();
                    return 'navigate';
                    
                case 'End':
                    event.preventDefault();
                    state.navigateToLast();
                    return 'navigate';
                    
                case 'Enter':
                case ' ': {
                    event.preventDefault();
                    const activeItem = state.getActiveItem();
                    if (activeItem && !activeItem.disabled) {
                        if (activeItem.items) {
                            // Enter submenu
                            state.pushSubmenu(activeItem.id);
                            state.navigateToFirst();
                        } else {
                            selectItem(activeItem);
                            return 'select';
                        }
                    }
                    break;
                }
                    
                case 'ArrowRight': {
                    event.preventDefault();
                    const currentItem = state.getActiveItem();
                    if (currentItem?.items && !currentItem.disabled) {
                        state.pushSubmenu(currentItem.id);
                        state.navigateToFirst();
                    }
                    break;
                }
                    
                case 'ArrowLeft':
                case 'Escape':
                    event.preventDefault();
                    if (state.isInSubmenu()) {
                        state.popSubmenu();
                    } else if (event.key === 'Escape') {
                        return 'close';
                    }
                    break;
                    
                case 'Tab':
                    // Allow tab to naturally move focus out
                    return 'close';
                    
                default:
                    // Type-ahead search
                    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
                        handleTypeAhead(event.key, currentState);
                    }
                    break;
            }
            return null;
        })
        .withInteraction('menu', 'onFocus', () => {
            return 'focus';
        })
        .withInteraction('menu', 'onBlur', (_, event: FocusEvent) => {
            // Check if focus is still within menu
            const relatedTarget = event.relatedTarget as HTMLElement;
            const currentTarget = event.currentTarget as HTMLElement;
            
            if (!currentTarget.contains(relatedTarget)) {
                // Focus left the menu entirely
                return 'close';
            }
            return 'blur';
        })
        // Remove item interactions - will use helper functions instead
        .build();
}

/**
 * Helper function to handle menu item click
 * This will be called by framework adapters with item ID
 */
export function handleMenuItemClick(
    state: MenuStateStore,
    logic: LogicLayer<MenuState, MenuEvents>,
    _currentState: MenuState,
    itemId: string,
    event: MouseEvent
): void {
    event.preventDefault();
    
    const currentItems = state.getCurrentItems();
    const item = currentItems.find(i => i.id === itemId);
    
    if (item && !item.disabled) {
        if (item.items) {
            // Enter submenu
            state.pushSubmenu(item.id);
            state.navigateToFirst();
        } else {
            // Select item
            if (item.onSelect) {
                item.onSelect();
            }
            logic.handleEvent('select', { item });
        }
    }
}

/**
 * Helper function to handle menu item mouse enter
 * This will be called by framework adapters with item ID
 */
export function handleMenuItemMouseEnter(
    state: MenuStateStore,
    _logic: LogicLayer<MenuState, MenuEvents>,
    _currentState: MenuState,
    itemId: string
): void {
    const currentItems = state.getCurrentItems();
    const itemIndex = currentItems.findIndex(i => i.id === itemId);
    
    const item = currentItems[itemIndex];
    if (itemIndex !== -1 && item && !item.disabled) {
        state.setActiveIndex(itemIndex);
    }
}

/**
 * Helper function to get menu item a11y props
 * This will be called by framework adapters
 */
export function getMenuItemA11yProps(
    state: MenuState,
    itemId: string
): Record<string, any> {
    // Use helper method to get current items based on submenu stack
    let currentItems = state.items;
    for (const submenuId of state.submenuStack) {
        const item = currentItems.find(i => i.id === submenuId);
        if (item?.items) {
            currentItems = item.items;
        }
    }
    
    const itemIndex = currentItems.findIndex(item => item.id === itemId);
    const item = currentItems[itemIndex];
    
    if (!item) return {};
    
    return {
        role: 'menuitem',
        'aria-disabled': item.disabled ? 'true' : undefined,
        'aria-haspopup': item.items ? 'true' : undefined,
        'aria-expanded': item.items && state.submenuStack.includes(item.id) ? 'true' : undefined,
        tabIndex: state.activeIndex === itemIndex ? 0 : -1,
    };
}