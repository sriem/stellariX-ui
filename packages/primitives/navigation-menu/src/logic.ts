/**
 * NavigationMenu Component Logic
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
 * - Call state setters directly: state.setActiveItemId(), state.toggleExpanded()
 * 
 * WHY: Calling state.getState() in reactive contexts creates circular dependencies
 * that cause infinite loops and crash the application.
 */

import { createLogicLayer } from '@stellarix-ui/core';
import type { LogicLayer } from '@stellarix-ui/core';
import type { NavigationMenuState, NavigationMenuEvents, NavigationMenuOptions, NavigationMenuItem } from './types';
import type { NavigationMenuStateStore } from './state';

/**
 * Find an item by ID in the navigation tree
 */
function findItemById(items: NavigationMenuItem[], itemId: string): NavigationMenuItem | null {
    for (const item of items) {
        if (item.id === itemId) return item;
        if (item.children) {
            const found = findItemById(item.children, itemId);
            if (found) return found;
        }
    }
    return null;
}

/**
 * Find parent item of a given item ID
 */
function findParentItem(items: NavigationMenuItem[], itemId: string): NavigationMenuItem | null {
    for (const item of items) {
        if (item.children) {
            if (item.children.some(child => child.id === itemId)) {
                return item;
            }
            const foundInChildren = findParentItem(item.children, itemId);
            if (foundInChildren) return foundInChildren;
        }
    }
    return null;
}

/**
 * Get all navigable items (not disabled) in order
 */
function getNavigableItems(items: NavigationMenuItem[], expandedIds: string[]): NavigationMenuItem[] {
    const result: NavigationMenuItem[] = [];
    
    function traverse(items: NavigationMenuItem[]) {
        for (const item of items) {
            if (!item.disabled) {
                result.push(item);
            }
            if (item.children && expandedIds.includes(item.id)) {
                traverse(item.children);
            }
        }
    }
    
    traverse(items);
    return result;
}

/**
 * Creates the navigation menu component logic
 * @param state State store to connect to
 * @param options Component options
 * @returns Logic layer for the component
 */
export function createNavigationMenuLogic(
    state: NavigationMenuStateStore,
    options: NavigationMenuOptions = {}
): LogicLayer<NavigationMenuState, NavigationMenuEvents> {
    let hoverTimeout: NodeJS.Timeout | null = null;
    
    // Create the logic layer with proper event handlers and a11y config
    return createLogicLayer<NavigationMenuState, NavigationMenuEvents>({
        // A11y configuration for static elements
        a11yConfig: {
            root: (currentState) => ({
                role: 'navigation',
                'aria-label': options.ariaLabel || 'Main navigation',
                'aria-orientation': currentState.orientation,
                'aria-disabled': currentState.disabled ? 'true' : undefined,
                'data-collapsed': currentState.collapsed ? 'true' : undefined,
            }),
            
            mobileMenuButton: (currentState) => ({
                role: 'button',
                'aria-label': currentState.collapsed ? 'Open navigation menu' : 'Close navigation menu',
                'aria-expanded': !currentState.collapsed ? 'true' : 'false',
                'aria-controls': options.id ? `${options.id}-menu` : undefined,
                tabIndex: currentState.disabled ? -1 : 0,
            }),
            
            menuList: (currentState) => ({
                role: 'menubar',
                'aria-orientation': currentState.orientation,
                id: options.id ? `${options.id}-menu` : undefined,
            }),
        },
        
        // Interaction handlers
        interactionConfig: {
            mobileMenuButton: {
                onClick: (currentState, event: MouseEvent) => {
                    if (currentState.disabled) return null;
                    
                    event.preventDefault();
                    state.toggleCollapsed();
                    
                    if (options.onCollapsedChange) {
                        options.onCollapsedChange(!currentState.collapsed);
                    }
                    
                    return null;
                },
            },
        },
        
        // Event handlers for component events
        eventHandlers: {
            itemClick: (currentState, payload) => {
                // Handle in interaction handlers
                return null;
            },
            itemsChange: (currentState, payload) => {
                if (options.onChange) {
                    options.onChange(payload.items);
                }
                return null;
            },
            activeChange: (currentState, payload) => {
                if (options.onActiveChange) {
                    options.onActiveChange(payload.itemId);
                }
                return null;
            },
            expandedChange: (currentState, payload) => {
                if (options.onExpandedChange) {
                    options.onExpandedChange(payload.expandedIds);
                }
                return null;
            },
            collapsedChange: (currentState, payload) => {
                if (options.onCollapsedChange) {
                    options.onCollapsedChange(payload.collapsed);
                }
                return null;
            },
        },
        
        onCleanup: () => {
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
                hoverTimeout = null;
            }
        },
    });
}

