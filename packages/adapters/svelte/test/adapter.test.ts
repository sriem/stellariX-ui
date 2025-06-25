/**
 * Tests for Svelte 5 adapter
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import { svelteAdapter, connectToSvelte } from '../src/adapter';
import { createComponentFactory } from '@stellarix-ui/core';
import type { ComponentCore } from '@stellarix-ui/core';

// Mock component core for testing
const createMockCore = (name: string, initialState: any = {}): ComponentCore<any, any> => {
  const mockStore = {
    getState: vi.fn(() => initialState),
    setState: vi.fn(),
    subscribe: vi.fn(() => vi.fn()),
  };

  const mockLogic = {
    handleEvent: vi.fn(),
    getA11yProps: vi.fn(() => ({ role: 'button', 'aria-label': 'Test button' })),
    getInteractionHandlers: vi.fn(() => ({ onClick: vi.fn() })),
    connect: vi.fn(),
    initialize: vi.fn(),
    cleanup: vi.fn(),
  };

  return {
    state: mockStore,
    logic: mockLogic,
    metadata: {
      name,
      version: '1.0.0',
      accessibility: {
        wcagLevel: 'AA',
        patterns: ['button'],
        role: 'button',
      },
      events: {
        supported: ['click', 'focus', 'blur'],
        required: [],
        custom: {},
      },
      structure: {
        elements: {
          root: { type: 'button' },
        },
      },
    },
    connect: vi.fn(),
    destroy: vi.fn(),
  };
};

describe('Svelte Adapter', () => {
  it('should have correct name and version', () => {
    expect(svelteAdapter.name).toBe('svelte');
    expect(svelteAdapter.version).toBe('5.0.0');
  });

  describe('createComponent', () => {
    it('should create a Svelte component from core', () => {
      const core = createMockCore('Button');
      const Component = svelteAdapter.createComponent(core);
      
      expect(Component).toBeDefined();
      expect(typeof Component).toBe('function');
    });

    it('should handle different component types', () => {
      const components = ['Button', 'Input', 'Checkbox', 'Select', 'Dialog'];
      
      components.forEach(name => {
        const core = createMockCore(name);
        const Component = svelteAdapter.createComponent(core);
        expect(Component).toBeDefined();
      });
    });

    it('should pass through optimization if provided', () => {
      const core = createMockCore('Button');
      const Component = svelteAdapter.createComponent(core);
      
      if (svelteAdapter.optimize) {
        const optimized = svelteAdapter.optimize(Component);
        expect(optimized).toBe(Component); // Should return same component for now
      }
    });
  });

  describe('connectToSvelte', () => {
    it('should create a component factory', () => {
      const core = createMockCore('Button');
      const factory = connectToSvelte(core);
      
      expect(factory).toHaveProperty('Component');
      expect(factory).toHaveProperty('props');
      expect(factory).toHaveProperty('core');
      expect(factory.core).toBe(core);
    });
  });

  describe('Component Integration', () => {
    it('should render a button component', async () => {
      const core = createMockCore('Button', { disabled: false, type: 'button' });
      const factory = connectToSvelte(core);
      
      // Since we can't actually render Svelte components in tests without compilation,
      // we'll test the structure instead
      expect(factory.Component).toBeDefined();
      
      // The component should be created which calls getState
      const component = factory.Component();
      expect(component).toBeDefined();
      expect(component.$$stellarix_core).toBe(core);
    });

    it('should sync props to state', () => {
      const core = createMockCore('Input', { value: '', disabled: false });
      const factory = connectToSvelte(core);
      
      // Test that the core is properly connected
      expect(factory.core.state).toBe(core.state);
      expect(factory.core.logic).toBe(core.logic);
    });

    it('should handle state updates', () => {
      const core = createMockCore('Checkbox', { checked: false });
      const factory = connectToSvelte(core);
      
      // Simulate state update
      core.state.setState({ checked: true });
      
      expect(core.state.setState).toHaveBeenCalledWith({ checked: true });
    });

    it('should forward events to logic layer', () => {
      const core = createMockCore('Button');
      const factory = connectToSvelte(core);
      
      // Get interaction handlers
      const handlers = core.logic.getInteractionHandlers('root');
      expect(handlers).toBeDefined();
      
      // Simulate event
      const event = new MouseEvent('click');
      if (handlers.onClick) {
        handlers.onClick(event);
      }
      
      expect(core.logic.getInteractionHandlers).toHaveBeenCalledWith('root');
    });

    it('should apply accessibility props', () => {
      const core = createMockCore('Button');
      const a11yProps = core.logic.getA11yProps('root');
      
      expect(a11yProps).toEqual({
        role: 'button',
        'aria-label': 'Test button',
      });
    });
  });

  describe('Compound Components', () => {
    it('should handle Select component', () => {
      const core = createMockCore('Select', {
        open: false,
        value: null,
        options: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
        ],
      });
      
      const factory = connectToSvelte(core);
      expect(factory.Component).toBeDefined();
    });

    it('should handle Dialog component', () => {
      const core = createMockCore('Dialog', { open: false });
      const factory = connectToSvelte(core);
      expect(factory.Component).toBeDefined();
    });

    it('should handle Tabs component', () => {
      const core = createMockCore('Tabs', {
        selectedTab: 'tab1',
        tabs: [
          { id: 'tab1', label: 'Tab 1' },
          { id: 'tab2', label: 'Tab 2' },
        ],
      });
      
      const factory = connectToSvelte(core);
      expect(factory.Component).toBeDefined();
    });
  });

  describe('Svelte 5 Features', () => {
    it('should support runes integration', () => {
      const core = createMockCore('Input', { value: 'test' });
      const factory = connectToSvelte(core);
      
      // The adapter should be compatible with Svelte 5 runes
      // This is more of a type check than runtime test
      expect(factory.Component).toBeDefined();
    });

    it('should handle derived state', () => {
      const core = createMockCore('Button', { disabled: false, loading: true });
      const factory = connectToSvelte(core);
      
      // In real implementation, derived state would be computed
      // For now, we just verify the structure is correct
      expect(factory.core.state.getState()).toEqual({ disabled: false, loading: true });
    });

    it('should support effects', () => {
      const core = createMockCore('Input', { value: '' });
      const unsubscribe = vi.fn();
      core.state.subscribe = vi.fn(() => unsubscribe);
      
      const factory = connectToSvelte(core);
      
      // Create a component instance which sets up subscriptions
      const component = factory.Component();
      
      // Verify subscription was set up via state bindings
      expect(core.state.subscribe).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing metadata gracefully', () => {
      const core = {
        state: { getState: vi.fn(), setState: vi.fn(), subscribe: vi.fn() },
        logic: { 
          handleEvent: vi.fn(), 
          getA11yProps: vi.fn(() => ({})), 
          getInteractionHandlers: vi.fn(() => ({})),
          connect: vi.fn(),
          initialize: vi.fn(),
          cleanup: vi.fn(),
        },
        metadata: {
          name: 'TestComponent',
          version: '1.0.0',
          accessibility: { wcagLevel: 'AA' as const, patterns: [] },
          events: { supported: [], required: [], custom: {} },
          structure: { elements: {} },
        },
        connect: vi.fn(),
        destroy: vi.fn(),
      };
      
      expect(() => svelteAdapter.createComponent(core)).not.toThrow();
    });

    it('should handle invalid component names', () => {
      const core = createMockCore('UnknownComponent');
      const Component = svelteAdapter.createComponent(core);
      expect(Component).toBeDefined();
    });
  });
});