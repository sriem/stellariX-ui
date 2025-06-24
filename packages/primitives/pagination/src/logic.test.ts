/**
 * Pagination Logic Tests
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
import { createPaginationLogic, getPageNumbers } from './logic';
import { createPaginationState } from './state';
import type { PaginationOptions } from './types';

describe('Pagination Logic', () => {
    let stateStore: ReturnType<typeof createPaginationState>;
    let logic: ReturnType<typeof createPaginationLogic>;
    let mockOnPageChange: ReturnType<typeof vi.fn>;
    let mockOnItemsPerPageChange: ReturnType<typeof vi.fn>;
    
    beforeEach(() => {
        mockOnPageChange = vi.fn();
        mockOnItemsPerPageChange = vi.fn();
        
        const options: PaginationOptions = {
            onPageChange: mockOnPageChange,
            onItemsPerPageChange: mockOnItemsPerPageChange,
            totalItems: 100,
            itemsPerPage: 10,
        };
        
        stateStore = createPaginationState(options);
        logic = createPaginationLogic(stateStore, options);
        
        // Connect logic to state
        logic.connect(stateStore);
        logic.initialize();
    });
    
    it('should handle pageChange events', () => {
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        logic.handleEvent('pageChange', { page: 5 });
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ currentPage: 5 })
        );
        expect(mockOnPageChange).toHaveBeenCalledWith(5);
    });
    
    it('should handle pageChange with direct number payload', () => {
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        logic.handleEvent('pageChange', 3);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ currentPage: 3 })
        );
        expect(mockOnPageChange).toHaveBeenCalledWith(3);
    });
    
    it('should clamp pageChange to valid bounds', () => {
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        // Beyond max
        logic.handleEvent('pageChange', { page: 20 });
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ currentPage: 10 }) // 100 items / 10 per page
        );
        
        // Below min
        listener.mockClear();
        mockOnPageChange.mockClear();
        logic.handleEvent('pageChange', { page: 0 });
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ currentPage: 1 })
        );
        expect(mockOnPageChange).toHaveBeenCalledWith(1);
    });
    
    it('should handle itemsPerPageChange events', () => {
        const listener = vi.fn();
        stateStore.subscribe(listener);
        
        logic.handleEvent('itemsPerPageChange', { itemsPerPage: 20 });
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ itemsPerPage: 20 })
        );
        expect(mockOnItemsPerPageChange).toHaveBeenCalledWith(20);
    });
    
    it('should handle navigate events', () => {
        const listener = vi.fn();
        stateStore.subscribe(listener);
        stateStore.setCurrentPage(5);
        listener.mockClear();
        
        // Navigate to first
        logic.handleEvent('navigate', { direction: 'first' });
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ currentPage: 1 })
        );
        expect(mockOnPageChange).toHaveBeenCalledWith(1);
        
        // Navigate to last
        listener.mockClear();
        mockOnPageChange.mockClear();
        logic.handleEvent('navigate', { direction: 'last' });
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ currentPage: 10 })
        );
        
        // Navigate previous
        stateStore.setCurrentPage(5);
        listener.mockClear();
        mockOnPageChange.mockClear();
        logic.handleEvent('navigate', { direction: 'previous' });
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ currentPage: 4 })
        );
        
        // Navigate next
        listener.mockClear();
        mockOnPageChange.mockClear();
        logic.handleEvent('navigate', { direction: 'next' });
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ currentPage: 5 })
        );
        
        // Navigate to specific page
        listener.mockClear();
        mockOnPageChange.mockClear();
        logic.handleEvent('navigate', { direction: 'page', page: 7 });
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ currentPage: 7 })
        );
    });
    
    it('should provide correct a11y props for navigation', () => {
        const props = logic.getA11yProps('root');
        
        expect(props).toEqual({
            'role': 'navigation',
            'aria-label': 'Pagination Navigation',
        });
    });
    
    it('should provide correct a11y props for buttons', () => {
        // First button - disabled at page 1
        const firstProps = logic.getA11yProps('firstButton');
        expect(firstProps).toEqual({
            'aria-label': 'Go to first page',
            'aria-disabled': 'true',
            'tabIndex': -1,
        });
        
        // Previous button - disabled at page 1
        const prevProps = logic.getA11yProps('previousButton');
        expect(prevProps).toEqual({
            'aria-label': 'Go to previous page',
            'aria-disabled': 'true',
            'tabIndex': -1,
        });
        
        // Move to page 5
        stateStore.setCurrentPage(5);
        
        // Now buttons should be enabled
        const firstPropsEnabled = logic.getA11yProps('firstButton');
        expect(firstPropsEnabled).toEqual({
            'aria-label': 'Go to first page',
            'aria-disabled': undefined,
            'tabIndex': 0,
        });
        
        // Next button
        const nextProps = logic.getA11yProps('nextButton');
        expect(nextProps).toEqual({
            'aria-label': 'Go to next page',
            'aria-disabled': undefined,
            'tabIndex': 0,
        });
        
        // Last button - disabled at last page
        stateStore.setCurrentPage(10);
        const lastProps = logic.getA11yProps('lastButton');
        expect(lastProps).toEqual({
            'aria-label': 'Go to last page',
            'aria-disabled': 'true',
            'tabIndex': -1,
        });
    });
    
    it('should provide interaction handlers', () => {
        const handlers = logic.getInteractionHandlers('previousButton');
        
        expect(handlers).toHaveProperty('onClick');
        
        // Test onClick when not disabled
        stateStore.setCurrentPage(5);
        const mockEvent = new MouseEvent('click', { cancelable: true });
        const preventDefaultSpy = vi.spyOn(mockEvent, 'preventDefault');
        
        handlers.onClick(mockEvent);
        
        expect(preventDefaultSpy).not.toHaveBeenCalled();
        expect(mockOnPageChange).toHaveBeenCalledWith(4);
    });
    
    it('should prevent interaction when disabled', () => {
        stateStore.setDisabled(true);
        
        const handlers = logic.getInteractionHandlers('nextButton');
        const mockEvent = new MouseEvent('click', { cancelable: true });
        const preventDefaultSpy = vi.spyOn(mockEvent, 'preventDefault');
        
        handlers.onClick(mockEvent);
        
        expect(preventDefaultSpy).toHaveBeenCalled();
        expect(mockOnPageChange).not.toHaveBeenCalled();
    });
    
    it('should handle keyboard navigation', () => {
        const handlers = logic.getInteractionHandlers('root');
        stateStore.setCurrentPage(5);
        
        // ArrowLeft
        const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true });
        const leftPreventDefault = vi.spyOn(leftEvent, 'preventDefault');
        handlers.onKeyDown(leftEvent);
        
        expect(leftPreventDefault).toHaveBeenCalled();
        expect(mockOnPageChange).toHaveBeenCalledWith(4);
        
        // ArrowRight
        mockOnPageChange.mockClear();
        const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true });
        const rightPreventDefault = vi.spyOn(rightEvent, 'preventDefault');
        handlers.onKeyDown(rightEvent);
        
        expect(rightPreventDefault).toHaveBeenCalled();
        expect(mockOnPageChange).toHaveBeenCalledWith(5);
        
        // Home
        mockOnPageChange.mockClear();
        const homeEvent = new KeyboardEvent('keydown', { key: 'Home', cancelable: true });
        const homePreventDefault = vi.spyOn(homeEvent, 'preventDefault');
        handlers.onKeyDown(homeEvent);
        
        expect(homePreventDefault).toHaveBeenCalled();
        expect(mockOnPageChange).toHaveBeenCalledWith(1);
        
        // End
        mockOnPageChange.mockClear();
        stateStore.setCurrentPage(1);
        const endEvent = new KeyboardEvent('keydown', { key: 'End', cancelable: true });
        const endPreventDefault = vi.spyOn(endEvent, 'preventDefault');
        handlers.onKeyDown(endEvent);
        
        expect(endPreventDefault).toHaveBeenCalled();
        expect(mockOnPageChange).toHaveBeenCalledWith(10);
    });
    
    it('should not navigate beyond bounds with keyboard', () => {
        stateStore.setCurrentPage(1);
        
        const handlers = logic.getInteractionHandlers('root');
        const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true });
        handlers.onKeyDown(leftEvent);
        
        expect(mockOnPageChange).not.toHaveBeenCalled();
        
        // At last page
        stateStore.setCurrentPage(10);
        const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true });
        handlers.onKeyDown(rightEvent);
        
        expect(mockOnPageChange).not.toHaveBeenCalled();
    });
});

describe('getPageNumbers helper', () => {
    it('should show all pages when total is small', () => {
        const pages = getPageNumbers(3, 5, 1);
        expect(pages).toEqual([1, 2, 3, 4, 5]);
    });
    
    it('should show ellipsis for many pages', () => {
        const pages = getPageNumbers(5, 10, 1);
        expect(pages).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]);
    });
    
    it('should handle edge cases at start', () => {
        const pages = getPageNumbers(1, 10, 1);
        expect(pages).toEqual([1, 2, 'ellipsis', 10]);
        
        const pages2 = getPageNumbers(2, 10, 1);
        expect(pages2).toEqual([1, 2, 3, 'ellipsis', 10]);
    });
    
    it('should handle edge cases at end', () => {
        const pages = getPageNumbers(10, 10, 1);
        expect(pages).toEqual([1, 'ellipsis', 9, 10]);
        
        const pages2 = getPageNumbers(9, 10, 1);
        expect(pages2).toEqual([1, 'ellipsis', 8, 9, 10]);
    });
    
    it('should handle different sibling counts', () => {
        const pages = getPageNumbers(5, 20, 2);
        expect(pages).toEqual([1, 'ellipsis', 3, 4, 5, 6, 7, 'ellipsis', 20]);
        
        const pages2 = getPageNumbers(10, 20, 3);
        expect(pages2).toEqual([1, 'ellipsis', 7, 8, 9, 10, 11, 12, 13, 'ellipsis', 20]);
    });
    
    it('should handle single page', () => {
        const pages = getPageNumbers(1, 1, 1);
        expect(pages).toEqual([1]);
    });
});