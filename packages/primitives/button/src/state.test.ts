import { describe, it, expect, vi } from 'vitest';
import { createButtonState } from './state.js';

describe('Button State', () => {
    it('should create button state with default values', () => {
        const state = createButtonState({});
        const listener = vi.fn();
        
        // Subscribe and trigger updates to verify state
        state.subscribe(listener);
        state.setPressed(false); // Trigger subscription
        
        // Button state uses correct spread operator, so we get full state
        const receivedState = listener.mock.calls[0][0];
        expect(receivedState.pressed).toBe(false);
        expect(receivedState.focused).toBe(false);
        expect(receivedState.disabled).toBe(false);
        expect(receivedState.loading).toBe(false);
        expect(receivedState.variant).toBe('default');
        expect(receivedState.size).toBe('md');
    });

    it('should set disabled state', () => {
        const state = createButtonState({});
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.setDisabled(true);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ disabled: true })
        );
        
        listener.mockClear();
        state.setDisabled(false);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ disabled: false })
        );
    });

    it('should set loading state', () => {
        const state = createButtonState({});
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setLoading(true);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ loading: true })
        );
    });

    it('should set pressed state', () => {
        const state = createButtonState({});
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setPressed(true);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ pressed: true })
        );
    });

    it('should set focused state', () => {
        const state = createButtonState({});
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setFocused(true);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ focused: true })
        );
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
        
        const listener = vi.fn();
        state.subscribe(listener);
        state.setDisabled(true); // Trigger subscription with same value
        
        // Button state uses correct spread operator, so we get full state
        const receivedState = listener.mock.calls[0][0];
        expect(receivedState.variant).toBe('primary');
        expect(receivedState.size).toBe('lg');
        expect(receivedState.disabled).toBe(true);
    });
});