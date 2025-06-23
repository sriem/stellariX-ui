/**
 * Select Component State Management
 * Manages the state for the select component
 */

import { createComponentState } from '@stellarix-ui/core';
import type { SelectState, SelectOptions, SelectOption } from './types.js';

/**
 * Creates a select state store
 */
export function createSelectState(options: SelectOptions) {
    const initialState: SelectState = {
        value: options.value || null,
        open: false,
        focused: false,
        disabled: options.disabled || false,
        readonly: options.readonly || false,
        placeholder: options.placeholder || 'Select an option',
        options: options.options || [],
        highlightedIndex: -1,
        searchQuery: '',
        filteredOptions: options.options || []
    };

    const store = createComponentState('Select', initialState);

    // Extended API for select-specific state management
    return {
        ...store,
        
        // Select-specific state methods
        setValue: (value: string | null) => {
            store.setState((prev) => ({ ...prev, value }));
        },
        
        setOpen: (open: boolean) => {
            store.setState((prev) => ({ ...prev, open }));
        },
        
        setFocused: (focused: boolean) => {
            store.setState((prev) => ({ ...prev, focused }));
        },
        
        setDisabled: (disabled: boolean) => {
            store.setState((prev) => ({ ...prev, disabled }));
        },
        
        setReadonly: (readonly: boolean) => {
            store.setState((prev) => ({ ...prev, readonly }));
        },
        
        setOptions: (options: SelectOption[]) => {
            store.setState((prev) => ({ 
                ...prev, 
                options,
                filteredOptions: options 
            }));
        },
        
        setHighlightedIndex: (highlightedIndex: number) => {
            store.setState((prev) => ({ ...prev, highlightedIndex }));
        },
        
        setSearchQuery: (searchQuery: string) => {
            store.setState((prev) => {
                const query = String(searchQuery || '');
                const filteredOptions = query
                    ? prev.options.filter(option =>
                        option.label.toLowerCase().includes(query.toLowerCase()) ||
                        option.value.toLowerCase().includes(query.toLowerCase())
                      )
                    : prev.options;
                    
                return {
                    ...prev, 
                    searchQuery: query,
                    filteredOptions,
                    highlightedIndex: filteredOptions.length > 0 ? 0 : -1
                };
            });
        },
        
        // Navigation methods
        navigateUp: () => {
            store.setState((prev) => {
                if (prev.filteredOptions.length === 0) return prev;
                
                const newIndex = prev.highlightedIndex > 0 
                    ? prev.highlightedIndex - 1 
                    : prev.filteredOptions.length - 1;
                    
                return { ...prev, highlightedIndex: newIndex };
            });
        },
        
        navigateDown: () => {
            store.setState((prev) => {
                if (prev.filteredOptions.length === 0) return prev;
                
                const newIndex = prev.highlightedIndex < prev.filteredOptions.length - 1
                    ? prev.highlightedIndex + 1
                    : 0;
                    
                return { ...prev, highlightedIndex: newIndex };
            });
        },
        
        navigateToFirst: () => {
            store.setState((prev) => {
                if (prev.filteredOptions.length > 0) {
                    return { ...prev, highlightedIndex: 0 };
                }
                return prev;
            });
        },
        
        navigateToLast: () => {
            store.setState((prev) => {
                if (prev.filteredOptions.length > 0) {
                    return { 
                        ...prev, 
                        highlightedIndex: prev.filteredOptions.length - 1 
                    };
                }
                return prev;
            });
        },
        
        // Selection methods
        selectOption: (option: SelectOption) => {
            store.setState((prev) => ({ 
                ...prev, 
                value: option.value,
                open: false,
                highlightedIndex: -1,
                searchQuery: '',
                filteredOptions: prev.options
            }));
        },
        
        selectHighlighted: () => {
            let selectedOption: SelectOption | null = null;
            
            store.setState((prev) => {
                if (prev.highlightedIndex >= 0 && 
                    prev.highlightedIndex < prev.filteredOptions.length) {
                    selectedOption = prev.filteredOptions[prev.highlightedIndex];
                    return { 
                        ...prev, 
                        value: selectedOption.value,
                        open: false,
                        highlightedIndex: -1,
                        searchQuery: '',
                        filteredOptions: prev.options
                    };
                }
                return prev;
            });
            
            return selectedOption;
        },
        
        clearSelection: () => {
            store.setState((prev) => ({ ...prev, value: null }));
        },
        
        // Computed properties
        isInteractive: store.derive(state => !state.disabled && !state.readonly),
        selectedOption: store.derive(state => 
            state.value ? state.options.find(opt => opt.value === state.value) || null : null
        ),
        hasValue: store.derive(state => state.value !== null),
        displayValue: store.derive(state => {
            if (state.value) {
                const option = state.options.find(opt => opt.value === state.value);
                return option ? option.label : '';
            }
            return state.searchQuery || '';
        }),
        highlightedOption: store.derive(state => 
            state.highlightedIndex >= 0 && state.highlightedIndex < state.filteredOptions.length
                ? state.filteredOptions[state.highlightedIndex]
                : null
        )
    };
}

export type SelectStateStore = ReturnType<typeof createSelectState>;