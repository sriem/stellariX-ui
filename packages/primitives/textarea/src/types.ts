/**
 * Textarea Component Types
 * Multi-line text input component
 */

/**
 * Textarea variants
 */
export type TextareaVariant = 'fixed' | 'autogrow';

/**
 * Textarea resize options
 */
export type TextareaResize = 'none' | 'horizontal' | 'vertical' | 'both';

/**
 * Textarea component state
 */
export interface TextareaState {
    /**
     * Current value of the textarea
     */
    value: string;
    
    /**
     * Whether the textarea is focused
     */
    focused: boolean;
    
    /**
     * Whether the textarea is disabled
     */
    disabled: boolean;
    
    /**
     * Whether the textarea is readonly
     */
    readonly: boolean;
    
    /**
     * Whether the textarea has an error
     */
    error: boolean;
    
    /**
     * Current number of rows (for autogrow)
     */
    rows: number;
    
    /**
     * Minimum number of rows
     */
    minRows: number;
    
    /**
     * Maximum number of rows
     */
    maxRows: number;
}

/**
 * Textarea component options
 */
export interface TextareaOptions {
    /**
     * Initial value
     * @default ''
     */
    value?: string;
    
    /**
     * Textarea variant
     * @default 'fixed'
     */
    variant?: TextareaVariant;
    
    /**
     * Number of visible text rows (for fixed variant)
     * @default 4
     */
    rows?: number;
    
    /**
     * Minimum rows (for autogrow variant)
     * @default 2
     */
    minRows?: number;
    
    /**
     * Maximum rows (for autogrow variant)
     * @default 10
     */
    maxRows?: number;
    
    /**
     * Whether the textarea is disabled
     * @default false
     */
    disabled?: boolean;
    
    /**
     * Whether the textarea is readonly
     * @default false
     */
    readonly?: boolean;
    
    /**
     * Whether the textarea has an error
     * @default false
     */
    error?: boolean;
    
    /**
     * Placeholder text
     */
    placeholder?: string;
    
    /**
     * Maximum length of input
     */
    maxLength?: number;
    
    /**
     * Whether the textarea is required
     * @default false
     */
    required?: boolean;
    
    /**
     * Resize behavior
     * @default 'vertical'
     */
    resize?: TextareaResize;
    
    /**
     * Callback when value changes
     */
    onChange?: (value: string) => void;
    
    /**
     * Callback when focus state changes
     */
    onFocus?: () => void;
    
    /**
     * Callback when blur occurs
     */
    onBlur?: () => void;
}

/**
 * Textarea component events
 */
export interface TextareaEvents {
    /**
     * Fired when the value changes
     */
    change: {
        value: string;
    };
    
    /**
     * Fired when textarea receives focus
     */
    focus: void;
    
    /**
     * Fired when textarea loses focus
     */
    blur: void;
    
    /**
     * Fired on input (for autogrow calculations)
     */
    input: {
        value: string;
    };
}

/**
 * Textarea component props
 */
export interface TextareaProps extends TextareaOptions {
    /**
     * Additional CSS class
     */
    className?: string;
    
    /**
     * Test ID for testing
     */
    'data-testid'?: string;
    
    /**
     * Name attribute for form submission
     */
    name?: string;
    
    /**
     * ID attribute
     */
    id?: string;
}