/**
 * Helper function to get a11y props for menu items (with parameters)
 * This is used in the render function since LogicLayer doesn't support parameterized a11y
 */
export function getMenuItemA11yProps(
    state: NavigationMenuState,
    itemId: string,
    hasChildren: boolean
): Record<string, any> {
    const item = findItemById(state.items, itemId);
    const isExpanded = state.expandedItemIds.includes(itemId);
    const isFocused = state.focusedItemId === itemId;
    
    return {
        role: 'menuitem',
        'aria-haspopup': hasChildren ? 'menu' : undefined,
        'aria-expanded': hasChildren ? (isExpanded ? 'true' : 'false') : undefined,
        'aria-current': item?.active ? 'page' : undefined,
        'aria-disabled': item?.disabled || state.disabled ? 'true' : undefined,
        tabIndex: isFocused || (!state.focusedItemId && item === state.items[0]) ? 0 : -1,
        href: !hasChildren && item?.href && !item.disabled && !state.disabled ? item.href : undefined,
    };
}

/**
 * Helper function to get submenu a11y props
 */
export function getSubmenuA11yProps(
    state: NavigationMenuState,
    parentId: string
): Record<string, any> {
    return {
        role: 'menu',
        'aria-orientation': state.orientation === 'horizontal' ? 'vertical' : state.orientation,
    };
}

/**
 * Helper function to create menu item interaction handlers
 * This is used in the render function since LogicLayer doesn't support parameterized interactions
 */
