/**
 * Tabs Component Logic
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
 * - Call state setters directly: state.setActiveTab(), state.setFocusedIndex()
 * 
 * WHY: Calling state.getState() in reactive contexts creates circular dependencies
 * that cause infinite loops and crash the application.
 */

import { LogicLayerBuilder } from '@stellarix/core';
import type { LogicLayer } from '@stellarix/core';
import type { TabsState, TabsEvents, TabsOptions, Tab } from './types';
import type { TabsStateStore } from './state';

/**
 * Find the next enabled tab index
 */
function findNextEnabledTab(tabs: Tab[], currentIndex: number, direction: 'next' | 'previous'): number {
    const step = direction === 'next' ? 1 : -1;
    let newIndex = currentIndex + step;
    
    // Wrap around
    if (newIndex < 0) newIndex = tabs.length - 1;
    if (newIndex >= tabs.length) newIndex = 0;
    
    // Find next enabled tab
    let attempts = 0;
    while (tabs[newIndex]?.disabled && attempts < tabs.length) {
        newIndex += step;
        if (newIndex < 0) newIndex = tabs.length - 1;
        if (newIndex >= tabs.length) newIndex = 0;
        attempts++;
    }
    
    return newIndex;
}

/**
 * Creates the tabs component logic
 * Since the core framework doesn't support parameterized a11y/interactions,
 * we'll use a different approach for tabs that need index-based handling
 * @param state State store to connect to
 * @param options Component options
 * @returns Logic layer for the component
 */
export function createTabsLogic(
    state: TabsStateStore,
    options: TabsOptions = {}
): LogicLayer<TabsState, TabsEvents> {
    return new LogicLayerBuilder<TabsState, TabsEvents>()
        .onEvent('change', (currentState, payload: any) => {
            // Extract tabId from payload
            let tabId = currentState.activeTab;
            
            if (payload && typeof payload === 'object' && 'tabId' in payload) {
                tabId = payload.tabId;
            }
            
            // Call user callback if provided
            if (options.onChange && tabId) {
                options.onChange(tabId);
            }
            return null;
        })
        .onEvent('focus', (currentState, payload: any) => {
            // Handle focus event if needed
            return null;
        })
        .onEvent('navigate', (currentState, payload: any) => {
            // Handle navigation event if needed
            return null;
        })
        // Tab list a11y props
        .withA11y('tablist', (state) => ({
            role: 'tablist',
            'aria-orientation': state.orientation,
            'aria-disabled': state.disabled ? 'true' : undefined
        }))
        // Root element interaction handlers
        .withInteraction('root', 'onClick', (currentState, event: MouseEvent) => {
            // This will be used for delegation pattern in framework adapters
            // The adapter will determine which tab was clicked based on DOM structure
            return null;
        })
        .withInteraction('root', 'onKeyDown', (currentState, event: KeyboardEvent) => {
            // Prevent interaction if disabled
            if (currentState.disabled) {
                return null;
            }
            
            const focusedIndex = currentState.focusedIndex;
            let handled = false;
            let newIndex = focusedIndex;
            
            switch (event.key) {
                case 'ArrowRight':
                    if (currentState.orientation === 'horizontal') {
                        event.preventDefault();
                        newIndex = findNextEnabledTab(currentState.tabs, focusedIndex, 'next');
                        handled = true;
                    }
                    break;
                    
                case 'ArrowLeft':
                    if (currentState.orientation === 'horizontal') {
                        event.preventDefault();
                        newIndex = findNextEnabledTab(currentState.tabs, focusedIndex, 'previous');
                        handled = true;
                    }
                    break;
                    
                case 'ArrowDown':
                    if (currentState.orientation === 'vertical') {
                        event.preventDefault();
                        newIndex = findNextEnabledTab(currentState.tabs, focusedIndex, 'next');
                        handled = true;
                    }
                    break;
                    
                case 'ArrowUp':
                    if (currentState.orientation === 'vertical') {
                        event.preventDefault();
                        newIndex = findNextEnabledTab(currentState.tabs, focusedIndex, 'previous');
                        handled = true;
                    }
                    break;
                    
                case 'Home':
                    event.preventDefault();
                    // Find first enabled tab
                    newIndex = currentState.tabs.findIndex(t => !t.disabled);
                    if (newIndex === -1) newIndex = 0;
                    handled = true;
                    break;
                    
                case 'End':
                    event.preventDefault();
                    // Find last enabled tab
                    for (let i = currentState.tabs.length - 1; i >= 0; i--) {
                        if (!currentState.tabs[i].disabled) {
                            newIndex = i;
                            break;
                        }
                    }
                    handled = true;
                    break;
                    
                case 'Enter':
                case ' ':
                    if (currentState.activationMode === 'manual' && currentState.focusedIndex !== -1) {
                        event.preventDefault();
                        const tab = currentState.tabs[currentState.focusedIndex];
                        if (tab && !tab.disabled) {
                            state.setActiveTab(tab.id);
                            return 'change';
                        }
                    }
                    break;
            }
            
            if (handled && newIndex !== focusedIndex) {
                state.setFocusedIndex(newIndex);
                
                // In automatic mode, also activate the tab
                if (currentState.activationMode === 'automatic') {
                    const newTab = currentState.tabs[newIndex];
                    if (newTab && !newTab.disabled) {
                        state.setActiveTab(newTab.id);
                        return 'change';
                    }
                }
                
                return 'navigate';
            }
            
            return null;
        })
        .build();
}

