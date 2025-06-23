/**
 * Avatar Component Types
 * Define all TypeScript interfaces for the avatar component
 */

/**
 * Avatar variants/types
 */
export type AvatarVariant = 'image' | 'initials' | 'icon' | 'placeholder';

/**
 * Avatar sizes
 */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Avatar shape
 */
export type AvatarShape = 'circle' | 'square';

/**
 * Avatar component state
 * Represents the internal state of the avatar
 */
export interface AvatarState {
    /**
     * The variant type of the avatar
     */
    variant: AvatarVariant;
    
    /**
     * The source URL for image avatars
     */
    src?: string;
    
    /**
     * Alternative text for the image
     */
    alt: string;
    
    /**
     * The name to generate initials from
     */
    name?: string;
    
    /**
     * Custom initials to display
     */
    initials?: string;
    
    /**
     * Icon content for icon variant
     */
    icon?: string;
    
    /**
     * The size of the avatar
     */
    size: AvatarSize;
    
    /**
     * The shape of the avatar
     */
    shape: AvatarShape;
    
    /**
     * Whether the image is loading
     */
    loading: boolean;
    
    /**
     * Whether the image failed to load
     */
    error: boolean;
    
    /**
     * Whether to show a badge
     */
    showBadge: boolean;
}

/**
 * Avatar component options
 * Configuration passed when creating the avatar
 */
export interface AvatarOptions {
    /**
     * The variant type of the avatar
     * @default 'placeholder'
     */
    variant?: AvatarVariant;
    
    /**
     * The source URL for image avatars
     */
    src?: string;
    
    /**
     * Alternative text for the image
     * @default ''
     */
    alt?: string;
    
    /**
     * The name to generate initials from
     */
    name?: string;
    
    /**
     * Custom initials to display (overrides name)
     */
    initials?: string;
    
    /**
     * Icon content for icon variant
     */
    icon?: string;
    
    /**
     * The size of the avatar
     * @default 'md'
     */
    size?: AvatarSize;
    
    /**
     * The shape of the avatar
     * @default 'circle'
     */
    shape?: AvatarShape;
    
    /**
     * Whether to show a badge
     * @default false
     */
    showBadge?: boolean;
    
    /**
     * Callback when image loads successfully
     */
    onLoad?: () => void;
    
    /**
     * Callback when image fails to load
     */
    onError?: () => void;
}

/**
 * Avatar component events
 * Events that can be triggered by the avatar
 */
export interface AvatarEvents {
    /**
     * Fired when the image loads successfully
     */
    load: {
        src: string;
    };
    
    /**
     * Fired when the image fails to load
     */
    error: {
        src: string;
        error: Error;
    };
    
    /**
     * Fired when avatar is clicked
     */
    click: {
        event: MouseEvent;
    };
}

/**
 * Avatar component props
 * Props that can be passed to the avatar
 */
export interface AvatarProps extends AvatarOptions {
    /**
     * Additional CSS class
     */
    className?: string;
    
    /**
     * Test ID for testing
     */
    'data-testid'?: string;
    
    /**
     * Badge content to display
     */
    badge?: React.ReactNode;
    
    /**
     * Click handler
     */
    onClick?: (event: MouseEvent) => void;
}