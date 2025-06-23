/**
 * Tooltip Component Types
 * Define all TypeScript interfaces for the component
 */

/**
 * Tooltip placement options
 */
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

/**
 * Tooltip component state
 * Represents the internal state of the component
 */
export interface TooltipState {
    /**
     * Whether the tooltip is visible
     */
    visible: boolean;
    
    /**
     * Tooltip placement relative to trigger
     */
    placement: TooltipPlacement;
    
    /**
     * Content to display in the tooltip
     */
    content: string | null;
    
    /**
     * Whether the tooltip is focused
     */
    focused: boolean;
    
    /**
     * Whether the tooltip is disabled
     */
    disabled: boolean;
    
    /**
     * Current position coordinates
     */
    position: {
        x: number;
        y: number;
    } | null;
}

/**
 * Tooltip component options
 * Configuration passed when creating the component
 */
export interface TooltipOptions {
    /**
     * Initial content for the tooltip
     */
    content?: string;
    
    /**
     * Placement of the tooltip
     * @default 'top'
     */
    placement?: TooltipPlacement;
    
    /**
     * Delay in ms before showing tooltip
     * @default 200
     */
    showDelay?: number;
    
    /**
     * Delay in ms before hiding tooltip
     * @default 0
     */
    hideDelay?: number;
    
    /**
     * Whether the tooltip is disabled
     * @default false
     */
    disabled?: boolean;
    
    /**
     * ID attribute for the tooltip
     */
    id?: string;
    
    /**
     * Offset from trigger element in pixels
     * @default 8
     */
    offset?: number;
    
    /**
     * Whether tooltip is controlled externally
     * @default false
     */
    controlled?: boolean;
    
    /**
     * Visible state when controlled
     */
    visible?: boolean;
    
    /**
     * Callback when visibility changes
     */
    onVisibilityChange?: (visible: boolean) => void;
    
    /**
     * Additional CSS classes
     */
    className?: string;
}

/**
 * Tooltip component events
 * Events that can be triggered by the component
 */
export interface TooltipEvents {
    /**
     * Fired when tooltip visibility changes
     */
    visibilityChange: {
        visible: boolean;
    };
    
    /**
     * Fired when trigger receives focus
     */
    focus: {
        event: FocusEvent;
    };
    
    /**
     * Fired when trigger loses focus
     */
    blur: {
        event: FocusEvent;
    };
    
    /**
     * Fired when mouse enters trigger
     */
    mouseenter: {
        event: MouseEvent;
    };
    
    /**
     * Fired when mouse leaves trigger
     */
    mouseleave: {
        event: MouseEvent;
    };
}

/**
 * Tooltip component props
 * Props that can be passed to the component
 */
export interface TooltipProps extends TooltipOptions {
    /**
     * Trigger element (wrapped component)
     */
    children?: any;
    
    /**
     * Test ID for testing
     */
    'data-testid'?: string;
}