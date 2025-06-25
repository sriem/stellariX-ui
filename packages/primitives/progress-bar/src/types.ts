/**
 * ProgressBar Component Types
 * Define all TypeScript interfaces for the component
 */

/**
 * ProgressBar component state
 * Represents the internal state of the component
 */
export interface ProgressBarState {
    /**
     * Current progress value (0-100 or 0-max)
     */
    value: number;
    
    /**
     * Maximum value for the progress
     * @default 100
     */
    max: number;
    
    /**
     * Visual variant of the progress bar
     */
    variant: 'default' | 'success' | 'warning' | 'error' | 'info';
    
    /**
     * Whether to show the percentage label
     */
    showLabel: boolean;
    
    /**
     * Whether the progress is indeterminate (loading state)
     */
    isIndeterminate: boolean;
    
    /**
     * Whether the progress bar is disabled
     */
    disabled: boolean;
}

/**
 * ProgressBar component options
 * Configuration passed when creating the component
 */
export interface ProgressBarOptions {
    /**
     * Initial progress value
     * @default 0
     */
    value?: number;
    
    /**
     * Maximum value for the progress
     * @default 100
     */
    max?: number;
    
    /**
     * Visual variant of the progress bar
     * @default 'default'
     */
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
    
    /**
     * Whether to show the percentage label
     * @default false
     */
    showLabel?: boolean;
    
    /**
     * Whether the progress is indeterminate
     * @default false
     */
    isIndeterminate?: boolean;
    
    /**
     * Whether the component is disabled
     * @default false
     */
    disabled?: boolean;
    
    /**
     * Callback when progress reaches 100%
     */
    onComplete?: () => void;
    
    /**
     * Callback when value changes
     */
    onChange?: (value: number, percentage: number) => void;
}

/**
 * ProgressBar component events
 * Events that can be triggered by the component
 */
export interface ProgressBarEvents {
    /**
     * Fired when the value changes
     */
    change: {
        value: number;
        percentage: number;
        previousValue: number;
    };
    
    /**
     * Fired when progress reaches 100%
     */
    complete: {
        value: number;
        max: number;
    };
    
    /**
     * Fired when variant changes
     */
    variantChange: {
        variant: 'default' | 'success' | 'warning' | 'error' | 'info';
        previousVariant: 'default' | 'success' | 'warning' | 'error' | 'info';
    };
}

/**
 * ProgressBar component props
 * Props that can be passed to the component
 */
export interface ProgressBarProps extends ProgressBarOptions {
    /**
     * Additional CSS class
     */
    className?: string;
    
    /**
     * Test ID for testing
     */
    'data-testid'?: string;
    
    /**
     * Custom label format function
     */
    formatLabel?: (value: number, percentage: number) => string;
}