import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, cleanup } from '@solidjs/testing-library';
import { createSignal, createEffect, onMount } from 'solid-js';
import { isServer } from 'solid-js/web';
import { createStore, type Store, createComponentFactory, createLogicLayer } from '@stellarix-ui/core';
import { solidAdapter, connectToSolid } from '../src/adapter';
import { createSignalFromStore } from '../src/signals';

describe('Solid.js Adapter', () => {
  beforeEach(() => {
    cleanup();
  });

  describe('solidAdapter', () => {
    it('should have correct name and version', () => {
      expect(solidAdapter.name).toBe('solid');
      expect(solidAdapter.version).toBe('1.8.0');
    });

    it('should create a Solid component from core', () => {
      const core = {
        state: createStore({ value: 'test' }),
        logic: {
          getA11yProps: () => ({}),
          getInteractionHandlers: () => ({}),
          handleEvent: vi.fn(),
          connect: vi.fn(),
          initialize: vi.fn(),
          cleanup: vi.fn(),
        },
        metadata: {
          name: 'TestComponent',
          version: '1.0.0',
          accessibility: { wcagLevel: 'AA', patterns: [] },
          events: { supported: [], required: [], custom: {} },
          structure: { elements: { root: { type: 'div' } } },
        },
        connect: vi.fn(),
        destroy: vi.fn(),
      };

      const Component = solidAdapter.createComponent(core);
      expect(Component).toBeDefined();
      expect(typeof Component).toBe('function');
    });
  });

  describe('Signal integration', () => {
    it('should sync store state to Solid signals', () => {
      if (isServer) {
        expect(true).toBe(true);
        return;
      }
      
      const store = createStore({ count: 0 });
      let signalValue: number | undefined;
      
      const TestComponent = () => {
        const state = createSignalFromStore(store);
        createEffect(() => {
          signalValue = state().count;
        });
        return <div>{state().count}</div>;
      };

      const { getByText } = render(() => <TestComponent />);
      expect(getByText('0')).toBeInTheDocument();
      expect(signalValue).toBe(0);

      store.setState({ count: 5 });
      expect(getByText('5')).toBeInTheDocument();
      expect(signalValue).toBe(5);
    });

    it('should handle state updates from props', () => {
      if (isServer) {
        expect(true).toBe(true);
        return;
      }
      
      const core = {
        state: createStore({ value: 'initial' }),
        logic: {
          getA11yProps: () => ({}),
          getInteractionHandlers: () => ({}),
          handleEvent: vi.fn(),
          connect: vi.fn(),
          initialize: vi.fn(),
          cleanup: vi.fn(),
        },
        metadata: {
          name: 'TestComponent',
          version: '1.0.0',
          accessibility: { wcagLevel: 'AA', patterns: [] },
          events: { supported: [], required: [], custom: {} },
          structure: { elements: { root: { type: 'div' } } },
        },
        connect: vi.fn(),
        destroy: vi.fn(),
      };

      const Component = solidAdapter.createComponent(core);
      const { getByText, rerender } = render(() => 
        <Component value="prop-value">{() => core.state.getState().value}</Component>
      );

      expect(getByText('initial')).toBeInTheDocument();
      
      rerender(() => <Component value="updated-value">{() => core.state.getState().value}</Component>);
      expect(core.state.getState().value).toBe('updated-value');
    });
  });

  describe('Component rendering', () => {
    it('should render basic components correctly', () => {
      if (isServer) {
        expect(true).toBe(true);
        return;
      }
      
      const buttonCore = {
        state: createStore({ disabled: false, type: 'button' }),
        logic: {
          getA11yProps: () => ({ 'aria-label': 'Test Button' }),
          getInteractionHandlers: () => ({ onClick: vi.fn() }),
          handleEvent: vi.fn(),
          connect: vi.fn(),
          initialize: vi.fn(),
          cleanup: vi.fn(),
        },
        metadata: {
          name: 'Button',
          version: '1.0.0',
          accessibility: { wcagLevel: 'AA', patterns: [] },
          events: { supported: ['click'], required: [], custom: {} },
          structure: { elements: { root: { type: 'button' } } },
        },
        connect: vi.fn(),
        destroy: vi.fn(),
      };

      const Button = solidAdapter.createComponent(buttonCore);
      const { getByRole } = render(() => <Button>Click me</Button>);
      
      const button = getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Click me');
      expect(button).toHaveAttribute('aria-label', 'Test Button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should handle click events', () => {
      if (isServer) {
        expect(true).toBe(true);
        return;
      }
      
      const handleClick = vi.fn();
      const buttonCore = {
        state: createStore({ disabled: false }),
        logic: {
          getA11yProps: () => ({}),
          getInteractionHandlers: () => ({ 
            onClick: (e: Event) => {
              handleClick(e);
              return 'click';
            }
          }),
          handleEvent: vi.fn(),
          connect: vi.fn(),
          initialize: vi.fn(),
          cleanup: vi.fn(),
        },
        metadata: {
          name: 'Button',
          version: '1.0.0',
          accessibility: { wcagLevel: 'AA', patterns: [] },
          events: { supported: ['click'], required: [], custom: {} },
          structure: { elements: { root: { type: 'button' } } },
        },
        connect: vi.fn(),
        destroy: vi.fn(),
      };

      const Button = solidAdapter.createComponent(buttonCore);
      const { getByRole } = render(() => <Button>Click me</Button>);
      
      const button = getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(buttonCore.logic.handleEvent).toHaveBeenCalledWith('click', expect.any(Object));
    });
  });

  describe('Input components', () => {
    it('should render Input component with two-way binding', () => {
      if (isServer) {
        expect(true).toBe(true);
        return;
      }
      
      const inputCore = {
        state: createStore({ value: '', type: 'text' }),
        logic: {
          getA11yProps: () => ({}),
          getInteractionHandlers: () => ({}),
          handleEvent: vi.fn(),
          connect: vi.fn(),
          initialize: vi.fn(),
          cleanup: vi.fn(),
        },
        metadata: {
          name: 'Input',
          version: '1.0.0',
          accessibility: { wcagLevel: 'AA', patterns: [] },
          events: { supported: ['input', 'change'], required: [], custom: {} },
          structure: { elements: { root: { type: 'input' } } },
        },
        connect: vi.fn(),
        destroy: vi.fn(),
      };

      const Input = solidAdapter.createComponent(inputCore);
      const { getByRole } = render(() => <Input placeholder="Enter text" />);
      
      const input = getByRole('textbox') as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input.value).toBe('');
      
      fireEvent.input(input, { target: { value: 'Hello' } });
      expect(inputCore.state.getState().value).toBe('Hello');
    });

    it('should render Checkbox component', () => {
      if (isServer) {
        expect(true).toBe(true);
        return;
      }
      
      const checkboxCore = {
        state: createStore({ checked: false }),
        logic: {
          getA11yProps: () => ({ role: 'checkbox' }),
          getInteractionHandlers: () => ({}),
          handleEvent: vi.fn(),
          connect: vi.fn(),
          initialize: vi.fn(),
          cleanup: vi.fn(),
        },
        metadata: {
          name: 'Checkbox',
          version: '1.0.0',
          accessibility: { wcagLevel: 'AA', patterns: [] },
          events: { supported: ['change'], required: [], custom: {} },
          structure: { elements: { root: { type: 'input' } } },
        },
        connect: vi.fn(),
        destroy: vi.fn(),
      };

      const Checkbox = solidAdapter.createComponent(checkboxCore);
      const { getByRole } = render(() => <Checkbox />);
      
      const checkbox = getByRole('checkbox') as HTMLInputElement;
      expect(checkbox).toBeInTheDocument();
      expect(checkbox.checked).toBe(false);
      
      fireEvent.click(checkbox);
      expect(checkboxCore.state.getState().checked).toBe(true);
    });
  });

  describe('Compound components', () => {
    it('should render Select component', () => {
      if (isServer) {
        expect(true).toBe(true);
        return;
      }
      
      const selectCore = {
        state: createStore({
          open: false,
          value: null,
          options: [
            { value: '1', label: 'Option 1' },
            { value: '2', label: 'Option 2' },
          ],
          placeholder: 'Select...',
        }),
        logic: {
          getA11yProps: (part: string) => {
            if (part === 'trigger') return { 'aria-haspopup': 'listbox' };
            if (part === 'listbox') return { role: 'listbox' };
            return {};
          },
          getInteractionHandlers: (part: string) => {
            if (part === 'trigger') {
              return {
                onClick: () => {
                  selectCore.state.setState((prev: any) => ({ ...prev, open: !prev.open }));
                  return 'toggle';
                }
              };
            }
            return {};
          },
          handleEvent: vi.fn(),
          connect: vi.fn(),
          initialize: vi.fn(),
          cleanup: vi.fn(),
        },
        metadata: {
          name: 'Select',
          version: '1.0.0',
          accessibility: { wcagLevel: 'AA', patterns: [] },
          events: { supported: ['select'], required: [], custom: {} },
          structure: { elements: { root: { type: 'div' } } },
        },
        connect: vi.fn(),
        destroy: vi.fn(),
      };

      const Select = solidAdapter.createComponent(selectCore);
      const { getByText, queryByRole } = render(() => <Select />);
      
      expect(getByText('Select...')).toBeInTheDocument();
      expect(queryByRole('listbox')).not.toBeInTheDocument();
      
      fireEvent.click(getByText('Select...'));
      expect(selectCore.state.getState().open).toBe(true);
    });

    it('should render Dialog component with portal', () => {
      if (isServer) {
        expect(true).toBe(true);
        return;
      }
      
      const dialogCore = {
        state: createStore({ open: true }),
        logic: {
          getA11yProps: (part: string) => {
            if (part === 'dialog') return { role: 'dialog' };
            return {};
          },
          getInteractionHandlers: () => ({}),
          handleEvent: vi.fn(),
          connect: vi.fn(),
          initialize: vi.fn(),
          cleanup: vi.fn(),
        },
        metadata: {
          name: 'Dialog',
          version: '1.0.0',
          accessibility: { wcagLevel: 'AA', patterns: [] },
          events: { supported: [], required: [], custom: {} },
          structure: { elements: { root: { type: 'div' } } },
        },
        connect: vi.fn(),
        destroy: vi.fn(),
      };

      const Dialog = solidAdapter.createComponent(dialogCore);
      const { getByRole } = render(() => <Dialog>Dialog Content</Dialog>);
      
      const dialog = getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveTextContent('Dialog Content');
    });
  });

  describe('connectToSolid helper', () => {
    it('should create a Solid component using connectToSolid', () => {
      const testFactory = createComponentFactory({
        name: 'TestComponent',
        createInitialState: () => ({ count: 0 }),
        createLogic: (state) => createLogicLayer({
          handlers: {},
          getA11yProps: () => ({}),
          getInteractionHandlers: () => ({}),
        }),
        metadata: {
          accessibility: { wcagLevel: 'AA', patterns: [] },
          events: { supported: [], required: [], custom: {} },
          structure: { elements: { root: { type: 'div' } } },
        },
      });

      const core = testFactory();
      const Component = connectToSolid(core);
      
      expect(Component).toBeDefined();
      expect(typeof Component).toBe('function');
    });
  });
});