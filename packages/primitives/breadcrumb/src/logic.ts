/**
 * Breadcrumb Component Logic
 * Business logic and event handling
 * 
 * 🚨 CRITICAL WARNING: NEVER call state.getState() in this file!
 * 
 * ❌ FORBIDDEN PATTERNS:
 * - const currentState = state.getState(); // CAUSES INFINITE LOOPS!
 * - state.getState() inside event handlers
 * - state.getState() inside getA11yProps()
 * - state.getState() inside getInteractionHandlers()
 * 
 * ✅ CORRECT PATTERNS:
 * - Use (currentState, handleEvent) parameters in interactions
 * - Use (state) parameter in a11y functions
 * - Call state setters directly: state.setItems(), state.setFocusedIndex()
 * 
 * WHY: Calling state.getState() in reactive contexts creates circular dependencies
 * that cause infinite loops and crash the application.
 */

import { LogicLayerBuilder } from '@stellarix-ui/core';
import type { LogicLayer } from '@stellarix-ui/core';
import type { BreadcrumbState, BreadcrumbEvents, BreadcrumbOptions } from './types';
import type { BreadcrumbStateStore } from './state';

/**
 * Get the displayed items based on truncation settings
 */
export function getDisplayedItems(state: BreadcrumbState) {
    if (!state.maxItems || state.items.length <= state.maxItems) {
        return state.items;
    }
    
    const firstCount = Math.floor((state.maxItems - 1) / 2);
    const lastCount = state.maxItems - 1 - firstCount;
    
    const firstItems = state.items.slice(0, firstCount);
    const lastItems = state.items.slice(-lastCount);
    
    return [
        ...firstItems,
        { id: '...', label: '...', disabled: true },
        ...lastItems
    ];
}

/**
 * Get a11y props for a specific breadcrumb item
 */
export function getItemA11yProps(state: BreadcrumbState, index: number) {
    const displayedItems = getDisplayedItems(state);
    const item = displayedItems[index];
    
    return {
        role: 'listitem',
        'aria-current': item?.current ? 'page' : undefined,
        'aria-disabled': item?.disabled || state.disabled ? 'true' : undefined,
    };
}

/**
 * Get a11y props for a breadcrumb link
 */
export function getLinkA11yProps(state: BreadcrumbState, index: number) {
    const displayedItems = getDisplayedItems(state);
    const item = displayedItems[index];
    
    return {
        tabIndex: state.disabled || item?.disabled ? -1 : 0,
        'aria-disabled': state.disabled || item?.disabled ? 'true' : undefined,
        'aria-current': item?.current ? 'page' : undefined,
        href: !state.disabled && !item?.disabled && item?.href ? item.href : undefined,
        role: item?.href ? undefined : 'button',
    };
}

/**
 * Creates the breadcrumb component logic
 * @param state State store to connect to
 * @param options Component options
 * @returns Logic layer for the component
 */
