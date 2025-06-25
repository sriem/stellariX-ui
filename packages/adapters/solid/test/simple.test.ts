import { describe, it, expect } from 'vitest';
import { solidAdapter } from '../src/adapter';

describe('Simple Solid Adapter Tests', () => {
  it('should have correct adapter name', () => {
    expect(solidAdapter.name).toBe('solid');
  });

  it('should have correct adapter version', () => {
    expect(solidAdapter.version).toBe('1.8.0');
  });

  it('should export createComponent function', () => {
    expect(typeof solidAdapter.createComponent).toBe('function');
  });
});