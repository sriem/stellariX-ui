/**
 * Radio Component Types
 * Define all TypeScript interfaces for the component
 */

/**
 * Radio component state
 * Represents the internal state of the component
 */
export interface RadioState {
    /**
     * Whether the radio is checked
     */
    checked: boolean;
    
    /**
     * Whether the radio is disabled
     */
    disabled: boolean;
    
    /**
     * Whether the radio is focused
     */
    focused: boolean;
    
    /**
     * Whether the radio is required
     */
    required: boolean;
    
    /**
     * Whether the radio has an error state
     */
    error: boolean;
    
    /**
     * Error message to display
     */
    errorMessage?: string;
    
    /**
     * The value of this radio option
     */
    value: string;
    
    /**
     * The name attribute for radio group
     */
    name: string;
}

/**
 * Radio component options
 * Configuration passed when creating the component
 */
export interface RadioOptions {
    /**
     * Initial checked state
     * @default false
     */
    checked?: boolean;
    
    /**
     * Whether the radio is disabled
     * @default false
     */
    disabled?: boolean;
    
    /**
     * Whether the radio is required
     * @default false
     */
    required?: boolean;
    
    /**
     * Name attribute for radio group (required for radio functionality)
     */
    name: string;
    
    /**
     * Value attribute for this radio option (required)
     */
    value: string;
    
    /**
     * ID attribute for the radio
     */
    id?: string;
    
    /**
     * Callback when checked state changes
     */
    onChange?: (checked: boolean, value: string) => void;
    
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
 * Radio component events
 * Events that can be triggered by the component
 */
export interface RadioEvents {
    /**
     * Fired when the checked state changes
     */
    change: {
        checked: boolean;
        value: string;
        previousChecked: boolean;
    };
    
    /**
     * Fired when radio receives focus
     */
    focus: {
        event: FocusEvent;
    };
    
    /**
     * Fired when radio loses focus
     */
    blur: {
        event: FocusEvent;
    };
    
    /**
     * Fired when arrow keys are pressed for group navigation
     */
    keydown: {
        event: KeyboardEvent;
    };
}

/**
 * Radio component props
 * Props that can be passed to the component
 */
export interface RadioProps extends RadioOptions {
    /**
     * Label text for the radio
     */
    children?: any;
    
    /**
     * Test ID for testing
     */
    'data-testid'?: string;
}