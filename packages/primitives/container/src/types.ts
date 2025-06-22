/**
 * Container Component Types
 * Define all TypeScript interfaces for the component
 */

/**
 * Container size variants
 */
export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Container variant types
 */
export type ContainerVariant = 'default' | 'fluid' | 'responsive';

/**
 * Container component state
 * Represents the internal state of the component
 */
export interface ContainerState {
    /**
     * Current size variant
     */
    size: ContainerSize;
    
    /**
     * Container variant
     */
    variant: ContainerVariant;
    
    /**
     * Maximum width constraint
     */
    maxWidth?: string;
    
    /**
     * Padding inside the container
     */
    padding?: string;
}

/**
 * Container component options
 * Configuration passed when creating the component
 */
export interface ContainerOptions {
    /**
     * Size variant
     * @default 'md'
     */
    size?: ContainerSize;
    
    /**
     * Container variant
     * @default 'default'
     */
    variant?: ContainerVariant;
    
    /**
     * Custom maximum width
     * Overrides size preset
     */
    maxWidth?: string;
    
    /**
     * Custom padding
     * @default '1rem'
     */
    padding?: string;
    
    /**
     * Whether to center the container
     * @default true
     */
    center?: boolean;
    
    /**
     * Additional CSS classes
     */
    className?: string;
}

/**
 * Container component events
 * Container is a layout component and doesn't emit events
 */
export interface ContainerEvents {
    // Container doesn't have interactive events
}

/**
 * Container component props
 * Props that can be passed to the component
 */
export interface ContainerProps extends ContainerOptions {
    /**
     * Child elements to contain
     */
    children?: any;
    
    /**
     * Test ID for testing
     */
    'data-testid'?: string;
}