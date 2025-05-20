/**
 * Button Component Types
 */

import { BaseComponentOptions, BaseComponentState } from '@stellarix/core';

/**
 * Button variants
 */
export type ButtonVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';

/**
 * Button sizes
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Button state interface
 */
export interface ButtonState extends BaseComponentState {
    /**
     * The button variant
     */
    variant: ButtonVariant;

    /**
     * The button size
     */
    size: ButtonSize;

    /**
     * Whether the button is loading
     */
    loading?: boolean;

    /**
     * Whether the button is disabled
     */
    disabled?: boolean;

    /**
     * Whether the button is in a pressed state
     */
    pressed?: boolean;

    /**
     * ARIA attributes
     */
    ariaAttributes?: Record<string, string>;
}

/**
 * Button events interface
 */
export interface ButtonEvents {
    /**
     * Click event
     */
    CLICK: {
        /**
         * The original event
         */
        originalEvent: MouseEvent | KeyboardEvent;
    };

    /**
     * Focus event
     */
    FOCUS: {
        /**
         * The original event
         */
        originalEvent: FocusEvent;
    };

    /**
     * Blur event
     */
    BLUR: {
        /**
         * The original event
         */
        originalEvent: FocusEvent;
    };

    /**
     * Mouse down event
     */
    MOUSE_DOWN: {
        /**
         * The original event
         */
        originalEvent: MouseEvent;
    };

    /**
     * Mouse up event
     */
    MOUSE_UP: {
        /**
         * The original event
         */
        originalEvent: MouseEvent;
    };
}

/**
 * Button options interface
 */
export interface ButtonOptions extends BaseComponentOptions {
    /**
     * The button variant
     * @default 'default'
     */
    variant?: ButtonVariant;

    /**
     * The button size
     * @default 'md'
     */
    size?: ButtonSize;

    /**
     * Whether the button is loading
     * @default false
     */
    loading?: boolean;

    /**
     * Whether the button is disabled
     * @default false
     */
    disabled?: boolean;

    /**
     * The button type (HTML button type attribute)
     * @default 'button'
     */
    type?: 'button' | 'submit' | 'reset';

    /**
     * The button ARIA label
     */
    ariaLabel?: string;

    /**
     * Click handler
     */
    onClick?: (event: MouseEvent | KeyboardEvent) => void;
} 