/**
 * Popover Component Types
 * Define all TypeScript interfaces for the component
 */

/**
 * Popover placement options
 */
export type PopoverPlacement = 
    | 'top' 
    | 'top-start' 
    | 'top-end'
    | 'bottom' 
    | 'bottom-start' 
    | 'bottom-end'
    | 'left' 
    | 'left-start' 
    | 'left-end'
    | 'right' 
    | 'right-start' 
    | 'right-end'
    | 'auto' 
    | 'auto-start' 
    | 'auto-end';

/**
 * Popover component state
 * Represents the internal state of the component
 */
export interface PopoverState {
    /**
     * Whether the popover is open
     */
    open: boolean;
    
    /**
     * Current placement of the popover
     */
    placement: PopoverPlacement;
    
    /**
     * Reference to the trigger element
     */
    triggerElement: HTMLElement | null;
    
    /**
     * Reference to the popover content element
     */
    contentElement: HTMLElement | null;
    
    /**
     * Whether the popover is focused
     */
    focused: boolean;
    
    /**
     * Whether the popover is disabled
     */
    disabled: boolean;
}

/**
 * Popover component options
 * Configuration passed when creating the component
 */
export interface PopoverOptions {
    /**
     * Initial open state
     * @default false
     */
    open?: boolean;
    
    /**
     * Preferred placement of the popover
     * @default 'bottom'
     */
    placement?: PopoverPlacement;
    
    /**
     * Whether the popover is disabled
     * @default false
     */
    disabled?: boolean;
    
    /**
     * Offset from the trigger element in pixels
     * @default 8
     */
    offset?: number;
    
    /**
     * Whether to close on click outside
     * @default true
     */
    closeOnClickOutside?: boolean;
    
    /**
     * Whether to close on escape key
     * @default true
     */
    closeOnEscape?: boolean;
    
    /**
     * ID attribute for the popover
     */
    id?: string;
    
    /**
     * Callback when open state changes
     */
    onOpenChange?: (open: boolean) => void;
    
    /**
     * Callback when placement changes (due to auto-positioning)
     */
    onPlacementChange?: (placement: PopoverPlacement) => void;
    
    /**
     * Additional CSS classes
     */
    className?: string;
}

/**
 * Popover component events
 * Events that can be triggered by the component
 */
export interface PopoverEvents {
    /**
     * Fired when the open state changes
     */
    openChange: {
        open: boolean;
        source: 'trigger' | 'escape' | 'outside-click' | 'api';
    };
    
    /**
     * Fired when placement changes
     */
    placementChange: {
        placement: PopoverPlacement;
        previousPlacement: PopoverPlacement;
    };
    
    /**
     * Fired when popover receives focus
     */
    focus: {
        event: FocusEvent;
    };
    
    /**
     * Fired when popover loses focus
     */
    blur: {
        event: FocusEvent;
    };
    
    /**
     * Fired when escape key is pressed
     */
    escape: {
        event: KeyboardEvent;
    };
    
    /**
     * Fired when clicked outside
     */
    outsideClick: {
        event: MouseEvent;
    };
}

/**
 * Popover component props
 * Props that can be passed to the component
 */
export interface PopoverProps extends PopoverOptions {
    /**
     * Content to display in the popover
     */
    children?: any;
    
    /**
     * Test ID for testing
     */
    'data-testid'?: string;
}

/**
 * Position calculation result
 */
export interface PopoverPosition {
    top: number;
    left: number;
    actualPlacement: PopoverPlacement;
}