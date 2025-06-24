/**
 * NavigationMenu Component
 * A flexible and accessible navigation menu component
 */

import type { ComponentCore, LogicLayer } from '@stellarix-ui/core';
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

// Remove this interface as we'll use ComponentCore from @stellarix-ui/core

/**
 * Creates a navigation menu component
 * @param options Component options
 * @returns Navigation menu component instance
 */
export function createNavigationMenu(options: NavigationMenuOptions = {}): ComponentCore<NavigationMenuState, NavigationMenuEvents> {
    const state = createNavigationMenuState(options);
    const logic = createNavigationMenuLogic(state, options);
    
    // Connect and initialize the logic
    logic.connect(state);
    logic.initialize();
    
    return {
        state,
        logic,
        metadata: {
            name: 'NavigationMenu',
            version: '1.0.0',
            accessibility: {
                role: 'navigation',
                keyboardShortcuts: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Space', 'Escape', 'Home', 'End'],
                ariaAttributes: ['aria-label', 'aria-orientation', 'aria-disabled', 'aria-expanded', 'aria-haspopup', 'aria-current'],
                wcagLevel: 'AA',
                patterns: ['menu', 'menubar', 'navigation']
            },
            events: {
                supported: ['itemClick', 'itemsChange', 'activeChange', 'expandedChange', 'collapsedChange'],
                required: [],
                custom: {
                    itemClick: { description: 'Fired when a menu item is clicked' },
                    itemsChange: { description: 'Fired when menu items are updated' },
                    activeChange: { description: 'Fired when active item changes' },
                    expandedChange: { description: 'Fired when expanded items change' },
                    collapsedChange: { description: 'Fired when collapsed state changes' }
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
        },
        connect: (adapter: any) => {
            return adapter.createComponent({
                state,
                logic,
                metadata: {
                    name: 'NavigationMenu',
                    version: '1.0.0'
                }
            });
        }
    };
}

// Export state store type
export type { NavigationMenuStateStore } from './state';

// Default export for convenience
export default createNavigationMenu;