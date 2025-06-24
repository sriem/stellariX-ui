/**
 * Pagination Component Logic
 * Business logic and event handling
 * 
 * 🚨🚨🚨 ULTRA-CRITICAL WARNING: NEVER call state.getState() in this file!
 * 
 * ❌❌❌ FORBIDDEN PATTERNS - WILL CAUSE INFINITE LOOPS:
 * - const currentState = state.getState(); // 🚨 INFINITE LOOP!
 * - state.getState() inside withInteraction callbacks // 🚨 INFINITE LOOP!
 * - state.getState() inside onEvent handlers // 🚨 INFINITE LOOP!
 * - state.getState() inside withA11y functions // 🚨 INFINITE LOOP!
 * - using createComponentLogic (causes complex circular deps)
 * 
 * ✅✅✅ CORRECT PATTERNS - LEARNED FROM CHECKBOX SUCCESS:
 * - Use LogicLayerBuilder pattern for clean implementation
 * - Use (currentState, event) parameters in withInteraction callbacks
 * - Use (state) parameter in withA11y functions
 * - Handle event payload extraction: const event = payload?.event ? payload.event : payload
 * - Support both direct events and wrapped { event } payloads
 * - Call state setters directly: state.setValue(), state.setActive()
 * - Test via callbacks, not state inspection
 * 
 * WHY: Calling state.getState() in reactive contexts creates circular dependencies
 * that cause infinite loops and crash the application. This has been proven 8+ times.
 * 
 * PROVEN WORKING PATTERN (Checkbox component - 30/30 tests passing):
 */

import { LogicLayerBuilder } from '@stellarix-ui/core';
import type { LogicLayer } from '@stellarix-ui/core';
import type { PaginationState, PaginationEvents, PaginationOptions, PageInfo } from './types';
import type { PaginationStateStore } from './state';

/**
 * Calculate page numbers to display with ellipsis
 */
export function getPageNumbers(
    currentPage: number,
    totalPages: number,
    siblingCount: number
): (number | 'ellipsis')[] {
    const totalNumbers = siblingCount * 2 + 5; // siblings + current + first/last + 2 ellipsis
    
    if (totalNumbers >= totalPages) {
        // Show all pages
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    
    const shouldShowLeftEllipsis = leftSiblingIndex > 2;
    const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;
    
    const pages: (number | 'ellipsis')[] = [];
    
    // Always show first page
    pages.push(1);
    
    // Add left ellipsis
    if (shouldShowLeftEllipsis) {
        pages.push('ellipsis');
    }
    
    // Add sibling pages
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        if (i !== 1 && i !== totalPages) {
            pages.push(i);
        }
    }
    
    // Add right ellipsis
    if (shouldShowRightEllipsis) {
        pages.push('ellipsis');
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1) {
        pages.push(totalPages);
    }
    
    return pages;
}

/**
 * Creates the pagination component logic using proven LogicLayerBuilder pattern
 * @param state State store to connect to
 * @param options Component options
 * @returns Logic layer for the component
 */
