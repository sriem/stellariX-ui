declare function generateId(prefix?: string): string;
declare function generateUniqueId(): string;
declare function generateComponentId(componentName: string): string;
declare function generateAriaId(prefix?: string): string;

/**
 * Accessibility Utilities
 * Helper functions for WCAG compliance and accessibility
 */
/**
 * ARIA roles
 */
declare enum AriaRole {
    Button = "button",
    Checkbox = "checkbox",
    Dialog = "dialog",
    ListBox = "listbox",
    Menu = "menu",
    MenuItem = "menuitem",
    Option = "option",
    Switch = "switch",
    Tab = "tab",
    TabList = "tablist",
    TabPanel = "tabpanel",
    Toolbar = "toolbar"
}
/**
 * Creates aria attributes for a button
 * @param isPressed Whether the button is pressed
 * @param isDisabled Whether the button is disabled
 * @returns ARIA attributes
 */
declare function getButtonA11yProps(isPressed?: boolean, isDisabled?: boolean): {
    role: AriaRole;
    'aria-pressed': string | undefined;
    'aria-disabled': string | undefined;
};
/**
 * Creates aria attributes for a checkbox
 * @param checked Whether the checkbox is checked
 * @param isDisabled Whether the checkbox is disabled
 * @returns ARIA attributes
 */
declare function getCheckboxA11yProps(checked?: boolean, isDisabled?: boolean): {
    role: AriaRole;
    'aria-checked': string | undefined;
    'aria-disabled': string | undefined;
};
/**
 * Gets the first focusable element in a container
 * @param container The container element
 * @returns The first focusable element or null
 */
declare function getFirstFocusableElement(container: HTMLElement): HTMLElement | null;
/**
 * Creates a focus trap within a container
 * @param container The container element
 * @returns Functions to activate and deactivate the focus trap
 */
declare function createFocusTrap(container: HTMLElement | null): {
    activate: () => void;
    deactivate: () => void;
};
declare function announceToScreenReader(message: string, priority?: 'polite' | 'assertive'): void;

/**
 * Object Utilities
 * Helper functions for object manipulation
 */
/**
 * Deep merges two objects
 * @param target Target object
 * @param source Source object
 * @returns Merged object
 */
declare function deepMerge<T extends Record<string, any>, U extends Record<string, any>>(target: T, source: U): T & U;
/**
 * Checks if a value is an object
 * @param item Value to check
 * @returns Whether the value is an object
 */
declare function isObject(item: any): item is Record<string, any>;
/**
 * Omits specified keys from an object
 * @param obj Source object
 * @param keys Keys to omit
 * @returns New object without the specified keys
 */
declare function omit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
/**
 * Picks specified keys from an object
 * @param obj Source object
 * @param keys Keys to pick
 * @returns New object with only the specified keys
 */
declare function pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
/**
 * Creates a memoized version of a function
 * @param fn Function to memoize
 * @returns Memoized function
 */
declare function memoize<T extends (...args: any[]) => any>(fn: T): T;
declare function isEmpty(value: any): boolean;

/**
 * StellarIX UI Utils
 * Utility functions for the StellarIX UI framework
 */

declare const VERSION = "0.0.1";

export { AriaRole, VERSION, announceToScreenReader, createFocusTrap, deepMerge, generateAriaId, generateComponentId, generateId, generateUniqueId, getButtonA11yProps, getCheckboxA11yProps, getFirstFocusableElement, isEmpty, isObject, memoize, omit, pick };
