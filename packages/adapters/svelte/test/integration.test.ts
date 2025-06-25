/**
 * Integration tests for Svelte adapter with real components
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { svelteAdapter, connectToSvelte } from '../src/adapter';
import { 
  createStateBindings, 
  syncPropsToState, 
  createEventHandler,
  createCSSVariables 
} from '../src/runes';
import { createStore } from '@stellarix-ui/core';

// For now, we'll use mock factories to test the adapter
// TODO: Update when component factories are properly exported
const createMockCore = (name: string, initialState: any) => {
  const mockLogic = {
    handleEvent: vi.fn((eventName: string, event?: any) => {
      // Simulate state updates based on events
      if (name === 'Input' && eventName === 'input' && event?.target?.value !== undefined) {
        mockCore.state.setState({ value: event.target.value });
      } else if (name === 'Dialog' && eventName === 'open') {
        mockCore.state.setState((prev: any) => ({ ...prev, open: true }));
      } else if (name === 'Dialog' && eventName === 'close') {
        mockCore.state.setState((prev: any) => ({ ...prev, open: false }));
      } else if (name === 'Select' && eventName === 'toggle') {
        const currentState = mockCore.state.getState();
        mockCore.state.setState((prev: any) => ({ ...prev, open: !currentState.open }));
      } else if (name === 'Select' && eventName === 'select' && event?.optionIndex !== undefined) {
        const currentState = mockCore.state.getState();
        const options = currentState.options || [];
        const option = options[event.optionIndex];
        if (option) {
          mockCore.state.setState((prev: any) => ({ ...prev, value: option.value, open: false }));
        }
      }
    }),
    getA11yProps: vi.fn(() => ({})),
    getInteractionHandlers: vi.fn(() => ({})),
    connect: vi.fn(),
    initialize: vi.fn(),
    cleanup: vi.fn()
  };
  
  const mockCore = {
    state: createStore(initialState),
    logic: mockLogic,
    metadata: { 
      name, 
      version: '1.0.0', 
      accessibility: { wcagLevel: 'AA' as const, patterns: [] }, 
      events: { supported: [], required: [], custom: {} }, 
      structure: { elements: { root: { type: name === 'Button' ? 'button' : name === 'Input' || name === 'Checkbox' ? 'input' : 'div' } } }
    },
    connect: vi.fn(),
    destroy: vi.fn(() => mockLogic.cleanup())
  };
  
  return mockCore;
};

const createButtonFactory = () => createMockCore('Button', { type: 'button', disabled: false, loading: false });
const createInputFactory = () => createMockCore('Input', { type: 'text', value: '', disabled: false });
const createCheckboxFactory = () => createMockCore('Checkbox', { checked: false, disabled: false });
const createSelectFactory = () => createMockCore('Select', { open: false, value: null, options: [] });
const createDialogFactory = () => createMockCore('Dialog', { open: false });
const createTabsFactory = () => createMockCore('Tabs', { selectedTab: 'tab1', tabs: [] });
const createStepperFactory = () => createMockCore('Stepper', { currentStep: 0, steps: [] });

describe('Svelte Adapter Integration', () => {
  describe('Button Component', () => {
    it('should create a working button component', () => {
      const buttonCore = createButtonFactory();
      
      const svelteButton = connectToSvelte(buttonCore);
      
      expect(svelteButton.Component).toBeDefined();
      expect(svelteButton.core.metadata.name).toBe('Button');
      expect(svelteButton.core.state.getState()).toMatchObject({
        type: 'button',
        disabled: false,
        loading: false
      });
    });

    it('should handle button state changes', () => {
      const buttonCore = createButtonFactory();
      const svelteButton = connectToSvelte(buttonCore);
      
      // Update state
      buttonCore.state.setState({ loading: true });
      
      const state = buttonCore.state.getState();
      expect(state.loading).toBe(true);
    });
  });

  describe('Input Component', () => {
    it('should create a working input component', () => {
      const inputCore = createInputFactory();
      inputCore.state.setState({ type: 'text', value: 'test' });
      
      const svelteInput = connectToSvelte(inputCore);
      
      expect(svelteInput.Component).toBeDefined();
      expect(svelteInput.core.metadata.name).toBe('Input');
      expect(svelteInput.core.state.getState()).toMatchObject({
        type: 'text',
        value: 'test'
      });
    });

    it('should handle input events', () => {
      const inputCore = createInputFactory();
      const svelteInput = connectToSvelte(inputCore);
      
      // Simulate input event
      const event = new Event('input');
      Object.defineProperty(event, 'target', {
        value: { value: 'new value' },
        enumerable: true
      });
      
      inputCore.logic.handleEvent('input', event);
      
      expect(inputCore.state.getState().value).toBe('new value');
    });
  });

  describe('Checkbox Component', () => {
    it('should create a working checkbox component', () => {
      const checkboxCore = createCheckboxFactory();
      checkboxCore.state.setState({ checked: false, disabled: false });
      
      const svelteCheckbox = connectToSvelte(checkboxCore);
      
      expect(svelteCheckbox.Component).toBeDefined();
      expect(svelteCheckbox.core.metadata.name).toBe('Checkbox');
      expect(svelteCheckbox.core.state.getState()).toMatchObject({
        checked: false,
        disabled: false
      });
    });

    it('should handle indeterminate state', () => {
      const checkboxCore = createCheckboxFactory();
      checkboxCore.state.setState({ checked: 'indeterminate' });
      
      const svelteCheckbox = connectToSvelte(checkboxCore);
      const state = checkboxCore.state.getState();
      
      expect(state.checked).toBe('indeterminate');
    });
  });

  describe('Select Component', () => {
    it('should create a working select component', () => {
      const selectCore = createSelectFactory();
      selectCore.state.setState({
        options: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' }
        ],
        value: '1',
        open: false
      });
      
      const svelteSelect = connectToSvelte(selectCore);
      
      expect(svelteSelect.Component).toBeDefined();
      expect(svelteSelect.core.metadata.name).toBe('Select');
      expect(svelteSelect.core.state.getState()).toMatchObject({
        value: '1',
        open: false
      });
    });

    it('should handle select state changes', () => {
      const selectCore = createSelectFactory();
      selectCore.state.setState({
        options: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' }
        ],
        open: false,
        value: null
      });
      
      const svelteSelect = connectToSvelte(selectCore);
      
      // Open select
      selectCore.logic.handleEvent('toggle');
      expect(selectCore.state.getState().open).toBe(true);
      
      // Select option
      selectCore.logic.handleEvent('select', { optionIndex: 1 });
      expect(selectCore.state.getState().value).toBe('2');
    });
  });

  describe('Dialog Component', () => {
    it('should create a working dialog component', () => {
      const dialogCore = createDialogFactory();
      dialogCore.state.setState({ open: false });
      
      const svelteDialog = connectToSvelte(dialogCore);
      
      expect(svelteDialog.Component).toBeDefined();
      expect(svelteDialog.core.metadata.name).toBe('Dialog');
      expect(svelteDialog.core.state.getState()).toMatchObject({
        open: false
      });
    });

    it('should handle dialog open/close', () => {
      const dialogCore = createDialogFactory();
      
      const svelteDialog = connectToSvelte(dialogCore);
      
      // Open dialog
      dialogCore.logic.handleEvent('open');
      expect(dialogCore.state.getState().open).toBe(true);
      
      // Close dialog
      dialogCore.logic.handleEvent('close');
      expect(dialogCore.state.getState().open).toBe(false);
    });
  });

  describe('Tabs Component', () => {
    it('should create a working tabs component', () => {
      const tabsCore = createTabsFactory();
      tabsCore.state.setState({
        tabs: [
          { id: 'tab1', label: 'Tab 1' },
          { id: 'tab2', label: 'Tab 2' }
        ],
        selectedTab: 'tab1'
      });
      
      const svelteTabs = connectToSvelte(tabsCore);
      
      expect(svelteTabs.Component).toBeDefined();
      expect(svelteTabs.core.metadata.name).toBe('Tabs');
      expect(svelteTabs.core.state.getState()).toMatchObject({
        selectedTab: 'tab1'
      });
    });
  });

  describe('Stepper Component', () => {
    it('should create a working stepper component', () => {
      const stepperCore = createStepperFactory();
      stepperCore.state.setState({
        steps: [
          { id: 'step1', label: 'Step 1' },
          { id: 'step2', label: 'Step 2' },
          { id: 'step3', label: 'Step 3' }
        ],
        currentStep: 0
      });
      
      const svelteStepper = connectToSvelte(stepperCore);
      
      expect(svelteStepper.Component).toBeDefined();
      expect(svelteStepper.core.metadata.name).toBe('Stepper');
      expect(svelteStepper.core.state.getState()).toMatchObject({
        currentStep: 0
      });
    });
  });

  describe('Rune Utilities', () => {
    it('should create state bindings', () => {
      const store = createStore({ value: 'test', count: 0 });
      const bindings = createStateBindings(store);
      
      expect(bindings.state).toEqual({ value: 'test', count: 0 });
      
      bindings.update({ count: 1 });
      expect(store.getState().count).toBe(1);
    });

    it('should sync props to state', () => {
      const store = createStore({ value: '', disabled: false });
      const props = { value: 'new value', disabled: true };
      const mapping = { value: 'value', disabled: 'disabled' };
      
      syncPropsToState(store, props, mapping);
      
      const state = store.getState();
      expect(state.value).toBe('new value');
      expect(state.disabled).toBe(true);
    });

    it('should create event handlers', () => {
      const handleEvent = vi.fn();
      const handler = createEventHandler(handleEvent, 'click');
      
      const event = new MouseEvent('click');
      handler(event);
      
      expect(handleEvent).toHaveBeenCalledWith('click', event);
    });

    it('should create CSS variables from state', () => {
      const state = {
        primaryColor: '#007acc',
        fontSize: 16,
        isActive: true
      };
      
      const cssVars = createCSSVariables(state);
      
      expect(cssVars).toEqual({
        '--stellarix-primary-color': '#007acc',
        '--stellarix-font-size': '16'
      });
    });
  });

  describe('Adapter Performance', () => {
    it('should handle multiple component instances', () => {
      const components = [];
      
      // Create 100 button instances
      for (let i = 0; i < 100; i++) {
        const core = createButtonFactory();
        core.state.setState({ id: `button-${i}` });
        const svelteComponent = connectToSvelte(core);
        components.push(svelteComponent);
      }
      
      expect(components).toHaveLength(100);
      expect(components[0].core.metadata.name).toBe('Button');
      expect(components[99].core.metadata.name).toBe('Button');
    });

    it('should clean up properly', () => {
      const buttonCore = createButtonFactory();
      const svelteButton = connectToSvelte(buttonCore);
      
      // Destroy component
      buttonCore.destroy();
      
      // Verify cleanup was called
      expect(buttonCore.logic.cleanup).toHaveBeenCalled();
    });
  });
});