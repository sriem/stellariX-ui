/**
 * Template Logic Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTemplateLogic } from './logic';
import { createTemplateState } from './state';
import type { TemplateOptions } from './types';

describe('Template Logic', () => {
    let stateStore: ReturnType<typeof createTemplateState>;
    let logic: ReturnType<typeof createTemplateLogic>;
    let mockOnChange: ReturnType<typeof vi.fn>;
    let mockOnActiveChange: ReturnType<typeof vi.fn>;
    
    beforeEach(() => {
        mockOnChange = vi.fn();
        mockOnActiveChange = vi.fn();
        
        const options: TemplateOptions = {
            onChange: mockOnChange,
            onActiveChange: mockOnActiveChange,
        };
        
        stateStore = createTemplateState(options);
        logic = createTemplateLogic(stateStore, options);
        
        // Connect logic to state
        logic.connect(stateStore);
        logic.initialize();
    });
    
    it('should handle change events', () => {
        logic.handleEvent('change', { 
            value: 'new value', 
            previousValue: '' 
        });
        
        expect(stateStore.getState().value).toBe('new value');
        expect(mockOnChange).toHaveBeenCalledWith('new value');
    });
    
    it('should not handle change when disabled', () => {
        stateStore.setDisabled(true);
        
        logic.handleEvent('change', { 
            value: 'new value', 
            previousValue: '' 
        });
        
        expect(stateStore.getState().value).toBe('');
        expect(mockOnChange).not.toHaveBeenCalled();
    });
    
    it('should handle activeChange events', () => {
        logic.handleEvent('activeChange', { active: true });
        
        expect(stateStore.getState().active).toBe(true);
        expect(mockOnActiveChange).toHaveBeenCalledWith(true);
    });
    
    it('should not handle activeChange when disabled', () => {
        stateStore.setDisabled(true);
        
        logic.handleEvent('activeChange', { active: true });
        
        expect(stateStore.getState().active).toBe(false);
        expect(mockOnActiveChange).not.toHaveBeenCalled();
    });
    
    it('should provide correct a11y props', () => {
        const props = logic.getA11yProps('root');
        
        expect(props).toEqual({
            'aria-disabled': false,
            'aria-pressed': false,
            'aria-label': 'Template component with value: ',
        });
        
        // Update state and check again
        stateStore.setDisabled(true);
        stateStore.setActive(true);
        stateStore.setValue('test');
        
        const updatedProps = logic.getA11yProps('root');
        expect(updatedProps).toEqual({
            'aria-disabled': true,
            'aria-pressed': true,
            'aria-label': 'Template component with value: test',
        });
    });
    
    it('should provide interaction handlers', () => {
        const handlers = logic.getInteractionHandlers('root');
        
        expect(handlers).toHaveProperty('onClick');
        expect(handlers).toHaveProperty('onFocus');
        expect(handlers).toHaveProperty('onBlur');
        
        // Test onClick handler
        const mockEvent = new MouseEvent('click');
        handlers.onClick(mockEvent);
        
        expect(stateStore.getState().active).toBe(true);
    });
    
    it('should not trigger onClick when disabled', () => {
        stateStore.setDisabled(true);
        
        const handlers = logic.getInteractionHandlers('root');
        const mockEvent = new MouseEvent('click');
        
        handlers.onClick(mockEvent);
        
        expect(stateStore.getState().active).toBe(false);
        expect(mockOnActiveChange).not.toHaveBeenCalled();
    });
    
    it('should handle focus events', () => {
        const mockEvent = new FocusEvent('focus');
        logic.handleEvent('focus', { event: mockEvent });
        
        // Just verify it doesn't throw
        expect(true).toBe(true);
    });
    
    it('should handle blur events', () => {
        const mockEvent = new FocusEvent('blur');
        logic.handleEvent('blur', { event: mockEvent });
        
        // Just verify it doesn't throw
        expect(true).toBe(true);
    });
    
    it('should cleanup properly', () => {
        logic.cleanup();
        
        // After cleanup, events should not be processed
        const mockEvent = new MouseEvent('click');
        logic.handleEvent('activeChange', { active: true });
        
        // State should not change after cleanup
        expect(stateStore.getState().active).toBe(false);
    });
});