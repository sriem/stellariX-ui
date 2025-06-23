/**
 * Toggle State Tests
 * 
 * 🚨 CRITICAL: Testing Pattern Rules
 * ❌ NEVER use state.getState() for verification
 * ✅ ALWAYS use subscription pattern: state.subscribe(listener)
 * ✅ ALWAYS verify via listener calls: expect(listener).toHaveBeenCalledWith()
 * 
 * This prevents infinite loops and ensures proper reactive testing
 */

import { describe, it, expect, vi } from 'vitest';
import { createToggleState } from './state';
import type { ToggleOptions } from './types';

describe('Toggle State', () => {
    it('should create state with default values', () => {
        const state = createToggleState();
        
        // Verify initial state via getState
        const initialState = state.getState();
        expect(initialState).toEqual({
            checked: false,
            focused: false,
            disabled: false
        });
    });
    
    it('should create state with initial options', () => {
        const options: ToggleOptions = {
            checked: true,
            disabled: true,
        };
        
        const state = createToggleState(options);
        
        // Verify initial state via getState
        const initialState = state.getState();
        expect(initialState).toEqual({
            checked: true,
            focused: false,
            disabled: true
        });
    });
    
    it('should update checked state', () => {
        const state = createToggleState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        listener.mockClear(); // Clear initial call
        
        state.setChecked(true);
        
        expect(listener).toHaveBeenCalledWith({
            checked: true,
            focused: false,
            disabled: false
        });
    });
    
    it('should update focused state', () => {
        const state = createToggleState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        listener.mockClear();
        
        state.setFocused(true);
        
        expect(listener).toHaveBeenCalledWith({
            checked: false,
            focused: true,
            disabled: false
        });
    });
    
    it('should update disabled state', () => {
        const state = createToggleState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        listener.mockClear();
        
        state.setDisabled(true);
        
        expect(listener).toHaveBeenCalledWith({
            checked: false,
            focused: false,
            disabled: true
        });
    });
    
    it('should toggle checked state', () => {
        const state = createToggleState({ checked: false });
        const listener = vi.fn();
        
        state.subscribe(listener);
        listener.mockClear();
        
        // Toggle from false to true
        state.toggle();
        expect(listener).toHaveBeenCalledWith({
            checked: true,
            focused: false,
            disabled: false
        });
        
        listener.mockClear();
        
        // Toggle from true to false
        state.toggle();
        expect(listener).toHaveBeenCalledWith({
            checked: false,
            focused: false,
            disabled: false
        });
    });
    
    it('should reset to initial state', () => {
        const state = createToggleState({ checked: true });
        const listener = vi.fn();
        
        // Change state
        state.setChecked(false);
        state.setFocused(true);
        
        // Subscribe and reset
        state.subscribe(listener);
        listener.mockClear();
        
        state.reset();
        
        // Should reset to initial options
        expect(listener).toHaveBeenCalledWith({
            checked: true,
            focused: false,
            disabled: false
        });
    });
    
    it('should compute isInteractive correctly', () => {
        const state = createToggleState();
        
        // Initial state should be interactive
        expect(state.isInteractive()).toBe(true);
        
        // Verify disabled state affects interactivity
        state.setDisabled(true);
        expect(state.isInteractive()).toBe(false);
        
        state.setDisabled(false);
        expect(state.isInteractive()).toBe(true);
    });
    
    it('should support derived state', () => {
        const state = createToggleState();
        const derivedLabel = state.derive(s => s.checked ? 'On' : 'Off');
        const listener = vi.fn();
        
        // Initial value should be 'Off'
        expect(derivedLabel.get()).toBe('Off');
        
        // Subscribe and change state
        derivedLabel.subscribe(listener);
        state.setChecked(true);
        
        // Derived value should update
        expect(derivedLabel.get()).toBe('On');
        expect(listener).toHaveBeenCalledWith('On');
    });
});