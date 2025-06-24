/**
 * Accordion Logic Tests
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
import { createAccordionLogic } from './logic';
import { createAccordionState } from './state';
import type { AccordionOptions } from './types';

describe('Accordion Logic', () => {
    let stateStore: ReturnType<typeof createAccordionState>;
    let logic: ReturnType<typeof createAccordionLogic>;
    let mockOnExpandedChange: ReturnType<typeof vi.fn>;
    let mockOnItemToggle: ReturnType<typeof vi.fn>;
    
    beforeEach(() => {
        mockOnExpandedChange = vi.fn();
        mockOnItemToggle = vi.fn();
        
        const options: AccordionOptions = {
            items: [
                { id: 'item1' },
                { id: 'item2' },
                { id: 'item3', disabled: true }
            ],
            onExpandedChange: mockOnExpandedChange,
            onItemToggle: mockOnItemToggle,
        };
        
        stateStore = createAccordionState(options);
        logic = createAccordionLogic(stateStore, options);
        
        // Connect logic to state
        logic.connect(stateStore);
        logic.initialize();
    });
    
    it('should handle item toggle event', async () => {
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        logic.handleEvent('itemToggle', { 
            itemId: 'item1', 
            expanded: true 
        });
        
        // The listener should be called immediately with the state change
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            expandedItems: ['item1']
        }));
        
        // The onItemToggle callback should be called immediately  
        expect(mockOnItemToggle).toHaveBeenCalledWith('item1', true);
        
        // Wait for async onExpandedChange callback
        await new Promise(resolve => setTimeout(resolve, 10));
        
        // Now onExpandedChange should have been called
        expect(mockOnExpandedChange).toHaveBeenCalledWith(['item1']);
    });
    
    it('should not toggle disabled items', () => {
        // First clear any previous state changes
        const listener = vi.fn();
        
        // Try to toggle disabled item
        logic.handleEvent('itemToggle', { 
            itemId: 'item3', 
            expanded: true 
        });
        
        // Subscribe after the event to check if state changed
        stateStore.subscribe(listener);
        stateStore.setState((prev) => ({ ...prev }));
        
        // Item3 should still be collapsed
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            expandedItems: []
        }));
        expect(mockOnItemToggle).not.toHaveBeenCalled();
    });
    
    it('should handle expanded items change', () => {
        // Create a new accordion with multiple=true to test expanding multiple items
        const multiOptions: AccordionOptions = {
            items: [
                { id: 'item1' },
                { id: 'item2' },
                { id: 'item3', disabled: true }
            ],
            multiple: true,
            onExpandedChange: mockOnExpandedChange,
            onItemToggle: mockOnItemToggle,
        };
        
        const multiState = createAccordionState(multiOptions);
        const multiLogic = createAccordionLogic(multiState, multiOptions);
        multiLogic.connect(multiState);
        multiLogic.initialize();
        
        const listener = vi.fn();
        multiState.subscribe(listener);
        
        multiLogic.handleEvent('expandedChange', { 
            expandedItems: ['item1', 'item2'],
            previousExpandedItems: [] 
        });
        
        // The logic should expand both items since multiple=true
        // Verify the final state contains both expanded items
        const calls = listener.mock.calls;
        const lastCall = calls[calls.length - 1][0];
        
        expect(lastCall.expandedItems).toEqual(['item1', 'item2']);
        expect(mockOnExpandedChange).toHaveBeenCalledWith(['item1', 'item2']);
    });
    
    it('should enforce single expansion when multiple is false', () => {
        const state = createAccordionState({
            items: [{ id: 'item1' }, { id: 'item2' }],
            multiple: false,
            onExpandedChange: mockOnExpandedChange,
            onItemToggle: mockOnItemToggle
        });
        const singleLogic = createAccordionLogic(state, {
            multiple: false,
            onExpandedChange: mockOnExpandedChange,
            onItemToggle: mockOnItemToggle
        });
        
        // Expand first item
        state.expandItem('item1');
        
        // Expand second item should collapse first
        state.expandItem('item2');
        
        const listener = vi.fn();
        state.subscribe(listener);
        state.setState((prev) => ({ ...prev }));
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            expandedItems: ['item2']
        }));
    });
    
    it('should provide correct a11y props for root', () => {
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        // Get initial state from subscription
        stateStore.setState((prev) => ({ ...prev }));
        const currentState = listener.mock.calls[0][0];
        
        const props = logic.getA11yProps('root');
        
        expect(props).toEqual({
            role: 'region',
            'aria-disabled': undefined
        });
        
        // Update state and check again
        stateStore.setDisabled(true);
        
        // Get updated state
        listener.mockClear();
        stateStore.setState((prev) => ({ ...prev }));
        const disabledState = listener.mock.calls[0][0];
        
        const updatedProps = logic.getA11yProps('root');
        expect(updatedProps).toEqual({
            role: 'region',
            'aria-disabled': 'true'
        });
    });
    
    it('should provide correct a11y props for trigger', () => {
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        // Expand item1
        stateStore.expandItem('item1');
        
        // Get current state
        listener.mockClear();
        stateStore.setState((prev) => ({ ...prev }));
        const currentState = listener.mock.calls[0][0];
        
        // The trigger a11y props returns a function that takes itemId
        const triggerPropsFunc = logic.getA11yProps('trigger');
        const triggerProps = triggerPropsFunc('item1');
        
        expect(triggerProps).toEqual({
            role: 'button',
            'aria-expanded': 'true',
            'aria-controls': 'panel-item1',
            'aria-disabled': undefined,
            tabIndex: 0,
            'data-item-id': 'item1'
        });
        
        // Check disabled item
        const disabledProps = triggerPropsFunc('item3');
        expect(disabledProps).toEqual({
            role: 'button',
            'aria-expanded': 'false',
            'aria-controls': 'panel-item3',
            'aria-disabled': 'true',
            tabIndex: -1,
            'data-item-id': 'item3'
        });
    });
    
    it('should provide interaction handlers for trigger', () => {
        const handlers = logic.getInteractionHandlers('trigger');
        
        expect(handlers).toHaveProperty('onClick');
        expect(handlers).toHaveProperty('onKeyDown');
        expect(handlers).toHaveProperty('onFocus');
        expect(handlers).toHaveProperty('onBlur');
    });
    
    it('should handle trigger click', async () => {
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        const handlers = logic.getInteractionHandlers('trigger');
        const mockEvent = new MouseEvent('click');
        Object.defineProperty(mockEvent, 'currentTarget', {
            value: { dataset: { itemId: 'item1' } } as HTMLElement,
            configurable: true
        });
        
        handlers.onClick?.(mockEvent);
        
        // Wait for next tick to allow for async callback execution
        await new Promise(resolve => setTimeout(resolve, 10));
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            expandedItems: ['item1']
        }));
        expect(mockOnItemToggle).toHaveBeenCalledWith('item1', true);
        expect(mockOnExpandedChange).toHaveBeenCalledWith(['item1']);
    });
    
    it('should not trigger click on disabled accordion', () => {
        stateStore.setDisabled(true);
        
        const handlers = logic.getInteractionHandlers('trigger');
        const mockEvent = new MouseEvent('click');
        Object.defineProperty(mockEvent, 'currentTarget', {
            value: { dataset: { itemId: 'item1' } } as HTMLElement,
            configurable: true
        });
        
        handlers.onClick?.(mockEvent);
        
        expect(mockOnItemToggle).not.toHaveBeenCalled();
        expect(mockOnExpandedChange).not.toHaveBeenCalled();
    });
    
    it('should handle item focus', () => {
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        logic.handleEvent('itemFocus', { 
            itemId: 'item1',
            event: new FocusEvent('focus') 
        });
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            focusedItem: 'item1'
        }));
    });
    
    it('should handle item blur', () => {
        // First set focus
        stateStore.setFocusedItem('item1');
        
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        logic.handleEvent('itemBlur', { 
            itemId: 'item1',
            event: new FocusEvent('blur') 
        });
        
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            focusedItem: null
        }));
    });
    
    it('should handle keyboard navigation', async () => {
        const handlers = logic.getInteractionHandlers('trigger');
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        // Test Enter key to toggle
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        Object.defineProperty(enterEvent, 'currentTarget', {
            value: { dataset: { itemId: 'item1' } } as HTMLElement,
            configurable: true
        });
        enterEvent.preventDefault = vi.fn();
        
        handlers.onKeyDown?.(enterEvent);
        
        // Wait for next tick to allow for async callback execution
        await new Promise(resolve => setTimeout(resolve, 10));
        
        expect(enterEvent.preventDefault).toHaveBeenCalled();
        expect(listener).toHaveBeenCalledWith(expect.objectContaining({
            expandedItems: ['item1']
        }));
    });
    
    it('should handle arrow key navigation', () => {
        const handlers = logic.getInteractionHandlers('trigger');
        const focusMock = vi.fn();
        
        // Mock document.querySelector to return element with focus method
        const originalQuerySelector = document.querySelector;
        document.querySelector = vi.fn(() => ({ focus: focusMock } as any));
        
        // Test ArrowDown
        const arrowDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        Object.defineProperty(arrowDownEvent, 'currentTarget', {
            value: { dataset: { itemId: 'item1' } } as HTMLElement,
            configurable: true
        });
        arrowDownEvent.preventDefault = vi.fn();
        
        handlers.onKeyDown?.(arrowDownEvent);
        
        expect(arrowDownEvent.preventDefault).toHaveBeenCalled();
        expect(document.querySelector).toHaveBeenCalledWith('[data-item-id="item2"]');
        expect(focusMock).toHaveBeenCalled();
        
        // Restore original querySelector
        document.querySelector = originalQuerySelector;
    });
    
    it('should enforce collapsible constraint', () => {
        const collapsibleLogic = createAccordionLogic(stateStore, {
            collapsible: false,
            onItemToggle: mockOnItemToggle
        });
        
        // Expand item1
        stateStore.expandItem('item1');
        
        // Try to collapse it when collapsible is false
        const handlers = collapsibleLogic.getInteractionHandlers('trigger');
        const mockEvent = new MouseEvent('click');
        Object.defineProperty(mockEvent, 'currentTarget', {
            value: { dataset: { itemId: 'item1' } } as HTMLElement,
            configurable: true
        });
        
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        handlers.onClick?.(mockEvent);
        
        // Should not collapse when it's the only expanded item and collapsible is false
        expect(listener).not.toHaveBeenCalled();
        expect(mockOnItemToggle).not.toHaveBeenCalled();
    });
});