/**
 * Select Component Logic
 * Handles interactions and business logic for the select component
 */

import { LogicLayerBuilder } from '@stellarix-ui/core';
import { generateComponentId } from '@stellarix-ui/utils';
import type { SelectState, SelectEvents, SelectOptions } from './types.js';
import type { SelectStateStore } from './state.js';

/**
 * Creates the logic layer for the select component
 */
export function createSelectLogic(
    state: SelectStateStore,
    options: SelectOptions = {}
) {
    const componentId = generateComponentId('select');
    const listboxId = `${componentId}-listbox`;
    const triggerId = `${componentId}-trigger`;

    return new LogicLayerBuilder<SelectState, SelectEvents>()
        .onEvent('change', (currentState, payload) => {
            const value = payload && 'value' in payload ? payload.value : payload;
            const option = payload && 'option' in payload ? payload.option : null;
            
            state.setValue(value);
            if (options.onChange) {
                options.onChange(value, option);
            }
            
            return null;
        })
        
        .onEvent('open', (currentState, payload) => {
            if (currentState.disabled || currentState.readonly) return null;
            
            state.setOpen(true);
            state.setHighlightedIndex(0);
            
            if (options.onOpen) {
                options.onOpen();
            }
            
            return null;
        })
        
        .onEvent('close', (currentState, payload) => {
            state.setOpen(false);
            state.setHighlightedIndex(-1);
            
            if (options.onClose) {
                options.onClose();
            }
            
            return null;
        })
        
        .onEvent('focus', (currentState, payload) => {
            const event = payload && 'event' in payload ? payload.event : payload;
            
            state.setFocused(true);
            
            if (options.onFocus && event) {
                options.onFocus(event);
            }
            
            return null;
        })
        
        .onEvent('blur', (currentState, payload) => {
            const event = payload && 'event' in payload ? payload.event : payload;
            
            state.setFocused(false);
            state.setOpen(false);
            
            if (options.onBlur && event) {
                options.onBlur(event);
            }
            
            return null;
        })
        
        .onEvent('search', (currentState, payload) => {
            const query = payload && 'query' in payload ? payload.query : payload;
            
            state.setSearchQuery(query || '');
            
            if (options.onSearch) {
                options.onSearch(query || '');
            }
            
            return null;
        })
        
        .onEvent('optionSelect', (currentState, payload) => {
            const option = payload && 'option' in payload ? payload.option : payload;
            
            if (option && !option.disabled) {
                state.selectOption(option);
                
                if (options.onChange) {
                    options.onChange(option.value, option);
                }
            }
            
            return null;
        })
        
        .onEvent('navigate', (currentState, payload) => {
            const direction = payload && 'direction' in payload ? payload.direction : payload;
            
            switch (direction) {
                case 'up':
                    state.navigateUp();
                    break;
                case 'down':
                    state.navigateDown();
                    break;
                case 'first':
                    state.navigateToFirst();
                    break;
                case 'last':
                    state.navigateToLast();
                    break;
            }
            
            return null;
        })
        
        .withA11y('trigger', (state) => ({
            role: 'combobox',
            'aria-expanded': state.open,
            'aria-haspopup': 'listbox',
            'aria-controls': state.open ? listboxId : undefined,
            'aria-activedescendant': state.open && state.highlightedIndex >= 0 
                ? `${componentId}-option-${state.highlightedIndex}`
                : undefined,
            'aria-disabled': state.disabled,
            'aria-readonly': state.readonly,
            tabIndex: state.disabled ? -1 : 0,
            id: triggerId
        }))
        
        .withA11y('listbox', (state) => ({
            role: 'listbox',
            id: listboxId,
            'aria-labelledby': triggerId,
            'aria-hidden': !state.open
        }))
        
        .withA11y('option', (state) => (index: number) => ({
            role: 'option',
            id: `${componentId}-option-${index}`,
            'aria-selected': state.filteredOptions[index]?.value === state.value,
            'aria-disabled': state.filteredOptions[index]?.disabled || false
        }))
        
        .withInteraction('trigger', 'onClick', (currentState, event) => {
            if (currentState.disabled || currentState.readonly) {
                event.preventDefault();
                return null;
            }
            
            if (currentState.open) {
                state.setOpen(false);
                return 'close';
            } else {
                state.setOpen(true);
                state.setHighlightedIndex(0);
                return 'open';
            }
        })
        
        .withInteraction('trigger', 'onKeyDown', (currentState, event) => {
            if (currentState.disabled || currentState.readonly) {
                event.preventDefault();
                return null;
            }
            
            switch (event.key) {
                case 'Enter':
                case ' ':
                    event.preventDefault();
                    if (!currentState.open) {
                        state.setOpen(true);
                        state.setHighlightedIndex(0);
                        return 'open';
                    } else {
                        const option = state.selectHighlighted();
                        if (option && options.onChange) {
                            options.onChange(option.value, option);
                        }
                        return 'optionSelect';
                    }
                    
                case 'ArrowDown':
                    event.preventDefault();
                    if (!currentState.open) {
                        state.setOpen(true);
                        state.setHighlightedIndex(0);
                        return 'open';
                    } else {
                        state.navigateDown();
                        return 'navigate';
                    }
                    
                case 'ArrowUp':
                    event.preventDefault();
                    if (!currentState.open) {
                        state.setOpen(true);
                        state.setHighlightedIndex(currentState.filteredOptions.length - 1);
                        return 'open';
                    } else {
                        state.navigateUp();
                        return 'navigate';
                    }
                    
                case 'Home':
                    if (currentState.open) {
                        event.preventDefault();
                        state.navigateToFirst();
                        return 'navigate';
                    }
                    break;
                    
                case 'End':
                    if (currentState.open) {
                        event.preventDefault();
                        state.navigateToLast();
                        return 'navigate';
                    }
                    break;
                    
                case 'Escape':
                    if (currentState.open) {
                        event.preventDefault();
                        state.setOpen(false);
                        return 'close';
                    }
                    break;
                    
                case 'Tab':
                    if (currentState.open) {
                        state.setOpen(false);
                        return 'close';
                    }
                    break;
                    
                default:
                    // Handle searchable select typing
                    if (options.searchable && event.key.length === 1) {
                        const currentQuery = currentState.searchQuery ?? '';
                        const newQuery = currentQuery + event.key;
                        state.setSearchQuery(newQuery);
                        
                        if (!currentState.open) {
                            state.setOpen(true);
                        }
                        
                        if (options.onSearch) {
                            options.onSearch(newQuery);
                        }
                        
                        return 'search';
                    }
                    break;
            }
            
            return null;
        })
        
        .withInteraction('trigger', 'onFocus', (currentState, event) => {
            state.setFocused(true);
            
            if (options.onFocus) {
                options.onFocus(event);
            }
            
            return 'focus';
        })
        
        .withInteraction('trigger', 'onBlur', (currentState, event) => {
            // Small delay to allow option selection
            setTimeout(() => {
                state.setFocused(false);
                state.setOpen(false);
                
                if (options.onBlur) {
                    options.onBlur(event);
                }
            }, 100);
            
            return 'blur';
        })
        
        .withInteraction('option', 'onClick', (currentState, event) => {
            // Index should be passed via event.currentTarget.dataset or similar
            const optionIndex = (event as any).optionIndex ?? 0;
            if (currentState.filteredOptions[optionIndex] && !currentState.filteredOptions[optionIndex].disabled) {
                const option = currentState.filteredOptions[optionIndex];
                state.selectOption(option);
                
                if (options.onChange) {
                    options.onChange(option.value, option);
                }
                
                return 'optionSelect';
            }
            
            return null;
        })
        
        .withInteraction('option', 'onMouseEnter', (currentState, event) => {
            // Index should be passed via event.currentTarget.dataset or similar  
            const optionIndex = (event as any).optionIndex ?? 0;
            if (currentState.filteredOptions[optionIndex] && !currentState.filteredOptions[optionIndex]?.disabled) {
                state.setHighlightedIndex(optionIndex);
            }
            
            return null;
        })
        
        .withInteraction('clear', 'onClick', (currentState, event) => {
            if (options.clearable && !currentState.disabled && !currentState.readonly) {
                event.stopPropagation();
                state.clearSelection();
                
                if (options.onChange) {
                    options.onChange(null, null);
                }
                
                return null;
            }
            
            return null;
        })
        
        .build();
}