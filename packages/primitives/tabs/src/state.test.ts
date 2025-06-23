/**
 * Tabs State Tests
 * Tests for the tabs state management
 * 
 * 🚨 CRITICAL: Test state changes via subscription pattern
 * ❌ NEVER: expect(state.getState().activeTab).toBe('tab1')
 * ✅ ALWAYS: Use subscription to verify state changes
 */

import { describe, it, expect, vi } from 'vitest';
import { createTabsState } from './state';
import type { TabsState, Tab } from './types';

describe('createTabsState', () => {
    it('should create state with default values', () => {
        const state = createTabsState();
        const listener = vi.fn();
        const unsubscribe = state.subscribe(listener);
        
        // Trigger a state update to verify the listener is called
        state.setActiveTab(null);
        
        // Initial state should match defaults
        expect(listener).toHaveBeenCalledWith({
            activeTab: null,
            tabs: [],
            disabled: false,
            orientation: 'horizontal',
            focusedIndex: 0,
            activationMode: 'automatic'
        });
        
        unsubscribe();
    });
    
    it('should create state with initial options', () => {
        const tabs: Tab[] = [
            { id: 'tab1', label: 'Tab 1' },
            { id: 'tab2', label: 'Tab 2' }
        ];
        
        const state = createTabsState({
            activeTab: 'tab2',
            tabs,
            disabled: true,
            orientation: 'vertical',
            activationMode: 'manual'
        });
        
        const listener = vi.fn();
        const unsubscribe = state.subscribe(listener);
        
        // Trigger an update to get current state
        state.setActiveTab('tab2');
        
        expect(listener).toHaveBeenCalledWith({
            activeTab: 'tab2',
            tabs,
            disabled: true,
            orientation: 'vertical',
            focusedIndex: 0,
            activationMode: 'manual'
        });
        
        unsubscribe();
    });
    
    it('should set first tab as active if not specified', () => {
        const tabs: Tab[] = [
            { id: 'tab1', label: 'Tab 1' },
            { id: 'tab2', label: 'Tab 2' }
        ];
        
        const state = createTabsState({ tabs });
        const listener = vi.fn();
        const unsubscribe = state.subscribe(listener);
        
        // Trigger an update to verify state
        state.setTabs(tabs);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({
                activeTab: 'tab1'
            })
        );
        
        unsubscribe();
    });
    
    it('should update active tab', () => {
        const state = createTabsState();
        const listener = vi.fn();
        state.subscribe(listener);
        
        // Clear initial call
        listener.mockClear();
        
        state.setActiveTab('tab3');
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({
                activeTab: 'tab3'
            })
        );
    });
    
    it('should update tabs list', () => {
        const state = createTabsState();
        const listener = vi.fn();
        state.subscribe(listener);
        
        const newTabs: Tab[] = [
            { id: 'tab1', label: 'Tab 1' },
            { id: 'tab2', label: 'Tab 2', disabled: true }
        ];
        
        listener.mockClear();
        state.setTabs(newTabs);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({
                tabs: newTabs
            })
        );
    });
    
    it('should update disabled state', () => {
        const state = createTabsState();
        const listener = vi.fn();
        state.subscribe(listener);
        
        listener.mockClear();
        state.setDisabled(true);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({
                disabled: true
            })
        );
        
        listener.mockClear();
        state.setDisabled(false);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({
                disabled: false
            })
        );
    });
    
    it('should update focused index', () => {
        const state = createTabsState();
        const listener = vi.fn();
        state.subscribe(listener);
        
        listener.mockClear();
        state.setFocusedIndex(2);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({
                focusedIndex: 2
            })
        );
    });
    
    it('should update orientation', () => {
        const state = createTabsState();
        const listener = vi.fn();
        state.subscribe(listener);
        
        listener.mockClear();
        state.setOrientation('vertical');
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({
                orientation: 'vertical'
            })
        );
    });
    
    it('should update activation mode', () => {
        const state = createTabsState();
        const listener = vi.fn();
        state.subscribe(listener);
        
        listener.mockClear();
        state.setActivationMode('manual');
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({
                activationMode: 'manual'
            })
        );
    });
    
    it('should handle multiple state updates', () => {
        const state = createTabsState();
        const listener = vi.fn();
        state.subscribe(listener);
        
        listener.mockClear();
        
        const tabs: Tab[] = [
            { id: 'tab1', label: 'Tab 1' },
            { id: 'tab2', label: 'Tab 2' }
        ];
        
        state.setTabs(tabs);
        state.setActiveTab('tab2');
        state.setFocusedIndex(1);
        
        expect(listener).toHaveBeenCalledTimes(3);
        
        // Check final state
        const finalCall = listener.mock.calls[2][0];
        expect(finalCall).toEqual({
            activeTab: 'tab2',
            tabs,
            disabled: false,
            orientation: 'horizontal',
            focusedIndex: 1,
            activationMode: 'automatic'
        });
    });
    
    it('should handle unsubscribe correctly', () => {
        const state = createTabsState();
        const listener = vi.fn();
        const unsubscribe = state.subscribe(listener);
        
        listener.mockClear();
        
        // Update state
        state.setActiveTab('tab1');
        expect(listener).toHaveBeenCalledTimes(1);
        
        // Unsubscribe
        unsubscribe();
        
        // Further updates should not call listener
        state.setActiveTab('tab2');
        expect(listener).toHaveBeenCalledTimes(1);
    });
});