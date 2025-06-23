import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createButtonLogic } from './logic';
import { createButtonState } from './state';
import type { ButtonOptions } from './types';

describe('Button Logic', () => {
    let stateStore: ReturnType<typeof createButtonState>;
    let logic: ReturnType<typeof createButtonLogic>;
    let mockOnClick: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockOnClick = vi.fn();
        const options: ButtonOptions = {
            variant: 'primary',
            size: 'md',
            onClick: mockOnClick
        };
        stateStore = createButtonState(options);
        logic = createButtonLogic(stateStore, options);
        
        // Connect logic to state
        logic.connect(stateStore);
        logic.initialize();
    });

    it('should provide correct a11y props', () => {
        const props = logic.getA11yProps('root');

        expect(props.role).toBe('button');
        expect(props['aria-disabled']).toBe(false);
        expect(props['aria-busy']).toBe(false);
        expect(props.tabIndex).toBe(0);
        expect(props.id).toBeDefined();
    });

    it('should handle disabled state correctly', () => {
        stateStore.setDisabled(true);
        const props = logic.getA11yProps('root');

        expect(props['aria-disabled']).toBe(true);
        expect(props.tabIndex).toBe(-1);
    });

    it('should handle click events', () => {
        const mockEvent = new MouseEvent('click');
        logic.handleEvent('click', { event: mockEvent });

        expect(mockOnClick).toHaveBeenCalledTimes(1);
        expect(mockOnClick).toHaveBeenCalledWith(mockEvent);
    });

    it('should not trigger onClick when disabled', () => {
        stateStore.setDisabled(true);
        const mockEvent = new MouseEvent('click');
        const preventDefaultSpy = vi.spyOn(mockEvent, 'preventDefault');
        
        // Get interaction handlers and call onClick
        const handlers = logic.getInteractionHandlers('root');
        handlers.onClick(mockEvent);

        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('should handle loading state', () => {
        stateStore.setLoading(true);
        const props = logic.getA11yProps('root');

        expect(props['aria-busy']).toBe(true);
    });

    it('should handle focus events', () => {
        const mockFocus = vi.fn();
        const focusOptions: ButtonOptions = {
            onFocus: mockFocus
        };
        const focusLogic = createButtonLogic(stateStore, focusOptions);
        focusLogic.connect(stateStore);
        
        const mockEvent = new FocusEvent('focus');
        focusLogic.handleEvent('focus', { event: mockEvent });

        expect(stateStore.getState().focused).toBe(true);
        expect(mockFocus).toHaveBeenCalledWith(mockEvent);
    });

    it('should handle blur events', () => {
        const mockBlur = vi.fn();
        const blurOptions: ButtonOptions = {
            onBlur: mockBlur
        };
        const blurLogic = createButtonLogic(stateStore, blurOptions);
        blurLogic.connect(stateStore);
        
        // First set focused to true
        stateStore.setFocused(true);
        
        const mockEvent = new FocusEvent('blur');
        blurLogic.handleEvent('blur', { event: mockEvent });

        expect(stateStore.getState().focused).toBe(false);
        expect(mockBlur).toHaveBeenCalledWith(mockEvent);
    });

    it('should handle keyboard events', () => {
        const mockEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        const preventDefaultSpy = vi.spyOn(mockEvent, 'preventDefault');
        
        logic.handleEvent('keydown', { event: mockEvent });

        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(mockOnClick).toHaveBeenCalled();
    });

    it('should handle space key', () => {
        const mockEvent = new KeyboardEvent('keydown', { key: ' ' });
        const preventDefaultSpy = vi.spyOn(mockEvent, 'preventDefault');
        
        logic.handleEvent('keydown', { event: mockEvent });

        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(mockOnClick).toHaveBeenCalled();
    });

    it('should not handle keyboard events when disabled', () => {
        stateStore.setDisabled(true);
        const mockEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        const preventDefaultSpy = vi.spyOn(mockEvent, 'preventDefault');
        
        // Get interaction handlers and call onKeyDown
        const handlers = logic.getInteractionHandlers('root');
        handlers.onKeyDown(mockEvent);

        // When disabled, preventDefault SHOULD be called for Enter/Space keys
        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('should cleanup properly', () => {
        logic.cleanup();
        
        // After cleanup, logic should not be connected - verifying state is disconnected
        const mockEvent = new MouseEvent('click');
        logic.handleEvent('click', { event: mockEvent });
        
        // Should not trigger onClick after cleanup
        expect(mockOnClick).not.toHaveBeenCalled();
    });
});