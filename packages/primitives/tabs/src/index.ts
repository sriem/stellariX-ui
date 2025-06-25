/**
 * Tabs Component
 * Framework-agnostic tabs component
 */

import { createTabsState } from './state';
import { 
    createTabsLogic,
    handleTabClick,
    handleTabFocus,
    getTabA11yProps,
    getTabPanelA11yProps
} from './logic';

export { createTabsState } from './state';
export { 
    createTabsLogic,
    handleTabClick,
    handleTabFocus,
    getTabA11yProps,
    getTabPanelA11yProps
} from './logic';
export type {
    Tab,
    TabsOrientation,
    TabActivationMode,
    TabsState,
    TabsOptions,
    TabsEvents,
    TabsProps
} from './types';
export type { TabsStateStore } from './state';

/**
 * Create a complete tabs component
 */
export function createTabs(options: import('./types').TabsOptions = {}) {
    const state = createTabsState(options);
    const logic = createTabsLogic(state, options);
    
    logic.connect(state);
    logic.initialize();
    
    return {
        state,
        logic,
        metadata: {
            name: 'Tabs',
            accessibility: {
                role: 'tablist',
                wcagLevel: 'AA',
                keyboardShortcuts: ['ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter', 'Space'],
                ariaAttributes: ['aria-selected', 'aria-controls', 'aria-labelledby']
            },
            events: {
                supported: ['tab-change', 'focus', 'blur'],
                required: [],
                custom: {}
            },
            structure: {
                elements: {
                    root: { type: 'div', role: 'tablist', optional: false },
                    tab: { type: 'button', role: 'tab', optional: false },
                    tabPanel: { type: 'div', role: 'tabpanel', optional: false }
                }
            }
        },
        connect: (adapter: any) => adapter.createComponent(this),
        destroy: () => logic.cleanup()
    };
}

// Test aliases for factory functions
export const createTabsWithImplementation = createTabs;
export const createTabsFactory = createTabs;