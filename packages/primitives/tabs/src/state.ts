/**
 * Tabs Component State Management
 * Manages the internal state of the tabs component
 * 
 * 🚨 CRITICAL WARNING: setState PARTIAL UPDATE PREVENTION
 * 
 * ❌ FORBIDDEN PATTERNS:
 * - state.setState({ field: value }) // WILL NOT WORK - causes NaN/undefined
 * - store.setState({ field: value }) // FORBIDDEN - loses other fields
 * 
 * ✅ ONLY CORRECT PATTERN:
 * - store.setState((prev: any) => ({ ...prev, field: value }))
 * - store.setState((prev: any) => ({ ...prev, field1: value1, field2: value2 }))
 * 
 * WHY: The core setState expects either a full state object or a function updater.
 * Partial objects cause the state to lose all other fields.
 */

import { createStore } from '@stellarix/core';
import type { TabsState, TabsOptions, Tab } from './types';

/**
 * Create initial state from options
 */
function createInitialState(options: TabsOptions = {}): TabsState {
    const tabs = options.tabs || [];
    
    return {
        activeTab: options.activeTab || (tabs.length > 0 ? tabs[0].id : null),
        tabs,
        disabled: options.disabled || false,
        orientation: options.orientation || 'horizontal',
        focusedIndex: 0,
        activationMode: options.activationMode || 'automatic'
    };
}

/**
 * Tabs state store type
 */
export interface TabsStateStore {
    getState: () => TabsState;
    setState: (updater: (state: TabsState) => TabsState) => void;
    subscribe: (listener: (state: TabsState) => void) => () => void;
    
    // Convenience methods for common state updates
    setActiveTab: (tabId: string | null) => void;
    setTabs: (tabs: Tab[]) => void;
    setDisabled: (disabled: boolean) => void;
    setFocusedIndex: (index: number) => void;
    setOrientation: (orientation: TabsState['orientation']) => void;
    setActivationMode: (mode: TabsState['activationMode']) => void;
}

/**
 * Create tabs state store
 */
export function createTabsState(options: TabsOptions = {}): TabsStateStore {
    const store = createStore<TabsState>(createInitialState(options));
    
    return {
        ...store,
        
        // ✅ CRITICAL: ALWAYS use function updater pattern for setState
        setActiveTab: (tabId: string | null) => {
            store.setState((prev: TabsState) => ({ ...prev, activeTab: tabId }));
        },
        
        setTabs: (tabs: Tab[]) => {
            store.setState((prev: TabsState) => ({ ...prev, tabs }));
        },
        
        setDisabled: (disabled: boolean) => {
            store.setState((prev: TabsState) => ({ ...prev, disabled }));
        },
        
        setFocusedIndex: (index: number) => {
            store.setState((prev: TabsState) => ({ ...prev, focusedIndex: index }));
        },
        
        setOrientation: (orientation: TabsState['orientation']) => {
            store.setState((prev: TabsState) => ({ ...prev, orientation }));
        },
        
        setActivationMode: (mode: TabsState['activationMode']) => {
            store.setState((prev: TabsState) => ({ ...prev, activationMode: mode }));
        }
    };
}