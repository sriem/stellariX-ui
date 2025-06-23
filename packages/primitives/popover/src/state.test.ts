/**
 * Popover State Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { createPopoverState } from './state';

describe('createPopoverState', () => {
    it('should create state with default values', () => {
        const state = createPopoverState();
        const initialState = state.getState();
        
        expect(initialState).toEqual({
            open: false,
            placement: 'bottom',
            triggerElement: null,
            contentElement: null,
            focused: false,
            disabled: false,
        });
    });
    
    it('should create state with custom initial values', () => {
        const state = createPopoverState({
            open: true,
            placement: 'top',
            disabled: true,
        });
        
        const initialState = state.getState();
        expect(initialState.open).toBe(true);
        expect(initialState.placement).toBe('top');
        expect(initialState.disabled).toBe(true);
    });
    
    it('should update open state', () => {
        const state = createPopoverState();
        const listener = vi.fn();
        state.subscribe(listener);
        
        state.setOpen(true);
        
        expect(listener).toHaveBeenCalledWith({
            open: true,
            placement: 'bottom',
            triggerElement: null,
            contentElement: null,
            focused: false,
            disabled: false,
        });
    });
    
    it('should update placement', () => {
        const state = createPopoverState();
        const listener = vi.fn();
        state.subscribe(listener);
        
        state.setPlacement('right-start');
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({
                placement: 'right-start',
            })
        );
    });
    
    it('should update trigger element', () => {
        const state = createPopoverState();
        const listener = vi.fn();
        state.subscribe(listener);
        
        const element = document.createElement('button');
        state.setTriggerElement(element);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({
                triggerElement: element,
            })
        );
    });
    
    it('should update content element', () => {
        const state = createPopoverState();
        const listener = vi.fn();
        state.subscribe(listener);
        
        const element = document.createElement('div');
        state.setContentElement(element);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({
                contentElement: element,
            })
        );
    });
    
    it('should update focused state', () => {
        const state = createPopoverState();
        const listener = vi.fn();
        state.subscribe(listener);
        
        state.setFocused(true);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({
                focused: true,
            })
        );
    });
    
    it('should update disabled state', () => {
        const state = createPopoverState();
        const listener = vi.fn();
        state.subscribe(listener);
        
        state.setDisabled(true);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({
                disabled: true,
            })
        );
    });
    
    it('should handle multiple state updates', () => {
        const state = createPopoverState();
        const listener = vi.fn();
        state.subscribe(listener);
        
        state.setOpen(true);
        state.setPlacement('top');
        state.setFocused(true);
        
        expect(listener).toHaveBeenCalledTimes(3);
        
        const finalState = state.getState();
        expect(finalState.open).toBe(true);
        expect(finalState.placement).toBe('top');
        expect(finalState.focused).toBe(true);
    });
    
    it('should unsubscribe correctly', () => {
        const state = createPopoverState();
        const listener = vi.fn();
        const unsubscribe = state.subscribe(listener);
        
        state.setOpen(true);
        expect(listener).toHaveBeenCalledTimes(1);
        
        unsubscribe();
        
        state.setOpen(false);
        expect(listener).toHaveBeenCalledTimes(1); // Should not be called again
    });
    
    it('should maintain state consistency with rapid updates', () => {
        const state = createPopoverState();
        
        // Rapid state updates
        state.setOpen(true);
        state.setPlacement('top');
        state.setFocused(true);
        state.setDisabled(true);
        state.setOpen(false);
        state.setFocused(false);
        
        const finalState = state.getState();
        expect(finalState).toEqual({
            open: false,
            placement: 'top',
            triggerElement: null,
            contentElement: null,
            focused: false,
            disabled: true,
        });
    });
});