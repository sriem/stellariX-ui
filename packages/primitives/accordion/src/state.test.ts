/**
 * Accordion State Tests
 * 
 * 🚨 CRITICAL: Testing Pattern Rules
 * ❌ NEVER use state.getState() for verification
 * ✅ ALWAYS use subscription pattern: state.subscribe(listener)
 * ✅ ALWAYS verify via listener calls: expect(listener).toHaveBeenCalledWith()
 * 
 * This prevents infinite loops and ensures proper reactive testing
 */

import { describe, it, expect, vi } from 'vitest';
import { createAccordionState } from './state';
import type { AccordionOptions } from './types';

describe('Accordion State', () => {
    it('should create state with default values', () => {
        const state = createAccordionState({});
        const listener = vi.fn();
        
        // Subscribe to verify initial state
        state.subscribe(listener);
        
        // Trigger a state update to see the full state structure
        state.setState((prev) => ({ ...prev }));
        
        expect(listener).toHaveBeenCalledWith({
            items: [],
            expandedItems: [],
            multiple: false,
            focusedItem: null,
            disabled: false
        });
    });
    
    it('should create state with initial options', () => {
        const options: AccordionOptions = {
            items: [
                { id: 'item1', expanded: true },
                { id: 'item2', expanded: false, disabled: true }
            ],
            multiple: true,
            disabled: false
        };
        
        const state = createAccordionState(options);
        const listener = vi.fn();
        
        // Subscribe and trigger update to verify state
        state.subscribe(listener);
        state.setState((prev) => ({ ...prev }));
        
        expect(listener).toHaveBeenCalledWith({
            items: [
                { id: 'item1', expanded: true, disabled: false },
                { id: 'item2', expanded: false, disabled: true }
            ],
            expandedItems: ['item1'],
            multiple: true,
            focusedItem: null,
            disabled: false
        });
    });
    
    it('should toggle item expansion', () => {
        const state = createAccordionState({
            items: [{ id: 'item1' }, { id: 'item2' }]
        });
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.toggleItem('item1');
        
        expect(listener).toHaveBeenLastCalledWith({
            items: [
                { id: 'item1', expanded: true, disabled: false },
                { id: 'item2', expanded: false, disabled: false }
            ],
            expandedItems: ['item1'],
            multiple: false,
            focusedItem: null,
            disabled: false
        });
    });
    
    it('should expand specific item', () => {
        const state = createAccordionState({
            items: [{ id: 'item1' }, { id: 'item2' }],
            multiple: true
        });
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.expandItem('item2');
        
        expect(listener).toHaveBeenLastCalledWith({
            items: [
                { id: 'item1', expanded: false, disabled: false },
                { id: 'item2', expanded: true, disabled: false }
            ],
            expandedItems: ['item2'],
            multiple: true,
            focusedItem: null,
            disabled: false
        });
    });
    
    it('should handle multiple expansion when multiple is true', () => {
        const state = createAccordionState({
            items: [{ id: 'item1' }, { id: 'item2' }, { id: 'item3' }],
            multiple: true
        });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        // Expand multiple items
        state.expandItem('item1');
        state.expandItem('item2');
        
        expect(listener).toHaveBeenLastCalledWith({
            items: [
                { id: 'item1', expanded: true, disabled: false },
                { id: 'item2', expanded: true, disabled: false },
                { id: 'item3', expanded: false, disabled: false }
            ],
            expandedItems: ['item1', 'item2'],
            multiple: true,
            focusedItem: null,
            disabled: false
        });
    });
    
    it('should handle single expansion when multiple is false', () => {
        const state = createAccordionState({
            items: [{ id: 'item1' }, { id: 'item2' }, { id: 'item3' }],
            multiple: false
        });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        // Expand first item
        state.expandItem('item1');
        
        // Expand second item - should collapse first
        state.expandItem('item2');
        
        expect(listener).toHaveBeenLastCalledWith({
            items: [
                { id: 'item1', expanded: false, disabled: false },
                { id: 'item2', expanded: true, disabled: false },
                { id: 'item3', expanded: false, disabled: false }
            ],
            expandedItems: ['item2'],
            multiple: false,
            focusedItem: null,
            disabled: false
        });
    });
    
    it('should collapse item', () => {
        const state = createAccordionState({
            items: [{ id: 'item1', expanded: true }]
        });
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.collapseItem('item1');
        
        expect(listener).toHaveBeenLastCalledWith({
            items: [
                { id: 'item1', expanded: false, disabled: false }
            ],
            expandedItems: [],
            multiple: false,
            focusedItem: null,
            disabled: false
        });
    });
    
    it('should expand all items when multiple is true', () => {
        const state = createAccordionState({
            items: [{ id: 'item1' }, { id: 'item2' }, { id: 'item3' }],
            multiple: true
        });
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.expandAll();
        
        expect(listener).toHaveBeenLastCalledWith({
            items: [
                { id: 'item1', expanded: true, disabled: false },
                { id: 'item2', expanded: true, disabled: false },
                { id: 'item3', expanded: true, disabled: false }
            ],
            expandedItems: ['item1', 'item2', 'item3'],
            multiple: true,
            focusedItem: null,
            disabled: false
        });
    });
    
    it('should collapse all items', () => {
        const state = createAccordionState({
            items: [
                { id: 'item1', expanded: true },
                { id: 'item2', expanded: true }
            ],
            multiple: true
        });
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.collapseAll();
        
        expect(listener).toHaveBeenLastCalledWith({
            items: [
                { id: 'item1', expanded: false, disabled: false },
                { id: 'item2', expanded: false, disabled: false }
            ],
            expandedItems: [],
            multiple: true,
            focusedItem: null,
            disabled: false
        });
    });
    
    it('should manage focus state', () => {
        const state = createAccordionState({
            items: [{ id: 'item1' }, { id: 'item2' }]
        });
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setFocusedItem('item1');
        
        expect(listener).toHaveBeenLastCalledWith({
            items: [
                { id: 'item1', expanded: false, disabled: false },
                { id: 'item2', expanded: false, disabled: false }
            ],
            expandedItems: [],
            multiple: false,
            focusedItem: 'item1',
            disabled: false
        });
    });
    
    it('should handle item disabled state', () => {
        const state = createAccordionState({
            items: [{ id: 'item1', expanded: true }]
        });
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setItemDisabled('item1', true);
        
        // Should collapse expanded item when disabling
        expect(listener).toHaveBeenLastCalledWith({
            items: [
                { id: 'item1', expanded: false, disabled: true }
            ],
            expandedItems: [],
            multiple: false,
            focusedItem: null,
            disabled: false
        });
    });
    
    it('should not expand disabled items', () => {
        const state = createAccordionState({
            items: [{ id: 'item1', disabled: true }]
        });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        // Try to expand disabled item
        state.expandItem('item1');
        
        // Verify the state hasn't changed - do a dummy update to check
        state.setState((prev) => ({ ...prev }));
        
        // Should still be collapsed
        expect(listener).toHaveBeenCalledWith({
            items: [
                { id: 'item1', expanded: false, disabled: true }
            ],
            expandedItems: [],
            multiple: false,
            focusedItem: null,
            disabled: false
        });
    });
    
    it('should support derived state for checking expansion', () => {
        const state = createAccordionState({
            items: [{ id: 'item1', expanded: true }, { id: 'item2' }]
        });
        
        const isItem1Expanded = state.isItemExpanded.get();
        const isItem2Expanded = state.isItemExpanded.get();
        
        expect(isItem1Expanded('item1')).toBe(true);
        expect(isItem2Expanded('item2')).toBe(false);
    });
});