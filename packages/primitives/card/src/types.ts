/**
 * Card Component Types
 * Define all TypeScript interfaces for the card component
 */

/**
 * Card variants
 */
export type CardVariant = 'simple' | 'outlined' | 'elevated' | 'filled';

/**
 * Card padding options
 */
export type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Card component state
 * Represents the internal state of the card
 */
export interface CardState {
    /**
     * The variant style of the card
     */
    variant: CardVariant;
    
    /**
     * Whether the card is interactive (clickable)
     */
    interactive: boolean;
    
    /**
     * Whether the card is currently hovered
     */
    hovered: boolean;
    
    /**
     * Whether the card is focused
     */
    focused: boolean;
    
    /**
     * Whether the card is selected
     */
    selected: boolean;
    
    /**
     * Whether the card is disabled
     */
    disabled: boolean;
    
    /**
     * The padding size
     */
    padding: CardPadding;
    
    /**
     * Whether the card has a header section
     */
    hasHeader: boolean;
    
    /**
     * Whether the card has a footer section
     */
    hasFooter: boolean;
    
    /**
     * Whether the card has media content
     */
    hasMedia: boolean;
}

/**
 * Card component options
 * Configuration passed when creating the card
 */
export interface CardOptions {
    /**
     * The variant style
     * @default 'simple'
     */
    variant?: CardVariant;
    
    /**
     * Whether the card is interactive
     * @default false
     */
    interactive?: boolean;
    
    /**
     * Whether the card is selected
     * @default false
     */
    selected?: boolean;
    
    /**
     * Whether the card is disabled
     * @default false
     */
    disabled?: boolean;
    
    /**
     * The padding size
     * @default 'md'
     */
    padding?: CardPadding;
    
    /**
     * Whether the card has a header
     * @default false
     */
    hasHeader?: boolean;
    
    /**
     * Whether the card has a footer
     * @default false
     */
    hasFooter?: boolean;
    
    /**
     * Whether the card has media
     * @default false
     */
    hasMedia?: boolean;
    
    /**
     * Callback when card is clicked
     */
    onClick?: (event: MouseEvent) => void;
    
    /**
     * Callback when card selection changes
     */
    onSelectionChange?: (selected: boolean) => void;
    
    /**
     * Callback when card receives focus
     */
    onFocus?: (event: FocusEvent) => void;
    
    /**
     * Callback when card loses focus
     */
    onBlur?: (event: FocusEvent) => void;
}

/**
 * Card component events
 * Events that can be triggered by the card
 */
export interface CardEvents {
    /**
     * Fired when the card is clicked
     */
    click: {
        event: MouseEvent;
    };
    
    /**
     * Fired when selection state changes
     */
    selectionChange: {
        selected: boolean;
    };
    
    /**
     * Fired when card receives focus
     */
    focus: {
        event: FocusEvent;
    };
    
    /**
     * Fired when card loses focus
     */
    blur: {
        event: FocusEvent;
    };
    
    /**
     * Fired when card is hovered
     */
    hover: {
        hovered: boolean;
    };
}

/**
 * Card component props
 * Props that can be passed to the card
 */
export interface CardProps extends CardOptions {
    /**
     * Additional CSS class
     */
    className?: string;
    
    /**
     * Additional styles
     */
    style?: React.CSSProperties;
    
    /**
     * Test ID for testing
     */
    'data-testid'?: string;
    
    /**
     * Header content
     */
    header?: React.ReactNode;
    
    /**
     * Footer content
     */
    footer?: React.ReactNode;
    
    /**
     * Media content (images, videos, etc.)
     */
    media?: React.ReactNode;
    
    /**
     * Main card content
     */
    children?: React.ReactNode;
}