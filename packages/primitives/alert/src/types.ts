/**
 * Alert Component Types
 * Define all TypeScript interfaces for the alert component
 */

/**
 * Alert variants
 */
export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

/**
 * Alert component state
 * Represents the internal state of the alert
 */
export interface AlertState {
    /**
     * Whether the alert is visible
     */
    visible: boolean;
    
    /**
     * The variant/type of the alert
     */
    variant: AlertVariant;
    
    /**
     * Whether the alert can be dismissed
     */
    dismissible: boolean;
    
    /**
     * Whether the alert is currently being dismissed
     */
    dismissing: boolean;
    
    /**
     * The alert message
     */
    message: string;
    
    /**
     * Optional title for the alert
     */
    title?: string;
    
    /**
     * Whether to show an icon
     */
    showIcon: boolean;
}

/**
 * Alert component options
 * Configuration passed when creating the alert
 */
export interface AlertOptions {
    /**
     * The variant/type of the alert
     * @default 'info'
     */
    variant?: AlertVariant;
    
    /**
     * Whether the alert can be dismissed
     * @default false
     */
    dismissible?: boolean;
    
    /**
     * The alert message
     */
    message?: string;
    
    /**
     * Optional title for the alert
     */
    title?: string;
    
    /**
     * Whether to show an icon
     * @default true
     */
    showIcon?: boolean;
    
    /**
     * Whether the alert is initially visible
     * @default true
     */
    visible?: boolean;
    
    /**
     * Callback when the alert is dismissed
     */
    onDismiss?: () => void;
    
    /**
     * Callback when visibility changes
     */
    onVisibilityChange?: (visible: boolean) => void;
    
    /**
     * Auto-dismiss after milliseconds (0 = no auto-dismiss)
     * @default 0
     */
    autoClose?: number;
}

/**
 * Alert component events
 * Events that can be triggered by the alert
 */
export interface AlertEvents {
    /**
     * Fired when the alert is dismissed
     */
    dismiss: {
        reason: 'user' | 'auto';
    };
    
    /**
     * Fired when visibility changes
     */
    visibilityChange: {
        visible: boolean;
    };
    
    /**
     * Fired when a close button is clicked
     */
    close: {
        event: MouseEvent;
    };
}

/**
 * Alert component props
 * Props that can be passed to the alert
 */
export interface AlertProps extends AlertOptions {
    /**
     * Additional CSS class
     */
    className?: string;
    
    /**
     * Test ID for testing
     */
    'data-testid'?: string;
    
    /**
     * Children content to display in the alert
     */
    children?: React.ReactNode;
}