import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createButtonLogic } from './logic';
import { createButtonState } from './state';
import type { ButtonOptions, ButtonState } from './types';

describe('Button Logic', () => {
    let state: ButtonState;
    let logic: ReturnType<typeof createButtonLogic>;
    let mockOnClick: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockOnClick = vi.fn();
        const options: ButtonOptions = {
            variant: 'primary',
            size: 'md',
            onClick: mockOnClick
        };
        state = createButtonState(options);
        logic = createButtonLogic(state);
    });

    it('should provide button props with correct attributes', () => {
        const props = logic.getButtonProps();

        expect(props.type).toBe('button');
        expect(props.disabled).toBe(false);
        expect(props.role).toBe('button');
        expect(props['aria-disabled']).toBe(false);
        expect(typeof props.onClick).toBe('function');
    });

    it('should handle disabled state correctly', () => {
        state.disabled = true;

        const props = logic.getButtonProps();

        expect(props.disabled).toBe(true);
        expect(props['aria-disabled']).toBe(true);
    });

    it('should handle click events', () => {
        const props = logic.getButtonProps();
        const mockEvent = { preventDefault: vi.fn() } as unknown as React.MouseEvent<HTMLButtonElement>;

        props.onClick(mockEvent);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
        expect(mockOnClick).toHaveBeenCalledWith(mockEvent);
    });

    it('should not trigger onClick when disabled', () => {
        state.disabled = true;

        const props = logic.getButtonProps();
        const mockEvent = { preventDefault: vi.fn() } as unknown as React.MouseEvent<HTMLButtonElement>;

        props.onClick(mockEvent);

        expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('should handle loading state', () => {
        state.loading = true;

        const props = logic.getButtonProps();

        expect(props['aria-busy']).toBe(true);
    });

    it('should handle custom button props', () => {
        const customProps = {
            id: 'custom-button',
            className: 'custom-class',
            'data-testid': 'button-test'
        };

        const props = logic.getButtonProps(customProps);

        expect(props.id).toBe('custom-button');
        expect(props.className).toBe('custom-class');
        expect(props['data-testid']).toBe('button-test');
        expect(props.type).toBe('button');
    });
}); 