/**
 * Select Component
 * Ultra-generic dropdown select component with search and keyboard navigation
 */

import { createSelectState } from './state';
import { createSelectLogic } from './logic';
import type { ComponentCore } from '@stellarix-ui/core';
import type { 
    SelectState, 
    SelectEvents, 
    SelectOptions, 
    SelectHelpers 
} from './types';

/**
 * Creates a select component with helper methods
 * @param options Configuration options for the select
 * @returns Component instance with helper methods
 */
export function createSelect(
    options: SelectOptions = {}
): ComponentCore<SelectState, SelectEvents> & SelectHelpers {
    // Create state store
    const state = createSelectState(options);
    
    // Create logic layer
    const logic = createSelectLogic(state, options);
    
    // Connect logic to state
    logic.connect(state);
    logic.initialize();
    
    // Helper methods
    const helpers: SelectHelpers = {
        /**
         * Open the dropdown
         */
        open(): void {
            state.setOpen(true);
        },
        
        /**
         * Close the dropdown
         */
        close(): void {
            state.setOpen(false);
        },
        
        /**
         * Toggle the dropdown
         */
        toggle(): void {
            state.setOpen(!state.getState().open);
        },
        
        /**
         * Select an option
         */
        selectOption(value: string): void {
            const currentState = state.getState();
            const option = currentState.options.find(opt => opt.value === value);
            
            if (option && !option.disabled) {
                state.setValue(value);
                if (options.onChange) {
                    options.onChange(value, option);
                }
            }
        },
        
        /**
         * Clear the selection
         */
        clear(): void {
            state.clearSelection();
            if (options.onChange) {
                options.onChange(null, null);
            }
        },
        
        /**
         * Set search query
         */
        search(query: string): void {
            state.setSearchQuery(query);
        },
        
        /**
         * Navigate to option by index
         */
        navigateToOption(index: number): void {
            const currentState = state.getState();
            const filteredOptions = currentState.filteredOptions || currentState.options;
            
            if (index >= 0 && index < filteredOptions.length) {
                state.setHighlightedIndex(index);
            }
        },
        
        /**
         * Get the currently selected option
         */
        getSelectedOption() {
            const currentState = state.getState();
            return currentState.options.find(opt => opt.value === currentState.value) || null;
        },
        
        /**
         * Check if an option is selected
         */
        isOptionSelected(value: string): boolean {
            return state.getState().value === value;
        },
        
        /**
         * Get filtered options based on search
         */
        getFilteredOptions() {
            const currentState = state.getState();
            return currentState.filteredOptions || currentState.options;
        }
    };
    
    // Create component core
    const component: ComponentCore<SelectState, SelectEvents> & SelectHelpers = {
        state,
        logic,
        metadata: {
            name: 'Select',
            version: '0.0.1',
            accessibility: {
                role: 'combobox',
                wcagLevel: 'AA',
                patterns: ['combobox', 'listbox', 'option'],
                keyboardShortcuts: ['Enter', 'Space', 'ArrowDown', 'ArrowUp', 'Home', 'End', 'Escape', 'Tab'],
                ariaAttributes: ['aria-expanded', 'aria-haspopup', 'aria-controls', 'aria-activedescendant', 'aria-disabled', 'aria-readonly'],
            },
            events: {
                supported: ['change', 'open', 'close', 'focus', 'blur', 'search', 'optionSelect', 'navigate'],
                required: [],
                custom: {},
            },
            structure: {
                elements: {
                    root: { type: 'div', role: 'combobox', optional: false },
                    trigger: { type: 'button', role: 'button', optional: false },
                    listbox: { type: 'ul', role: 'listbox', optional: false },
                    option: { type: 'li', role: 'option', optional: false },
                    clear: { type: 'button', role: 'button', optional: true },
                },
            },
        },
        connect: function <TFrameworkComponent>(adapter: any): TFrameworkComponent {
            return adapter.createComponent(this);
        },
        destroy: () => {
            logic.cleanup();
        },
        ...helpers
    };
    
    return component;
}

// Test aliases for factory functions
export const createSelectWithImplementation = createSelect;
export const createSelectFactory = createSelect;

// Re-export types
export type {
    SelectState,
    SelectEvents,
    SelectOptions,
    SelectOption,
    SelectProps,
    SelectHelpers
} from './types';

// Re-export state and logic creators for advanced use cases
export { createSelectState } from './state';
export { createSelectLogic } from './logic';