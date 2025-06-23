/**
 * Accordion Component Logic
 * Implements the business logic and behavior for the accordion component
 */

import { LogicLayerBuilder } from '@stellarix/core';
import type { AccordionState, AccordionEvents, AccordionOptions } from './types.js';
import type { AccordionStateStore } from './state.js';

export type AccordionLogic = ReturnType<typeof createAccordionLogic>;

/**
 * Creates accordion logic layer
 */
export function createAccordionLogic(
    state: AccordionStateStore,
    options: AccordionOptions = {}
) {
    const { collapsible = true } = options;
    
    return new LogicLayerBuilder<AccordionState, AccordionEvents>()
        // Handle item toggle
        .onEvent('itemToggle', (currentState, payload) => {
            const { itemId, expanded } = payload;
            
            // Check if toggle is allowed
            if (!collapsible && currentState.expandedItems.length === 1 && 
                currentState.expandedItems[0] === itemId && !expanded) {
                // Prevent collapsing the last item if not collapsible
                return null;
            }
            
            // Toggle the item
            state.toggleItem(itemId);
            
            // Call callbacks
            if (options.onItemToggle) {
                options.onItemToggle(itemId, expanded);
            }
            
            if (options.onExpandedChange) {
                // Get updated state after toggle
                let newExpandedItems: string[] = [];
                const unsubscribe = state.subscribe((newState) => {
                    newExpandedItems = newState.expandedItems;
                });
                unsubscribe();
                options.onExpandedChange(newExpandedItems);
            }
            
            return null;
        })
        
        // Handle expanded items change
        .onEvent('expandedChange', (currentState, payload) => {
            const { expandedItems } = payload;
            
            // Update state to match the new expanded items
            expandedItems.forEach(itemId => {
                if (!currentState.expandedItems.includes(itemId)) {
                    state.expandItem(itemId);
                }
            });
            
            currentState.expandedItems.forEach(itemId => {
                if (!expandedItems.includes(itemId)) {
                    state.collapseItem(itemId);
                }
            });
            
            if (options.onExpandedChange) {
                options.onExpandedChange(expandedItems);
            }
            
            return null;
        })
        
        // Handle item focus
        .onEvent('itemFocus', (currentState, payload) => {
            const { itemId } = payload;
            state.setFocusedItem(itemId);
            return null;
        })
        
        // Handle item blur
        .onEvent('itemBlur', (currentState, payload) => {
            if (currentState.focusedItem === payload.itemId) {
                state.setFocusedItem(null);
            }
            return null;
        })
        
        // Item trigger interactions (button/header)
        .withInteraction('trigger', 'onClick', (currentState, event) => {
            const itemId = event.itemId || (event.currentTarget as HTMLElement)?.dataset?.itemId;
            if (!itemId || currentState.disabled) return null;
            
            const item = currentState.items.find(i => i.id === itemId);
            if (!item || item.disabled) return null;
            
            const isExpanded = currentState.expandedItems.includes(itemId);
            
            // Check collapsible constraint
            if (!collapsible && isExpanded && currentState.expandedItems.length === 1) {
                return null;
            }
            
            state.toggleItem(itemId);
            
            if (options.onItemToggle) {
                options.onItemToggle(itemId, !isExpanded);
            }
            
            if (options.onExpandedChange) {
                // Get updated expanded items after toggle
                setTimeout(() => {
                    let newExpandedItems: string[] = [];
                    const unsubscribe = state.subscribe((newState) => {
                        newExpandedItems = newState.expandedItems;
                    });
                    unsubscribe();
                    options.onExpandedChange(newExpandedItems);
                }, 0);
            }
            
            return 'itemToggle';
        })
        
        .withInteraction('trigger', 'onKeyDown', (currentState, event) => {
            const itemId = event.itemId || (event.currentTarget as HTMLElement)?.dataset?.itemId;
            if (!itemId || currentState.disabled) return null;
            
            const currentIndex = currentState.items.findIndex(i => i.id === itemId);
            if (currentIndex === -1) return null;
            
            switch (event.key) {
                case 'Enter':
                case ' ':
                case 'Space':
                    event.preventDefault();
                    const item = currentState.items[currentIndex];
                    if (!item.disabled) {
                        const isExpanded = currentState.expandedItems.includes(itemId);
                        
                        // Check collapsible constraint
                        if (!collapsible && isExpanded && currentState.expandedItems.length === 1) {
                            return null;
                        }
                        
                        state.toggleItem(itemId);
                        
                        if (options.onItemToggle) {
                            options.onItemToggle(itemId, !isExpanded);
                        }
                        
                        if (options.onExpandedChange) {
                            // Get updated expanded items after toggle
                            setTimeout(() => {
                                let newExpandedItems: string[] = [];
                                const unsubscribe = state.subscribe((newState) => {
                                    newExpandedItems = newState.expandedItems;
                                });
                                unsubscribe();
                                options.onExpandedChange(newExpandedItems);
                            }, 0);
                        }
                        
                        return 'itemToggle';
                    }
                    break;
                    
                case 'ArrowDown':
                    event.preventDefault();
                    // Find next non-disabled item
                    for (let i = currentIndex + 1; i < currentState.items.length; i++) {
                        if (!currentState.items[i].disabled) {
                            const nextId = currentState.items[i].id;
                            state.setFocusedItem(nextId);
                            // Focus the actual element
                            const nextElement = document.querySelector(`[data-item-id="${nextId}"]`);
                            (nextElement as HTMLElement)?.focus();
                            return 'navigate';
                        }
                    }
                    break;
                    
                case 'ArrowUp':
                    event.preventDefault();
                    // Find previous non-disabled item
                    for (let i = currentIndex - 1; i >= 0; i--) {
                        if (!currentState.items[i].disabled) {
                            const prevId = currentState.items[i].id;
                            state.setFocusedItem(prevId);
                            // Focus the actual element
                            const prevElement = document.querySelector(`[data-item-id="${prevId}"]`);
                            (prevElement as HTMLElement)?.focus();
                            return 'navigate';
                        }
                    }
                    break;
                    
                case 'Home':
                    event.preventDefault();
                    // Find first non-disabled item
                    const firstItem = currentState.items.find(item => !item.disabled);
                    if (firstItem) {
                        state.setFocusedItem(firstItem.id);
                        const firstElement = document.querySelector(`[data-item-id="${firstItem.id}"]`);
                        (firstElement as HTMLElement)?.focus();
                        return 'navigate';
                    }
                    break;
                    
                case 'End':
                    event.preventDefault();
                    // Find last non-disabled item
                    const lastItem = [...currentState.items].reverse().find(item => !item.disabled);
                    if (lastItem) {
                        state.setFocusedItem(lastItem.id);
                        const lastElement = document.querySelector(`[data-item-id="${lastItem.id}"]`);
                        (lastElement as HTMLElement)?.focus();
                        return 'navigate';
                    }
                    break;
            }
            
            return null;
        })
        
        .withInteraction('trigger', 'onFocus', (currentState, event) => {
            const itemId = event.itemId || (event.currentTarget as HTMLElement)?.dataset?.itemId;
            if (itemId) {
                state.setFocusedItem(itemId);
                return 'itemFocus';
            }
            return null;
        })
        
        .withInteraction('trigger', 'onBlur', (currentState, event) => {
            const itemId = event.itemId || (event.currentTarget as HTMLElement)?.dataset?.itemId;
            if (itemId && currentState.focusedItem === itemId) {
                state.setFocusedItem(null);
                return 'itemBlur';
            }
            return null;
        })
        
        // Accessibility attributes for accordion container
        .withA11y('root', (state) => ({
            role: 'region',
            'aria-disabled': state.disabled ? 'true' : undefined
        }))
        
        // Accessibility attributes for item triggers
        .withA11y('trigger', (state) => (itemId: string) => {
            const isExpanded = state.expandedItems.includes(itemId);
            const item = state.items.find(i => i.id === itemId);
            const isDisabled = state.disabled || item?.disabled;
            
            return {
                role: 'button',
                'aria-expanded': isExpanded ? 'true' : 'false',
                'aria-controls': `panel-${itemId}`,
                'aria-disabled': isDisabled ? 'true' : undefined,
                tabIndex: isDisabled ? -1 : 0,
                'data-item-id': itemId
            };
        })
        
        // Accessibility attributes for panels
        .withA11y('panel', (state) => (itemId: string) => {
            const isExpanded = state.expandedItems.includes(itemId);
            
            return {
                id: `panel-${itemId}`,
                role: 'region',
                'aria-labelledby': `trigger-${itemId}`,
                'aria-hidden': !isExpanded ? 'true' : undefined
            };
        })
        
        .build();
}