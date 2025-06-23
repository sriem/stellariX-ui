/**
 * Tabs Logic Tests
 * Tests for the tabs business logic and event handling
 * 
 * 🚨 CRITICAL: Test via callbacks and interactions, NOT state.getState()
 * ✅ CORRECT: expect(onChange).toHaveBeenCalledWith('tab1')
 * ❌ FORBIDDEN: expect(state.getState().activeTab).toBe('tab1')
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTabsState } from './state';
import { createTabsLogic } from './logic';
import type { TabsOptions, Tab } from './types';

describe('createTabsLogic', () => {
    const mockTabs: Tab[] = [
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' },
        { id: 'tab3', label: 'Tab 3', disabled: true },
        { id: 'tab4', label: 'Tab 4' }
    ];
    
    const createMockEvent = (type: string, overrides: any = {}) => ({
        type,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        ...overrides
    });
    
    describe('Event Handling', () => {
        it('should handle change event with onChange callback', () => {
            const onChange = vi.fn();
            const state = createTabsState({ tabs: mockTabs });
            const logic = createTabsLogic(state, { onChange });
            
            logic.connect(state);
            logic.initialize();
            
            // Trigger change event
            logic.handleEvent('change', { tabId: 'tab2' });
            
            expect(onChange).toHaveBeenCalledWith('tab2');
        });
        
        it('should handle change event without payload', () => {
            const onChange = vi.fn();
            const state = createTabsState({ tabs: mockTabs, activeTab: 'tab1' });
            const logic = createTabsLogic(state, { onChange });
            
            logic.connect(state);
            logic.initialize();
            
            // Trigger change event without payload
            logic.handleEvent('change', null);
            
            expect(onChange).toHaveBeenCalledWith('tab1');
        });
    });
    
    describe('Tab Click Interaction', () => {
        it('should change active tab on click', async () => {
            const onChange = vi.fn();
            const state = createTabsState({ tabs: mockTabs });
            const logic = createTabsLogic(state, { onChange });
            
            logic.connect(state);
            logic.initialize();
            
            // Import helper function and test it directly
            const { handleTabClick } = await import('./logic');
            const currentState = { ...state.getState() };
            const mockEvent = createMockEvent('click');
            
            handleTabClick(state, logic, currentState, 1, mockEvent as MouseEvent);
            
            expect(onChange).toHaveBeenCalledWith('tab2');
        });
        
        it('should not change tab when disabled', async () => {
            const onChange = vi.fn();
            const state = createTabsState({ tabs: mockTabs, disabled: true });
            const logic = createTabsLogic(state, { onChange });
            
            logic.connect(state);
            logic.initialize();
            
            const { handleTabClick } = await import('./logic');
            const currentState = { ...state.getState() };
            const mockEvent = createMockEvent('click');
            
            handleTabClick(state, logic, currentState, 1, mockEvent as MouseEvent);
            
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(onChange).not.toHaveBeenCalled();
        });
        
        it('should not activate disabled tab', async () => {
            const onChange = vi.fn();
            const state = createTabsState({ tabs: mockTabs });
            const logic = createTabsLogic(state, { onChange });
            
            logic.connect(state);
            logic.initialize();
            
            const { handleTabClick } = await import('./logic');
            const currentState = { ...state.getState() };
            const mockEvent = createMockEvent('click');
            
            handleTabClick(state, logic, currentState, 2, mockEvent as MouseEvent); // tab3 is disabled
            
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(onChange).not.toHaveBeenCalled();
        });
    });
    
    describe('Keyboard Navigation - Horizontal', () => {
        it('should navigate right with ArrowRight', () => {
            const onChange = vi.fn();
            const state = createTabsState({ tabs: mockTabs, orientation: 'horizontal' });
            const logic = createTabsLogic(state, { onChange });
            
            logic.connect(state);
            logic.initialize();
            
            const interactions = logic.getInteractionHandlers('root');
            const mockEvent = createMockEvent('keydown', { key: 'ArrowRight' });
            
            interactions.onKeyDown(mockEvent);
            
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(onChange).toHaveBeenCalledWith('tab2');
        });
        
        it('should navigate left with ArrowLeft', () => {
            const onChange = vi.fn();
            const state = createTabsState({ 
                tabs: mockTabs, 
                orientation: 'horizontal',
                activeTab: 'tab2'
            });
            const logic = createTabsLogic(state, { onChange });
            
            logic.connect(state);
            logic.initialize();
            
            // Set focused index to 1
            state.setFocusedIndex(1);
            
            const interactions = logic.getInteractionHandlers('root');
            const mockEvent = createMockEvent('keydown', { key: 'ArrowLeft' });
            
            interactions.onKeyDown(mockEvent);
            
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(onChange).toHaveBeenCalledWith('tab1');
        });
        
        it('should skip disabled tabs when navigating', () => {
            const onChange = vi.fn();
            const state = createTabsState({ 
                tabs: mockTabs,
                activeTab: 'tab2'
            });
            const logic = createTabsLogic(state, { onChange });
            
            logic.connect(state);
            logic.initialize();
            
            state.setFocusedIndex(1);
            
            const interactions = logic.getInteractionHandlers('root');
            const mockEvent = createMockEvent('keydown', { key: 'ArrowRight' });
            
            interactions.onKeyDown(mockEvent);
            
            // Should skip tab3 (disabled) and go to tab4
            expect(onChange).toHaveBeenCalledWith('tab4');
        });
        
        it('should wrap around when navigating past end', () => {
            const onChange = vi.fn();
            const state = createTabsState({ 
                tabs: mockTabs,
                activeTab: 'tab4'
            });
            const logic = createTabsLogic(state, { onChange });
            
            logic.connect(state);
            logic.initialize();
            
            state.setFocusedIndex(3);
            
            const interactions = logic.getInteractionHandlers('root');
            const mockEvent = createMockEvent('keydown', { key: 'ArrowRight' });
            
            interactions.onKeyDown(mockEvent);
            
            expect(onChange).toHaveBeenCalledWith('tab1');
        });
    });
    
    describe('Keyboard Navigation - Vertical', () => {
        it('should navigate down with ArrowDown', () => {
            const onChange = vi.fn();
            const state = createTabsState({ 
                tabs: mockTabs, 
                orientation: 'vertical' 
            });
            const logic = createTabsLogic(state, { onChange });
            
            logic.connect(state);
            logic.initialize();
            
            const interactions = logic.getInteractionHandlers('root');
            const mockEvent = createMockEvent('keydown', { key: 'ArrowDown' });
            
            interactions.onKeyDown(mockEvent);
            
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(onChange).toHaveBeenCalledWith('tab2');
        });
        
        it('should navigate up with ArrowUp', () => {
            const onChange = vi.fn();
            const state = createTabsState({ 
                tabs: mockTabs, 
                orientation: 'vertical',
                activeTab: 'tab2'
            });
            const logic = createTabsLogic(state, { onChange });
            
            logic.connect(state);
            logic.initialize();
            
            state.setFocusedIndex(1);
            
            const interactions = logic.getInteractionHandlers('root');
            const mockEvent = createMockEvent('keydown', { key: 'ArrowUp' });
            
            interactions.onKeyDown(mockEvent);
            
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(onChange).toHaveBeenCalledWith('tab1');
        });
    });
    
    describe('Home/End Navigation', () => {
        it('should navigate to first tab with Home', () => {
            const onChange = vi.fn();
            const state = createTabsState({ 
                tabs: mockTabs,
                activeTab: 'tab4'
            });
            const logic = createTabsLogic(state, { onChange });
            
            logic.connect(state);
            logic.initialize();
            
            state.setFocusedIndex(3);
            
            const interactions = logic.getInteractionHandlers('root');
            const mockEvent = createMockEvent('keydown', { key: 'Home' });
            
            interactions.onKeyDown(mockEvent);
            
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(onChange).toHaveBeenCalledWith('tab1');
        });
        
        it('should navigate to last tab with End', () => {
            const onChange = vi.fn();
            const state = createTabsState({ tabs: mockTabs });
            const logic = createTabsLogic(state, { onChange });
            
            logic.connect(state);
            logic.initialize();
            
            const interactions = logic.getInteractionHandlers('root');
            const mockEvent = createMockEvent('keydown', { key: 'End' });
            
            interactions.onKeyDown(mockEvent);
            
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(onChange).toHaveBeenCalledWith('tab4');
        });
    });
    
    describe('Manual Activation Mode', () => {
        it('should only focus but not activate tabs on arrow keys', () => {
            const onChange = vi.fn();
            const state = createTabsState({ 
                tabs: mockTabs,
                activationMode: 'manual'
            });
            const logic = createTabsLogic(state, { onChange });
            
            logic.connect(state);
            logic.initialize();
            
            const interactions = logic.getInteractionHandlers('root');
            const mockEvent = createMockEvent('keydown', { key: 'ArrowRight' });
            
            interactions.onKeyDown(mockEvent);
            
            // Should not call onChange in manual mode
            expect(onChange).not.toHaveBeenCalled();
            
            // But focused index should update
            // Check the state directly
            const currentState = state.getState();
            expect(currentState.focusedIndex).toBe(1);
        });
        
        it('should activate tab on Enter in manual mode', () => {
            const onChange = vi.fn();
            const state = createTabsState({ 
                tabs: mockTabs,
                activationMode: 'manual'
            });
            const logic = createTabsLogic(state, { onChange });
            
            logic.connect(state);
            logic.initialize();
            
            state.setFocusedIndex(1);
            
            const interactions = logic.getInteractionHandlers('root');
            const mockEvent = createMockEvent('keydown', { key: 'Enter' });
            
            interactions.onKeyDown(mockEvent);
            
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(onChange).toHaveBeenCalledWith('tab2');
        });
        
        it('should activate tab on Space in manual mode', () => {
            const onChange = vi.fn();
            const state = createTabsState({ 
                tabs: mockTabs,
                activationMode: 'manual'
            });
            const logic = createTabsLogic(state, { onChange });
            
            logic.connect(state);
            logic.initialize();
            
            state.setFocusedIndex(3);
            
            const interactions = logic.getInteractionHandlers('root');
            const mockEvent = createMockEvent('keydown', { key: ' ' });
            
            interactions.onKeyDown(mockEvent);
            
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(onChange).toHaveBeenCalledWith('tab4');
        });
    });
    
    describe('Focus Management', () => {
        it('should update focused index on focus', async () => {
            const state = createTabsState({ tabs: mockTabs });
            const logic = createTabsLogic(state, {});
            
            logic.connect(state);
            logic.initialize();
            
            const listener = vi.fn();
            state.subscribe(listener);
            listener.mockClear();
            
            // Import helper function and test it directly
            const { handleTabFocus } = await import('./logic');
            const currentState = { ...state.getState() };
            
            handleTabFocus(state, logic, currentState, 2);
            
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({
                    focusedIndex: 2
                })
            );
        });
    });
    
    describe('Accessibility', () => {
        it('should provide correct a11y props for tablist', () => {
            const state = createTabsState({ 
                tabs: mockTabs,
                orientation: 'vertical',
                disabled: true
            });
            const logic = createTabsLogic(state, { id: 'my-tabs' });
            
            logic.connect(state);
            logic.initialize();
            
            const a11yProps = logic.getA11yProps('tablist');
            
            expect(a11yProps).toEqual({
                role: 'tablist',
                'aria-orientation': 'vertical',
                'aria-disabled': 'true'
            });
        });
        
        it('should provide correct a11y props for tabs', async () => {
            const state = createTabsState({ 
                tabs: mockTabs,
                activeTab: 'tab2'
            });
            const logic = createTabsLogic(state, { id: 'my-tabs' });
            
            logic.connect(state);
            logic.initialize();
            
            state.setFocusedIndex(1);
            
            // Import helper function
            const { getTabA11yProps } = await import('./logic');
            const currentState = { ...state.getState() };
            
            // Check tab 1 (not active, not focused)
            const tab1Props = getTabA11yProps(currentState, 0, 'my-tabs');
            expect(tab1Props).toEqual({
                role: 'tab',
                'aria-selected': 'false',
                'aria-disabled': undefined,
                'aria-controls': 'my-tabs-panel-tab1',
                id: 'my-tabs-tab-tab1',
                tabIndex: -1
            });
            
            // Check tab 2 (active and focused)
            const tab2Props = getTabA11yProps(currentState, 1, 'my-tabs');
            expect(tab2Props).toEqual({
                role: 'tab',
                'aria-selected': 'true',
                'aria-disabled': undefined,
                'aria-controls': 'my-tabs-panel-tab2',
                id: 'my-tabs-tab-tab2',
                tabIndex: 0
            });
            
            // Check tab 3 (disabled)
            const tab3Props = getTabA11yProps(currentState, 2, 'my-tabs');
            expect(tab3Props).toEqual({
                role: 'tab',
                'aria-selected': 'false',
                'aria-disabled': 'true',
                'aria-controls': 'my-tabs-panel-tab3',
                id: 'my-tabs-tab-tab3',
                tabIndex: -1
            });
        });
        
        it('should provide correct a11y props for tab panels', async () => {
            const state = createTabsState({ 
                tabs: mockTabs,
                activeTab: 'tab2'
            });
            const logic = createTabsLogic(state, { id: 'my-tabs' });
            
            logic.connect(state);
            logic.initialize();
            
            // Import helper function
            const { getTabPanelA11yProps } = await import('./logic');
            const currentState = { ...state.getState() };
            
            // Check active panel
            const activePanel = getTabPanelA11yProps(currentState, 'tab2', 'my-tabs');
            expect(activePanel).toEqual({
                role: 'tabpanel',
                'aria-labelledby': 'my-tabs-tab-tab2',
                id: 'my-tabs-panel-tab2',
                hidden: false,
                tabIndex: 0
            });
            
            // Check inactive panel
            const inactivePanel = getTabPanelA11yProps(currentState, 'tab1', 'my-tabs');
            expect(inactivePanel).toEqual({
                role: 'tabpanel',
                'aria-labelledby': 'my-tabs-tab-tab1',
                id: 'my-tabs-panel-tab1',
                hidden: true,
                tabIndex: 0
            });
        });
    });
});