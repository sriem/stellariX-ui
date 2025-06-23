/**
 * Badge State Tests
 * 
 * 🚨 CRITICAL: Testing Pattern Rules
 * ❌ NEVER use state.getState() for verification
 * ✅ ALWAYS use subscription pattern: state.subscribe(listener)
 * ✅ ALWAYS verify via listener calls: expect(listener).toHaveBeenCalledWith()
 * 
 * This prevents infinite loops and ensures proper reactive testing
 */

import { describe, it, expect, vi } from 'vitest';
import { createBadgeState } from './state';
import type { BadgeOptions } from './types';

describe('Badge State', () => {
    it('should create state with default values', () => {
        const state = createBadgeState();
        
        // Use getState() only in tests for initial verification
        const currentState = state.getState();
        expect(currentState).toEqual({
            variant: 'default',
            type: 'numeric',
            content: '',
            visible: true,
            max: 99,
            showZero: false,
        });
    });
    
    it('should create state with initial options', () => {
        const options: BadgeOptions = {
            variant: 'error',
            type: 'dot',
            content: 42,
            visible: false,
            max: 999,
            showZero: true,
        };
        
        const state = createBadgeState(options);
        const currentState = state.getState();
        
        expect(currentState).toEqual({
            variant: 'error',
            type: 'dot',
            content: 42,
            visible: false,
            max: 999,
            showZero: true,
        });
    });
    
    it('should update variant', () => {
        const state = createBadgeState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setVariant('success');
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ variant: 'success' }));
    });
    
    it('should update content', () => {
        const state = createBadgeState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setContent(10);
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ content: 10 }));
        
        listener.mockClear();
        state.setContent('New');
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ content: 'New' }));
    });
    
    it('should update visibility', () => {
        const state = createBadgeState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setVisible(false);
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ visible: false }));
    });
    
    it('should show and hide badge', () => {
        const state = createBadgeState({ visible: false });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.show();
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ visible: true }));
        
        listener.mockClear();
        state.hide();
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ visible: false }));
    });
    
    it('should increment and decrement numeric content', () => {
        const state = createBadgeState({ content: 5 });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.increment();
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ content: 6 }));
        
        listener.mockClear();
        state.decrement();
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ content: 5 }));
        
        // Should not decrement below 0
        state.setContent(0);
        listener.mockClear();
        state.decrement();
        expect(listener).not.toHaveBeenCalled();
    });
    
    it('should not increment/decrement string content', () => {
        const state = createBadgeState({ content: 'hello' });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.increment();
        expect(listener).not.toHaveBeenCalled();
        
        state.decrement();
        expect(listener).not.toHaveBeenCalled();
    });
    
    it('should reset to initial state', () => {
        const initialOptions: BadgeOptions = {
            variant: 'info',
            content: 100,
            showZero: true,
        };
        
        const state = createBadgeState(initialOptions);
        
        // Change state
        state.setVariant('error');
        state.setContent(200);
        state.setShowZero(false);
        
        // Reset
        state.reset();
        
        const currentState = state.getState();
        expect(currentState.variant).toBe('info');
        expect(currentState.content).toBe(100);
        expect(currentState.showZero).toBe(true);
    });
    
    it('should compute display content correctly', () => {
        const state = createBadgeState({ type: 'numeric', max: 99 });
        
        // Normal numeric content
        state.setContent(50);
        expect(state.getDisplayContent()).toBe('50');
        
        // Content exceeding max
        state.setContent(150);
        expect(state.getDisplayContent()).toBe('99+');
        
        // String content
        state.setContent('New');
        expect(state.getDisplayContent()).toBe('New');
        
        // Dot type should return empty
        state.setType('dot');
        expect(state.getDisplayContent()).toBe('');
    });
    
    it('should compute shouldDisplay correctly', () => {
        const state = createBadgeState({ content: 5 });
        
        // Should display by default with content
        expect(state.shouldDisplay()).toBe(true);
        
        // Should not display when not visible
        state.setVisible(false);
        expect(state.shouldDisplay()).toBe(false);
        
        // Reset visibility
        state.setVisible(true);
        
        // Should not display zero by default
        state.setContent(0);
        expect(state.shouldDisplay()).toBe(false);
        
        // Should display zero when showZero is true
        state.setShowZero(true);
        expect(state.shouldDisplay()).toBe(true);
        
        // Empty content should not display
        state.setContent('');
        expect(state.shouldDisplay()).toBe(false);
        
        // Dot type should display even with empty content
        state.setType('dot');
        expect(state.shouldDisplay()).toBe(true);
    });
    
    it('should support derived state', () => {
        const state = createBadgeState();
        const derivedDisplay = state.derive(s => {
            if (s.type === 'dot') return 'DOT';
            if (typeof s.content === 'number' && s.max && s.content > s.max) {
                return `${s.max}+`;
            }
            return s.content.toString();
        });
        const listener = vi.fn();
        
        derivedDisplay.subscribe(listener);
        
        state.setContent(150);
        
        expect(derivedDisplay.get()).toBe('99+');
        expect(listener).toHaveBeenCalledWith('99+');
    });
});