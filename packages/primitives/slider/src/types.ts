/**
 * Slider Component Types
 * Define all TypeScript interfaces for the component
 */

/**
 * Slider component state
 * Represents the internal state of the component
 */
export interface SliderState {
    /**
     * Current value of the slider
     * For range sliders, this is a tuple [min, max]
     */
    value: number | [number, number];
    
    /**
     * Minimum allowed value
     */
    min: number;
    
    /**
     * Maximum allowed value
     */
    max: number;
    
    /**
     * Step increment for value changes
     */
    step: number;
    
    /**
     * Whether the slider is disabled
     */
    disabled: boolean;
    
    /**
     * Whether the slider is focused
     */
    focused: boolean;
    
    /**
     * Whether the slider is being dragged
     */
    dragging: boolean;
    
    /**
     * Orientation of the slider
     */
    orientation: 'horizontal' | 'vertical';
    
    /**
     * Whether this is a range slider
     */
    isRange: boolean;
}

/**
 * Slider component options
 * Configuration passed when creating the component
 */
export interface SliderOptions {
    /**
     * Initial value
     * @default 0 for single, [0, 100] for range
     */
    value?: number | [number, number];
    
    /**
     * Minimum value
     * @default 0
     */
    min?: number;
    
    /**
     * Maximum value
     * @default 100
     */
    max?: number;
    
    /**
     * Step increment
     * @default 1
     */
    step?: number;
    
    /**
     * Whether the slider is disabled
     * @default false
     */
    disabled?: boolean;
    
    /**
     * Orientation of the slider
     * @default 'horizontal'
     */
    orientation?: 'horizontal' | 'vertical';
    
    /**
     * Callback when value changes
     */
    onChange?: (value: number | [number, number]) => void;
    
    /**
     * Callback when dragging starts
     */
    onDragStart?: () => void;
    
    /**
     * Callback when dragging ends
     */
    onDragEnd?: () => void;
}

/**
 * Slider component events
 * Events that can be triggered by the component
 */
export interface SliderEvents {
    /**
     * Fired when the value changes
     */
    change: {
        value: number | [number, number];
        previousValue: number | [number, number];
    };
    
    /**
     * Fired when dragging starts
     */
    dragStart: {
        value: number | [number, number];
    };
    
    /**
     * Fired when dragging ends
     */
    dragEnd: {
        value: number | [number, number];
    };
    
    /**
     * Fired when component receives focus
     */
    focus: {
        event: FocusEvent;
    };
    
    /**
     * Fired when component loses focus
     */
    blur: {
        event: FocusEvent;
    };
}

/**
 * Slider component props
 * Props that can be passed to the component
 */
export interface SliderProps extends SliderOptions {
    /**
     * Additional CSS class
     */
    className?: string;
    
    /**
     * Test ID for testing
     */
    'data-testid'?: string;
    
    /**
     * ARIA label for the slider
     */
    'aria-label'?: string;
    
    /**
     * ARIA label for the minimum thumb (range slider)
     */
    'aria-label-min'?: string;
    
    /**
     * ARIA label for the maximum thumb (range slider)
     */
    'aria-label-max'?: string;
}