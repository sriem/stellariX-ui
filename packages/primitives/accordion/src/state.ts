/**
 * Accordion Component State Management
 * Manages the state for the accordion component
 */

import { createComponentState } from '@stellarix/core';
import type { AccordionState, AccordionOptions, AccordionItem } from './types.js';

/**
 * Creates an accordion state store
 */
export function createAccordionState(options: AccordionOptions) {
    // Initialize items from options
    const items: AccordionItem[] = options.items?.map(item => ({
        id: item.id,
        expanded: item.expanded || options.expandedItems?.includes(item.id) || false,
        disabled: item.disabled || false
    })) || [];
    
    // Get initially expanded items
    const expandedItems = items.filter(item => item.expanded).map(item => item.id);
    
    const initialState: AccordionState = {
        items,
        expandedItems,
        multiple: options.multiple || false,
        focusedItem: null,
        disabled: options.disabled || false
    };

    const store = createComponentState('Accordion', initialState);

    // Extended API for accordion-specific state management
    return {
        ...store,
        
        // Item management
        addItem: (item: AccordionItem) => {
            store.setState((prev) => ({
                ...prev,
                items: [...prev.items, item],
                expandedItems: item.expanded 
                    ? [...prev.expandedItems, item.id]
                    : prev.expandedItems
            }));
        },
        
        removeItem: (itemId: string) => {
            store.setState((prev) => ({
                ...prev,
                items: prev.items.filter(item => item.id !== itemId),
                expandedItems: prev.expandedItems.filter(id => id !== itemId),
                focusedItem: prev.focusedItem === itemId ? null : prev.focusedItem
            }));
        },
        
        // Expansion control
        toggleItem: (itemId: string) => {
            store.setState((prev) => {
                const item = prev.items.find(i => i.id === itemId);
                if (!item || item.disabled || prev.disabled) return prev;
                
                const isExpanded = prev.expandedItems.includes(itemId);
                let newExpandedItems: string[];
                
                if (isExpanded) {
                    // Collapse
                    newExpandedItems = prev.expandedItems.filter(id => id !== itemId);
                } else {
                    // Expand
                    if (prev.multiple) {
                        newExpandedItems = [...prev.expandedItems, itemId];
                    } else {
                        newExpandedItems = [itemId];
                    }
                }
                
                // Update items array
                const newItems = prev.items.map(i => ({
                    ...i,
                    expanded: newExpandedItems.includes(i.id)
                }));
                
                return {
                    ...prev,
                    items: newItems,
                    expandedItems: newExpandedItems
                };
            });
        },
        
        expandItem: (itemId: string) => {
            store.setState((prev) => {
                const item = prev.items.find(i => i.id === itemId);
                if (!item || item.disabled || prev.disabled) return prev;
                if (prev.expandedItems.includes(itemId)) return prev;
                
                let newExpandedItems: string[];
                if (prev.multiple) {
                    newExpandedItems = [...prev.expandedItems, itemId];
                } else {
                    newExpandedItems = [itemId];
                }
                
                const newItems = prev.items.map(i => ({
                    ...i,
                    expanded: newExpandedItems.includes(i.id)
                }));
                
                return {
                    ...prev,
                    items: newItems,
                    expandedItems: newExpandedItems
                };
            });
        },
        
        collapseItem: (itemId: string) => {
            store.setState((prev) => {
                if (!prev.expandedItems.includes(itemId)) return prev;
                
                const newExpandedItems = prev.expandedItems.filter(id => id !== itemId);
                const newItems = prev.items.map(i => ({
                    ...i,
                    expanded: newExpandedItems.includes(i.id)
                }));
                
                return {
                    ...prev,
                    items: newItems,
                    expandedItems: newExpandedItems
                };
            });
        },
        
        expandAll: () => {
            store.setState((prev) => {
                if (!prev.multiple || prev.disabled) return prev;
                
                const enabledItems = prev.items.filter(item => !item.disabled);
                const newExpandedItems = enabledItems.map(item => item.id);
                const newItems = prev.items.map(item => ({
                    ...item,
                    expanded: !item.disabled
                }));
                
                return {
                    ...prev,
                    items: newItems,
                    expandedItems: newExpandedItems
                };
            });
        },
        
        collapseAll: () => {
            store.setState((prev) => ({
                ...prev,
                items: prev.items.map(item => ({ ...item, expanded: false })),
                expandedItems: []
            }));
        },
        
        // Focus management
        setFocusedItem: (itemId: string | null) => {
            store.setState((prev) => ({ ...prev, focusedItem: itemId }));
        },
        
        // Disable control
        setDisabled: (disabled: boolean) => {
            store.setState((prev) => ({ ...prev, disabled }));
        },
        
        setItemDisabled: (itemId: string, disabled: boolean) => {
            store.setState((prev) => {
                const newItems = prev.items.map(item =>
                    item.id === itemId ? { ...item, disabled } : item
                );
                
                // If disabling an expanded item, collapse it
                const newExpandedItems = disabled
                    ? prev.expandedItems.filter(id => id !== itemId)
                    : prev.expandedItems;
                
                return {
                    ...prev,
                    items: newItems,
                    expandedItems: newExpandedItems
                };
            });
        },
        
        // Computed properties
        isItemExpanded: store.derive(state => (itemId: string) => 
            state.expandedItems.includes(itemId)
        ),
        
        isItemDisabled: store.derive(state => (itemId: string) => {
            const item = state.items.find(i => i.id === itemId);
            return state.disabled || (item?.disabled ?? false);
        }),
        
        hasExpandedItems: store.derive(state => state.expandedItems.length > 0),
        
        canToggleItem: store.derive(state => (itemId: string) => {
            const item = state.items.find(i => i.id === itemId);
            return !state.disabled && item && !item.disabled;
        })
    };
}

export type AccordionStateStore = ReturnType<typeof createAccordionState>;