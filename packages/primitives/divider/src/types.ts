/**
 * Divider Component Types
 * Define all TypeScript interfaces for the component
 */

/**
 * Divider orientation
 */
export type DividerOrientation = 'horizontal' | 'vertical';

/**
 * Divider variant
 */
export type DividerVariant = 'solid' | 'dashed' | 'dotted';

/**
 * Divider label position
 */
export type DividerLabelPosition = 'start' | 'center' | 'end';

/**
 * Divider component state
 * Represents the internal state of the component
 */
export interface DividerState {
    /**
     * Orientation of the divider
     */
    orientation: DividerOrientation;
    
    /**
     * Visual variant of the divider
     */
    variant: DividerVariant;
    
    /**
     * Whether the divider has a label
     */
    hasLabel: boolean;
    
    /**
     * Position of the label (if present)
     */
    labelPosition: DividerLabelPosition;
}

/**
 * Divider component options
 * Configuration passed when creating the component
 */
export interface DividerOptions {
    /**
     * Orientation of the divider
     * @default 'horizontal'
     */
    orientation?: DividerOrientation;
    
    /**
     * Visual variant of the divider
     * @default 'solid'
     */
    variant?: DividerVariant;
    
    /**
     * Label text for the divider
     */
    label?: string;
    
    /**
     * Position of the label
     * @default 'center'
     */
    labelPosition?: DividerLabelPosition;
    
    /**
     * Custom spacing around the divider (in CSS units)
     * @default '1rem'
     */
    spacing?: string;
    
    /**
     * Custom color for the divider
     */
    color?: string;
    
    /**
     * Custom thickness for the divider (in CSS units)
     * @default '1px'
     */
    thickness?: string;
}

/**
 * Divider component events
 * Note: Divider is a presentational component and typically doesn't have events
 */
export interface DividerEvents {
    // No events for a divider component
}

/**
 * Divider component props
 * Props that can be passed to the component
 */
export interface DividerProps extends DividerOptions {
    /**
     * Additional CSS class
     */
    className?: string;
    
    /**
     * Test ID for testing
     */
    'data-testid'?: string;
    
    /**
     * ID attribute
     */
    id?: string;
}