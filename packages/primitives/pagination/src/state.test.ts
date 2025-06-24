/**
 * Pagination State Tests
 * 
 * 🚨 CRITICAL: Testing Pattern Rules
 * ❌ NEVER use state.getState() for verification
 * ✅ ALWAYS use subscription pattern: state.subscribe(listener)
 * ✅ ALWAYS verify via listener calls: expect(listener).toHaveBeenCalledWith()
 * 
 * This prevents infinite loops and ensures proper reactive testing
 */

import { describe, it, expect, vi } from 'vitest';
import { createPaginationState } from './state';
import type { PaginationOptions } from './types';

describe('Pagination State', () => {
    it('should create state with default values', () => {
        const state = createPaginationState();
        const listener = vi.fn();
        
        // Subscribe to verify initial state
        state.subscribe(listener);
        
        // Trigger an update to see the full state
        state.setCurrentPage(1); // Same as default
        
        // Verify the state update contains expected values
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({
                currentPage: 1,
                totalItems: 0,
                itemsPerPage: 10,
                totalPages: 1,
                siblingCount: 1,
                disabled: false
            })
        );
    });
    
    it('should create state with initial options', () => {
        const options: PaginationOptions = {
            currentPage: 3,
            totalItems: 100,
            itemsPerPage: 20,
            siblingCount: 2,
            disabled: true,
        };
        
        const state = createPaginationState(options);
        const listener = vi.fn();
        
        // Subscribe and trigger update to verify state
        state.subscribe(listener);
        state.setCurrentPage(3); // Same as initial
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({
                currentPage: 3,
                totalItems: 100,
                itemsPerPage: 20,
                totalPages: 5, // 100 / 20
                siblingCount: 2,
                disabled: true
            })
        );
    });
    
    it('should update current page within bounds', () => {
        const state = createPaginationState({ totalItems: 50, itemsPerPage: 10 });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        // Valid page
        state.setCurrentPage(3);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ currentPage: 3 })
        );
        
        // Beyond bounds - should clamp to max
        listener.mockClear();
        state.setCurrentPage(10);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ currentPage: 5 }) // 50 items / 10 per page = 5 pages
        );
        
        // Below bounds - should clamp to min
        listener.mockClear();
        state.setCurrentPage(0);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ currentPage: 1 })
        );
    });
    
    it('should update total items and recalculate pages', () => {
        const state = createPaginationState({ itemsPerPage: 10 });
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setTotalItems(55);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({
                totalItems: 55,
                totalPages: 6 // Math.ceil(55 / 10)
            })
        );
    });
    
    it('should update items per page and recalculate', () => {
        const state = createPaginationState({ totalItems: 100, currentPage: 5 });
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setItemsPerPage(20);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({
                itemsPerPage: 20,
                totalPages: 5, // 100 / 20
                currentPage: 5 // Should maintain current page if still valid
            })
        );
        
        // Test when current page becomes invalid
        listener.mockClear();
        state.setItemsPerPage(50);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({
                itemsPerPage: 50,
                totalPages: 2, // 100 / 50
                currentPage: 2 // Clamped from 5 to 2
            })
        );
    });
    
    it('should navigate to specific pages', () => {
        const state = createPaginationState({ totalItems: 50, itemsPerPage: 10 });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.goToPage(3);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ currentPage: 3 })
        );
        
        // Test bounds
        listener.mockClear();
        state.goToPage(10);
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ currentPage: 5 })
        );
    });
    
    it('should navigate to first/last pages', () => {
        const state = createPaginationState({ 
            totalItems: 50, 
            itemsPerPage: 10,
            currentPage: 3 
        });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.goToFirst();
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ currentPage: 1 })
        );
        
        listener.mockClear();
        state.goToLast();
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ currentPage: 5 })
        );
    });
    
    it('should navigate to previous/next pages', () => {
        const state = createPaginationState({ 
            totalItems: 50, 
            itemsPerPage: 10,
            currentPage: 3 
        });
        const listener = vi.fn();
        
        state.subscribe(listener);
        
        state.goToPrevious();
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ currentPage: 2 })
        );
        
        listener.mockClear();
        state.goToNext();
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ currentPage: 3 })
        );
        
        // Test bounds
        state.goToFirst();
        listener.mockClear();
        state.goToPrevious();
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({ currentPage: 1 }) // Should stay at 1
        );
    });
    
    it('should compute canGoPrevious correctly', () => {
        const state = createPaginationState({ totalItems: 50, itemsPerPage: 10 });
        
        state.setCurrentPage(1);
        expect(state.canGoPrevious()).toBe(false);
        
        state.setCurrentPage(2);
        expect(state.canGoPrevious()).toBe(true);
        
        // Test with disabled
        state.setDisabled(true);
        expect(state.canGoPrevious()).toBe(false);
    });
    
    it('should compute canGoNext correctly', () => {
        const state = createPaginationState({ totalItems: 50, itemsPerPage: 10 });
        
        state.setCurrentPage(5);
        expect(state.canGoNext()).toBe(false);
        
        state.setCurrentPage(4);
        expect(state.canGoNext()).toBe(true);
        
        // Test with disabled
        state.setDisabled(true);
        expect(state.canGoNext()).toBe(false);
    });
    
    it('should compute page info correctly', () => {
        const state = createPaginationState({ 
            totalItems: 55, 
            itemsPerPage: 10,
            currentPage: 3 
        });
        
        const pageInfo = state.getPageInfo();
        expect(pageInfo).toEqual({
            startIndex: 21, // (3-1) * 10 + 1
            endIndex: 30    // 3 * 10
        });
        
        // Last page
        state.setCurrentPage(6);
        const lastPageInfo = state.getPageInfo();
        expect(lastPageInfo).toEqual({
            startIndex: 51, // (6-1) * 10 + 1
            endIndex: 55    // Math.min(6 * 10, 55)
        });
    });
    
    it('should handle edge case with zero items', () => {
        const state = createPaginationState({ totalItems: 0, itemsPerPage: 10 });
        const listener = vi.fn();
        
        state.subscribe(listener);
        state.setCurrentPage(1);
        
        expect(listener).toHaveBeenCalledWith(
            expect.objectContaining({
                currentPage: 1,
                totalPages: 1, // Should be 1 even with 0 items
                totalItems: 0
            })
        );
        
        const pageInfo = state.getPageInfo();
        expect(pageInfo).toEqual({
            startIndex: 1,
            endIndex: 0 // No items
        });
    });
    
    it('should support derived state', () => {
        const state = createPaginationState({ totalItems: 50, itemsPerPage: 10 });
        const derivedPageLabel = state.derive(s => `Page ${s.currentPage} of ${s.totalPages}`);
        const listener = vi.fn();
        
        derivedPageLabel.subscribe(listener);
        
        state.setCurrentPage(3);
        
        expect(derivedPageLabel.get()).toBe('Page 3 of 5');
        expect(listener).toHaveBeenCalledWith('Page 3 of 5');
    });
});