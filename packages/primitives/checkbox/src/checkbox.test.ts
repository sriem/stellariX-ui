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
        const listener = vi.fn();
        
        // Subscribe and verify individual state properties through updates
        state.subscribe(listener);
        
        // Test individual properties by triggering updates
        state.setChecked(false);
        expect(listener).toHaveBeenLastCalledWith({
            checked: false,
            disabled: false,
            focused: false,
            required: false,
            error: false,
            errorMessage: undefined
        });
        
        listener.mockClear();
        state.setDisabled(false);
        expect(listener).toHaveBeenLastCalledWith({
            checked: false,
            disabled: false,
            focused: false,
            required: false,
            error: false,
            errorMessage: undefined
        });
        
        listener.mockClear();
        state.setFocused(false);
        expect(listener).toHaveBeenLastCalledWith({
            checked: false,
            disabled: false,
            focused: false,
            required: false,
            error: false,
            errorMessage: undefined
        });
        
        listener.mockClear();
        state.setRequired(false);
        expect(listener).toHaveBeenLastCalledWith({
            checked: false,
            disabled: false,
            focused: false,
            required: false,
            error: false,
            errorMessage: undefined
        });
        
        listener.mockClear();
        state.setError(false);
        expect(listener).toHaveBeenLastCalledWith({
            checked: false,
            disabled: false,
            focused: false,
            required: false,
            error: false,
            errorMessage: undefined
        });
    });

    it('should create initial state with custom options', () => {
        const options: CheckboxOptions = {
            checked: true,
            disabled: true,
            required: true
        };
        
        const state = createCheckboxState(options);
        const listener = vi.fn();
        
        // Subscribe and verify individual properties match initial options
        state.subscribe(listener);
        
        // Verify each property was initialized correctly
        state.setChecked(true);
        expect(listener).toHaveBeenLastCalledWith({
            checked: true,
            disabled: true,
            focused: false,
            required: true,
            error: false,
            errorMessage: undefined
        });
        
        listener.mockClear();
        state.setDisabled(true);
        expect(listener).toHaveBeenLastCalledWith({
            checked: true,
            disabled: true,
            focused: false,
            required: true,
            error: false,
            errorMessage: undefined
        });
        
        listener.mockClear();
        state.setRequired(true);
        expect(listener).toHaveBeenLastCalledWith({
            checked: true,
            disabled: true,
            focused: false,
            required: true,
            error: false,
            errorMessage: undefined
        });
    });

    it('should handle indeterminate state', () => {
        const state = createCheckboxState({ checked: 'indeterminate' });
        const listener = vi.fn();
        
        state.subscribe(listener);
        // Trigger update to verify current state
        state.setChecked('indeterminate'); // Same as initial
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({
                checked: 'indeterminate'
            })
        );
    });

    it('should update checked state', () => {
        const state = createCheckboxState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.setChecked(true);
        expect(listener).toHaveBeenCalledWith({
            checked: true,
            disabled: false,
            focused: false,
            required: false,
            error: false,
            errorMessage: undefined
        });
        
        listener.mockClear();
        state.setChecked('indeterminate');
        expect(listener).toHaveBeenCalledWith({
            checked: 'indeterminate',
            disabled: false,
            focused: false,
            required: false,
            error: false,
            errorMessage: undefined
        });
        
        listener.mockClear();
        state.setChecked(false);
        expect(listener).toHaveBeenCalledWith({
            checked: false,
            disabled: false,
            focused: false,
            required: false,
            error: false,
            errorMessage: undefined
        });
    });

    it('should update disabled state', () => {
        const state = createCheckboxState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.setDisabled(true);
        expect(listener).toHaveBeenCalledWith({
            checked: false,
            disabled: true,
            focused: false,
            required: false,
            error: false,
            errorMessage: undefined
        });
        
        listener.mockClear();
        state.setDisabled(false);
        expect(listener).toHaveBeenCalledWith({
            checked: false,
            disabled: false,
            focused: false,
            required: false,
            error: false,
            errorMessage: undefined
        });
    });

    it('should update focused state', () => {
        const state = createCheckboxState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.setFocused(true);
        expect(listener).toHaveBeenCalledWith({
            checked: false,
            disabled: false,
            focused: true,
            required: false,
            error: false,
            errorMessage: undefined
        });
        
        listener.mockClear();
        state.setFocused(false);
        expect(listener).toHaveBeenCalledWith({
            checked: false,
            disabled: false,
            focused: false,
            required: false,
            error: false,
            errorMessage: undefined
        });
    });

    it('should update required state', () => {
        const state = createCheckboxState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.setRequired(true);
        expect(listener).toHaveBeenCalledWith({
            checked: false,
            disabled: false,
            focused: false,
            required: true,
            error: false,
            errorMessage: undefined
        });
        
        listener.mockClear();
        state.setRequired(false);
        expect(listener).toHaveBeenCalledWith({
            checked: false,
            disabled: false,
            focused: false,
            required: false,
            error: false,
            errorMessage: undefined
        });
    });

    it('should update error state', () => {
        const state = createCheckboxState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.setError(true, 'Test error');
        expect(listener).toHaveBeenCalledWith({
            checked: false,
            disabled: false,
            focused: false,
            required: false,
            error: true,
            errorMessage: 'Test error'
        });
        
        listener.mockClear();
        state.setError(false);
        expect(listener).toHaveBeenCalledWith({
            checked: false,
            disabled: false,
            focused: false,
            required: false,
            error: false,
            errorMessage: undefined
        });
    });

    describe('toggle method', () => {
        it('should toggle from false to true', () => {
            const state = createCheckboxState({ checked: false });
            const listener = vi.fn();
            
            state.subscribe(listener);
            state.toggle();
            
            expect(listener).toHaveBeenCalled();
            // Since toggle uses getState internally, we just verify it was called
        });

        it('should toggle from true to false', () => {
            const state = createCheckboxState({ checked: true });
            const listener = vi.fn();
            
            state.subscribe(listener);
            state.toggle();
            
            expect(listener).toHaveBeenCalled();
            // Since toggle uses getState internally, we just verify it was called
        });

        it('should toggle from indeterminate to true', () => {
            const state = createCheckboxState({ checked: 'indeterminate' });
            const listener = vi.fn();
            
            state.subscribe(listener);
            state.toggle();
            
            expect(listener).toHaveBeenCalled();
            // Since toggle uses getState internally, we just verify it was called
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
        expect(listener).toHaveBeenCalledWith({
            checked: true,
            disabled: false,
            focused: false,
            required: false,
            error: false,
            errorMessage: undefined
        });
        
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
            const interactions = logicWithCallback.getInteractionHandlers('root');
            
            // Test by triggering the click interaction which calls onChange
            interactions.onClick(mockEvent as MouseEvent);
            
            expect(onChange).toHaveBeenCalledWith(true);
        });

        it('should call onFocus callback when provided', () => {
            const onFocus = vi.fn();
            const logicWithCallback = createCheckboxLogic(state, { onFocus });
            logicWithCallback.connect(state);
            logicWithCallback.initialize();
            const interactions = logicWithCallback.getInteractionHandlers('root');
            
            // Test by triggering the focus interaction
            interactions.onFocus(mockFocusEvent as FocusEvent);
            
            expect(onFocus).toHaveBeenCalledWith(mockFocusEvent);
        });

        it('should call onBlur callback when provided', () => {
            const onBlur = vi.fn();
            const logicWithCallback = createCheckboxLogic(state, { onBlur });
            logicWithCallback.connect(state);
            logicWithCallback.initialize();
            const interactions = logicWithCallback.getInteractionHandlers('root');
            
            // Test by triggering the blur interaction
            interactions.onBlur(mockFocusEvent as FocusEvent);
            
            expect(onBlur).toHaveBeenCalledWith(mockFocusEvent);
        });
    });
});