export function createPaginationLogic(
    state: PaginationStateStore,
    options: PaginationOptions = {}
): LogicLayer<PaginationState, PaginationEvents> {
    return new LogicLayerBuilder<PaginationState, PaginationEvents>()
        .onEvent('pageChange', (currentState, payload: any) => {
            // Extract page from payload
            let newPage = currentState.currentPage;
            if (payload && typeof payload === 'object' && 'page' in payload) {
                newPage = payload.page;
            } else if (typeof payload === 'number') {
                newPage = payload;
            }
            
            // Validate page bounds
            newPage = Math.max(1, Math.min(newPage, currentState.totalPages));
            
            // Update state
            state.setCurrentPage(newPage);
            
            // Call user callback if provided
            if (options.onPageChange) {
                options.onPageChange(newPage);
            }
            return null;
        })
        .onEvent('itemsPerPageChange', (currentState, payload: any) => {
            // Extract items per page from payload
            let newItemsPerPage = currentState.itemsPerPage;
            if (payload && typeof payload === 'object' && 'itemsPerPage' in payload) {
                newItemsPerPage = payload.itemsPerPage;
            } else if (typeof payload === 'number') {
                newItemsPerPage = payload;
            }
            
            // Update state
            state.setItemsPerPage(newItemsPerPage);
            
            // Call user callback if provided
            if (options.onItemsPerPageChange) {
                options.onItemsPerPageChange(newItemsPerPage);
            }
            return null;
        })
        .onEvent('navigate', (currentState, payload: any) => {
            // Extract direction and page from payload
            const direction = payload?.direction || 'page';
            let targetPage = currentState.currentPage;
            
            switch (direction) {
                case 'first':
                    targetPage = 1;
                    break;
                case 'previous':
                    targetPage = Math.max(1, currentState.currentPage - 1);
                    break;
                case 'next':
                    targetPage = Math.min(currentState.totalPages, currentState.currentPage + 1);
                    break;
                case 'last':
                    targetPage = currentState.totalPages;
                    break;
                case 'page':
                    targetPage = payload?.page || currentState.currentPage;
                    break;
            }
            
            // Update state
            state.setCurrentPage(targetPage);
            
            // Call user callback if provided
            if (options.onPageChange) {
                options.onPageChange(targetPage);
            }
            return null;
        })
        .withA11y('root', (state) => ({
            'role': 'navigation',
            'aria-label': 'Pagination Navigation',
        }))
        .withA11y('firstButton', (state) => ({
            'aria-label': 'Go to first page',
            'aria-disabled': state.currentPage === 1 || state.disabled ? 'true' : undefined,
            'tabIndex': state.currentPage === 1 || state.disabled ? -1 : 0,
        }))
        .withA11y('previousButton', (state) => ({
            'aria-label': 'Go to previous page',
            'aria-disabled': state.currentPage === 1 || state.disabled ? 'true' : undefined,
            'tabIndex': state.currentPage === 1 || state.disabled ? -1 : 0,
        }))
        .withA11y('nextButton', (state) => ({
            'aria-label': 'Go to next page',
            'aria-disabled': state.currentPage === state.totalPages || state.disabled ? 'true' : undefined,
            'tabIndex': state.currentPage === state.totalPages || state.disabled ? -1 : 0,
        }))
        .withA11y('lastButton', (state) => ({
            'aria-label': 'Go to last page',
            'aria-disabled': state.currentPage === state.totalPages || state.disabled ? 'true' : undefined,
            'tabIndex': state.currentPage === state.totalPages || state.disabled ? -1 : 0,
        }))
        .withA11y('pageButton', (state) => ({
            'aria-label': (page: number) => `Go to page ${page}`,
            'aria-current': (page: number) => page === state.currentPage ? 'page' : undefined,
            'tabIndex': state.disabled ? -1 : 0,
        }))
        .withA11y('pageInfo', (state) => {
            const startIndex = (state.currentPage - 1) * state.itemsPerPage + 1;
            const endIndex = Math.min(
                state.currentPage * state.itemsPerPage,
                state.totalItems
            );
            return {
                'aria-label': `Showing ${startIndex} to ${endIndex} of ${state.totalItems} items`,
                'aria-live': 'polite',
            };
        })
        .withInteraction('firstButton', 'onClick', (currentState, event: MouseEvent) => {
            if (currentState.disabled || currentState.currentPage === 1) {
                event.preventDefault();
                return null;
            }
            state.goToFirst();
            return 'navigate';
        })
        .withInteraction('previousButton', 'onClick', (currentState, event: MouseEvent) => {
            if (currentState.disabled || currentState.currentPage === 1) {
                event.preventDefault();
                return null;
            }
            state.goToPrevious();
            return 'navigate';
        })
        .withInteraction('nextButton', 'onClick', (currentState, event: MouseEvent) => {
            if (currentState.disabled || currentState.currentPage === currentState.totalPages) {
                event.preventDefault();
                return null;
            }
            state.goToNext();
            return 'navigate';
        })
        .withInteraction('lastButton', 'onClick', (currentState, event: MouseEvent) => {
            if (currentState.disabled || currentState.currentPage === currentState.totalPages) {
                event.preventDefault();
                return null;
            }
            state.goToLast();
            return 'navigate';
        })
        .withInteraction('pageButton', 'onClick', (currentState, event: MouseEvent, page?: number) => {
            if (currentState.disabled || !page || page === currentState.currentPage) {
                event.preventDefault();
                return null;
            }
            state.goToPage(page);
            return 'navigate';
        })
        .withInteraction('root', 'onKeyDown', (currentState, event: KeyboardEvent) => {
            if (currentState.disabled) {
                return null;
            }
            
            switch (event.key) {
                case 'ArrowLeft':
                    event.preventDefault();
                    if (currentState.currentPage > 1) {
                        state.goToPrevious();
                        return 'navigate';
                    }
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    if (currentState.currentPage < currentState.totalPages) {
                        state.goToNext();
                        return 'navigate';
                    }
                    break;
                case 'Home':
                    event.preventDefault();
                    if (currentState.currentPage !== 1) {
                        state.goToFirst();
                        return 'navigate';
                    }
                    break;
                case 'End':
                    event.preventDefault();
                    if (currentState.currentPage !== currentState.totalPages) {
                        state.goToLast();
                        return 'navigate';
                    }
                    break;
            }
            return null;
        })
        .build();
}