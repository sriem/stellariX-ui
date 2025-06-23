/**
 * Alert Logic Tests
 * 
 * 🚨 CRITICAL: Testing Pattern Rules
 * ❌ NEVER use state.getState() for verification
 * ✅ ALWAYS test via callbacks: onDismiss, onVisibilityChange, etc.
 * ✅ ALWAYS verify behavior through callback invocations
 * ✅ For a11y props, call logic.getA11yProps() directly
 * 
 * This prevents infinite loops and ensures proper behavior testing
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createAlertLogic } from './logic';
import { createAlertState } from './state';
import type { AlertOptions } from './types';

describe('Alert Logic', () => {
    let stateStore: ReturnType<typeof createAlertState>;
    let logic: ReturnType<typeof createAlertLogic>;
    let mockOnDismiss: ReturnType<typeof vi.fn>;
    let mockOnVisibilityChange: ReturnType<typeof vi.fn>;
    
    beforeEach(() => {
        vi.useFakeTimers();
        mockOnDismiss = vi.fn();
        mockOnVisibilityChange = vi.fn();
        
        const options: AlertOptions = {
            onDismiss: mockOnDismiss,
            onVisibilityChange: mockOnVisibilityChange,
            dismissible: true,
            visible: true,
        };
        
        stateStore = createAlertState(options);
        logic = createAlertLogic(stateStore, options);
        
        // Connect logic to state
        logic.connect(stateStore);
        logic.initialize();
    });
    
    it('should handle dismiss events', () => {
        logic.handleEvent('dismiss', { reason: 'user' });
        
        expect(mockOnDismiss).toHaveBeenCalledWith();
        expect(stateStore.getState().dismissing).toBe(true);
        
        // Fast-forward through animation
        vi.advanceTimersByTime(300);
        expect(stateStore.getState().visible).toBe(false);
    });
    
    it('should not dismiss when not dismissible', () => {
        stateStore.setDismissible(false);
        
        logic.handleEvent('dismiss', { reason: 'user' });
        
        expect(mockOnDismiss).not.toHaveBeenCalled();
        expect(stateStore.getState().visible).toBe(true);
    });
    
    it('should handle visibilityChange events', () => {
        logic.handleEvent('visibilityChange', { visible: false });
        
        expect(stateStore.getState().visible).toBe(false);
        expect(mockOnVisibilityChange).toHaveBeenCalledWith(false);
    });
    
    it('should handle close events', () => {
        const mockEvent = new MouseEvent('click');
        const preventDefaultSpy = vi.spyOn(mockEvent, 'preventDefault');
        
        logic.handleEvent('close', { event: mockEvent });
        
        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(mockOnDismiss).toHaveBeenCalledWith();
    });
    
    it('should not close when not dismissible', () => {
        stateStore.setDismissible(false);
        
        const mockEvent = new MouseEvent('click');
        logic.handleEvent('close', { event: mockEvent });
        
        expect(mockOnDismiss).not.toHaveBeenCalled();
        expect(stateStore.getState().visible).toBe(true);
    });
    
    it('should provide correct a11y props for root', () => {
        const props = logic.getA11yProps('root');
        
        expect(props).toEqual({
            role: 'alert',
            'aria-live': 'polite',
            'aria-atomic': 'true',
            'aria-hidden': undefined,
        });
        
        // Update state to error variant
        stateStore.setVariant('error');
        const errorProps = logic.getA11yProps('root');
        expect(errorProps['aria-live']).toBe('assertive');
        
        // Hide alert
        stateStore.setVisible(false);
        const hiddenProps = logic.getA11yProps('root');
        expect(hiddenProps['aria-hidden']).toBe('true');
    });
    
    it('should provide correct a11y props for close button', () => {
        const props = logic.getA11yProps('closeButton');
        
        expect(props).toEqual({
            'aria-label': 'Close alert',
            type: 'button',
            tabIndex: 0,
        });
        
        // Disable dismissibility
        stateStore.setDismissible(false);
        const disabledProps = logic.getA11yProps('closeButton');
        expect(disabledProps.tabIndex).toBe(-1);
    });
    
    it('should provide interaction handlers for close button', () => {
        const handlers = logic.getInteractionHandlers('closeButton');
        
        expect(handlers).toHaveProperty('onClick');
        expect(handlers).toHaveProperty('onKeyDown');
        
        // Test onClick handler
        const mockEvent = new MouseEvent('click');
        handlers.onClick(mockEvent);
        
        expect(mockOnDismiss).toHaveBeenCalledWith();
    });
    
    it('should handle keyboard interaction on close button', () => {
        const handlers = logic.getInteractionHandlers('closeButton');
        
        // Test Enter key
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        const preventDefaultSpy = vi.spyOn(enterEvent, 'preventDefault');
        handlers.onKeyDown(enterEvent);
        
        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(mockOnDismiss).toHaveBeenCalledWith();
        
        // Wait for dismiss animation to complete
        vi.advanceTimersByTime(300);
        
        // Reset state for Space key test
        mockOnDismiss.mockClear();
        preventDefaultSpy.mockClear();
        
        // Re-set state to make alert visible again
        stateStore.show();
        
        // Test Space key
        const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
        const spacePreventDefaultSpy = vi.spyOn(spaceEvent, 'preventDefault');
        handlers.onKeyDown(spaceEvent);
        
        expect(spacePreventDefaultSpy).toHaveBeenCalled();
        expect(mockOnDismiss).toHaveBeenCalledWith();
        
        // Test other keys (should not trigger)
        mockOnDismiss.mockClear();
        vi.advanceTimersByTime(300); // Let dismiss complete
        stateStore.show(); // Make visible again
        
        const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
        handlers.onKeyDown(escapeEvent);
        
        expect(mockOnDismiss).not.toHaveBeenCalled();
    });
    
    it('should not trigger close when dismissing', () => {
        stateStore.setDismissing(true);
        
        const handlers = logic.getInteractionHandlers('closeButton');
        const mockEvent = new MouseEvent('click');
        
        handlers.onClick(mockEvent);
        
        expect(mockOnDismiss).not.toHaveBeenCalled();
    });
    
    it('should handle event payloads correctly', () => {
        // Test with direct payload
        logic.handleEvent('dismiss', { reason: 'auto' });
        expect(mockOnDismiss).toHaveBeenCalledWith();
        
        // Test with wrapped event
        mockOnDismiss.mockClear();
        const mockEvent = new MouseEvent('click');
        logic.handleEvent('close', mockEvent);
        expect(mockOnDismiss).toHaveBeenCalledWith();
    });
    
    it('should cleanup properly', () => {
        logic.cleanup();
        
        // After cleanup, events should not be processed
        logic.handleEvent('dismiss', { reason: 'user' });
        
        // Callbacks should not be called after cleanup
        expect(mockOnDismiss).not.toHaveBeenCalled();
        expect(stateStore.getState().visible).toBe(true);
    });
    
    afterEach(() => {
        vi.restoreAllMocks();
    });
});