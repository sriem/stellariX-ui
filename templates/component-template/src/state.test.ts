/**
 * Template State Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { createTemplateState } from './state';
import type { TemplateOptions } from './types';

describe('Template State', () => {
    it('should create state with default values', () => {
        const state = createTemplateState();
        const currentState = state.getState();
        
        expect(currentState.active).toBe(false);
        expect(currentState.value).toBe('');
        expect(currentState.disabled).toBe(false);
    });
    
    it('should create state with initial options', () => {
        const options: TemplateOptions = {
            active: true,
            value: 'initial',
            disabled: true,
        };
        
        const state = createTemplateState(options);
        const currentState = state.getState();
        
        expect(currentState.active).toBe(true);
        expect(currentState.value).toBe('initial');
        expect(currentState.disabled).toBe(true);
    });
    
    it('should update active state', () => {
        const state = createTemplateState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setActive(true);
        
        expect(state.getState().active).toBe(true);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ active: true })
        );
    });
    
    it('should update value', () => {
        const state = createTemplateState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setValue('new value');
        
        expect(state.getState().value).toBe('new value');
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ value: 'new value' })
        );
    });
    
    it('should toggle active state', () => {
        const state = createTemplateState({ active: false });
        
        state.toggle();
        expect(state.getState().active).toBe(true);
        
        state.toggle();
        expect(state.getState().active).toBe(false);
    });
    
    it('should reset to initial state', () => {
        const state = createTemplateState({ value: 'initial' });
        
        // Change state
        state.setValue('changed');
        state.setActive(true);
        
        // Reset
        state.reset();
        const currentState = state.getState();
        
        expect(currentState.value).toBe('initial');
        expect(currentState.active).toBe(false);
    });
    
    it('should compute isInteractive correctly', () => {
        const state = createTemplateState();
        
        expect(state.isInteractive()).toBe(true);
        
        state.setDisabled(true);
        expect(state.isInteractive()).toBe(false);
        
        state.setDisabled(false);
        expect(state.isInteractive()).toBe(true);
    });
    
    it('should support derived state', () => {
        const state = createTemplateState();
        const derivedValue = state.derive(s => s.value.toUpperCase());
        const listener = vi.fn();
        
        derivedValue.subscribe(listener);
        
        state.setValue('hello');
        
        expect(derivedValue.get()).toBe('HELLO');
        expect(listener).toHaveBeenCalledWith('HELLO');
    });
});