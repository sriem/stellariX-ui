/**
 * DOM Utilities
 * Helper functions for DOM manipulation
 */
/**
 * Checks if the current environment is a browser
 * @returns True if in a browser environment, false otherwise
 */
export declare const isBrowser: () => boolean;
/**
 * Gets an element by ID with proper typing
 * @param id Element ID
 * @returns The element or null if not found
 */
export declare function getElementById<T extends HTMLElement = HTMLElement>(id: string): T | null;
/**
 * Focuses an element with proper error handling
 * @param element The element to focus
 * @returns True if focus was successful, false otherwise
 */
export declare function focusElement(element: HTMLElement | null): boolean;
/**
 * Creates a DOM element with attributes and properties
 * @param tagName HTML tag name
 * @param attributes Attributes to set
 * @returns The created element
 */
export declare function createElement<T extends HTMLElement>(tagName: string, attributes?: Record<string, string>): T;
/**
 * Adds a global event listener that can be safely removed
 * @param eventName Event name
 * @param handler Event handler
 * @param options Event listener options
 * @returns Function to remove the event listener
 */
export declare function addGlobalEventListener<K extends keyof WindowEventMap>(eventName: K, handler: (event: WindowEventMap[K]) => void, options?: boolean | AddEventListenerOptions): () => void;
//# sourceMappingURL=dom.d.ts.map