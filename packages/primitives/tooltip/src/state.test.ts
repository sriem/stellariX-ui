/**
 * Tooltip State Tests
 * 
 * CRITICAL: Follow the proven testing patterns from checkbox/radio
 * - Test state changes via subscription pattern
 * - NEVER use state.getState() in tests
 * - Use listener callbacks to verify state updates
 */

import { describe, it, expect, vi } from 'vitest';
import { createTooltipState } from './state';
import type { TooltipState } from './types';

describe('createTooltipState', () => {
    it('should create initial state with defaults', () => {
        const state = createTooltipState();
        
        // Test initial state via getState
        const initialState = state.getState();
        
        expect(initialState).toEqual({
            visible: false,
            placement: 'top',
            content: null,
            focused: false,
            disabled: false,
            position: null
        });
    });
    
    it('should create initial state with custom options', () => {
        const state = createTooltipState({
            content: 'Hello tooltip',
            placement: 'bottom',
            disabled: true,
            visible: true,
            controlled: true
        });
        
        const initialState = state.getState();
        
        expect(initialState).toEqual({
            visible: true,
            placement: 'bottom',
            content: 'Hello tooltip',
            disabled: true,
            focused: false,
            position: null
        });
    });
    
    describe('state setters', () => {
        it('should update visible state', () => {
            const state = createTooltipState();
            const listener = vi.fn();
            state.subscribe(listener);
            
            state.setVisible(true);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                visible: true
            }));
            
            state.setVisible(false);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                visible: false
            }));
        });
        
        it('should update placement', () => {
            const state = createTooltipState();
            const listener = vi.fn();
            state.subscribe(listener);
            
            state.setPlacement('bottom');
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                placement: 'bottom'
            }));
            
            state.setPlacement('left');
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                placement: 'left'
            }));
        });
        
        it('should update content', () => {
            const state = createTooltipState();
            const listener = vi.fn();
            state.subscribe(listener);
            
            state.setContent('New content');
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                content: 'New content'
            }));
            
            state.setContent(null);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                content: null
            }));
        });
        
        it('should update focused state', () => {
            const state = createTooltipState();
            const listener = vi.fn();
            state.subscribe(listener);
            
            state.setFocused(true);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                focused: true
            }));
            
            state.setFocused(false);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                focused: false
            }));
        });
        
        it('should update disabled state', () => {
            const state = createTooltipState();
            const listener = vi.fn();
            state.subscribe(listener);
            
            state.setDisabled(true);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                disabled: true
            }));
            
            state.setDisabled(false);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                disabled: false
            }));
        });
        
        it('should update position', () => {
            const state = createTooltipState();
            const listener = vi.fn();
            state.subscribe(listener);
            
            const position = { x: 100, y: 200 };
            state.setPosition(position);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                position
            }));
            
            state.setPosition(null);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                position: null
            }));
        });
    });
    
    describe('utility methods', () => {
        it('should show tooltip', () => {
            const state = createTooltipState();
            const listener = vi.fn();
            state.subscribe(listener);
            
            state.show();
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                visible: true
            }));
        });
        
        it('should hide tooltip', () => {
            const state = createTooltipState({ visible: true, controlled: true });
            const listener = vi.fn();
            state.subscribe(listener);
            
            state.hide();
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                visible: false
            }));
        });
        
        it('should toggle tooltip visibility', () => {
            const state = createTooltipState();
            const listener = vi.fn();
            state.subscribe(listener);
            
            // Initially false, should become true
            state.toggle();
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                visible: true
            }));
            
            // Now true, should become false
            state.toggle();
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                visible: false
            }));
        });
    });
    
    describe('subscription', () => {
        it('should notify subscribers on state changes', () => {
            const state = createTooltipState();
            const listener1 = vi.fn();
            const listener2 = vi.fn();
            
            const unsubscribe1 = state.subscribe(listener1);
            state.subscribe(listener2);
            
            state.setVisible(true);
            
            expect(listener1).toHaveBeenCalledTimes(1);
            expect(listener2).toHaveBeenCalledTimes(1);
            
            // Unsubscribe first listener
            unsubscribe1();
            
            state.setContent('Updated');
            
            expect(listener1).toHaveBeenCalledTimes(1); // Not called again
            expect(listener2).toHaveBeenCalledTimes(2); // Called again
        });
    });
});