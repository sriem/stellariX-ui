import { describe, it, expect } from 'vitest';
import { createButtonState } from './state.js';

describe('Button State', () => {
    it('should create button state with default values', () => {
        const state = createButtonState({});
        const currentState = state.getState();
        
        expect(currentState.pressed).toBe(false);
        expect(currentState.focused).toBe(false);
        expect(currentState.disabled).toBe(false);
        expect(currentState.loading).toBe(false);
        expect(currentState.variant).toBe('default');
        expect(currentState.size).toBe('md');
    });

    it('should set disabled state', () => {
        const state = createButtonState({});
        
        state.setDisabled(true);
        expect(state.getState().disabled).toBe(true);
        
        state.setDisabled(false);
        expect(state.getState().disabled).toBe(false);
    });

    it('should set loading state', () => {
        const state = createButtonState({});
        
        state.setLoading(true);
        expect(state.getState().loading).toBe(true);
    });

    it('should set pressed state', () => {
        const state = createButtonState({});
        
        state.setPressed(true);
        expect(state.getState().pressed).toBe(true);
    });

    it('should set focused state', () => {
        const state = createButtonState({});
        
        state.setFocused(true);
        expect(state.getState().focused).toBe(true);
    });

    it('should compute interactive state', () => {
        const state = createButtonState({});
        
        expect(state.isInteractive.get()).toBe(true);
        
        state.setDisabled(true);
        expect(state.isInteractive.get()).toBe(false);
        
        state.setDisabled(false);
        state.setLoading(true);
        expect(state.isInteractive.get()).toBe(false);
    });

    it('should initialize with options', () => {
        const state = createButtonState({
            variant: 'primary',
            size: 'lg',
            disabled: true,
            loading: false
        });
        
        const currentState = state.getState();
        expect(currentState.variant).toBe('primary');
        expect(currentState.size).toBe('lg');
        expect(currentState.disabled).toBe(true);
    });
});