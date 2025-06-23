/**
 * Toggle Logic Tests
 * 
 * 🚨 CRITICAL: Testing Pattern Rules
 * ❌ NEVER use state.getState() for verification
 * ✅ ALWAYS test via callbacks: onChange, onFocus, etc.
 * ✅ ALWAYS verify behavior through callback invocations
 * ✅ For a11y props, call logic.getA11yProps() directly
 * 
 * This prevents infinite loops and ensures proper behavior testing
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createToggleLogic } from './logic';
import { createToggleState } from './state';
import type { ToggleOptions } from './types';

describe('Toggle Logic', () => {
    let stateStore: ReturnType<typeof createToggleState>;
    let logic: ReturnType<typeof createToggleLogic>;
    let mockOnChange: ReturnType<typeof vi.fn>;
    let mockOnFocus: ReturnType<typeof vi.fn>;
    let mockOnBlur: ReturnType<typeof vi.fn>;
    
    beforeEach(() => {
        mockOnChange = vi.fn();
        mockOnFocus = vi.fn();
        mockOnBlur = vi.fn();
        
        const options: ToggleOptions = {
            onChange: mockOnChange,
            onFocus: mockOnFocus,
            onBlur: mockOnBlur,
        };
        
        stateStore = createToggleState(options);
        logic = createToggleLogic(stateStore, options);
        
        // Connect logic to state
        logic.connect(stateStore);
        logic.initialize();
    });
    
    it('should handle change events', () => {
        logic.handleEvent('change', { 
            checked: true,
            previousChecked: false 
        });
        
        // Verify callback was called
        expect(mockOnChange).toHaveBeenCalledWith(true);
    });
    
    it('should handle focus events', () => {
        const mockEvent = new FocusEvent('focus');
        logic.handleEvent('focus', { event: mockEvent });
        
        // Verify callback was called
        expect(mockOnFocus).toHaveBeenCalledWith(mockEvent);
    });
    
    it('should handle blur events', () => {
        const mockEvent = new FocusEvent('blur');
        logic.handleEvent('blur', { event: mockEvent });
        
        // Verify callback was called
        expect(mockOnBlur).toHaveBeenCalledWith(mockEvent);
    });
    
    it('should provide correct a11y props', () => {
        // Initial state
        let currentState = stateStore.getState();
        const props = logic.getA11yProps('root');
        
        expect(props).toEqual({
            'aria-checked': 'false',
            'aria-disabled': undefined,
            role: 'switch',
            tabIndex: 0,
        });
        
        // Update state and check again
        stateStore.setDisabled(true);
        stateStore.setChecked(true);
        
        const updatedProps = logic.getA11yProps('root');
        expect(updatedProps).toEqual({
            'aria-checked': 'true',
            'aria-disabled': 'true',
            role: 'switch',
            tabIndex: -1,
        });
    });
    
    it('should provide interaction handlers', () => {
        const handlers = logic.getInteractionHandlers('root');
        
        expect(handlers).toHaveProperty('onClick');
        expect(handlers).toHaveProperty('onFocus');
        expect(handlers).toHaveProperty('onBlur');
        expect(handlers).toHaveProperty('onKeyDown');
        
        // Test onClick handler - verify via callback
        const mockEvent = new MouseEvent('click');
        handlers.onClick(mockEvent);
        
        expect(mockOnChange).toHaveBeenCalledWith(true);
    });
    
    it('should handle keyboard interactions', () => {
        const handlers = logic.getInteractionHandlers('root');
        
        // Test Space key
        const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
        const preventDefaultSpy = vi.spyOn(spaceEvent, 'preventDefault');
        
        handlers.onKeyDown(spaceEvent);
        
        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(mockOnChange).toHaveBeenCalledWith(true);
        
        // Test other keys (should do nothing)
        mockOnChange.mockClear();
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        handlers.onKeyDown(enterEvent);
        
        expect(mockOnChange).not.toHaveBeenCalled();
    });
    
    it('should not trigger interactions when disabled', () => {
        stateStore.setDisabled(true);
        
        const handlers = logic.getInteractionHandlers('root');
        const clickEvent = new MouseEvent('click');
        const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
        
        const clickPreventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');
        
        handlers.onClick(clickEvent);
        handlers.onKeyDown(spaceEvent);
        
        expect(clickPreventDefaultSpy).toHaveBeenCalled();
        expect(mockOnChange).not.toHaveBeenCalled();
    });
    
    it('should handle focus interaction', () => {
        const handlers = logic.getInteractionHandlers('root');
        const focusEvent = new FocusEvent('focus');
        
        handlers.onFocus(focusEvent);
        
        expect(mockOnFocus).toHaveBeenCalledWith(focusEvent);
    });
    
    it('should handle blur interaction', () => {
        const handlers = logic.getInteractionHandlers('root');
        const blurEvent = new FocusEvent('blur');
        
        handlers.onBlur(blurEvent);
        
        expect(mockOnBlur).toHaveBeenCalledWith(blurEvent);
    });
    
    it('should cleanup properly', () => {
        logic.cleanup();
        
        // After cleanup, events should not be processed
        logic.handleEvent('change', { checked: true });
        
        // Callback should not be called after cleanup
        expect(mockOnChange).not.toHaveBeenCalled();
    });
});