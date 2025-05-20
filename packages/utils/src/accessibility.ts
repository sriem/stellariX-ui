/**
 * Accessibility Utilities
 * Helper functions for WCAG compliance and accessibility
 */

import { isBrowser } from './dom';

/**
 * ARIA roles
 */
export enum AriaRole {
    Button = 'button',
    Checkbox = 'checkbox',
    Dialog = 'dialog',
    ListBox = 'listbox',
    Menu = 'menu',
    MenuItem = 'menuitem',
    Option = 'option',
    Switch = 'switch',
    Tab = 'tab',
    TabList = 'tablist',
    TabPanel = 'tabpanel',
    Toolbar = 'toolbar',
}

/**
 * Creates aria attributes for a button
 * @param isPressed Whether the button is pressed
 * @param isDisabled Whether the button is disabled
 * @returns ARIA attributes
 */
export function getButtonA11yProps(isPressed?: boolean, isDisabled?: boolean) {
    return {
        role: AriaRole.Button,
        'aria-pressed': isPressed ? 'true' : undefined,
        'aria-disabled': isDisabled ? 'true' : undefined,
    };
}

/**
 * Creates aria attributes for a checkbox
 * @param checked Whether the checkbox is checked
 * @param isDisabled Whether the checkbox is disabled
 * @returns ARIA attributes
 */
export function getCheckboxA11yProps(checked?: boolean, isDisabled?: boolean) {
    return {
        role: AriaRole.Checkbox,
        'aria-checked': typeof checked === 'boolean' ? String(checked) : undefined,
        'aria-disabled': isDisabled ? 'true' : undefined,
    };
}

/**
 * Gets the first focusable element in a container
 * @param container The container element
 * @returns The first focusable element or null
 */
export function getFirstFocusableElement(container: HTMLElement): HTMLElement | null {
    if (!isBrowser() || !container) return null;

    const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    return focusableElements.length > 0 ? focusableElements[0] as HTMLElement : null;
}

/**
 * Creates a focus trap within a container
 * @param container The container element
 * @returns Functions to activate and deactivate the focus trap
 */
export function createFocusTrap(container: HTMLElement | null) {
    if (!isBrowser() || !container) {
        return {
            activate: () => { },
            deactivate: () => { },
        };
    }

    let previouslyFocusedElement: HTMLElement | null = null;

    const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement | undefined;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement | undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Tab') return;

        if (!firstElement || !lastElement) return;

        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                event.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                event.preventDefault();
            }
        }
    };

    return {
        activate: () => {
            previouslyFocusedElement = document.activeElement as HTMLElement;
            container.addEventListener('keydown', handleKeyDown);
            if (firstElement) {
                firstElement.focus();
            }
        },
        deactivate: () => {
            container.removeEventListener('keydown', handleKeyDown);
            if (previouslyFocusedElement) {
                previouslyFocusedElement.focus();
            }
        },
    };
} 