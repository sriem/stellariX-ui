/**
 * NavigationMenu Component
 * A flexible and accessible navigation menu component
 */

import { createPrimitive } from '@stellarix-ui/core';
import type { LogicLayer } from '@stellarix-ui/core';
import type { NavigationMenuState, NavigationMenuOptions, NavigationMenuEvents } from './types';
import { createNavigationMenuState } from './state';
import type { NavigationMenuStateStore } from './state';
import { createNavigationMenuLogic } from './logic';

// Re-export types
export type {
    NavigationMenuItem,
    NavigationMenuOrientation,
    NavigationMenuTrigger,
    NavigationMenuState,
    NavigationMenuOptions,
    NavigationMenuEvents,
    NavigationMenuProps
} from './types';

// Re-export helper functions for render usage
export { getMenuItemA11yProps, getSubmenuA11yProps, createMenuItemHandlers } from './logic';

/**
 * NavigationMenu component implementation
 */
export interface NavigationMenuComponent {
    state: NavigationMenuStateStore;
    logic: LogicLayer<NavigationMenuState, NavigationMenuEvents>;
    options: NavigationMenuOptions;
    metadata?: any; // Full ComponentMetadata type from core
}

/**
 * Creates a navigation menu component
 * @param options Component options
 * @returns Navigation menu component instance
 */
export function createNavigationMenu(options: NavigationMenuOptions = {}): NavigationMenuComponent {
    const state = createNavigationMenuState(options);
    const logic = createNavigationMenuLogic(state, options);
    
    // Connect and initialize the logic
    logic.connect(state);
    logic.initialize();
    
    return {
        state,
        logic,
        options,
        metadata: {
            name: 'NavigationMenu',
            version: '0.0.0',
            accessibility: {
                role: 'navigation',
                keyboardShortcuts: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Space', 'Escape', 'Home', 'End'],
                ariaAttributes: ['aria-label', 'aria-orientation', 'aria-disabled', 'aria-expanded', 'aria-haspopup', 'aria-current'],
                wcagLevel: 'AA' as const,
                patterns: ['menu', 'menubar', 'navigation']
            },
            events: {
                supported: ['click', 'mouseenter', 'mouseleave', 'focus', 'blur', 'keydown'],
                required: [],
                custom: {
                    itemClick: {
                        description: 'Fired when a menu item is clicked'
                    },
                    itemsChange: {
                        description: 'Fired when menu items are updated'
                    },
                    activeChange: {
                        description: 'Fired when active item changes'
                    },
                    expandedChange: {
                        description: 'Fired when expanded items change'
                    },
                    collapsedChange: {
                        description: 'Fired when collapsed state changes'
                    }
                }
            },
            structure: {
                elements: {
                    'root': {
                        type: 'nav',
                        role: 'navigation',
                        optional: false
                    },
                    'mobileMenuButton': {
                        type: 'button',
                        role: 'button',
                        optional: true
                    },
                    'menuList': {
                        type: 'ul',
                        role: 'menubar',
                        optional: false
                    },
                    'menuItem': {
                        type: 'li',
                        role: 'menuitem',
                        optional: false
                    },
                    'submenu': {
                        type: 'ul',
                        role: 'menu',
                        optional: true
                    }
                }
            }
        }
    };
}

/**
 * Creates NavigationMenu component core (for advanced usage)
 */
export function createNavigationMenuCore(options: NavigationMenuOptions = {}) {
    return createPrimitive<NavigationMenuState, NavigationMenuEvents, NavigationMenuOptions>('NavigationMenu', {
        initialState: options,
        logicConfig: options,
        metadata: {
            accessibility: {
                role: 'navigation',
                keyboardShortcuts: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Space', 'Escape', 'Home', 'End'],
                ariaAttributes: ['aria-label', 'aria-orientation', 'aria-disabled', 'aria-expanded', 'aria-haspopup', 'aria-current'],
                wcagLevel: 'AA',
                patterns: ['menu', 'menubar', 'navigation']
            },
            events: {
                supported: ['click', 'mouseenter', 'mouseleave', 'focus', 'blur', 'keydown'],
                required: [],
                custom: {
                    itemClick: {
                        description: 'Fired when a menu item is clicked'
                    },
                    itemsChange: {
                        description: 'Fired when menu items are updated'
                    },
                    activeChange: {
                        description: 'Fired when active item changes'
                    },
                    expandedChange: {
                        description: 'Fired when expanded items change'
                    },
                    collapsedChange: {
                        description: 'Fired when collapsed state changes'
                    }
                }
            },
            structure: {
                elements: {
                    'root': {
                        type: 'nav',
                        role: 'navigation',
                        optional: false
                    },
                    'mobileMenuButton': {
                        type: 'button',
                        role: 'button',
                        optional: true
                    },
                    'menuList': {
                        type: 'ul',
                        role: 'menubar',
                        optional: false
                    },
                    'menuItem': {
                        type: 'li',
                        role: 'menuitem',
                        optional: false
                    },
                    'submenu': {
                        type: 'ul',
                        role: 'menu',
                        optional: true
                    }
                }
            }
        }
    });
}

// Default export for convenience
export default createNavigationMenu;