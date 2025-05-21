/**
 * Accessibility Utilities
 * Helper functions for WCAG compliance and accessibility
 */
/**
 * ARIA roles
 */
export declare enum AriaRole {
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
export declare function getButtonA11yProps(isPressed?: boolean, isDisabled?: boolean): {
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
export declare function getCheckboxA11yProps(checked?: boolean, isDisabled?: boolean): {
    role: AriaRole;
    'aria-checked': string | undefined;
    'aria-disabled': string | undefined;
};
/**
 * Gets the first focusable element in a container
 * @param container The container element
 * @returns The first focusable element or null
 */
export declare function getFirstFocusableElement(container: HTMLElement): HTMLElement | null;
/**
 * Creates a focus trap within a container
 * @param container The container element
 * @returns Functions to activate and deactivate the focus trap
 */
export declare function createFocusTrap(container: HTMLElement | null): {
    activate: () => void;
    deactivate: () => void;
};
//# sourceMappingURL=accessibility.d.ts.map