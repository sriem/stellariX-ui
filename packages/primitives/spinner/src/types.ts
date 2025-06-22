/**
 * Spinner Component Types
 * Define all TypeScript interfaces for the component
 */

/**
 * Spinner size variants
 */
export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Spinner component state
 * Represents the internal state of the component
 */
export interface SpinnerState {
    /**
     * Whether the spinner is currently spinning
     */
    spinning: boolean;
    
    /**
     * Current size variant
     */
    size: SpinnerSize;
    
    /**
     * Color of the spinner (CSS color value)
     */
    color?: string;
    
    /**
     * Accessible label for screen readers
     */
    label: string;
    
    /**
     * Animation speed in milliseconds
     */
    speed: number;
}

/**
 * Spinner component options
 * Configuration passed when creating the component
 */
export interface SpinnerOptions {
    /**
     * Size variant
     * @default 'md'
     */
    size?: SpinnerSize;
    
    /**
     * Color of the spinner
     * @default 'currentColor'
     */
    color?: string;
    
    /**
     * Accessible label
     * @default 'Loading...'
     */
    label?: string;
    
    /**
     * Animation speed in milliseconds
     * @default 750
     */
    speed?: number;
    
    /**
     * Whether to start spinning immediately
     * @default true
     */
    spinning?: boolean;
    
    /**
     * Additional CSS classes
     */
    className?: string;
}

/**
 * Spinner component events
 * Spinner is a visual component and doesn't emit events
 */
export interface SpinnerEvents {
    // Spinner doesn't have interactive events
}

/**
 * Spinner component props
 * Props that can be passed to the component
 */
export interface SpinnerProps extends SpinnerOptions {
    /**
     * Test ID for testing
     */
    'data-testid'?: string;
}