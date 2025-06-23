/**
 * Toggle Component Types
 * Define all TypeScript interfaces for the toggle/switch component
 */

/**
 * Toggle component state
 * Represents the internal state of the toggle switch
 */
export interface ToggleState {
    /**
     * Whether the toggle is checked (on)
     */
    checked: boolean;
    
    /**
     * Whether the toggle has focus
     */
    focused: boolean;
    
    /**
     * Whether the toggle is disabled
     */
    disabled: boolean;
}

/**
 * Toggle component options
 * Configuration passed when creating the toggle
 */
export interface ToggleOptions {
    /**
     * Initial checked state
     * @default false
     */
    checked?: boolean;
    
    /**
     * Whether the toggle is disabled
     * @default false
     */
    disabled?: boolean;
    
    /**
     * Size variant
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg';
    
    /**
     * Optional label text
     */
    label?: string;
    
    /**
     * Callback when checked state changes
     */
    onChange?: (checked: boolean) => void;
    
    /**
     * Callback when toggle receives focus
     */
    onFocus?: (event: FocusEvent) => void;
    
    /**
     * Callback when toggle loses focus
     */
    onBlur?: (event: FocusEvent) => void;
}

/**
 * Toggle component events
 * Events that can be triggered by the toggle
 */
export interface ToggleEvents {
    /**
     * Fired when the checked state changes
     */
    change: {
        checked: boolean;
        previousChecked: boolean;
    };
    
    /**
     * Fired when toggle receives focus
     */
    focus: {
        event: FocusEvent;
    };
    
    /**
     * Fired when toggle loses focus
     */
    blur: {
        event: FocusEvent;
    };
}

/**
 * Toggle component props
 * Props that can be passed to the toggle
 */
export interface ToggleProps extends ToggleOptions {
    /**
     * Additional CSS class
     */
    className?: string;
    
    /**
     * Test ID for testing
     */
    'data-testid'?: string;
}