import { describe, it, expect, vi } from 'vitest';
import { svelteAdapter } from '@stellarix-ui/svelte';
import { COMPONENTS, type ComponentName } from '../src/test-matrix';

describe('Svelte Adapter Specific Tests', () => {
  describe('Svelte 5 Runes', () => {
    it('uses $state rune for reactive state', async () => {
      const { createToggleFactory } = await import('@stellarix-ui/toggle');
      const toggleCore = createToggleFactory();
      const Toggle = svelteAdapter.createComponent(toggleCore);
      
      const instance = Toggle({ props: { checked: false } });
      expect(instance.$$state).toBeDefined();
      
      const state = toggleCore.state.getState();
      expect(state.checked).toBe(false);
      
      if ('setChecked' in toggleCore.state) {
        toggleCore.state.setChecked(true);
        const newState = toggleCore.state.getState();
        expect(newState.checked).toBe(true);
      }
    });
    
    it('syncs props to state', async () => {
      const { createInputFactory } = await import('@stellarix-ui/input');
      const inputCore = createInputFactory();
      const Input = svelteAdapter.createComponent(inputCore);
      
      const instance = Input({ 
        props: { 
          value: 'initial',
          placeholder: 'Enter text'
        } 
      });
      
      expect(instance.$$props.value).toBe('initial');
      expect(instance.$$props.placeholder).toBe('Enter text');
      
      instance.$set({ value: 'updated' });
      expect(instance.$$props.value).toBe('updated');
    });
  });
  
  describe('Component Factory', () => {
    it('creates component instances correctly', async () => {
      const { createButtonFactory } = await import('@stellarix-ui/button');
      const buttonCore = createButtonFactory();
      const Button = svelteAdapter.createComponent(buttonCore);
      
      const instance = Button({
        props: {
          disabled: true
        }
      });
      
      expect(instance).toBeDefined();
      expect(instance.$$stellarix_core).toBe(buttonCore);
      expect(instance.$destroy).toBeDefined();
      expect(instance.$set).toBeDefined();
    });
  });
  
  describe('Lifecycle Methods', () => {
    it('handles cleanup on destroy', async () => {
      const { createTooltipFactory } = await import('@stellarix-ui/tooltip');
      const tooltipCore = createTooltipFactory();
      const Tooltip = svelteAdapter.createComponent(tooltipCore);
      
      const cleanupSpy = vi.spyOn(tooltipCore.logic, 'cleanup');
      const instance = Tooltip({ props: {} });
      
      instance.$destroy();
      
      if (tooltipCore.logic.cleanup) {
        expect(cleanupSpy).toHaveBeenCalled();
      }
    });
  });
  
  describe('State Bindings', () => {
    it('creates reactive state bindings', async () => {
      const { createCheckboxFactory } = await import('@stellarix-ui/checkbox');
      const checkboxCore = createCheckboxFactory();
      const Checkbox = svelteAdapter.createComponent(checkboxCore);
      
      const instance = Checkbox({ props: { checked: false } });
      
      expect(instance.$$state).toBeDefined();
      expect(instance.$$state.checked).toBe(false);
      
      if ('setChecked' in checkboxCore.state) {
        checkboxCore.state.setChecked(true);
        expect(instance.$$state.checked).toBe(true);
      }
    });
  });
  
  describe('Event Handling', () => {
    it('integrates with StellarIX event system', async () => {
      const { createSelectFactory } = await import('@stellarix-ui/select');
      const selectCore = createSelectFactory({
        options: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' }
        ]
      });
      const Select = svelteAdapter.createComponent(selectCore);
      
      const instance = Select({ props: {} });
      
      const logic = selectCore.logic;
      const handlers = logic.getInteractionHandlers('trigger');
      
      expect(handlers).toBeDefined();
      expect(typeof handlers.onClick).toBe('function');
    });
  });
  
  describe('Props Mapping', () => {
    const propMappingTests = [
      { component: 'input', props: { value: 'test', placeholder: 'Enter text' } },
      { component: 'checkbox', props: { checked: true, disabled: false } },
      { component: 'select', props: { clearable: true, searchable: true } },
      { component: 'dialog', props: { open: true } },
      { component: 'tabs', props: { orientation: 'horizontal' } }
    ];
    
    propMappingTests.forEach(({ component, props }) => {
      it(`maps props correctly for ${component}`, async () => {
        const moduleName = component.charAt(0).toUpperCase() + component.slice(1);
        const factoryName = `create${moduleName}Factory`;
        const module = await import(`@stellarix-ui/${component}`);
        const factory = module[factoryName];
        const core = factory();
        const Component = svelteAdapter.createComponent(core);
        
        const instance = Component({ props });
        
        Object.entries(props).forEach(([key, value]) => {
          expect(instance.$$props[key]).toBe(value);
        });
      });
    });
  });
  
  describe('Compound Components', () => {
    it('handles compound component structure', async () => {
      const { createTabsFactory } = await import('@stellarix-ui/tabs');
      const tabsCore = createTabsFactory({
        tabs: [
          { id: 'tab1', label: 'Tab 1', content: 'Content 1' },
          { id: 'tab2', label: 'Tab 2', content: 'Content 2' }
        ]
      });
      const Tabs = svelteAdapter.createComponent(tabsCore);
      
      const instance = Tabs({ props: {} });
      
      const tabListA11y = tabsCore.logic.getA11yProps('tabList');
      expect(tabListA11y).toBeDefined();
      
      const tabA11y = tabsCore.logic.getA11yProps('tab');
      expect(typeof tabA11y).toBe('function');
    });
  });
});

export default {};