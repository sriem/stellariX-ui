/**
 * Template Component Types
 * Define all TypeScript interfaces for the component
 */

/**
 * Template component state
 * Represents the internal state of the component
 */
export interface TemplateState {
    /**
     * Example: Whether the component is active
     */
    active: boolean;
    
    /**
     * Example: Current value
     */
    value: string;
    
    /**
     * Example: Whether the component is disabled
     */
    disabled: boolean;
}

/**
 * Template component options
 * Configuration passed when creating the component
 */
export interface TemplateOptions {
    /**
     * Initial active state
     * @default false
     */
    active?: boolean;
    
    /**
     * Initial value
     * @default ''
     */
    value?: string;
    
    /**
     * Whether the component is disabled
     * @default false
     */
    disabled?: boolean;
    
    /**
     * Callback when value changes
     */
    onChange?: (value: string) => void;
    
    /**
     * Callback when active state changes
     */
    onActiveChange?: (active: boolean) => void;
}

/**
 * Template component events
 * Events that can be triggered by the component
 */
export interface TemplateEvents {
    /**
     * Fired when the value changes
     */
    change: {
        value: string;
        previousValue: string;
    };
    
    /**
     * Fired when active state changes
     */
    activeChange: {
        active: boolean;
    };
    
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
}

/**
 * Template component props
 * Props that can be passed to the component
 */
export interface TemplateProps extends TemplateOptions {
    /**
     * Additional CSS class
     */
    className?: string;
    
    /**
     * Test ID for testing
     */
    'data-testid'?: string;
}