/**
 * Card Logic Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCardLogic } from './logic';
import { createCardState } from './state';
import type { CardOptions } from './types';

describe('Card Logic', () => {
    let stateStore: ReturnType<typeof createCardState>;
    let logic: ReturnType<typeof createCardLogic>;
    let mockOnClick: ReturnType<typeof vi.fn>;
    let mockOnSelectionChange: ReturnType<typeof vi.fn>;
    let mockOnFocus: ReturnType<typeof vi.fn>;
    let mockOnBlur: ReturnType<typeof vi.fn>;
    
    beforeEach(() => {
        mockOnClick = vi.fn();
        mockOnSelectionChange = vi.fn();
        mockOnFocus = vi.fn();
        mockOnBlur = vi.fn();
        
        const options: CardOptions = {
            onClick: mockOnClick,
            onSelectionChange: mockOnSelectionChange,
            onFocus: mockOnFocus,
            onBlur: mockOnBlur,
            interactive: true,
        };
        
        stateStore = createCardState(options);
        logic = createCardLogic(stateStore, options);
        
        // Connect logic to state
        logic.connect(stateStore);
        logic.initialize();
    });
    
    it('should handle click event', () => {
        const mockEvent = new MouseEvent('click');
        logic.handleEvent('click', { event: mockEvent });
        
        expect(stateStore.getState().selected).toBe(true);
        expect(mockOnSelectionChange).toHaveBeenCalledWith(true);
        expect(mockOnClick).toHaveBeenCalledWith(mockEvent);
    });
    
    it('should toggle selection on click when interactive', () => {
        // First click - select
        logic.handleEvent('click', { event: new MouseEvent('click') });
        expect(stateStore.getState().selected).toBe(true);
        expect(mockOnSelectionChange).toHaveBeenCalledWith(true);
        
        // Second click - deselect
        mockOnSelectionChange.mockClear();
        logic.handleEvent('click', { event: new MouseEvent('click') });
        expect(stateStore.getState().selected).toBe(false);
        expect(mockOnSelectionChange).toHaveBeenCalledWith(false);
    });
    
    it('should not toggle selection when not interactive', () => {
        stateStore.setInteractive(false);
        
        logic.handleEvent('click', { event: new MouseEvent('click') });
        
        expect(stateStore.getState().selected).toBe(false);
        expect(mockOnSelectionChange).not.toHaveBeenCalled();
        expect(mockOnClick).toHaveBeenCalledWith(expect.any(MouseEvent));
    });
    
    it('should not handle click when disabled', () => {
        stateStore.setDisabled(true);
        
        const mockEvent = new MouseEvent('click');
        logic.handleEvent('click', { event: mockEvent });
        
        expect(stateStore.getState().selected).toBe(false);
        expect(mockOnSelectionChange).not.toHaveBeenCalled();
        expect(mockOnClick).not.toHaveBeenCalled();
    });
    
    it('should handle selection change event', () => {
        logic.handleEvent('selectionChange', { selected: true });
        
        expect(stateStore.getState().selected).toBe(true);
        expect(mockOnSelectionChange).toHaveBeenCalledWith(true);
    });
    
    it('should handle focus event', () => {
        const mockEvent = new FocusEvent('focus');
        logic.handleEvent('focus', { event: mockEvent });
        
        expect(stateStore.getState().focused).toBe(true);
        expect(mockOnFocus).toHaveBeenCalledWith(mockEvent);
    });
    
    it('should handle blur event', () => {
        stateStore.setFocused(true); // Set focused first
        
        const mockEvent = new FocusEvent('blur');
        logic.handleEvent('blur', { event: mockEvent });
        
        expect(stateStore.getState().focused).toBe(false);
        expect(mockOnBlur).toHaveBeenCalledWith(mockEvent);
    });
    
    it('should handle hover state changes', () => {
        logic.handleEvent('hover', { hovered: true });
        expect(stateStore.getState().hovered).toBe(true);
        
        logic.handleEvent('hover', { hovered: false });
        expect(stateStore.getState().hovered).toBe(false);
    });
    
    it('should provide correct a11y props for interactive card', () => {
        const props = logic.getA11yProps('root');
        
        expect(props).toEqual({
            role: 'checkbox',
            tabIndex: 0,
            'aria-checked': 'false',
        });
        
        // Update state and check again
        stateStore.setSelected(true);
        stateStore.setDisabled(true);
        
        const updatedProps = logic.getA11yProps('root');
        expect(updatedProps).toEqual({
            role: 'checkbox',
            tabIndex: -1,
            'aria-checked': 'true',
            'aria-disabled': 'true',
        });
    });
    
    it('should provide correct a11y props for non-interactive card', () => {
        stateStore.setInteractive(false);
        
        const props = logic.getA11yProps('root');
        expect(props).toEqual({});
    });
    
    it('should provide header a11y props', () => {
        const props = logic.getA11yProps('header');
        
        expect(props).toEqual({
            role: 'heading',
            'aria-level': '3',
        });
    });
    
    it('should provide interaction handlers', () => {
        const handlers = logic.getInteractionHandlers('root');
        
        expect(handlers).toHaveProperty('onClick');
        expect(handlers).toHaveProperty('onFocus');
        expect(handlers).toHaveProperty('onBlur');
        expect(handlers).toHaveProperty('onMouseEnter');
        expect(handlers).toHaveProperty('onMouseLeave');
        expect(handlers).toHaveProperty('onKeyDown');
    });
    
    it('should handle mouse enter/leave for hover state', () => {
        const handlers = logic.getInteractionHandlers('root');
        
        // Mouse enter
        handlers.onMouseEnter(new MouseEvent('mouseenter'));
        expect(stateStore.getState().hovered).toBe(true);
        
        // Mouse leave
        handlers.onMouseLeave(new MouseEvent('mouseleave'));
        expect(stateStore.getState().hovered).toBe(false);
    });
    
    it('should handle keyboard interactions', () => {
        const handlers = logic.getInteractionHandlers('root');
        
        // Enter key
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        Object.defineProperty(enterEvent, 'preventDefault', { value: vi.fn() });
        handlers.onKeyDown(enterEvent);
        
        expect(enterEvent.preventDefault).toHaveBeenCalled();
        expect(stateStore.getState().selected).toBe(true);
        
        // Space key
        const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
        Object.defineProperty(spaceEvent, 'preventDefault', { value: vi.fn() });
        handlers.onKeyDown(spaceEvent);
        
        expect(spaceEvent.preventDefault).toHaveBeenCalled();
        expect(stateStore.getState().selected).toBe(false);
    });
    
    it('should not handle keyboard when disabled', () => {
        stateStore.setDisabled(true);
        
        const handlers = logic.getInteractionHandlers('root');
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        handlers.onKeyDown(enterEvent);
        
        expect(stateStore.getState().selected).toBe(false);
    });
    
    it('should cleanup properly', () => {
        logic.cleanup();
        
        // After cleanup, events should not be processed
        logic.handleEvent('click', { event: new MouseEvent('click') });
        
        // Callbacks should not be called after cleanup
        expect(mockOnClick).not.toHaveBeenCalled();
    });
});