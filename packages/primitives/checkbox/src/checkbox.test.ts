/**
 * Checkbox Component Tests
 * Unit tests for state and logic layers
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCheckboxState } from './state';
import { createCheckboxLogic } from './logic';
import type { CheckboxOptions, CheckboxCheckedState } from './types';

describe('Checkbox State', () => {
    it('should create initial state with default values', () => {
        const state = createCheckboxState();
        const currentState = state.getState();
        
        expect(currentState.checked).toBe(false);
        expect(currentState.disabled).toBe(false);
        expect(currentState.focused).toBe(false);
        expect(currentState.required).toBe(false);
        expect(currentState.error).toBe(false);
        expect(currentState.errorMessage).toBeUndefined();
    });

    it('should create initial state with custom options', () => {
        const options: CheckboxOptions = {
            checked: true,
            disabled: true,
            required: true
        };
        
        const state = createCheckboxState(options);
        const currentState = state.getState();
        
        expect(currentState.checked).toBe(true);
        expect(currentState.disabled).toBe(true);
        expect(currentState.required).toBe(true);
    });

    it('should handle indeterminate state', () => {
        const state = createCheckboxState({ checked: 'indeterminate' });
        const currentState = state.getState();
        
        expect(currentState.checked).toBe('indeterminate');
    });

    it('should update checked state', () => {
        const state = createCheckboxState();
        
        state.setChecked(true);
        expect(state.getState().checked).toBe(true);
        
        state.setChecked('indeterminate');
        expect(state.getState().checked).toBe('indeterminate');
        
        state.setChecked(false);
        expect(state.getState().checked).toBe(false);
    });

    it('should update disabled state', () => {
        const state = createCheckboxState();
        
        state.setDisabled(true);
        expect(state.getState().disabled).toBe(true);
        
        state.setDisabled(false);
        expect(state.getState().disabled).toBe(false);
    });

    it('should update focused state', () => {
        const state = createCheckboxState();
        
        state.setFocused(true);
        expect(state.getState().focused).toBe(true);
        
        state.setFocused(false);
        expect(state.getState().focused).toBe(false);
    });

    it('should update required state', () => {
        const state = createCheckboxState();
        
        state.setRequired(true);
        expect(state.getState().required).toBe(true);
        
        state.setRequired(false);
        expect(state.getState().required).toBe(false);
    });

    it('should update error state', () => {
        const state = createCheckboxState();
        
        state.setError(true, 'Test error');
        expect(state.getState().error).toBe(true);
        expect(state.getState().errorMessage).toBe('Test error');
        
        state.setError(false);
        expect(state.getState().error).toBe(false);
    });

    describe('toggle method', () => {
        it('should toggle from false to true', () => {
            const state = createCheckboxState({ checked: false });
            
            state.toggle();
            expect(state.getState().checked).toBe(true);
        });

        it('should toggle from true to false', () => {
            const state = createCheckboxState({ checked: true });
            
            state.toggle();
            expect(state.getState().checked).toBe(false);
        });

        it('should toggle from indeterminate to true', () => {
            const state = createCheckboxState({ checked: 'indeterminate' });
            
            state.toggle();
            expect(state.getState().checked).toBe(true);
        });
    });

    describe('isInteractive computed property', () => {
        it('should return true when not disabled', () => {
            const state = createCheckboxState({ disabled: false });
            expect(state.isInteractive()).toBe(true);
        });

        it('should return false when disabled', () => {
            const state = createCheckboxState({ disabled: true });
            expect(state.isInteractive()).toBe(false);
        });
    });

    it('should handle subscriptions', () => {
        const state = createCheckboxState();
        const listener = vi.fn();
        
        const unsubscribe = state.subscribe(listener);
        
        state.setChecked(true);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ checked: true })
        );
        
        unsubscribe();
        state.setChecked(false);
        expect(listener).toHaveBeenCalledTimes(1);
    });
});

describe('Checkbox Logic', () => {
    let state: ReturnType<typeof createCheckboxState>;
    let logic: ReturnType<typeof createCheckboxLogic>;
    let mockEvent: Partial<MouseEvent>;
    let mockKeyboardEvent: Partial<KeyboardEvent>;
    let mockFocusEvent: Partial<FocusEvent>;

    beforeEach(() => {
        state = createCheckboxState();
        logic = createCheckboxLogic(state);
        
        mockEvent = {
            preventDefault: vi.fn(),
            type: 'click'
        };
        
        mockKeyboardEvent = {
            preventDefault: vi.fn(),
            code: 'Space',
            type: 'keydown'
        };
        
        mockFocusEvent = {
            type: 'focus'
        };
    });

    describe('accessibility properties', () => {
        it('should generate correct a11y props for unchecked state', () => {
            logic.connect(state);
            logic.initialize();
            const a11yProps = logic.getA11yProps('root');
            
            expect(a11yProps).toMatchObject({
                role: 'checkbox',
                'aria-checked': false,
                tabIndex: 0
            });
        });

        it('should generate correct a11y props for checked state', () => {
            state.setChecked(true);
            logic.connect(state);
            logic.initialize();
            const a11yProps = logic.getA11yProps('root');
            
            expect(a11yProps).toMatchObject({
                role: 'checkbox',
                'aria-checked': true,
                tabIndex: 0
            });
        });

        it('should generate correct a11y props for indeterminate state', () => {
            state.setChecked('indeterminate');
            logic.connect(state);
            logic.initialize();
            const a11yProps = logic.getA11yProps('root');
            
            expect(a11yProps).toMatchObject({
                role: 'checkbox',
                'aria-checked': 'mixed',
                tabIndex: 0
            });
        });

        it('should generate correct a11y props for disabled state', () => {
            state.setDisabled(true);
            logic.connect(state);
            logic.initialize();
            const a11yProps = logic.getA11yProps('root');
            
            expect(a11yProps).toMatchObject({
                'aria-disabled': 'true',
                tabIndex: -1
            });
        });

        it('should generate correct a11y props for required state', () => {
            state.setRequired(true);
            logic.connect(state);
            logic.initialize();
            const a11yProps = logic.getA11yProps('root');
            
            expect(a11yProps).toMatchObject({
                'aria-required': 'true'
            });
        });

        it('should generate correct a11y props for error state', () => {
            state.setError(true, 'Test error');
            logic.connect(state);
            logic.initialize();
            const a11yProps = logic.getA11yProps('root');
            
            expect(a11yProps).toMatchObject({
                'aria-invalid': 'true'
            });
        });
    });

    describe('interactions', () => {
        it('should handle click to toggle checkbox', () => {
            const onChange = vi.fn();
            const logicWithCallback = createCheckboxLogic(state, { onChange });
            logicWithCallback.connect(state);
            logicWithCallback.initialize();
            const interactions = logicWithCallback.getInteractionHandlers('root');
            
            interactions.onClick(mockEvent as MouseEvent);
            
            // Verify the onChange callback was called with true
            expect(onChange).toHaveBeenCalledWith(true);
        });

        it('should prevent click when disabled', () => {
            state.setDisabled(true);
            const onChange = vi.fn();
            const logicWithCallback = createCheckboxLogic(state, { onChange });
            logicWithCallback.connect(state);
            logicWithCallback.initialize();
            const interactions = logicWithCallback.getInteractionHandlers('root');
            
            interactions.onClick(mockEvent as MouseEvent);
            
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            // Verify onChange was NOT called when disabled
            expect(onChange).not.toHaveBeenCalled();
        });

        it('should handle space key to toggle', () => {
            const onChange = vi.fn();
            const logicWithCallback = createCheckboxLogic(state, { onChange });
            logicWithCallback.connect(state);
            logicWithCallback.initialize();
            const interactions = logicWithCallback.getInteractionHandlers('root');
            
            interactions.onKeyDown(mockKeyboardEvent as KeyboardEvent);
            
            expect(mockKeyboardEvent.preventDefault).toHaveBeenCalled();
            expect(onChange).toHaveBeenCalledWith(true);
        });

        it('should ignore non-space keys', () => {
            const onChange = vi.fn();
            const logicWithCallback = createCheckboxLogic(state, { onChange });
            logicWithCallback.connect(state);
            logicWithCallback.initialize();
            const mockOtherKey = { ...mockKeyboardEvent, code: 'Enter' };
            const interactions = logicWithCallback.getInteractionHandlers('root');
            
            interactions.onKeyDown(mockOtherKey as KeyboardEvent);
            
            // Verify onChange was NOT called for non-space keys
            expect(onChange).not.toHaveBeenCalled();
        });

        it('should prevent keydown when disabled', () => {
            state.setDisabled(true);
            const onChange = vi.fn();
            const logicWithCallback = createCheckboxLogic(state, { onChange });
            logicWithCallback.connect(state);
            logicWithCallback.initialize();
            const interactions = logicWithCallback.getInteractionHandlers('root');
            
            interactions.onKeyDown(mockKeyboardEvent as KeyboardEvent);
            
            // Verify onChange was NOT called when disabled
            expect(onChange).not.toHaveBeenCalled();
        });

        it('should handle focus events', () => {
            const onFocus = vi.fn();
            const logicWithCallback = createCheckboxLogic(state, { onFocus });
            logicWithCallback.connect(state);
            logicWithCallback.initialize();
            const interactions = logicWithCallback.getInteractionHandlers('root');
            
            interactions.onFocus(mockFocusEvent as FocusEvent);
            
            // Verify onFocus callback was called
            expect(onFocus).toHaveBeenCalledWith(mockFocusEvent);
        });

        it('should handle blur events', () => {
            const onBlur = vi.fn();
            const logicWithCallback = createCheckboxLogic(state, { onBlur });
            logicWithCallback.connect(state);
            logicWithCallback.initialize();
            const interactions = logicWithCallback.getInteractionHandlers('root');
            
            interactions.onBlur(mockFocusEvent as FocusEvent);
            
            // Verify onBlur callback was called
            expect(onBlur).toHaveBeenCalledWith(mockFocusEvent);
        });
    });

    describe('event handling', () => {
        it('should call onChange callback when provided', () => {
            const onChange = vi.fn();
            const logicWithCallback = createCheckboxLogic(state, { onChange });
            logicWithCallback.connect(state);
            logicWithCallback.initialize();
            
            logicWithCallback.handleEvent('change', {
                checked: true,
                previousChecked: false
            });
            
            expect(onChange).toHaveBeenCalledWith(true);
        });

        it('should call onFocus callback when provided', () => {
            const onFocus = vi.fn();
            const logicWithCallback = createCheckboxLogic(state, { onFocus });
            logicWithCallback.connect(state);
            logicWithCallback.initialize();
            
            logicWithCallback.handleEvent('focus', { event: mockFocusEvent as FocusEvent });
            
            expect(onFocus).toHaveBeenCalledWith(mockFocusEvent);
        });

        it('should call onBlur callback when provided', () => {
            const onBlur = vi.fn();
            const logicWithCallback = createCheckboxLogic(state, { onBlur });
            logicWithCallback.connect(state);
            logicWithCallback.initialize();
            
            logicWithCallback.handleEvent('blur', { event: mockFocusEvent as FocusEvent });
            
            expect(onBlur).toHaveBeenCalledWith(mockFocusEvent);
        });
    });
});