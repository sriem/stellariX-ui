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
export declare function deepMerge<T extends Record<string, any>, U extends Record<string, any>>(target: T, source: U): T & U;
/**
 * Checks if a value is an object
 * @param item Value to check
 * @returns Whether the value is an object
 */
export declare function isObject(item: any): item is Record<string, any>;
/**
 * Omits specified keys from an object
 * @param obj Source object
 * @param keys Keys to omit
 * @returns New object without the specified keys
 */
export declare function omit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
/**
 * Picks specified keys from an object
 * @param obj Source object
 * @param keys Keys to pick
 * @returns New object with only the specified keys
 */
export declare function pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
/**
 * Creates a memoized version of a function
 * @param fn Function to memoize
 * @returns Memoized function
 */
export declare function memoize<T extends (...args: any[]) => any>(fn: T): T;
//# sourceMappingURL=object.d.ts.map