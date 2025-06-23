/**
 * Menu State Tests
 * Tests for state management following proven patterns
 */

import { describe, it, expect, vi } from 'vitest';
import { createMenuState } from './state';
import type { MenuItem } from './types';

describe('createMenuState', () => {
    it('should create state with default values', () => {
        const state = createMenuState();
        const initialState = state.getState();
        
        expect(initialState.open).toBe(false);
        expect(initialState.activeIndex).toBe(-1);
        expect(initialState.items).toEqual([]);
        expect(initialState.searchQuery).toBe('');
        expect(initialState.focused).toBe(false);
        expect(initialState.selectedId).toBeUndefined();
        expect(initialState.submenuStack).toEqual([]);
    });
    
    it('should create state with custom initial values', () => {
        const items: MenuItem[] = [
            { id: '1', label: 'Item 1' },
            { id: '2', label: 'Item 2' }
        ];
        
        const state = createMenuState({
            open: true,
            items
        });
        
        const initialState = state.getState();
        expect(initialState.open).toBe(true);
        expect(initialState.items).toEqual(items);
    });
    
    it('should update open state and notify subscribers', () => {
        const state = createMenuState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setOpen(true);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ open: true })
        );
    });
    
    it('should update active index', () => {
        const state = createMenuState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setActiveIndex(2);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ activeIndex: 2 })
        );
    });
    
    it('should update items', () => {
        const state = createMenuState();
        const listener = vi.fn();
        const items: MenuItem[] = [
            { id: '1', label: 'New Item' }
        ];
        
        state.subscribe(listener);
        state.setItems(items);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ items })
        );
    });
    
    it('should update search query with timestamp', () => {
        const state = createMenuState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setSearchQuery('test');
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ 
                searchQuery: 'test',
                searchTimeout: expect.any(Number)
            })
        );
    });
    
    it('should manage submenu stack', () => {
        const state = createMenuState();
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        // Push submenu
        state.pushSubmenu('item1');
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ 
                submenuStack: ['item1'],
                activeIndex: -1
            })
        );
        
        // Push another
        state.pushSubmenu('item2');
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ 
                submenuStack: ['item1', 'item2'],
                activeIndex: -1
            })
        );
        
        // Pop submenu
        state.popSubmenu();
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ 
                submenuStack: ['item1'],
                activeIndex: -1
            })
        );
        
        // Clear all
        state.clearSubmenuStack();
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ 
                submenuStack: [],
                activeIndex: -1
            })
        );
    });
    
    it('should navigate through items', () => {
        const items: MenuItem[] = [
            { id: '1', label: 'Item 1' },
            { id: '2', label: 'Item 2', disabled: true },
            { id: '3', label: 'Item 3' }
        ];
        
        const state = createMenuState({ items });
        const listener = vi.fn();
        state.subscribe(listener);
        
        // Navigate down - should skip disabled
        state.navigateDown();
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ activeIndex: 0 })
        );
        
        // Navigate down again - should skip index 1 (disabled)
        state.navigateDown();
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ activeIndex: 2 })
        );
        
        // Navigate up - should skip disabled
        state.navigateUp();
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ activeIndex: 0 })
        );
    });
    
    it('should navigate to first and last enabled items', () => {
        const items: MenuItem[] = [
            { id: '1', label: 'Item 1', disabled: true },
            { id: '2', label: 'Item 2' },
            { id: '3', label: 'Item 3' },
            { id: '4', label: 'Item 4', disabled: true }
        ];
        
        const state = createMenuState({ items });
        const listener = vi.fn();
        state.subscribe(listener);
        
        // Navigate to first - should skip disabled
        state.navigateToFirst();
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ activeIndex: 1 })
        );
        
        // Navigate to last - should skip disabled
        state.navigateToLast();
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ activeIndex: 2 })
        );
    });
    
    it('should get current items based on submenu stack', () => {
        const items: MenuItem[] = [
            { 
                id: '1', 
                label: 'Item 1',
                items: [
                    { id: '1.1', label: 'Subitem 1' },
                    { id: '1.2', label: 'Subitem 2' }
                ]
            },
            { id: '2', label: 'Item 2' }
        ];
        
        const state = createMenuState({ items });
        
        // Initially should return root items
        expect(state.getCurrentItems()).toEqual(items);
        
        // After entering submenu
        state.pushSubmenu('1');
        expect(state.getCurrentItems()).toEqual(items[0].items);
    });
    
    it('should get active item', () => {
        const items: MenuItem[] = [
            { id: '1', label: 'Item 1' },
            { id: '2', label: 'Item 2' }
        ];
        
        const state = createMenuState({ items });
        
        // No active item initially
        expect(state.getActiveItem()).toBeUndefined();
        
        // Set active index
        state.setActiveIndex(1);
        expect(state.getActiveItem()).toEqual(items[1]);
    });
    
    it('should check if in submenu', () => {
        const state = createMenuState();
        
        expect(state.isInSubmenu()).toBe(false);
        
        state.pushSubmenu('item1');
        expect(state.isInSubmenu()).toBe(true);
        
        state.clearSubmenuStack();
        expect(state.isInSubmenu()).toBe(false);
    });
    
    it('should handle all disabled items gracefully', () => {
        const items: MenuItem[] = [
            { id: '1', label: 'Item 1', disabled: true },
            { id: '2', label: 'Item 2', disabled: true }
        ];
        
        const state = createMenuState({ items });
        const listener = vi.fn();
        state.subscribe(listener);
        
        // Should not change activeIndex if all disabled
        state.navigateDown();
        expect(listener).not.toHaveBeenCalled();
        
        state.navigateToFirst();
        expect(listener).not.toHaveBeenCalled();
    });
});