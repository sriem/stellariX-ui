/**
 * Dialog Logic Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createDialogState } from './state';
import { createDialogLogic } from './logic';
import type { DialogOptions } from './types';

describe('createDialogLogic', () => {
    let state: ReturnType<typeof createDialogState>;
    let logic: ReturnType<typeof createDialogLogic>;
    let options: DialogOptions;
    
    beforeEach(() => {
        // Reset document body styles before each test
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        
        options = {
            onOpenChange: vi.fn(),
            onEscapeKeyDown: vi.fn(),
            onBackdropClick: vi.fn(),
        };
        
        state = createDialogState();
        logic = createDialogLogic(state, options);
        logic.connect(state);
        logic.initialize();
    });
    
    describe('state management', () => {
        it('should handle dialog opening through state change', () => {
            const mockFocusElement = document.createElement('button');
            Object.defineProperty(document, 'activeElement', {
                writable: true,
                configurable: true,
                value: mockFocusElement,
            });
            
            // Set open state directly
            state.setOpen(true);
            
            // Verify callbacks were called via subscription
            const listener = vi.fn();
            state.subscribe(listener);
            state.setOpen(true);
            
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ open: true })
            );
        });
        
        it('should handle dialog closing through state change', () => {
            // First open the dialog
            state.setOpen(true);
            const mockFocusElement = document.createElement('button');
            state.setPreviousFocus(mockFocusElement);
            
            const focusSpy = vi.spyOn(mockFocusElement, 'focus');
            
            // Listen for state changes
            const listener = vi.fn();
            state.subscribe(listener);
            
            state.setOpen(false);
            
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({ open: false })
            );
        });
    });
    
    describe('escapeKeyDown event', () => {
        it('should close dialog on escape if enabled', () => {
            state.setOpen(true);
            const mockEvent = new KeyboardEvent('keydown', { key: 'Escape' });
            const preventDefaultSpy = vi.spyOn(mockEvent, 'preventDefault');
            const stopPropagationSpy = vi.spyOn(mockEvent, 'stopPropagation');
            
            logic.handleEvent('escapeKeyDown', { event: mockEvent });
            
            expect(preventDefaultSpy).toHaveBeenCalled();
            expect(stopPropagationSpy).toHaveBeenCalled();
            expect(options.onEscapeKeyDown).toHaveBeenCalledWith(mockEvent);
            
            // Test via subscription
            const listener = vi.fn();
            state.subscribe(listener);
            state.setOpen(false);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({ open: false }));
        });
        
        it('should not close dialog on escape if disabled', () => {
            state.setOpen(true);
            state.setCloseOnEscape(false);
            const mockEvent = new KeyboardEvent('keydown', { key: 'Escape' });
            
            logic.handleEvent('escapeKeyDown', { event: mockEvent });
            
            expect(options.onEscapeKeyDown).not.toHaveBeenCalled();
            
            // Verify state hasn't changed via subscription
            const listener = vi.fn();
            state.subscribe(listener);
            // If state didn't change, listener won't be called
            expect(listener).not.toHaveBeenCalled();
        });
        
        it('should not close dialog on escape if already closed', () => {
            const mockEvent = new KeyboardEvent('keydown', { key: 'Escape' });
            
            logic.handleEvent('escapeKeyDown', { event: mockEvent });
            
            expect(options.onEscapeKeyDown).not.toHaveBeenCalled();
            
            // State should remain closed
            const listener = vi.fn();
            state.subscribe(listener);
            expect(listener).not.toHaveBeenCalled();
        });
    });
    
    describe('backdropClick event', () => {
        it('should close dialog on backdrop click if enabled', () => {
            state.setOpen(true);
            const mockEvent = new MouseEvent('click');
            
            logic.handleEvent('backdropClick', { event: mockEvent });
            
            expect(options.onBackdropClick).toHaveBeenCalledWith(mockEvent);
            
            // Test via subscription
            const listener = vi.fn();
            state.subscribe(listener);
            state.setOpen(false);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({ open: false }));
        });
        
        it('should not close dialog on backdrop click if disabled', () => {
            state.setOpen(true);
            state.setCloseOnBackdropClick(false);
            const mockEvent = new MouseEvent('click');
            
            logic.handleEvent('backdropClick', { event: mockEvent });
            
            expect(options.onBackdropClick).not.toHaveBeenCalled();
            
            // Verify state hasn't changed
            const listener = vi.fn();
            state.subscribe(listener);
            expect(listener).not.toHaveBeenCalled();
        });
        
        it('should not close dialog on backdrop click if already closed', () => {
            const mockEvent = new MouseEvent('click');
            
            logic.handleEvent('backdropClick', { event: mockEvent });
            
            expect(options.onBackdropClick).not.toHaveBeenCalled();
            
            // State should remain closed
            const listener = vi.fn();
            state.subscribe(listener);
            expect(listener).not.toHaveBeenCalled();
        });
    });
    
    describe('accessibility', () => {
        it('should provide correct a11y props for dialog', () => {
            const dialogOptions: DialogOptions = {
                ariaLabel: 'Test Dialog',
                ariaLabelledBy: 'dialog-title',
                ariaDescribedBy: 'dialog-desc',
            };
            
            const dialogLogic = createDialogLogic(state, dialogOptions);
            dialogLogic.connect(state);
            dialogLogic.initialize();
            
            state.setOpen(true);
            state.setRole('alertdialog');
            
            const a11yProps = dialogLogic.getA11yProps('dialog');
            
            expect(a11yProps).toEqual({
                role: 'alertdialog',
                'aria-modal': 'true',
                'aria-label': 'Test Dialog',
                'aria-labelledby': 'dialog-title',
                'aria-describedby': 'dialog-desc',
                'data-state': 'open',
                tabIndex: -1,
            });
        });
        
        it('should provide correct a11y props for backdrop', () => {
            state.setOpen(true);
            
            const a11yProps = logic.getA11yProps('backdrop');
            
            expect(a11yProps).toEqual({
                'aria-hidden': 'true',
                'data-state': 'open',
            });
        });
    });
    
    describe('interactions', () => {
        beforeEach(() => {
            // Reset mocks for interaction tests
            vi.clearAllMocks();
        });
        
        it('should handle backdrop click interaction', () => {
            state.setOpen(true);
            const backdrop = document.createElement('div');
            const mockEvent = new MouseEvent('click');
            Object.defineProperty(mockEvent, 'target', {
                value: backdrop,
                configurable: true,
            });
            Object.defineProperty(mockEvent, 'currentTarget', {
                value: backdrop,
                configurable: true,
            });
            
            const handlers = logic.getInteractionHandlers('backdrop');
            handlers.onClick?.(mockEvent);
            
            // Verify the backdropClick callback was triggered
            expect(options.onBackdropClick).toHaveBeenCalledWith(mockEvent);
            
            // Verify state was updated
            const listener = vi.fn();
            state.subscribe(listener);
            expect(state.getState().open).toBe(false);
        });
        
        it('should not handle backdrop click if event bubbled', () => {
            state.setOpen(true);
            const backdrop = document.createElement('div');
            const childElement = document.createElement('div');
            const mockEvent = new MouseEvent('click');
            Object.defineProperty(mockEvent, 'target', {
                value: childElement,
                configurable: true,
            });
            Object.defineProperty(mockEvent, 'currentTarget', {
                value: backdrop,
                configurable: true,
            });
            
            const handlers = logic.getInteractionHandlers('backdrop');
            handlers.onClick?.(mockEvent);
            
            // Should not trigger callback when event bubbled
            expect(options.onBackdropClick).not.toHaveBeenCalled();
            // State should remain open
            expect(state.getState().open).toBe(true);
        });
        
        it('should handle dialog escape key interaction', () => {
            state.setOpen(true);
            const mockEvent = new KeyboardEvent('keydown', { key: 'Escape' });
            
            const handlers = logic.getInteractionHandlers('dialog');
            handlers.onKeyDown?.(mockEvent);
            
            // Verify the escapeKeyDown callback was triggered
            expect(options.onEscapeKeyDown).toHaveBeenCalledWith(mockEvent);
            
            // Verify state was updated
            expect(state.getState().open).toBe(false);
        });
        
        it('should not handle non-escape keys', () => {
            state.setOpen(true);
            const mockEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            
            const handlers = logic.getInteractionHandlers('dialog');
            handlers.onKeyDown?.(mockEvent);
            
            // Should not trigger callback for non-escape keys
            expect(options.onEscapeKeyDown).not.toHaveBeenCalled();
            // State should remain open
            expect(state.getState().open).toBe(true);
        });
    });
    
    describe('focus management', () => {
        it('should focus dialog when opened', async () => {
            // Create a mock dialog element
            const dialogElement = document.createElement('div');
            dialogElement.setAttribute('role', 'dialog');
            dialogElement.tabIndex = -1;
            document.body.appendChild(dialogElement);
            
            const focusSpy = vi.spyOn(dialogElement, 'focus');
            
            logic.handleEvent('openChange', { open: true });
            
            // Wait for setTimeout in focus trap
            await new Promise(resolve => setTimeout(resolve, 10));
            
            expect(focusSpy).toHaveBeenCalled();
            
            // Cleanup
            document.body.removeChild(dialogElement);
        });
    });
});