/**
 * StellarIX UI Utils
 * Utility functions for the StellarIX UI framework
 */

export * from './id';
export * from './accessibility';
export * from './object';

// Re-export commonly used utilities
export {
  generateId,
  generateUniqueId,
  generateComponentId,
  generateAriaId
} from './id';

export {
  createFocusTrap,
  announceToScreenReader
} from './accessibility';

export {
  deepMerge,
  pick,
  omit,
  isEmpty
} from './object';

// Version
export const VERSION = '0.0.1'; 