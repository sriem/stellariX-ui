/**
 * DOM Utilities
 * Helper functions for DOM manipulation
 */

/**
 * Checks if the current environment is a browser
 * @returns True if in a browser environment, false otherwise
 */
export const isBrowser = () => typeof window !== 'undefined';

/**
 * Gets an element by ID with proper typing
 * @param id Element ID
 * @returns The element or null if not found
 */
export function getElementById<T extends HTMLElement = HTMLElement>(id: string): T | null {
    return isBrowser() ? document.getElementById(id) as T | null : null;
}

/**
 * Focuses an element with proper error handling
 * @param element The element to focus
 * @returns True if focus was successful, false otherwise
 */
export function focusElement(element: HTMLElement | null): boolean {
    if (element && typeof element.focus === 'function') {
        try {
            element.focus();
            return document.activeElement === element;
        } catch (e) {
            return false;
        }
    }
    return false;
}

/**
 * Creates a DOM element with attributes and properties
 * @param tagName HTML tag name
 * @param attributes Attributes to set
 * @returns The created element
 */
export function createElement<T extends HTMLElement>(
    tagName: string,
    attributes: Record<string, string> = {}
): T {
    const element = document.createElement(tagName) as T;

    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });

    return element;
}

/**
 * Generates a unique ID with an optional prefix
 * @param prefix Optional prefix for the ID
 * @returns A unique ID string
 */
export function generateId(prefix: string = 'stellarix'): string {
    const randomPart = Math.random().toString(36).substring(2, 10);
    return `${prefix}-${randomPart}`;
}

/**
 * Adds a global event listener that can be safely removed
 * @param eventName Event name
 * @param handler Event handler
 * @param options Event listener options
 * @returns Function to remove the event listener
 */
export function addGlobalEventListener<K extends keyof WindowEventMap>(
    eventName: K,
    handler: (event: WindowEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
): () => void {
    if (!isBrowser()) return () => { };

    window.addEventListener(eventName, handler as EventListener, options);
    return () => {
        window.removeEventListener(eventName, handler as EventListener, options);
    };
} 