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
export function deepMerge<T extends Record<string, any>, U extends Record<string, any>>(
    target: T,
    source: U
): T & U {
    const output = { ...target } as T & U;

    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] });
                } else {
                    output[key as keyof (T & U)] = deepMerge(
                        target[key],
                        source[key]
                    ) as any;
                }
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }

    return output;
}

/**
 * Checks if a value is an object
 * @param item Value to check
 * @returns Whether the value is an object
 */
export function isObject(item: any): item is Record<string, any> {
    return item !== null && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Omits specified keys from an object
 * @param obj Source object
 * @param keys Keys to omit
 * @returns New object without the specified keys
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[]
): Omit<T, K> {
    const result = { ...obj };
    keys.forEach(key => {
        delete result[key];
    });
    return result;
}

/**
 * Picks specified keys from an object
 * @param obj Source object
 * @param keys Keys to pick
 * @returns New object with only the specified keys
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
    obj: T,
    keys: K[]
): Pick<T, K> {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
        if (key in obj) {
            result[key] = obj[key];
        }
    });
    return result;
}

/**
 * Creates a memoized version of a function
 * @param fn Function to memoize
 * @returns Memoized function
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
    const cache = new Map();

    return ((...args: any[]) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }

        const result = fn(...args);
        cache.set(key, result);
        return result;
    }) as T;
}

export function isEmpty(value: any): boolean {
  if (value == null) return true;
  if (Array.isArray(value) || typeof value === 'string') return value.length === 0;
  if (isObject(value)) return Object.keys(value).length === 0;
  return false;
} 