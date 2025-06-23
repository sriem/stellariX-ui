/**
 * Alert State Tests
 * 
 * 🚨 CRITICAL: Testing Pattern Rules
 * ❌ NEVER use state.getState() for verification
 * ✅ ALWAYS use subscription pattern: state.subscribe(listener)
 * ✅ ALWAYS verify via listener calls: expect(listener).toHaveBeenCalledWith()
 * 
 * This prevents infinite loops and ensures proper reactive testing
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createAlertState } from './state';
import type { AlertOptions } from './types';

describe('Alert State', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    
    afterEach(() => {
        vi.restoreAllMocks();
    });
    it('should create state with default values', () => {
        const state = createAlertState();
        const listener = vi.fn();
        
        // Use getState() only in tests for initial verification
        const currentState = state.getState();
        expect(currentState).toEqual({
            visible: true,
            variant: 'info',
            dismissible: false,
            dismissing: false,
            message: '',
            title: undefined,
            showIcon: true,
        });
    });
    
    it('should create state with initial options', () => {
        const options: AlertOptions = {
            visible: false,
            variant: 'error',
            dismissible: true,
            message: 'Test error',
            title: 'Error Title',
            showIcon: false,
        };
        
        const state = createAlertState(options);
        const currentState = state.getState();
        
        expect(currentState).toEqual({
            visible: false,
            variant: 'error',
            dismissible: true,
            dismissing: false,
            message: 'Test error',
            title: 'Error Title',
            showIcon: false,
        });
    });
    
    it('should update visible state', () => {
        const state = createAlertState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setVisible(false);
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ visible: false }));
        
        listener.mockClear();
        state.setVisible(true);
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ visible: true }));
    });
    
    it('should update variant', () => {
        const state = createAlertState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setVariant('success');
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ variant: 'success' }));
        
        listener.mockClear();
        state.setVariant('warning');
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ variant: 'warning' }));
    });
    
    it('should update message', () => {
        const state = createAlertState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setMessage('New message');
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ message: 'New message' }));
    });
    
    it('should show and hide alert', () => {
        const state = createAlertState({ visible: false });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.show();
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ 
            visible: true,
            dismissing: false 
        }));
        
        listener.mockClear();
        state.hide();
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ 
            visible: false,
            dismissing: false 
        }));
    });
    
    it('should dismiss alert when dismissible', () => {
        const state = createAlertState({ dismissible: true, visible: true });
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.dismiss();
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ dismissing: true }));
        
        // Fast-forward through animation
        vi.advanceTimersByTime(300);
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ 
            visible: false,
            dismissing: false 
        }));
    });
    
    it('should not dismiss when not dismissible', () => {
        const state = createAlertState({ dismissible: false, visible: true });
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.dismiss();
        
        expect(listener).not.toHaveBeenCalled();
    });
    
    it('should auto-close after specified time', () => {
        const state = createAlertState({ 
            autoClose: 5000,
            dismissible: true,
            visible: true 
        });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        // Fast-forward through auto-close timeout
        vi.advanceTimersByTime(5000);
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ dismissing: true }));
        
        // Fast-forward through animation
        vi.advanceTimersByTime(300);
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ 
            visible: false,
            dismissing: false 
        }));
    });
    
    it('should compute isVisible correctly', () => {
        const state = createAlertState();
        
        expect(state.isVisible()).toBe(true);
        
        state.setVisible(false);
        expect(state.isVisible()).toBe(false);
        
        state.setVisible(true);
        state.setDismissing(true);
        expect(state.isVisible()).toBe(false);
    });
    
    it('should compute canDismiss correctly', () => {
        const state = createAlertState({ dismissible: false });
        
        expect(state.canDismiss()).toBe(false);
        
        state.setDismissible(true);
        expect(state.canDismiss()).toBe(true);
        
        state.setVisible(false);
        expect(state.canDismiss()).toBe(false);
    });
    
    it('should support derived state for variant', () => {
        const state = createAlertState();
        const derivedVariant = state.derive(s => s.variant.toUpperCase());
        const listener = vi.fn();
        
        derivedVariant.subscribe(listener);
        
        state.setVariant('error');
        
        expect(derivedVariant.get()).toBe('ERROR');
        expect(listener).toHaveBeenCalledWith('ERROR');
    });
    
    it('should reset to initial state', () => {
        const initialOptions: AlertOptions = {
            variant: 'success',
            message: 'Initial message',
            dismissible: true,
        };
        
        const state = createAlertState(initialOptions);
        
        // Change state
        state.setVariant('error');
        state.setMessage('Changed message');
        state.setDismissible(false);
        
        // Reset
        state.reset();
        
        const currentState = state.getState();
        expect(currentState.variant).toBe('success');
        expect(currentState.message).toBe('Initial message');
        expect(currentState.dismissible).toBe(true);
    });
});