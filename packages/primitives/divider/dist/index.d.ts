import * as _stellarix_core from '@stellarix/core';

/**
 * Divider Component Types
 * Define all TypeScript interfaces for the component
 */
/**
 * Divider orientation
 */
type DividerOrientation = 'horizontal' | 'vertical';
/**
 * Divider variant
 */
type DividerVariant = 'solid' | 'dashed' | 'dotted';
/**
 * Divider label position
 */
type DividerLabelPosition = 'start' | 'center' | 'end';
/**
 * Divider component state
 * Represents the internal state of the component
 */
interface DividerState {
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
interface DividerOptions {
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
interface DividerEvents {
}
/**
 * Divider component props
 * Props that can be passed to the component
 */
interface DividerProps extends DividerOptions {
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

/**
 * Divider Component State Management
 * Ultra-generic state implementation
 */

/**
 * Extended state store with component-specific methods
 */
interface DividerStateStore {
    getState: () => DividerState;
    setState: (updater: DividerState | ((prev: DividerState) => DividerState)) => void;
    subscribe: (listener: (state: DividerState) => void) => () => void;
    derive: <U>(selector: (state: DividerState) => U) => {
        get: () => U;
        subscribe: (listener: (value: U) => void) => () => void;
    };
    setOrientation: (orientation: DividerOrientation) => void;
    setVariant: (variant: DividerVariant) => void;
    setLabelPosition: (position: DividerLabelPosition) => void;
    updateLabel: (hasLabel: boolean) => void;
    isHorizontal: () => boolean;
    isVertical: () => boolean;
}

/**
 * Creates a divider component factory
 * @param options Component options
 * @returns Component factory
 */
declare function createDivider(options?: DividerOptions): _stellarix_core.ComponentCore<DividerState, DividerEvents>;
/**
 * Create the component with actual implementation
 * This connects the state and logic layers
 */
declare function createDividerWithImplementation(options?: DividerOptions): _stellarix_core.ComponentCore<DividerState, DividerEvents>;

export { type DividerEvents, type DividerLabelPosition, type DividerOptions, type DividerOrientation, type DividerProps, type DividerState, type DividerStateStore, type DividerVariant, createDivider, createDividerWithImplementation, createDividerWithImplementation as default };
