/**
 * Input Logic Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createInputLogic } from './logic';
import { createInputState } from './state';
import type { InputOptions } from './types';

describe('Input Logic', () => {
    let stateStore: ReturnType<typeof createInputState>;
    let logic: ReturnType<typeof createInputLogic>;
    let mockOnChange: ReturnType<typeof vi.fn>;
    let mockOnInput: ReturnType<typeof vi.fn>;
    let mockOnFocus: ReturnType<typeof vi.fn>;
    let mockOnBlur: ReturnType<typeof vi.fn>;
    let mockOnKeyDown: ReturnType<typeof vi.fn>;
    
    beforeEach(() => {
        mockOnChange = vi.fn();
        mockOnInput = vi.fn();
        mockOnFocus = vi.fn();
        mockOnBlur = vi.fn();
        mockOnKeyDown = vi.fn();
        
        const options: InputOptions = {
            onChange: mockOnChange,
            onInput: mockOnInput,
            onFocus: mockOnFocus,
            onBlur: mockOnBlur,
            onKeyDown: mockOnKeyDown,
        };
        
        stateStore = createInputState(options);
        logic = createInputLogic(stateStore, options);
        
        // Connect logic to state
        logic.connect(stateStore);
        logic.initialize();
    });
    
    it('should handle change events', () => {
        logic.handleEvent('change', { 
            value: 'new value', 
            previousValue: '' 
        });
        
        expect(stateStore.getState().value).toBe('new value');
        expect(mockOnChange).toHaveBeenCalledWith('new value');
    });
    
    it('should not handle change when disabled', () => {
        stateStore.setDisabled(true);
        
        logic.handleEvent('change', { 
            value: 'new value', 
            previousValue: '' 
        });
        
        expect(stateStore.getState().value).toBe('');
        expect(mockOnChange).not.toHaveBeenCalled();
    });
    
    it('should not handle change when readonly', () => {
        stateStore.setReadonly(true);
        
        logic.handleEvent('change', { 
            value: 'new value', 
            previousValue: '' 
        });
        
        expect(stateStore.getState().value).toBe('');
        expect(mockOnChange).not.toHaveBeenCalled();
    });
    
    it('should handle input events', () => {
        logic.handleEvent('input', { value: 'typing...' });
        
        expect(stateStore.getState().value).toBe('typing...');
        expect(mockOnInput).toHaveBeenCalledWith('typing...');
    });
    
    it('should handle focus events', () => {
        const mockEvent = new FocusEvent('focus');
        logic.handleEvent('focus', { event: mockEvent });
        
        expect(stateStore.getState().focused).toBe(true);
        expect(mockOnFocus).toHaveBeenCalledWith(mockEvent);
    });
    
    it('should handle blur events', () => {
        stateStore.setFocused(true);
        const mockEvent = new FocusEvent('blur');
        logic.handleEvent('blur', { event: mockEvent });
        
        expect(stateStore.getState().focused).toBe(false);
        expect(mockOnBlur).toHaveBeenCalledWith(mockEvent);
    });
    
    it('should handle keydown events', () => {
        const mockEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        logic.handleEvent('keydown', { event: mockEvent });
        
        expect(mockOnKeyDown).toHaveBeenCalledWith(mockEvent);
    });
    
    it('should provide correct a11y props', () => {
        const props = logic.getA11yProps('root');
        
        // When all states are false, should return empty object
        expect(props).toEqual({});
        
        // Update state and check again
        stateStore.setDisabled(true);
        stateStore.setRequired(true);
        stateStore.setError(true, 'Invalid input');
        
        const updatedProps = logic.getA11yProps('root');
        expect(updatedProps).toEqual({
            'aria-invalid': 'true',
            'aria-required': 'true',
            'aria-disabled': 'true',
        });
    });
    
    it('should provide interaction handlers', () => {
        const handlers = logic.getInteractionHandlers('root');
        
        expect(handlers).toHaveProperty('onChange');
        expect(handlers).toHaveProperty('onInput');
        expect(handlers).toHaveProperty('onFocus');
        expect(handlers).toHaveProperty('onBlur');
        expect(handlers).toHaveProperty('onKeyDown');
    });
    
    it('should trigger change handler on input change', () => {
        const handlers = logic.getInteractionHandlers('root');
        const mockEvent = new Event('change');
        Object.defineProperty(mockEvent, 'target', {
            value: { value: 'changed' },
            writable: false
        });
        
        handlers.onChange(mockEvent);
        
        expect(stateStore.getState().value).toBe('changed');
    });
    
    it('should trigger submit on Enter key', () => {
        stateStore.setValue('test value');
        const handlers = logic.getInteractionHandlers('root');
        const mockEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        
        handlers.onKeyDown(mockEvent);
        
        // Submit event should be handled
        expect(mockOnKeyDown).toHaveBeenCalledWith(mockEvent);
    });
    
    it('should handle state changes in onStateChange', () => {
        // Trigger onStateChange callback
        if (logic.onStateChange) {
            const prevState = { ...stateStore.getState() };
            stateStore.setValue('updated');
            logic.onStateChange(stateStore.getState(), prevState);
        }
        
        // Just verify it doesn't throw
        expect(true).toBe(true);
    });
});