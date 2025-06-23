/**
 * Dialog State Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { createDialogState } from './state';
import type { DialogState } from './types';

describe('createDialogState', () => {
    it('should create state with default values', () => {
        const state = createDialogState();
        const initialState = state.getState();
        
        expect(initialState).toEqual({
            open: false,
            previousFocus: null,
            loading: false,
            closeOnBackdropClick: true,
            closeOnEscape: true,
            focusTrap: true,
            preventScroll: true,
            role: 'dialog',
        });
    });
    
    it('should create state with custom options', () => {
        const state = createDialogState({
            open: true,
            closeOnBackdropClick: false,
            closeOnEscape: false,
            focusTrap: false,
            preventScroll: false,
            role: 'alertdialog',
        });
        
        const initialState = state.getState();
        
        expect(initialState.open).toBe(true);
        expect(initialState.closeOnBackdropClick).toBe(false);
        expect(initialState.closeOnEscape).toBe(false);
        expect(initialState.focusTrap).toBe(false);
        expect(initialState.preventScroll).toBe(false);
        expect(initialState.role).toBe('alertdialog');
    });
    
    it('should update open state', () => {
        const state = createDialogState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setOpen(true);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ open: true })
        );
    });
    
    it('should update previous focus', () => {
        const state = createDialogState();
        const listener = vi.fn();
        const mockElement = document.createElement('button');
        
        state.subscribe(listener);
        state.setPreviousFocus(mockElement);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ previousFocus: mockElement })
        );
    });
    
    it('should update loading state', () => {
        const state = createDialogState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setLoading(true);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ loading: true })
        );
    });
    
    it('should update closeOnBackdropClick', () => {
        const state = createDialogState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setCloseOnBackdropClick(false);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ closeOnBackdropClick: false })
        );
    });
    
    it('should update closeOnEscape', () => {
        const state = createDialogState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setCloseOnEscape(false);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ closeOnEscape: false })
        );
    });
    
    it('should update focusTrap', () => {
        const state = createDialogState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setFocusTrap(false);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ focusTrap: false })
        );
    });
    
    it('should update preventScroll', () => {
        const state = createDialogState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setPreventScroll(false);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ preventScroll: false })
        );
    });
    
    it('should update role', () => {
        const state = createDialogState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setRole('alertdialog');
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ role: 'alertdialog' })
        );
    });
    
    it('should handle multiple state updates', () => {
        const state = createDialogState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.setOpen(true);
        state.setLoading(true);
        state.setCloseOnBackdropClick(false);
        
        expect(listener).toHaveBeenCalledTimes(3);
        
        const finalState = state.getState();
        expect(finalState.open).toBe(true);
        expect(finalState.loading).toBe(true);
        expect(finalState.closeOnBackdropClick).toBe(false);
    });
    
    it('should unsubscribe correctly', () => {
        const state = createDialogState();
        const listener = vi.fn();
        
        const unsubscribe = state.subscribe(listener);
        state.setOpen(true);
        
        expect(listener).toHaveBeenCalledTimes(1);
        
        unsubscribe();
        state.setOpen(false);
        
        expect(listener).toHaveBeenCalledTimes(1); // Should not be called again
    });
});