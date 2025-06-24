/**
 * Pagination Component State Management
 * Ultra-generic state implementation
 */

import { createComponentState } from '@stellarix/core';
import type { PaginationState, PaginationOptions } from './types';

/**
 * Extended state store with component-specific methods
 */
export interface PaginationStateStore {
    // Core state methods
    getState: () => PaginationState;
    setState: (updater: ((prev: PaginationState) => PaginationState) | Partial<PaginationState>) => void;
    subscribe: (listener: (state: PaginationState) => void) => () => void;
    derive: <U>(selector: (state: PaginationState) => U) => {
        get: () => U;
        subscribe: (listener: (value: U) => void) => () => void;
    };
    
    // Component-specific methods
    setCurrentPage: (page: number) => void;
    setTotalItems: (total: number) => void;
    setItemsPerPage: (itemsPerPage: number) => void;
    setSiblingCount: (count: number) => void;
    setDisabled: (disabled: boolean) => void;
    goToPage: (page: number) => void;
    goToFirst: () => void;
    goToPrevious: () => void;
    goToNext: () => void;
    goToLast: () => void;
    
    // Computed properties
    canGoPrevious: () => boolean;
    canGoNext: () => boolean;
    getPageInfo: () => { startIndex: number; endIndex: number };
}

/**
 * Calculate total pages based on total items and items per page
 */
function calculateTotalPages(totalItems: number, itemsPerPage: number): number {
    return Math.ceil(totalItems / itemsPerPage) || 1;
}

/**
 * Creates the pagination component state
 * @param options Initial options
 * @returns Extended state store
 */
export function createPaginationState(options: PaginationOptions = {}): PaginationStateStore {
    // Define initial state
    const initialState: PaginationState = {
        currentPage: options.currentPage ?? 1,
        totalItems: options.totalItems ?? 0,
        itemsPerPage: options.itemsPerPage ?? 10,
        totalPages: calculateTotalPages(
            options.totalItems ?? 0,
            options.itemsPerPage ?? 10
        ),
        siblingCount: options.siblingCount ?? 1,
        disabled: options.disabled ?? false,
    };
    
    // Create the core state store
    const store = createComponentState('Pagination', initialState);
    
    // Extend with component-specific methods
    const extendedStore: PaginationStateStore = {
        ...store,
        
        // Convenience setters
        setCurrentPage: (page: number) => {
            store.setState((prev: PaginationState) => ({
                ...prev,
                currentPage: Math.max(1, Math.min(page, prev.totalPages))
            }));
        },
        
        setTotalItems: (total: number) => {
            store.setState((prev: PaginationState) => {
                const totalPages = calculateTotalPages(total, prev.itemsPerPage);
                return {
                    ...prev,
                    totalItems: total,
                    totalPages,
                    currentPage: Math.min(prev.currentPage, totalPages)
                };
            });
        },
        
        setItemsPerPage: (itemsPerPage: number) => {
            store.setState((prev: PaginationState) => {
                const totalPages = calculateTotalPages(prev.totalItems, itemsPerPage);
                return {
                    ...prev,
                    itemsPerPage,
                    totalPages,
                    currentPage: Math.min(prev.currentPage, totalPages)
                };
            });
        },
        
        setSiblingCount: (count: number) => {
            store.setState((prev: PaginationState) => ({
                ...prev,
                siblingCount: count
            }));
        },
        
        setDisabled: (disabled: boolean) => {
            store.setState((prev: PaginationState) => ({
                ...prev,
                disabled
            }));
        },
        
        // Navigation methods
        goToPage: (page: number) => {
            store.setState((prev: PaginationState) => ({
                ...prev,
                currentPage: Math.max(1, Math.min(page, prev.totalPages))
            }));
        },
        
        goToFirst: () => {
            store.setState((prev: PaginationState) => ({
                ...prev,
                currentPage: 1
            }));
        },
        
        goToPrevious: () => {
            store.setState((prev: PaginationState) => ({
                ...prev,
                currentPage: Math.max(1, prev.currentPage - 1)
            }));
        },
        
        goToNext: () => {
            store.setState((prev: PaginationState) => ({
                ...prev,
                currentPage: Math.min(prev.totalPages, prev.currentPage + 1)
            }));
        },
        
        goToLast: () => {
            store.setState((prev: PaginationState) => ({
                ...prev,
                currentPage: prev.totalPages
            }));
        },
        
        // Computed properties
        canGoPrevious: () => {
            const state = store.getState();
            return state.currentPage > 1 && !state.disabled;
        },
        
        canGoNext: () => {
            const state = store.getState();
            return state.currentPage < state.totalPages && !state.disabled;
        },
        
        getPageInfo: () => {
            const state = store.getState();
            const startIndex = (state.currentPage - 1) * state.itemsPerPage + 1;
            const endIndex = Math.min(
                state.currentPage * state.itemsPerPage,
                state.totalItems
            );
            return { startIndex, endIndex };
        },
    };
    
    return extendedStore;
}