/**
 * Helper function to handle tab click
 * This will be called by framework adapters
 * 
 * IMPORTANT: Pass currentState as parameter to avoid getState() calls
 */
export function handleTabClick(
    state: TabsStateStore,
    logic: LogicLayer<TabsState, TabsEvents>,
    currentState: TabsState,
    tabIndex: number,
    event: MouseEvent
): void {
    // Prevent interaction if disabled
    if (currentState.disabled) {
        event.preventDefault();
        return;
    }
    
    const tab = currentState.tabs[tabIndex];
    if (!tab || tab.disabled) {
        event.preventDefault();
        return;
    }
    
    // Update active tab
    state.setActiveTab(tab.id);
    state.setFocusedIndex(tabIndex);
    
    // Trigger change event
    logic.handleEvent('change', { tabId: tab.id });
}

/**
 * Helper function to handle tab focus
 * This will be called by framework adapters
 * 
 * IMPORTANT: Pass currentState as parameter to avoid getState() calls
 */
export function handleTabFocus(
    state: TabsStateStore,
    logic: LogicLayer<TabsState, TabsEvents>,
    currentState: TabsState,
    tabIndex: number
): void {
    state.setFocusedIndex(tabIndex);
    const tab = currentState.tabs[tabIndex];
    if (tab) {
        logic.handleEvent('focus', { tabId: tab.id, index: tabIndex });
    }
}

/**
 * Helper function to get tab-specific a11y props
 * This will be called by framework adapters
 */
export function getTabA11yProps(
    state: TabsState,
    tabIndex: number,
    tabsId?: string
): Record<string, any> {
    const tab = state.tabs[tabIndex];
    if (!tab) return {};
    
    return {
        role: 'tab',
        'aria-selected': state.activeTab === tab.id ? 'true' : 'false',
        'aria-disabled': tab.disabled || state.disabled ? 'true' : undefined,
        'aria-controls': `${tabsId || 'tabs'}-panel-${tab.id}`,
        id: `${tabsId || 'tabs'}-tab-${tab.id}`,
        tabIndex: state.focusedIndex === tabIndex ? 0 : -1
    };
}

/**
 * Helper function to get tab panel a11y props
 * This will be called by framework adapters
 */
export function getTabPanelA11yProps(
    state: TabsState,
    tabId: string,
    tabsId?: string
): Record<string, any> {
    return {
        role: 'tabpanel',
        'aria-labelledby': `${tabsId || 'tabs'}-tab-${tabId}`,
        id: `${tabsId || 'tabs'}-panel-${tabId}`,
        hidden: state.activeTab !== tabId,
        tabIndex: 0
    };
}