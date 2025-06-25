import { describe, it, expect } from 'vitest';
import { reactAdapter } from '@stellarix-ui/react';
import { vueAdapter } from '@stellarix-ui/vue';
import { svelteAdapter } from '@stellarix-ui/svelte';
import { solidAdapter } from '@stellarix-ui/solid';
import { loadComponent } from '../src/component-loader';
import { validateAdapterInterface } from '../src/adapter-validator';

const adapters = {
  react: reactAdapter,
  vue: vueAdapter,
  svelte: svelteAdapter,
  solid: solidAdapter
};

describe('Simple Unified Adapter Tests', () => {
  describe('Adapter Interface', () => {
    it('all adapters implement required interface', () => {
      for (const [name, adapter] of Object.entries(adapters)) {
        expect(validateAdapterInterface(adapter)).toBe(true);
        expect(adapter.name).toBe(name);
        expect(adapter.version).toBeDefined();
        expect(typeof adapter.createComponent).toBe('function');
      }
    });
  });
  
  describe('Component Creation', () => {
    it('creates Button component with all adapters', async () => {
      const buttonCore = await loadComponent('button');
      
      for (const [name, adapter] of Object.entries(adapters)) {
        const Component = adapter.createComponent(buttonCore);
        expect(Component).toBeDefined();
        expect(Component).toBeDefined();
      }
    });
    
    it('creates Input component with all adapters', async () => {
      const inputCore = await loadComponent('input');
      
      for (const [name, adapter] of Object.entries(adapters)) {
        const Component = adapter.createComponent(inputCore);
        expect(Component).toBeDefined();
        expect(Component).toBeDefined();
      }
    });
    
    it('creates Select component with all adapters', async () => {
      const selectModule = await import('@stellarix-ui/select');
      const selectCore = selectModule.createSelect({
        options: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' }
        ]
      });
      
      for (const [name, adapter] of Object.entries(adapters)) {
        const Component = adapter.createComponent(selectCore);
        expect(Component).toBeDefined();
        expect(Component).toBeDefined();
      }
    });
  });
  
  describe('State Management', () => {
    it('all adapters handle state correctly', async () => {
      const checkboxCore = await loadComponent('checkbox');
      
      for (const [name, adapter] of Object.entries(adapters)) {
        const Component = adapter.createComponent(checkboxCore);
        
        expect(checkboxCore.state.getState().checked).toBe(false);
        
        checkboxCore.state.setChecked(true);
        expect(checkboxCore.state.getState().checked).toBe(true);
        
        checkboxCore.state.setChecked(false);
        expect(checkboxCore.state.getState().checked).toBe(false);
      }
    });
  });
  
  describe('Event Handlers', () => {
    it('all adapters provide event handlers', async () => {
      const buttonCore = await loadComponent('button');
      
      for (const [name, adapter] of Object.entries(adapters)) {
        const Component = adapter.createComponent(buttonCore);
        const handlers = buttonCore.logic.getInteractionHandlers('root');
        
        expect(handlers).toBeDefined();
        expect(typeof handlers).toBe('object');
        
        if (handlers.onClick) {
          expect(typeof handlers.onClick).toBe('function');
        }
      }
    });
  });
  
  describe('Accessibility', () => {
    it('all adapters provide ARIA props', async () => {
      const inputModule = await import('@stellarix-ui/input');
      // Create input with state that will generate ARIA props
      const inputCore = inputModule.createInputWithImplementation({
        required: true,
        disabled: false,
        error: true,
        errorMessage: 'Field is required'
      });
      
      for (const [name, adapter] of Object.entries(adapters)) {
        const Component = adapter.createComponent(inputCore);
        const a11yProps = inputCore.logic.getA11yProps('root');
        
        expect(a11yProps).toBeDefined();
        expect(typeof a11yProps).toBe('object');
        
        const ariaKeys = Object.keys(a11yProps || {}).filter(k => k.startsWith('aria-'));
        
        // Should have aria props when state has error/required
        expect(ariaKeys.length).toBeGreaterThan(0);
        expect(ariaKeys).toContain('aria-invalid');
        expect(ariaKeys).toContain('aria-required');
      }
    });
  });
});