export function createBreadcrumbLogic(
    state: BreadcrumbStateStore,
    options: BreadcrumbOptions = {}
): LogicLayer<BreadcrumbState, BreadcrumbEvents> {
    const logicLayer = new LogicLayerBuilder<BreadcrumbState, BreadcrumbEvents>()
        // Root navigation element
        .withA11y('root', (currentState) => ({
            role: 'navigation',
            'aria-label': options.ariaLabel || 'Breadcrumb',
            'aria-disabled': currentState.disabled ? 'true' : undefined,
        }))
        
        // List element
        .withA11y('list', () => ({
            role: 'list',
        }))
        
        // Individual breadcrumb items - generic case
        .withA11y('item', (currentState) => ({
            role: 'listitem',
        }))
        
        // Links within items - generic case  
        .withA11y('link', (currentState) => ({
            tabIndex: currentState.disabled ? -1 : 0,
        }))
        
        // Handle item click
        .withInteraction('link', 'onClick', (currentState, event: MouseEvent & { index: number }) => {
            const displayedItems = getDisplayedItems(currentState);
            const item = displayedItems[event.index];
            
            // Prevent interaction if disabled
            if (currentState.disabled || item?.disabled || item?.id === '...') {
                event.preventDefault();
                return null;
            }
            
            // If no href, prevent default to avoid navigation
            if (!item?.href) {
                event.preventDefault();
            }
            
            // Call user callback
            if (options.onItemClick && item) {
                options.onItemClick(item, event.index);
            }
            
            return null;
        })
        
        // Handle keyboard navigation
        .withInteraction('link', 'onKeyDown', (currentState, event: KeyboardEvent & { index: number }) => {
            const displayedItems = getDisplayedItems(currentState);
            
            // Prevent interaction if disabled
            if (currentState.disabled) {
                return null;
            }
            
            let newFocusIndex = event.index;
            
            switch (event.key) {
                case 'ArrowLeft':
                    event.preventDefault();
                    // Find previous non-disabled item
                    for (let i = event.index - 1; i >= 0; i--) {
                        if (!displayedItems[i]?.disabled && displayedItems[i]?.id !== '...') {
                            newFocusIndex = i;
                            break;
                        }
                    }
                    break;
                    
                case 'ArrowRight':
                    event.preventDefault();
                    // Find next non-disabled item
                    for (let i = event.index + 1; i < displayedItems.length; i++) {
                        if (!displayedItems[i]?.disabled && displayedItems[i]?.id !== '...') {
                            newFocusIndex = i;
                            break;
                        }
                    }
                    break;
                    
                case 'Home':
                    event.preventDefault();
                    // Find first non-disabled item
                    for (let i = 0; i < displayedItems.length; i++) {
                        if (!displayedItems[i]?.disabled && displayedItems[i]?.id !== '...') {
                            newFocusIndex = i;
                            break;
                        }
                    }
                    break;
                    
                case 'End':
                    event.preventDefault();
                    // Find last non-disabled item
                    for (let i = displayedItems.length - 1; i >= 0; i--) {
                        if (!displayedItems[i]?.disabled && displayedItems[i]?.id !== '...') {
                            newFocusIndex = i;
                            break;
                        }
                    }
                    break;
                    
                case 'Enter':
                case ' ':
                    // Handle activation for items without href
                    const item = displayedItems[event.index];
                    if (!item?.href && !item?.disabled && item?.id !== '...') {
                        event.preventDefault();
                        if (options.onItemClick && item) {
                            options.onItemClick(item, event.index);
                        }
                    }
                    break;
                    
                default:
                    return null;
            }
            
            // Update focus if changed
            if (newFocusIndex !== event.index) {
                state.setFocusedIndex(newFocusIndex);
                
                // Focus the element at the new index
                const linkElements = (event.target as HTMLElement)
                    .closest('[role="navigation"]')
                    ?.querySelectorAll('[role="listitem"] a, [role="listitem"] [role="button"]');
                    
                if (linkElements && linkElements[newFocusIndex]) {
                    (linkElements[newFocusIndex] as HTMLElement).focus();
                }
            }
            
            return null;
        })
        
        // Handle focus
        .withInteraction('link', 'onFocus', (currentState, event: FocusEvent & { index: number }) => {
            state.setFocusedIndex(event.index);
            return null;
        })
        
        // Handle blur
        .withInteraction('link', 'onBlur', (currentState, event: FocusEvent) => {
            // Only clear focus if we're leaving the breadcrumb entirely
            const relatedTarget = event.relatedTarget as HTMLElement;
            const breadcrumbNav = (event.target as HTMLElement).closest('[role="navigation"]');
            
            if (!breadcrumbNav?.contains(relatedTarget)) {
                state.setFocusedIndex(-1);
            }
            
            return null;
        })
        
        .build();
        
    // Extend the logic layer with custom methods that support index parameter
    const originalGetA11yProps = logicLayer.getA11yProps.bind(logicLayer);
    
    (logicLayer as any).getA11yProps = function(elementId: string, currentState?: BreadcrumbState, context?: { index?: number }) {
        // If state is passed, use it for context-aware a11y props
        if (currentState && context?.index !== undefined) {
            const displayedItems = getDisplayedItems(currentState);
            const item = displayedItems[context.index];
            
            if (elementId === 'item') {
                return {
                    role: 'listitem',
                    'aria-current': item?.current ? 'page' : undefined,
                    'aria-disabled': item?.disabled || currentState.disabled ? 'true' : undefined,
                };
            }
            
            if (elementId === 'link') {
                return {
                    tabIndex: currentState.disabled || item?.disabled ? -1 : 0,
                    'aria-disabled': currentState.disabled || item?.disabled ? 'true' : undefined,
                    'aria-current': item?.current ? 'page' : undefined,
                    href: !currentState.disabled && !item?.disabled && item?.href ? item.href : undefined,
                    role: item?.href ? undefined : 'button',
                };
            }
        }
        
        // Default behavior for other cases
        return originalGetA11yProps(elementId);
    };
    
    // Extend interaction handlers to return the actual handler functions
    const originalGetInteractionHandlers = logicLayer.getInteractionHandlers.bind(logicLayer);
    
    (logicLayer as any).getInteractionHandlers = function(elementId: string, currentState?: BreadcrumbState) {
        const handlers = originalGetInteractionHandlers(elementId);
        
        // For the link element, we need to return the actual functions
        if (elementId === 'link') {
            return {
                onClick: handlers.onClick || ((event: MouseEvent & { index: number }) => {
                    const displayedItems = getDisplayedItems(state.getState());
                    const item = displayedItems[event.index];
                    
                    // Prevent interaction if disabled
                    if (state.getState().disabled || item?.disabled || item?.id === '...') {
                        event.preventDefault();
                        return null;
                    }
                    
                    // If no href, prevent default to avoid navigation
                    if (!item?.href) {
                        event.preventDefault();
                    }
                    
                    // Call user callback
                    if (options.onItemClick && item) {
                        options.onItemClick(item, event.index);
                    }
                }),
                onKeyDown: handlers.onKeyDown || ((event: KeyboardEvent & { index: number }) => {
                    const currentState = state.getState();
                    const displayedItems = getDisplayedItems(currentState);
                    
                    // Prevent interaction if disabled
                    if (currentState.disabled) {
                        return null;
                    }
                    
                    let newFocusIndex = event.index;
                    
                    switch (event.key) {
                        case 'ArrowLeft':
                            event.preventDefault();
                            // Find previous non-disabled item
                            for (let i = event.index - 1; i >= 0; i--) {
                                if (!displayedItems[i]?.disabled && displayedItems[i]?.id !== '...') {
                                    newFocusIndex = i;
                                    break;
                                }
                            }
                            break;
                            
                        case 'ArrowRight':
                            event.preventDefault();
                            // Find next non-disabled item
                            for (let i = event.index + 1; i < displayedItems.length; i++) {
                                if (!displayedItems[i]?.disabled && displayedItems[i]?.id !== '...') {
                                    newFocusIndex = i;
                                    break;
                                }
                            }
                            break;
                            
                        case 'Home':
                            event.preventDefault();
                            // Find first non-disabled item
                            for (let i = 0; i < displayedItems.length; i++) {
                                if (!displayedItems[i]?.disabled && displayedItems[i]?.id !== '...') {
                                    newFocusIndex = i;
                                    break;
                                }
                            }
                            break;
                            
                        case 'End':
                            event.preventDefault();
                            // Find last non-disabled item
                            for (let i = displayedItems.length - 1; i >= 0; i--) {
                                if (!displayedItems[i]?.disabled && displayedItems[i]?.id !== '...') {
                                    newFocusIndex = i;
                                    break;
                                }
                            }
                            break;
                            
                        case 'Enter':
                        case ' ':
                            // Handle activation for items without href
                            const item = displayedItems[event.index];
                            if (!item?.href && !item?.disabled && item?.id !== '...') {
                                event.preventDefault();
                                if (options.onItemClick && item) {
                                    options.onItemClick(item, event.index);
                                }
                            }
                            break;
                            
                        default:
                            return null;
                    }
                    
                    // Update focus if changed
                    if (newFocusIndex !== event.index) {
                        state.setFocusedIndex(newFocusIndex);
                        
                        // Focus the element at the new index
                        const linkElements = (event.target as HTMLElement)
                            .closest('[role="navigation"]')
                            ?.querySelectorAll('[role="listitem"] a, [role="listitem"] [role="button"]');
                            
                        if (linkElements && linkElements[newFocusIndex]) {
                            (linkElements[newFocusIndex] as HTMLElement).focus();
                        }
                    }
                }),
                onFocus: handlers.onFocus || ((event: FocusEvent & { index: number }) => {
                    state.setFocusedIndex(event.index);
                }),
                onBlur: handlers.onBlur || ((event: FocusEvent) => {
                    // Only clear focus if we're leaving the breadcrumb entirely
                    const relatedTarget = event.relatedTarget as HTMLElement;
                    const breadcrumbNav = (event.target as HTMLElement).closest('[role="navigation"]');
                    
                    if (!breadcrumbNav?.contains(relatedTarget)) {
                        state.setFocusedIndex(-1);
                    }
                })
            };
        }
        
        return handlers;
    };
    
    return logicLayer;
}