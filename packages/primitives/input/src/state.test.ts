/**
 * Input State Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { createInputState } from './state';
import type { InputOptions } from './types';

describe('Input State', () => {
    it('should create state with default values', () => {
        const state = createInputState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setValue(''); // Trigger subscription with default value
        
        // State now returns the full state object
        expect(listener).toHaveBeenCalledWith({
            value: '',
            focused: false,
            disabled: false,
            readonly: false,
            error: false,
            errorMessage: undefined,
            required: false,
            type: 'text',
            size: 'md'
        });
    });
    
    it('should create state with initial options', () => {
        const options: InputOptions = {
            value: 'test',
            disabled: true,
            required: true,
            type: 'email',
            size: 'lg',
            error: true,
            errorMessage: 'Invalid email'
        };
        
        const state = createInputState(options);
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setValue('test'); // Trigger subscription with initial value
        
        // State now returns the full state object
        expect(listener).toHaveBeenCalledWith({
            value: 'test',
            focused: false,
            disabled: true,
            readonly: false,
            error: true,
            errorMessage: 'Invalid email',
            required: true,
            type: 'email',
            size: 'lg'
        });
    });
    
    it('should update value correctly', () => {
        const state = createInputState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setValue('new value');
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ value: 'new value' })
        );
    });
    
    it('should update focused state', () => {
        const state = createInputState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.setFocused(true);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ focused: true })
        );
        
        listener.mockClear();
        state.setFocused(false);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ focused: false })
        );
    });
    
    it('should update disabled state', () => {
        const state = createInputState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setDisabled(true);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ disabled: true })
        );
    });
    
    it('should update error state with message', () => {
        const state = createInputState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.setError(true, 'Field is required');
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ 
                error: true,
                errorMessage: 'Field is required'
            })
        );
        
        listener.mockClear();
        state.setError(false);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ error: false })
        );
    });
    
    it('should clear value', () => {
        const state = createInputState({ value: 'test' });
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.clear();
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ value: '' })
        );
    });
    
    it('should compute isInteractive correctly', () => {
        const state = createInputState();
        
        expect(state.isInteractive()).toBe(true);
        
        state.setDisabled(true);
        expect(state.isInteractive()).toBe(false);
        
        state.setDisabled(false);
        state.setReadonly(true);
        expect(state.isInteractive()).toBe(false);
    });
    
    it('should compute isEmpty correctly', () => {
        const state = createInputState();
        
        expect(state.isEmpty()).toBe(true);
        
        state.setValue('  ');
        expect(state.isEmpty()).toBe(true);
        
        state.setValue('text');
        expect(state.isEmpty()).toBe(false);
    });
    
    it('should compute validation state correctly', () => {
        const state = createInputState();
        
        expect(state.getValidationState()).toBe('none');
        
        state.setValue('test');
        expect(state.getValidationState()).toBe('valid');
        
        state.setError(true);
        expect(state.getValidationState()).toBe('invalid');
    });
    
    it('should notify subscribers on state changes', () => {
        const state = createInputState();
        let notified = false;
        
        const unsubscribe = state.subscribe(() => {
            notified = true;
        });
        
        state.setValue('test');
        expect(notified).toBe(true);
        
        unsubscribe();
    });
    
    it('should support derived state', () => {
        const state = createInputState();
        const derivedValue = state.derive(s => s.value.toUpperCase());
        const listener = vi.fn();
        
        derivedValue.subscribe(listener);
        
        state.setValue('hello');
        
        expect(derivedValue.get()).toBe('HELLO');
        expect(listener).toHaveBeenCalledWith('HELLO');
    });
});