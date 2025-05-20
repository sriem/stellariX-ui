import { describe, it, expect, beforeEach } from 'vitest';
import { createButtonState } from './state';
import type { ButtonState, ButtonOptions } from './types';

describe('Button State', () => {
    let defaultState: ButtonState;
    let customState: ButtonState;

    const defaultOptions: ButtonOptions = {};
    const customOptions: ButtonOptions = {
        defaultDisabled: true,
        defaultLoading: true,
        variant: 'secondary',
        size: 'lg',
        onClick: () => { },
    };

    beforeEach(() => {
        defaultState = createButtonState(defaultOptions);
        customState = createButtonState(customOptions);
    });

    it('should initialize default state correctly', () => {
        expect(defaultState.disabled).toBe(false);
        expect(defaultState.loading).toBe(false);
        expect(defaultState.variant).toBe('primary');
        expect(defaultState.size).toBe('md');
        expect(defaultState.onClick).toBeUndefined();
    });

    it('should initialize custom state correctly', () => {
        expect(customState.disabled).toBe(true);
        expect(customState.loading).toBe(true);
        expect(customState.variant).toBe('secondary');
        expect(customState.size).toBe('lg');
        expect(customState.onClick).toBeDefined();
        expect(typeof customState.onClick).toBe('function');
    });

    it('should update disabled state', () => {
        defaultState.setDisabled(true);
        expect(defaultState.disabled).toBe(true);

        defaultState.setDisabled(false);
        expect(defaultState.disabled).toBe(false);
    });

    it('should update loading state', () => {
        defaultState.setLoading(true);
        expect(defaultState.loading).toBe(true);

        defaultState.setLoading(false);
        expect(defaultState.loading).toBe(false);
    });

    it('should handle onClick callback', () => {
        const mockFn = vi.fn();
        const stateWithClick = createButtonState({
            onClick: mockFn
        });

        const event = {} as React.MouseEvent<HTMLButtonElement>;
        stateWithClick.onClick?.(event);

        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith(event);
    });

    it('should handle null onClick callback', () => {
        // This should not throw an error
        expect(() => defaultState.onClick?.({})).not.toThrow();
    });
}); 