/**
 * Dialog Component Types
 * Define all TypeScript interfaces for the component
 */

/**
 * Dialog component state
 * Represents the internal state of the component
 */
export interface DialogState {
    /**
     * Whether the dialog is currently open
     */
    open: boolean;
    
    /**
     * Element that had focus before dialog opened
     */
    previousFocus: HTMLElement | null;
    
    /**
     * Whether the dialog is in a loading state
     */
    loading: boolean;
    
    /**
     * Whether to close dialog on backdrop click
     */
    closeOnBackdropClick: boolean;
    
    /**
     * Whether to close dialog on escape key
     */
    closeOnEscape: boolean;
    
    /**
     * Whether to trap focus within dialog
     */
    focusTrap: boolean;
    
    /**
     * Whether to prevent body scroll when open
     */
    preventScroll: boolean;
    
    /**
     * Dialog role for accessibility
     */
    role: 'dialog' | 'alertdialog';
}

/**
 * Dialog component options
 * Configuration passed when creating the component
 */
export interface DialogOptions {
    /**
     * Initial open state
     * @default false
     */
    open?: boolean;
    
    /**
     * Whether to close dialog on backdrop click
     * @default true
     */
    closeOnBackdropClick?: boolean;
    
    /**
     * Whether to close dialog on escape key
     * @default true
     */
    closeOnEscape?: boolean;
    
    /**
     * Whether to trap focus within dialog
     * @default true
     */
    focusTrap?: boolean;
    
    /**
     * Whether to prevent body scroll when open
     * @default true
     */
    preventScroll?: boolean;
    
    /**
     * Dialog role for accessibility
     * @default 'dialog'
     */
    role?: 'dialog' | 'alertdialog';
    
    /**
     * ID attribute for the dialog
     */
    id?: string;
    
    /**
     * ARIA label for the dialog
     */
    ariaLabel?: string;
    
    /**
     * ID of element that labels the dialog
     */
    ariaLabelledBy?: string;
    
    /**
     * ID of element that describes the dialog
     */
    ariaDescribedBy?: string;
    
    /**
     * Callback when dialog open state changes
     */
    onOpenChange?: (open: boolean) => void;
    
    /**
     * Callback when escape key is pressed
     */
    onEscapeKeyDown?: (event: KeyboardEvent) => void;
    
    /**
     * Callback when backdrop is clicked
     */
    onBackdropClick?: (event: MouseEvent) => void;
    
    /**
     * Additional CSS classes
     */
    className?: string;
}

/**
 * Dialog component events
 * Events that can be triggered by the component
 */
export interface DialogEvents {
    /**
     * Fired when dialog open state changes
     */
    openChange: {
        open: boolean;
    };
    
    /**
     * Fired when escape key is pressed
     */
    escapeKeyDown: {
        event: KeyboardEvent;
    };
    
    /**
     * Fired when backdrop is clicked
     */
    backdropClick: {
        event: MouseEvent;
    };
}

/**
 * Dialog component props
 * Props that can be passed to the component
 */
export interface DialogProps extends DialogOptions {
    /**
     * Dialog content
     */
    children?: any;
    
    /**
     * Test ID for testing
     */
    'data-testid'?: string;
} 