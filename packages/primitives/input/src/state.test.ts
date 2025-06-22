/**
 * Input State Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { createInputState } from './state';
import type { InputOptions } from './types';

describe('Input State', () => {
    it('should create state with default values', () => {
        const state = createInputState();
        const currentState = state.getState();
        
        expect(currentState.value).toBe('');
        expect(currentState.focused).toBe(false);
        expect(currentState.disabled).toBe(false);
        expect(currentState.readonly).toBe(false);
        expect(currentState.error).toBe(false);
        expect(currentState.required).toBe(false);
        expect(currentState.type).toBe('text');
        expect(currentState.size).toBe('md');
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
        const currentState = state.getState();
        
        expect(currentState.value).toBe('test');
        expect(currentState.disabled).toBe(true);
        expect(currentState.required).toBe(true);
        expect(currentState.type).toBe('email');
        expect(currentState.size).toBe('lg');
        expect(currentState.error).toBe(true);
        expect(currentState.errorMessage).toBe('Invalid email');
    });
    
    it('should update value correctly', () => {
        const state = createInputState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setValue('new value');
        
        expect(state.getState().value).toBe('new value');
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ value: 'new value' })
        );
    });
    
    it('should update focused state', () => {
        const state = createInputState();
        
        state.setFocused(true);
        expect(state.getState().focused).toBe(true);
        
        state.setFocused(false);
        expect(state.getState().focused).toBe(false);
    });
    
    it('should update disabled state', () => {
        const state = createInputState();
        
        state.setDisabled(true);
        expect(state.getState().disabled).toBe(true);
    });
    
    it('should update error state with message', () => {
        const state = createInputState();
        
        state.setError(true, 'Field is required');
        expect(state.getState().error).toBe(true);
        expect(state.getState().errorMessage).toBe('Field is required');
        
        state.setError(false);
        expect(state.getState().error).toBe(false);
    });
    
    it('should clear value', () => {
        const state = createInputState({ value: 'test' });
        
        state.clear();
        expect(state.getState().value).toBe('');
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