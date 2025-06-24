/**
 * Select Component Types
 * Define all TypeScript interfaces for the select component
 */

/**
 * Select option interface
 */
export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
    group?: string;
}

/**
 * Select component state
 * Represents the internal state of the component
 */
export interface SelectState {
    /**
     * Currently selected value
     */
    value: string | null;
    
    /**
     * Whether the dropdown is open
     */
    open: boolean;
    
    /**
     * Whether the component has focus
     */
    focused: boolean;
    
    /**
     * Whether the component is disabled
     */
    disabled: boolean;
    
    /**
     * Whether the component is readonly
     */
    readonly: boolean;
    
    /**
     * Placeholder text when no value is selected
     */
    placeholder: string;
    
    /**
     * Available options
     */
    options: SelectOption[];
    
    /**
     * Index of currently highlighted option
     */
    highlightedIndex: number;
    
    /**
     * Current search query (for searchable selects)
     */
    searchQuery: string;
    
    /**
     * Filtered options based on search
     */
    filteredOptions: SelectOption[];
}

/**
 * Select component options
 * Configuration passed when creating the component
 */
export interface SelectOptions {
    /**
     * Initial selected value
     * @default null
     */
    value?: string | null;
    
    /**
     * Available options to select from
     * @default []
     */
    options?: SelectOption[];
    
    /**
     * Placeholder text
     * @default 'Select an option'
     */
    placeholder?: string;
    
    /**
     * Whether the component is disabled
     * @default false
     */
    disabled?: boolean;
    
    /**
     * Whether the component is readonly
     * @default false
     */
    readonly?: boolean;
    
    /**
     * Whether the select is searchable
     * @default false
     */
    searchable?: boolean;
    
    /**
     * Whether the selected value can be cleared
     * @default false
     */
    clearable?: boolean;
    
    /**
     * Whether multiple selections are allowed
     * @default false
     */
    multiple?: boolean;
    
    /**
     * Callback when selected value changes
     */
    onChange?: (value: string | null, option: SelectOption | null) => void;
    
    /**
     * Callback when component receives focus
     */
    onFocus?: (event: FocusEvent) => void;
    
    /**
     * Callback when component loses focus
     */
    onBlur?: (event: FocusEvent) => void;
    
    /**
     * Callback when search query changes
     */
    onSearch?: (query: string) => void;
    
    /**
     * Callback when dropdown opens
     */
    onOpen?: () => void;
    
    /**
     * Callback when dropdown closes
     */
    onClose?: () => void;
}

/**
 * Select component events
 * Events that can be triggered by the component
 */
export interface SelectEvents {
    /**
     * Fired when the selected value changes
     */
    change: {
        value: string | null;
        option: SelectOption | null;
    };
    
    /**
     * Fired when dropdown opens
     */
    open: null;
    
    /**
     * Fired when dropdown closes
     */
    close: null;
    
    /**
     * Fired when component receives focus
     */
    focus: {
        event: FocusEvent;
    };
    
    /**
     * Fired when component loses focus
     */
    blur: {
        event: FocusEvent;
    };
    
    /**
     * Fired when search query changes
     */
    search: {
        query: string;
    };
    
    /**
     * Fired when an option is selected
     */
    optionSelect: {
        option: SelectOption;
    };
    
    /**
     * Fired on keyboard navigation
     */
    navigate: {
        direction: 'up' | 'down' | 'first' | 'last';
        index: number;
    };
}

/**
 * Helper methods returned by createSelect
 */
export interface SelectHelpers {
    /**
     * Open the dropdown
     */
    open: () => void;
    
    /**
     * Close the dropdown
     */
    close: () => void;
    
    /**
     * Toggle the dropdown
     */
    toggle: () => void;
    
    /**
     * Select an option
     */
    selectOption: (value: string) => void;
    
    /**
     * Clear the selection
     */
    clear: () => void;
    
    /**
     * Set search query
     */
    search: (query: string) => void;
    
    /**
     * Navigate to option by index
     */
    navigateToOption: (index: number) => void;
    
    /**
     * Get the currently selected option
     */
    getSelectedOption: () => SelectOption | null;
    
    /**
     * Check if an option is selected
     */
    isOptionSelected: (value: string) => boolean;
    
    /**
     * Get filtered options based on search
     */
    getFilteredOptions: () => SelectOption[];
}

/**
 * Select component props
 * Props that can be passed to the component
 */
export interface SelectProps extends SelectOptions {
    /**
     * Additional CSS class
     */
    className?: string;
    
    /**
     * Component ID
     */
    id?: string;
    
    /**
     * ARIA label
     */
    'aria-label'?: string;
    
    /**
     * ARIA labelledby
     */
    'aria-labelledby'?: string;
    
    /**
     * ARIA describedby
     */
    'aria-describedby'?: string;
    
    /**
     * Test ID for testing
     */
    'data-testid'?: string;
}