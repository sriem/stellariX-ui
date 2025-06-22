/**
 * Checkbox Component Types
 * Define all TypeScript interfaces for the component
 */

/**
 * Checkbox checked state
 */
export type CheckboxCheckedState = boolean | 'indeterminate';

/**
 * Checkbox component state
 * Represents the internal state of the component
 */
export interface CheckboxState {
    /**
     * Whether the checkbox is checked, unchecked, or indeterminate
     */
    checked: CheckboxCheckedState;
    
    /**
     * Whether the checkbox is disabled
     */
    disabled: boolean;
    
    /**
     * Whether the checkbox is focused
     */
    focused: boolean;
    
    /**
     * Whether the checkbox is required
     */
    required: boolean;
    
    /**
     * Whether the checkbox has an error state
     */
    error: boolean;
    
    /**
     * Error message to display
     */
    errorMessage?: string;
}

/**
 * Checkbox component options
 * Configuration passed when creating the component
 */
export interface CheckboxOptions {
    /**
     * Initial checked state
     * @default false
     */
    checked?: CheckboxCheckedState;
    
    /**
     * Whether the checkbox is disabled
     * @default false
     */
    disabled?: boolean;
    
    /**
     * Whether the checkbox is required
     * @default false
     */
    required?: boolean;
    
    /**
     * Name attribute for form submission
     */
    name?: string;
    
    /**
     * Value attribute for form submission
     */
    value?: string;
    
    /**
     * ID attribute for the checkbox
     */
    id?: string;
    
    /**
     * Callback when checked state changes
     */
    onChange?: (checked: CheckboxCheckedState) => void;
    
    /**
     * Callback when focus state changes
     */
    onFocus?: (event: FocusEvent) => void;
    
    /**
     * Callback when blur event occurs
     */
    onBlur?: (event: FocusEvent) => void;
    
    /**
     * Additional CSS classes
     */
    className?: string;
}

/**
 * Checkbox component events
 * Events that can be triggered by the component
 */
export interface CheckboxEvents {
    /**
     * Fired when the checked state changes
     */
    change: {
        checked: CheckboxCheckedState;
        previousChecked: CheckboxCheckedState;
    };
    
    /**
     * Fired when checkbox receives focus
     */
    focus: {
        event: FocusEvent;
    };
    
    /**
     * Fired when checkbox loses focus
     */
    blur: {
        event: FocusEvent;
    };
    
    /**
     * Fired when space key is pressed
     */
    keydown: {
        event: KeyboardEvent;
    };
}

/**
 * Checkbox component props
 * Props that can be passed to the component
 */
export interface CheckboxProps extends CheckboxOptions {
    /**
     * Label text for the checkbox
     */
    children?: any;
    
    /**
     * Test ID for testing
     */
    'data-testid'?: string;
}