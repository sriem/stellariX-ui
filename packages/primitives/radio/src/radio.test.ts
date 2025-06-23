/**
 * Radio Component Tests
 * Unit tests for state and logic layers using proven callback verification patterns
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRadioState } from './state';
import { createRadioLogic } from './logic';
import type { RadioOptions } from './types';

describe('Radio State', () => {
    it('should create initial state with default values', () => {
        const options: RadioOptions = {
            name: 'test-group',
            value: 'test-value'
        };
        const state = createRadioState(options);
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setChecked(false); // Trigger subscription
        
        // Radio state has the same issue as checkbox - only partial updates
        expect(listener).toHaveBeenCalledWith({
            checked: false,
            disabled: false,
            focused: false,
            required: false,
            error: false,
            errorMessage: undefined,
            name: 'test-group',
            value: 'test-value'
        });
        
        // Verify other properties through individual updates
        listener.mockClear();
        state.setDisabled(false);
        expect(listener).toHaveBeenCalledWith({
            checked: false,
            disabled: false,
            focused: false,
            required: false,
            error: false,
            errorMessage: undefined,
            name: 'test-group',
            value: 'test-value'
        });
        
        listener.mockClear();
        state.setRequired(false);
        expect(listener).toHaveBeenCalledWith({
            checked: false,
            disabled: false,
            focused: false,
            required: false,
            error: false,
            errorMessage: undefined,
            name: 'test-group',
            value: 'test-value'
        });
    });

    it('should create initial state with custom options', () => {
        const options: RadioOptions = {
            name: 'custom-group',
            value: 'custom-value',
            checked: true,
            disabled: true,
            required: true
        };
        
        const state = createRadioState(options);
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setChecked(true); // Trigger subscription
        
        expect(listener).toHaveBeenCalledWith({
            checked: true,
            disabled: true,
            focused: false,
            required: true,
            error: false,
            errorMessage: undefined,
            name: 'custom-group',
            value: 'custom-value'
        });
        
        // Verify other properties through individual updates
        listener.mockClear();
        state.setDisabled(true);
        expect(listener).toHaveBeenCalledWith({
            checked: true,
            disabled: true,
            focused: false,
            required: true,
            error: false,
            errorMessage: undefined,
            name: 'custom-group',
            value: 'custom-value'
        });
        
        listener.mockClear();
        state.setRequired(true);
        expect(listener).toHaveBeenCalledWith({
            checked: true,
            disabled: true,
            focused: false,
            required: true,
            error: false,
            errorMessage: undefined,
            name: 'custom-group',
            value: 'custom-value'
        });
    });

    it('should update checked state', () => {
        const options: RadioOptions = {
            name: 'test-group',
            value: 'test-value'
        };
        const state = createRadioState(options);
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.setChecked(true);
        expect(listener).toHaveBeenCalledWith({
            checked: true,
            disabled: false,
            focused: false,
            required: false,
            error: false,
            errorMessage: undefined,
            name: 'test-group',
            value: 'test-value'
        });
        
        listener.mockClear();
        state.setChecked(false);
        expect(listener).toHaveBeenCalledWith({
            checked: false,
            disabled: false,
            focused: false,
            required: false,
            error: false,
            errorMessage: undefined,
            name: 'test-group',
            value: 'test-value'
        });
    });

    it('should update disabled state', () => {
        const options: RadioOptions = {
            name: 'test-group',
            value: 'test-value'
        };
        const state = createRadioState(options);
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.setDisabled(true);
        expect(listener).toHaveBeenCalledWith({
            checked: false,
            disabled: true,
            focused: false,
            required: false,
            error: false,
            errorMessage: undefined,
            name: 'test-group',
            value: 'test-value'
        });
        
        listener.mockClear();
        state.setDisabled(false);
        expect(listener).toHaveBeenCalledWith({
            checked: false,
            disabled: false,
            focused: false,
            required: false,
            error: false,
            errorMessage: undefined,
            name: 'test-group',
            value: 'test-value'
        });
    });

    it('should update focused state', () => {
        const options: RadioOptions = {
            name: 'test-group',
            value: 'test-value'
        };
        const state = createRadioState(options);
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.setFocused(true);
        expect(listener).toHaveBeenCalledWith({
            checked: false,
            disabled: false,
            focused: true,
            required: false,
            error: false,
            errorMessage: undefined,
            name: 'test-group',
            value: 'test-value'
        });
        
        listener.mockClear();
        state.setFocused(false);
        expect(listener).toHaveBeenCalledWith({
            checked: false,
            disabled: false,
            focused: false,
            required: false,
            error: false,
            errorMessage: undefined,
            name: 'test-group',
            value: 'test-value'
        });
    });

    it('should update required state', () => {
        const options: RadioOptions = {
            name: 'test-group',
            value: 'test-value'
        };
        const state = createRadioState(options);
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.setRequired(true);
        expect(listener).toHaveBeenCalledWith({
            checked: false,
            disabled: false,
            focused: false,
            required: true,
            error: false,
            errorMessage: undefined,
            name: 'test-group',
            value: 'test-value'
        });
        
        listener.mockClear();
        state.setRequired(false);
        expect(listener).toHaveBeenCalledWith({
            checked: false,
            disabled: false,
            focused: false,
            required: false,
            error: false,
            errorMessage: undefined,
            name: 'test-group',
            value: 'test-value'
        });
    });

    it('should update error state', () => {
        const options: RadioOptions = {
            name: 'test-group',
            value: 'test-value'
        };
        const state = createRadioState(options);
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.setError(true, 'Test error message');
        expect(listener).toHaveBeenCalledWith({
            checked: false,
            disabled: false,
            focused: false,
            required: false,
            error: true,
            errorMessage: 'Test error message',
            name: 'test-group',
            value: 'test-value'
        });
        
        listener.mockClear();
        state.setError(false);
        expect(listener).toHaveBeenCalledWith({
            checked: false,
            disabled: false,
            focused: false,
            required: false,
            error: false,
            errorMessage: undefined,
            name: 'test-group',
            value: 'test-value'
        });
    });

    describe('isInteractive computed property', () => {
        it('should return true when not disabled', () => {
            const options: RadioOptions = {
                name: 'test-group',
                value: 'test-value',
                disabled: false
            };
            const state = createRadioState(options);
            expect(state.isInteractive()).toBe(true);
        });

        it('should return false when disabled', () => {
            const options: RadioOptions = {
                name: 'test-group',
                value: 'test-value',
                disabled: true
            };
            const state = createRadioState(options);
            expect(state.isInteractive()).toBe(false);
        });
    });

    it('should handle subscriptions', () => {
        const options: RadioOptions = {
            name: 'test-group',
            value: 'test-value'
        };
        const state = createRadioState(options);
        const listener = vi.fn();
        
        const unsubscribe = state.subscribe(listener);
        
        state.setChecked(true);
        expect(listener).toHaveBeenCalledWith({
            checked: true,
            disabled: false,
            focused: false,
            required: false,
            error: false,
            errorMessage: undefined,
            name: 'test-group',
            value: 'test-value'
        });
        
        unsubscribe();
        state.setChecked(false);
        expect(listener).toHaveBeenCalledTimes(1);
    });
});

describe('Radio Logic', () => {
    let state: ReturnType<typeof createRadioState>;
    let logic: ReturnType<typeof createRadioLogic>;
    let mockEvent: Partial<MouseEvent>;
    let mockKeyboardEvent: Partial<KeyboardEvent>;
    let mockFocusEvent: Partial<FocusEvent>;
    let options: RadioOptions;

    beforeEach(() => {
        options = {
            name: 'test-group',
            value: 'test-value'
        };
        state = createRadioState(options);
        logic = createRadioLogic(state, options);
        
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
                role: 'radio',
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
                role: 'radio',
                'aria-checked': true,
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
            const optionsWithId = { ...options, id: 'test-radio' };
            const logicWithId = createRadioLogic(state, optionsWithId);
            state.setError(true, 'Test error');
            logicWithId.connect(state);
            logicWithId.initialize();
            const a11yProps = logicWithId.getA11yProps('root');
            
            expect(a11yProps).toMatchObject({
                'aria-invalid': 'true',
                'aria-describedby': 'test-radio-error'
            });
        });
    });

    describe('interactions', () => {
        it('should handle click to check radio', () => {
            const onChange = vi.fn();
            const logicWithCallback = createRadioLogic(state, { ...options, onChange });
            logicWithCallback.connect(state);
            logicWithCallback.initialize();
            const interactions = logicWithCallback.getInteractionHandlers('root');
            
            interactions.onClick(mockEvent as MouseEvent);
            
            // Verify the onChange callback was called with true
            expect(onChange).toHaveBeenCalledWith(true, 'test-value');
        });

        it('should not toggle when already checked (radio behavior)', () => {
            state.setChecked(true);
            const onChange = vi.fn();
            const logicWithCallback = createRadioLogic(state, { ...options, onChange });
            logicWithCallback.connect(state);
            logicWithCallback.initialize();
            const interactions = logicWithCallback.getInteractionHandlers('root');
            
            interactions.onClick(mockEvent as MouseEvent);
            
            // Radio should not uncheck when clicked if already checked
            expect(onChange).not.toHaveBeenCalled();
        });

        it('should prevent click when disabled', () => {
            state.setDisabled(true);
            const onChange = vi.fn();
            const logicWithCallback = createRadioLogic(state, { ...options, onChange });
            logicWithCallback.connect(state);
            logicWithCallback.initialize();
            const interactions = logicWithCallback.getInteractionHandlers('root');
            
            interactions.onClick(mockEvent as MouseEvent);
            
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            // Verify onChange was NOT called when disabled
            expect(onChange).not.toHaveBeenCalled();
        });

        it('should handle space key to check', () => {
            const onChange = vi.fn();
            const logicWithCallback = createRadioLogic(state, { ...options, onChange });
            logicWithCallback.connect(state);
            logicWithCallback.initialize();
            const interactions = logicWithCallback.getInteractionHandlers('root');
            
            interactions.onKeyDown(mockKeyboardEvent as KeyboardEvent);
            
            expect(mockKeyboardEvent.preventDefault).toHaveBeenCalled();
            expect(onChange).toHaveBeenCalledWith(true, 'test-value');
        });

        it('should not toggle with space when already checked', () => {
            state.setChecked(true);
            const onChange = vi.fn();
            const logicWithCallback = createRadioLogic(state, { ...options, onChange });
            logicWithCallback.connect(state);
            logicWithCallback.initialize();
            const interactions = logicWithCallback.getInteractionHandlers('root');
            
            interactions.onKeyDown(mockKeyboardEvent as KeyboardEvent);
            
            expect(mockKeyboardEvent.preventDefault).toHaveBeenCalled();
            // Radio should not uncheck with space if already checked
            expect(onChange).not.toHaveBeenCalled();
        });

        it('should handle arrow keys for group navigation', () => {
            const logicWithCallback = createRadioLogic(state, options);
            logicWithCallback.connect(state);
            logicWithCallback.initialize();
            const interactions = logicWithCallback.getInteractionHandlers('root');
            const arrowKey = { ...mockKeyboardEvent, code: 'ArrowDown' };
            
            interactions.onKeyDown(arrowKey as KeyboardEvent);
            
            // Arrow keys should not prevent default (to allow group navigation)
            expect(arrowKey.preventDefault).not.toHaveBeenCalled();
        });

        it('should ignore non-space/arrow keys', () => {
            const onChange = vi.fn();
            const logicWithCallback = createRadioLogic(state, { ...options, onChange });
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
            const logicWithCallback = createRadioLogic(state, { ...options, onChange });
            logicWithCallback.connect(state);
            logicWithCallback.initialize();
            const interactions = logicWithCallback.getInteractionHandlers('root');
            
            interactions.onKeyDown(mockKeyboardEvent as KeyboardEvent);
            
            // Verify onChange was NOT called when disabled
            expect(onChange).not.toHaveBeenCalled();
        });

        it('should handle focus events', () => {
            const onFocus = vi.fn();
            const logicWithCallback = createRadioLogic(state, { ...options, onFocus });
            logicWithCallback.connect(state);
            logicWithCallback.initialize();
            const interactions = logicWithCallback.getInteractionHandlers('root');
            
            interactions.onFocus(mockFocusEvent as FocusEvent);
            
            // Verify onFocus callback was called
            expect(onFocus).toHaveBeenCalledWith(mockFocusEvent);
        });

        it('should handle blur events', () => {
            const onBlur = vi.fn();
            const logicWithCallback = createRadioLogic(state, { ...options, onBlur });
            logicWithCallback.connect(state);
            logicWithCallback.initialize();
            const interactions = logicWithCallback.getInteractionHandlers('root');
            
            interactions.onBlur(mockFocusEvent as FocusEvent);
            
            // Verify onBlur callback was called
            expect(onBlur).toHaveBeenCalledWith(mockFocusEvent);
        });
    });

    describe('event triggering', () => {
        it('should trigger change event on interaction', () => {
            const onChange = vi.fn();
            const logicWithCallback = createRadioLogic(state, { ...options, onChange });
            logicWithCallback.connect(state);
            logicWithCallback.initialize();
            
            // Simulate an event being triggered
            logicWithCallback.handleEvent('change', {
                checked: true,
                value: 'test-value'
            });
            
            expect(onChange).toHaveBeenCalledWith(true, 'test-value');
        });

        it('should trigger focus event', () => {
            const onFocus = vi.fn();
            const logicWithCallback = createRadioLogic(state, { ...options, onFocus });
            logicWithCallback.connect(state);
            logicWithCallback.initialize();
            
            // Simulate focus event
            logicWithCallback.handleEvent('focus', mockFocusEvent);
            
            expect(onFocus).toHaveBeenCalledWith(mockFocusEvent);
        });

        it('should trigger blur event', () => {
            const onBlur = vi.fn();
            const logicWithCallback = createRadioLogic(state, { ...options, onBlur });
            logicWithCallback.connect(state);
            logicWithCallback.initialize();
            
            // Simulate blur event
            logicWithCallback.handleEvent('blur', mockFocusEvent);
            
            expect(onBlur).toHaveBeenCalledWith(mockFocusEvent);
        });
    });
});

describe('Radio Integration', () => {
    it('should create complete radio component', () => {
        const options: RadioOptions = {
            name: 'test-group',
            value: 'test-value',
            checked: true,
            onChange: vi.fn()
        };
        
        const state = createRadioState(options);
        const logic = createRadioLogic(state, options);
        const listener = vi.fn();
        
        expect(state).toBeDefined();
        expect(logic).toBeDefined();
        
        // Verify state through subscription
        state.subscribe(listener);
        state.setChecked(true); // Trigger subscription
        
        // Radio state has the same issue - only partial updates
        expect(listener).toHaveBeenCalledWith({
            checked: true,
            disabled: false,
            focused: false,
            required: false,
            error: false,
            errorMessage: undefined,
            name: 'test-group',
            value: 'test-value'
        });
        // Value and name are set during initialization and don't change
    });
});