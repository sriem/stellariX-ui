/**
 * Dialog Component Types
 */

import { BaseComponentOptions, BaseComponentState } from '../../../core/src/types';

/**
 * Dialog state interface
 */
export interface DialogState extends BaseComponentState {
    /**
     * Whether the dialog is open
     */
    isOpen: boolean;

    /**
     * Whether the dialog has a backdrop
     */
    hasBackdrop: boolean;

    /**
     * Whether the dialog closes when clicking outside
     */
    closeOnOutsideClick: boolean;

    /**
     * Whether the dialog closes when pressing escape key
     */
    closeOnEsc: boolean;

    /**
     * Generated title ID for accessibility
     */
    titleId: string;

    /**
     * Generated description ID for accessibility
     */
    descriptionId: string;

    /**
     * Dialog role - either "dialog" or "alertdialog"
     */
    role: "dialog" | "alertdialog";
}

/**
 * Dialog events interface
 */
export interface DialogEvents {
    /**
     * Dialog open event
     */
    OPEN: void;

    /**
     * Dialog close event
     */
    CLOSE: void;

    /**
     * Escape key press event
     */
    ESCAPE_KEY_DOWN: {
        /**
         * The original keyboard event
         */
        originalEvent: KeyboardEvent;
    };

    /**
     * Outside click event
     */
    OUTSIDE_CLICK: {
        /**
         * The original mouse event
         */
        originalEvent: MouseEvent;
    };
}

/**
 * Dialog options interface
 */
export interface DialogOptions extends BaseComponentOptions {
    /**
     * Unique ID for the dialog
     */
    id?: string;

    /**
     * Initial open state
     * @default false
     */
    initialOpen?: boolean;

    /**
     * Whether the dialog has a backdrop
     * @default true
     */
    hasBackdrop?: boolean;

    /**
     * Whether the dialog closes when clicking outside
     * @default true
     */
    closeOnOutsideClick?: boolean;

    /**
     * Whether the dialog closes when pressing escape key
     * @default true
     */
    closeOnEsc?: boolean;

    /**
     * Whether to prevent body scrolling when dialog is open
     * @default true
     */
    preventScroll?: boolean;

    /**
     * Whether to return focus to the trigger element when closed
     * @default true
     */
    returnFocusOnClose?: boolean;

    /**
     * Dialog role - either "dialog" or "alertdialog"
     * @default "dialog"
     */
    role?: "dialog" | "alertdialog";

    /**
     * Callback when dialog opens
     */
    onOpen?: () => void;

    /**
     * Callback when dialog closes
     */
    onClose?: () => void;

    /**
     * Callback when escape key is pressed
     */
    onEscapeKeyDown?: (event: KeyboardEvent) => void;

    /**
     * Callback when clicking outside the dialog
     */
    onOutsideClick?: (event: MouseEvent) => void;
} 