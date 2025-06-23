/**
 * Menu Component Public API
 * Framework-agnostic menu implementation
 */

import { createMenuState } from './state';
import { 
    createMenuLogic,
    handleMenuItemClick,
    handleMenuItemMouseEnter,
    getMenuItemA11yProps
} from './logic';
import type { MenuOptions, MenuState, MenuEvents, MenuItem } from './types';
import type { MenuStateStore } from './state';
import type { LogicLayer } from '@stellarix-ui/core';

/**
 * Menu component instance interface
 */
export interface MenuComponent {
    /** Component state store */
    state: MenuStateStore;
    /** Component logic layer */
    logic: LogicLayer<MenuState, MenuEvents>;
    /** Connect to a framework adapter */
    connect: <T>(adapter: any) => T;
    /** Cleanup function */
    destroy: () => void;
}

/**
 * Creates a new menu component instance
 * @param options Component configuration options
 * @returns Menu component instance
 */
export function createMenu(options: MenuOptions = {}): MenuComponent {
    // Create state and logic layers
    const state = createMenuState(options);
    const logic = createMenuLogic(state, options);
    
    // Connect logic to state
    logic.connect(state);
    
    // Initialize the component
    const cleanup = logic.initialize();
    
    return {
        state,
        logic,
        connect: (adapter: any) => adapter.createComponent({ state, logic }),
        destroy: () => {
            cleanup();
        },
    };
}

// Re-export types
export type { MenuState, MenuOptions, MenuEvents, MenuItem } from './types';
export type { MenuStateStore } from './state';

// Re-export helper functions
export { 
    createMenuState,
    createMenuLogic,
    handleMenuItemClick,
    handleMenuItemMouseEnter,
    getMenuItemA11yProps
};