export function createMenuItemHandlers(
    state: NavigationMenuStateStore,
    options: NavigationMenuOptions,
    itemId: string
) {
    let hoverTimeout: NodeJS.Timeout | null = null;
    
    return {
        onClick: (event: MouseEvent) => {
            const currentState = state.getState();
            const item = findItemById(currentState.items, itemId);
            
            if (!item || currentState.disabled || item.disabled) {
                event.preventDefault();
                return;
            }
            
            // If item has children, toggle expansion
            if (item.children && item.children.length > 0) {
                event.preventDefault();
                state.toggleExpanded(itemId);
                
                if (options.onExpandedChange) {
                    const newExpandedIds = currentState.expandedItemIds.includes(itemId)
                        ? currentState.expandedItemIds.filter(id => id !== itemId)
                        : [...currentState.expandedItemIds, itemId];
                    options.onExpandedChange(newExpandedIds);
                }
            } else {
                // If no href, prevent default navigation
                if (!item.href) {
                    event.preventDefault();
                }
                
                // Update active item
                state.setActiveItemId(itemId);
                
                // Call callbacks
                if (options.onItemClick) {
                    options.onItemClick(item, event);
                }
                
                if (options.onActiveChange) {
                    options.onActiveChange(itemId);
                }
                
                // Collapse mobile menu after selection
                if (currentState.collapsed === false && currentState.showMobileMenu) {
                    state.setCollapsed(true);
                    if (options.onCollapsedChange) {
                        options.onCollapsedChange(true);
                    }
                }
            }
        },
        
        onMouseEnter: (event: MouseEvent) => {
            const currentState = state.getState();
            if (currentState.disabled || currentState.trigger === 'click') return;
            
            const item = findItemById(currentState.items, itemId);
            if (!item || item.disabled || !item.children) return;
            
            // Clear any existing timeout
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
                hoverTimeout = null;
            }
            
            // Expand after a short delay
            hoverTimeout = setTimeout(() => {
                state.expandItem(itemId);
                if (options.onExpandedChange) {
                    const expandedIds = state.getState().expandedItemIds;
                    options.onExpandedChange(expandedIds);
                }
            }, 150);
        },
        
        onMouseLeave: (event: MouseEvent) => {
            const currentState = state.getState();
            if (currentState.disabled || currentState.trigger === 'click') return;
            
            // Clear any pending timeout
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
                hoverTimeout = null;
            }
            
            // Collapse after a delay
            hoverTimeout = setTimeout(() => {
                state.collapseItem(itemId);
                if (options.onExpandedChange) {
                    const expandedIds = state.getState().expandedItemIds;
                    options.onExpandedChange(expandedIds);
                }
            }, 300);
        },
        
        onKeyDown: (event: KeyboardEvent) => {
            const currentState = state.getState();
            if (currentState.disabled) return;
            
            const navigableItems = getNavigableItems(currentState.items, currentState.expandedItemIds);
            const currentIndex = navigableItems.findIndex(item => item.id === itemId);
            const currentItem = findItemById(currentState.items, itemId);
            
            if (currentIndex === -1 || !currentItem) return;
            
            let newFocusItemId: string | null = null;
            let preventDefault = true;
            
            switch (event.key) {
                case 'ArrowDown':
                    if (currentState.orientation === 'vertical' || currentItem.children) {
                        // In vertical mode or on parent items, arrow down navigates to next item
                        const nextItem = navigableItems[currentIndex + 1];
                        if (nextItem) newFocusItemId = nextItem.id;
                    }
                    break;
                    
                case 'ArrowUp':
                    if (currentState.orientation === 'vertical' || currentItem.children) {
                        // In vertical mode or on parent items, arrow up navigates to previous item
                        const prevItem = navigableItems[currentIndex - 1];
                        if (prevItem) newFocusItemId = prevItem.id;
                    }
                    break;
                    
                case 'ArrowRight':
                    if (currentState.orientation === 'horizontal') {
                        // In horizontal mode, arrow right navigates to next sibling
                        const nextItem = navigableItems[currentIndex + 1];
                        if (nextItem && !findParentItem(currentState.items, nextItem.id)) {
                            newFocusItemId = nextItem.id;
                        }
                    } else if (currentItem.children) {
                        // In vertical mode, arrow right expands submenu
                        state.expandItem(itemId);
                        // Focus first child
                        const firstChild = currentItem.children.find(child => !child.disabled);
                        if (firstChild) newFocusItemId = firstChild.id;
                    }
                    break;
                    
                case 'ArrowLeft':
                    if (currentState.orientation === 'horizontal') {
                        // In horizontal mode, arrow left navigates to previous sibling
                        const prevItem = navigableItems[currentIndex - 1];
                        if (prevItem && !findParentItem(currentState.items, prevItem.id)) {
                            newFocusItemId = prevItem.id;
                        }
                    } else {
                        // In vertical mode, arrow left collapses submenu or goes to parent
                        const parent = findParentItem(currentState.items, itemId);
                        if (parent) {
                            state.collapseItem(parent.id);
                            newFocusItemId = parent.id;
                        }
                    }
                    break;
                    
                case 'Home':
                    newFocusItemId = navigableItems[0]?.id || null;
                    break;
                    
                case 'End':
                    newFocusItemId = navigableItems[navigableItems.length - 1]?.id || null;
                    break;
                    
                case 'Enter':
                case ' ':
                    // Activate the item
                    if (currentItem.children) {
                        state.toggleExpanded(itemId);
                    } else if (!currentItem.href) {
                        // For items without href, trigger click
                        if (options.onItemClick) {
                            options.onItemClick(currentItem, event as any);
                        }
                    }
                    break;
                    
                case 'Escape':
                    // Close submenu or exit navigation
                    const parent = findParentItem(currentState.items, itemId);
                    if (parent && currentState.expandedItemIds.includes(parent.id)) {
                        state.collapseItem(parent.id);
                        newFocusItemId = parent.id;
                    } else {
                        // Exit navigation
                        state.setFocusedItemId(null);
                        (event.target as HTMLElement).blur();
                    }
                    break;
                    
                default:
                    preventDefault = false;
            }
            
            if (preventDefault) {
                event.preventDefault();
            }
            
            // Update focus if changed
            if (newFocusItemId && newFocusItemId !== itemId) {
                state.setFocusedItemId(newFocusItemId);
                
                // Focus the element
                const menuElement = (event.target as HTMLElement).closest('[role="navigation"]');
                const targetElement = menuElement?.querySelector(`[data-item-id="${newFocusItemId}"]`) as HTMLElement;
                if (targetElement) {
                    targetElement.focus();
                }
            }
        },
        
        onFocus: (event: FocusEvent) => {
            state.setFocusedItemId(itemId);
        },
        
        onBlur: (event: FocusEvent) => {
            // Only clear focus if we're leaving the navigation entirely
            const relatedTarget = event.relatedTarget as HTMLElement;
            const navigationElement = (event.target as HTMLElement).closest('[role="navigation"]');
            
            if (!navigationElement?.contains(relatedTarget)) {
                state.setFocusedItemId(null);
            }
        },
    };
}