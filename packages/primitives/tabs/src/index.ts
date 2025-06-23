/**
 * Tabs Component
 * Framework-agnostic tabs component
 */

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
    const state = import('./state').createTabsState(options);
    const logic = import('./logic').createTabsLogic(state, options);
    
    return {
        state,
        logic,
        connect: (adapter: any) => adapter.createComponent({ state, logic })
    };
}