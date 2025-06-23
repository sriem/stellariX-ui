/**
 * Badge Component Types
 * Define all TypeScript interfaces for the badge component
 */

/**
 * Badge variants
 */
export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

/**
 * Badge types
 */
export type BadgeType = 'numeric' | 'dot' | 'status';

/**
 * Badge component state
 * Represents the internal state of the badge
 */
export interface BadgeState {
    /**
     * The variant/color of the badge
     */
    variant: BadgeVariant;
    
    /**
     * The type of badge
     */
    type: BadgeType;
    
    /**
     * The content/value of the badge
     */
    content: string | number;
    
    /**
     * Whether the badge is visible
     */
    visible: boolean;
    
    /**
     * Maximum value for numeric badges (shows 99+ or similar)
     */
    max?: number;
    
    /**
     * Whether to show the badge when content is 0
     */
    showZero: boolean;
}

/**
 * Badge component options
 * Configuration passed when creating the badge
 */
export interface BadgeOptions {
    /**
     * The variant/color of the badge
     * @default 'default'
     */
    variant?: BadgeVariant;
    
    /**
     * The type of badge
     * @default 'numeric'
     */
    type?: BadgeType;
    
    /**
     * The content/value of the badge
     * @default ''
     */
    content?: string | number;
    
    /**
     * Whether the badge is visible
     * @default true
     */
    visible?: boolean;
    
    /**
     * Maximum value for numeric badges
     * @default 99
     */
    max?: number;
    
    /**
     * Whether to show the badge when content is 0
     * @default false
     */
    showZero?: boolean;
    
    /**
     * Callback when visibility changes
     */
    onVisibilityChange?: (visible: boolean) => void;
    
    /**
     * Callback when content changes
     */
    onContentChange?: (content: string | number) => void;
}

/**
 * Badge component events
 * Events that can be triggered by the badge
 */
export interface BadgeEvents {
    /**
     * Fired when the content changes
     */
    contentChange: {
        content: string | number;
        previousContent: string | number;
    };
    
    /**
     * Fired when visibility changes
     */
    visibilityChange: {
        visible: boolean;
    };
}

/**
 * Badge component props
 * Props that can be passed to the badge
 */
export interface BadgeProps extends BadgeOptions {
    /**
     * Additional CSS class
     */
    className?: string;
    
    /**
     * Test ID for testing
     */
    'data-testid'?: string;
    
    /**
     * Children content (for wrapping other components)
     */
    children?: React.ReactNode;
}