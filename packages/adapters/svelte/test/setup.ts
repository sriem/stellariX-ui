/**
 * Test setup for Svelte adapter tests
 */

import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Svelte 5 internals if needed
// Since Svelte 5 is still in development, we might need to mock some APIs

// Setup global test environment
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Add custom matchers if needed
expect.extend({
  toHaveState(component: any, expectedState: any) {
    const state = component.state;
    const pass = JSON.stringify(state) === JSON.stringify(expectedState);
    
    return {
      pass,
      message: () => pass
        ? `Expected component not to have state ${JSON.stringify(expectedState)}`
        : `Expected component to have state ${JSON.stringify(expectedState)}, but got ${JSON.stringify(state)}`
    };
  }
});