/**
 * Input Component Types
 * Define all TypeScript interfaces for the component
 */

/**
 * Input type variants
 */
export type InputType = 'text' | 'number' | 'password' | 'email' | 'url' | 'search' | 'tel';

/**
 * Input size variants
 */
export type InputSize = 'sm' | 'md' | 'lg';

/**
 * Input component state
 * Represents the internal state of the component
 */
export interface InputState {
    /**
     * Current value of the input
     */
    value: string;
    
    /**
     * Whether the input is focused
     */
    focused: boolean;
    
    /**
     * Whether the input is disabled
     */
    disabled: boolean;
    
    /**
     * Whether the input is readonly
     */
    readonly: boolean;
    
    /**
     * Whether the input has an error
     */
    error: boolean;
    
    /**
     * Error message to display
     */
    errorMessage?: string;
    
    /**
     * Whether the input is required
     */
    required: boolean;
    
    /**
     * Input type
     */
    type: InputType;
    
    /**
     * Input size
     */
    size: InputSize;
}

/**
 * Input component options
 * Configuration passed when creating the component
 */
export interface InputOptions {
    /**
     * Initial value
     * @default ''
     */
    value?: string;
    
    /**
     * Input type
     * @default 'text'
     */
    type?: InputType;
    
    /**
     * Input size
     * @default 'md'
     */
    size?: InputSize;
    
    /**
     * Placeholder text
     */
    placeholder?: string;
    
    /**
     * Whether the input is disabled
     * @default false
     */
    disabled?: boolean;
    
    /**
     * Whether the input is readonly
     * @default false
     */
    readonly?: boolean;
    
    /**
     * Whether the input is required
     * @default false
     */
    required?: boolean;
    
    /**
     * Pattern for validation
     */
    pattern?: string;
    
    /**
     * Minimum length
     */
    minLength?: number;
    
    /**
     * Maximum length
     */
    maxLength?: number;
    
    /**
     * Minimum value (for number inputs)
     */
    min?: number | string;
    
    /**
     * Maximum value (for number inputs)
     */
    max?: number | string;
    
    /**
     * Step value (for number inputs)
     */
    step?: number | string;
    
    /**
     * Autocomplete attribute
     */
    autocomplete?: string;
    
    /**
     * Name attribute
     */
    name?: string;
    
    /**
     * ID attribute
     */
    id?: string;
    
    /**
     * Initial error state
     * @default false
     */
    error?: boolean;
    
    /**
     * Error message
     */
    errorMessage?: string;
    
    /**
     * Callback when value changes
     */
    onChange?: (value: string) => void;
    
    /**
     * Callback when input receives focus
     */
    onFocus?: (event: FocusEvent) => void;
    
    /**
     * Callback when input loses focus
     */
    onBlur?: (event: FocusEvent) => void;
    
    /**
     * Callback for input event
     */
    onInput?: (value: string) => void;
    
    /**
     * Callback for keydown event
     */
    onKeyDown?: (event: KeyboardEvent) => void;
    
    /**
     * Callback for submit event (Enter key)
     */
    onSubmit?: (value: string) => void;
}

/**
 * Input component events
 * Events that can be triggered by the component
 */
export interface InputEvents {
    /**
     * Fired when the value changes
     */
    change: {
        value: string;
        previousValue: string;
    };
    
    /**
     * Fired on input (real-time)
     */
    input: {
        value: string;
    };
    
    /**
     * Fired when input receives focus
     */
    focus: {
        event: FocusEvent;
    };
    
    /**
     * Fired when input loses focus
     */
    blur: {
        event: FocusEvent;
    };
    
    /**
     * Fired on keydown
     */
    keydown: {
        event: KeyboardEvent;
    };
    
    /**
     * Fired on Enter key press
     */
    submit: {
        value: string;
    };
}

/**
 * Input component props
 * Props that can be passed to the component
 */
export interface InputProps extends InputOptions {
    /**
     * Additional CSS class
     */
    className?: string;
    
    /**
     * Test ID for testing
     */
    'data-testid'?: string;
    
    /**
     * Prefix content
     */
    prefix?: any;
    
    /**
     * Suffix content
     */
    suffix?: any;
}