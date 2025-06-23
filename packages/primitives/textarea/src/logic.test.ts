/**
 * Textarea Logic Tests
 * 
 * 🚨 CRITICAL: Testing Pattern Rules
 * ❌ NEVER use state.getState() for verification
 * ✅ ALWAYS test via callbacks: onChange, onFocus, etc.
 * ✅ ALWAYS verify behavior through callback invocations
 * ✅ For a11y props, call logic.getA11yProps() directly
 * 
 * This prevents infinite loops and ensures proper behavior testing
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTextareaLogic } from './logic';
import { createTextareaState } from './state';
import type { TextareaOptions } from './types';

describe('Textarea Logic', () => {
    let stateStore: ReturnType<typeof createTextareaState>;
    let logic: ReturnType<typeof createTextareaLogic>;
    let mockOnChange: ReturnType<typeof vi.fn>;
    let mockOnFocus: ReturnType<typeof vi.fn>;
    let mockOnBlur: ReturnType<typeof vi.fn>;
    
    beforeEach(() => {
        mockOnChange = vi.fn();
        mockOnFocus = vi.fn();
        mockOnBlur = vi.fn();
        
        const options: TextareaOptions = {
            onChange: mockOnChange,
            onFocus: mockOnFocus,
            onBlur: mockOnBlur,
        };
        
        stateStore = createTextareaState(options);
        logic = createTextareaLogic(stateStore, options);
        
        // Connect logic to state
        logic.connect(stateStore);
        logic.initialize();
    });
    
    it('should handle change events', () => {
        // Subscribe to state to verify updates
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        logic.handleEvent('change', { value: 'Hello World' });
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ value: 'Hello World' })
        );
        expect(mockOnChange).toHaveBeenCalledWith('Hello World');
    });
    
    it('should handle string payload for change event', () => {
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        logic.handleEvent('change', 'Direct string value');
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ value: 'Direct string value' })
        );
        expect(mockOnChange).toHaveBeenCalledWith('Direct string value');
    });
    
    it('should handle focus events', () => {
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        logic.handleEvent('focus', null);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ focused: true })
        );
        expect(mockOnFocus).toHaveBeenCalled();
    });
    
    it('should handle blur events', () => {
        // First focus the textarea
        stateStore.setFocused(true);
        
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        logic.handleEvent('blur', null);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ focused: false })
        );
        expect(mockOnBlur).toHaveBeenCalled();
    });
    
    it('should handle input events for autogrow', () => {
        const autogrowOptions: TextareaOptions = {
            variant: 'autogrow',
            minRows: 2,
            maxRows: 10,
            onChange: mockOnChange,
        };
        
        stateStore = createTextareaState(autogrowOptions);
        logic = createTextareaLogic(stateStore, autogrowOptions);
        logic.connect(stateStore);
        logic.initialize();
        
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        // Single line input
        logic.handleEvent('input', { value: 'Single line' });
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ value: 'Single line' })
        );
        
        // Multi-line input
        listener.mockClear();
        logic.handleEvent('input', { value: 'Line 1\nLine 2\nLine 3' });
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ value: 'Line 1\nLine 2\nLine 3' })
        );
        
        // Verify rows were updated
        listener.mockClear();
        stateStore.setRows(3);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ rows: 3 })
        );
    });
    
    it('should provide correct a11y props', () => {
        const options: TextareaOptions = {
            required: true,
            placeholder: 'Enter text here',
            maxLength: 500,
        };
        
        stateStore = createTextareaState(options);
        logic = createTextareaLogic(stateStore, options);
        logic.connect(stateStore);
        
        const props = logic.getA11yProps('root');
        
        expect(props).toMatchObject({
            'aria-disabled': undefined,
            'aria-readonly': undefined,
            'aria-invalid': undefined,
            'aria-required': 'true',
            'aria-multiline': 'true',
            rows: 4,
            placeholder: 'Enter text here',
            maxLength: 500,
        });
        
        // Update state and check again
        stateStore.setDisabled(true);
        stateStore.setReadonly(true);
        stateStore.setError(true);
        
        const updatedProps = logic.getA11yProps('root');
        expect(updatedProps).toMatchObject({
            'aria-disabled': 'true',
            'aria-readonly': 'true',
            'aria-invalid': 'true',
            'aria-required': 'true',
            'aria-multiline': 'true',
            disabled: true,
            readOnly: true,
        });
    });
    
    it('should provide interaction handlers', () => {
        const handlers = logic.getInteractionHandlers('root');
        
        expect(typeof handlers.onChange).toBe('function');
        expect(typeof handlers.onInput).toBe('function');
        expect(typeof handlers.onFocus).toBe('function');
        expect(typeof handlers.onBlur).toBe('function');
    });
    
    it('should handle onChange interaction', () => {
        const handlers = logic.getInteractionHandlers('root');
        const mockEvent = new Event('change');
        Object.defineProperty(mockEvent, 'target', {
            value: { value: 'New text' },
            writable: false,
        });
        
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        handlers.onChange(mockEvent);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ value: 'New text' })
        );
        expect(mockOnChange).toHaveBeenCalledWith('New text');
    });
    
    it('should prevent onChange when disabled', () => {
        stateStore.setDisabled(true);
        
        const handlers = logic.getInteractionHandlers('root');
        const mockEvent = new Event('change');
        const preventDefault = vi.fn();
        mockEvent.preventDefault = preventDefault;
        
        handlers.onChange(mockEvent);
        
        expect(preventDefault).toHaveBeenCalled();
        expect(mockOnChange).not.toHaveBeenCalled();
    });
    
    it('should prevent onChange when readonly', () => {
        stateStore.setReadonly(true);
        
        const handlers = logic.getInteractionHandlers('root');
        const mockEvent = new Event('change');
        const preventDefault = vi.fn();
        mockEvent.preventDefault = preventDefault;
        
        handlers.onChange(mockEvent);
        
        expect(preventDefault).toHaveBeenCalled();
        expect(mockOnChange).not.toHaveBeenCalled();
    });
    
    it('should handle onFocus interaction', () => {
        const handlers = logic.getInteractionHandlers('root');
        const mockEvent = new FocusEvent('focus');
        
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        handlers.onFocus(mockEvent);
        
        expect(mockOnFocus).toHaveBeenCalled();
    });
    
    it('should prevent focus when disabled', () => {
        stateStore.setDisabled(true);
        
        const handlers = logic.getInteractionHandlers('root');
        const mockEvent = new FocusEvent('focus');
        const preventDefault = vi.fn();
        mockEvent.preventDefault = preventDefault;
        
        handlers.onFocus(mockEvent);
        
        expect(preventDefault).toHaveBeenCalled();
        expect(mockOnFocus).not.toHaveBeenCalled();
    });
    
    it('should handle onBlur interaction', () => {
        const handlers = logic.getInteractionHandlers('root');
        const mockEvent = new FocusEvent('blur');
        
        handlers.onBlur(mockEvent);
        
        expect(mockOnBlur).toHaveBeenCalled();
    });
    
    it('should cleanup properly', () => {
        logic.cleanup();
        
        // After cleanup, events should not be processed
        logic.handleEvent('change', { value: 'After cleanup' });
        
        // Callbacks should not be called after cleanup
        expect(mockOnChange).not.toHaveBeenCalled();
    });
});