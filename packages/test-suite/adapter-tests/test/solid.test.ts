import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent } from '@solidjs/testing-library';
import { createSignal, createEffect } from 'solid-js';
import { solidAdapter } from '@stellarix-ui/solid';
import { COMPONENTS, type ComponentName } from '../src/test-matrix';

describe('Solid Adapter Specific Tests', () => {
  afterEach(() => {
    cleanup();
  });
  
  describe('Solid.js Reactivity', () => {
    it('uses signals for state management', async () => {
      const { createToggleFactory } = await import('@stellarix-ui/toggle');
      const toggleCore = createToggleFactory();
      const Toggle = solidAdapter.createComponent(toggleCore);
      
      const { container } = render(() => Toggle({ checked: false }));
      
      const state = toggleCore.state.getState();
      expect(state.checked).toBe(false);
      
      if ('setChecked' in toggleCore.state) {
        toggleCore.state.setChecked(true);
        const newState = toggleCore.state.getState();
        expect(newState.checked).toBe(true);
      }
    });
    
    it('creates reactive effects', async () => {
      const { createInputFactory } = await import('@stellarix-ui/input');
      const inputCore = createInputFactory();
      const Input = solidAdapter.createComponent(inputCore);
      
      let effectCount = 0;
      
      render(() => {
        const component = Input({ value: 'initial' });
        
        createEffect(() => {
          const state = inputCore.state.getState();
          if (state.value) {
            effectCount++;
          }
        });
        
        return component;
      });
      
      expect(effectCount).toBeGreaterThan(0);
      
      if ('setValue' in inputCore.state) {
        inputCore.state.setValue('updated');
        expect(effectCount).toBeGreaterThan(1);
      }
    });
  });
  
  describe('Props Splitting', () => {
    it('correctly splits props', async () => {
      const { createButtonFactory } = await import('@stellarix-ui/button');
      const buttonCore = createButtonFactory();
      const Button = solidAdapter.createComponent(buttonCore);
      
      const { container } = render(() => 
        Button({ 
          class: 'custom-class',
          disabled: true,
          'data-testid': 'test-button',
          children: 'Click me'
        })
      );
      
      const button = container.querySelector('button');
      expect(button?.classList.contains('custom-class')).toBe(true);
      expect(button?.disabled).toBe(true);
      expect(button?.getAttribute('data-testid')).toBe('test-button');
      expect(button?.textContent).toBe('Click me');
    });
  });
  
  describe('Control Flow Components', () => {
    it('uses Show for conditional rendering', async () => {
      const { createDialogFactory } = await import('@stellarix-ui/dialog');
      const dialogCore = createDialogFactory();
      const Dialog = solidAdapter.createComponent(dialogCore);
      
      const [open, setOpen] = createSignal(false);
      
      const { container, rerender } = render(() => 
        Dialog({ open: open(), children: 'Dialog content' })
      );
      
      expect(container.querySelector('[role="dialog"]')).toBeFalsy();
      
      setOpen(true);
      rerender(() => Dialog({ open: open(), children: 'Dialog content' }));
      
      expect(container.querySelector('[role="dialog"]')).toBeTruthy();
    });
    
    it('uses For for list rendering', async () => {
      const { createSelectFactory } = await import('@stellarix-ui/select');
      const selectCore = createSelectFactory({
        options: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
          { value: '3', label: 'Option 3' }
        ]
      });
      const Select = solidAdapter.createComponent(selectCore);
      
      const { container } = render(() => Select({}));
      
      const trigger = container.querySelector('[role="button"]');
      fireEvent.click(trigger!);
      
      const options = container.querySelectorAll('[role="option"]');
      expect(options).toHaveLength(3);
    });
  });
  
  describe('Dynamic Components', () => {
    it('uses Dynamic for element type switching', async () => {
      const { createDividerFactory } = await import('@stellarix-ui/divider');
      const dividerCore = createDividerFactory();
      const Divider = solidAdapter.createComponent(dividerCore);
      
      const { container } = render(() => Divider({}));
      
      const divider = container.firstElementChild;
      expect(divider?.tagName.toLowerCase()).toBe('div');
    });
  });
  
  describe('Portal Components', () => {
    it('renders portals for overlay components', async () => {
      const { createTooltipFactory } = await import('@stellarix-ui/tooltip');
      const tooltipCore = createTooltipFactory();
      const Tooltip = solidAdapter.createComponent(tooltipCore);
      
      if ('setVisible' in tooltipCore.state) {
        tooltipCore.state.setVisible(true);
      }
      
      const { container } = render(() => 
        Tooltip({ content: 'Tooltip text', visible: true })
      );
      
      const tooltip = container.querySelector('[role="tooltip"]');
      expect(tooltip).toBeTruthy();
      expect(tooltip?.textContent).toBe('Tooltip text');
    });
  });
  
  describe('Event Handling', () => {
    it('batches state updates', async () => {
      const { createCheckboxFactory } = await import('@stellarix-ui/checkbox');
      const checkboxCore = createCheckboxFactory();
      const Checkbox = solidAdapter.createComponent(checkboxCore);
      
      let updateCount = 0;
      const unsubscribe = checkboxCore.state.subscribe(() => {
        updateCount++;
      });
      
      const { container } = render(() => Checkbox({}));
      
      const checkbox = container.querySelector('input[type="checkbox"]');
      fireEvent.click(checkbox!);
      
      expect(updateCount).toBe(1);
      
      unsubscribe();
    });
  });
  
  describe('Lifecycle', () => {
    it('calls onMount lifecycle', async () => {
      const { createSliderFactory } = await import('@stellarix-ui/slider');
      const sliderCore = createSliderFactory();
      const Slider = solidAdapter.createComponent(sliderCore);
      
      const initSpy = vi.spyOn(sliderCore.logic, 'init');
      
      render(() => Slider({}));
      
      if (sliderCore.logic.init) {
        expect(initSpy).toHaveBeenCalled();
      }
    });
    
    it('calls onCleanup lifecycle', async () => {
      const { createPopoverFactory } = await import('@stellarix-ui/popover');
      const popoverCore = createPopoverFactory();
      const Popover = solidAdapter.createComponent(popoverCore);
      
      const cleanupSpy = vi.spyOn(popoverCore.logic, 'cleanup');
      
      const { unmount } = render(() => Popover({}));
      
      unmount();
      
      if (popoverCore.logic.cleanup) {
        expect(cleanupSpy).toHaveBeenCalled();
      }
    });
  });
  
  describe('Memoization', () => {
    it('uses createMemo for computed values', async () => {
      const { createProgressBarFactory } = await import('@stellarix-ui/progress-bar');
      const progressCore = createProgressBarFactory();
      const ProgressBar = solidAdapter.createComponent(progressCore);
      
      const { container } = render(() => 
        ProgressBar({ value: 50, max: 100 })
      );
      
      const progressBar = container.firstElementChild;
      expect(progressBar).toBeTruthy();
      
      const state = progressCore.state.getState();
      expect(state.value).toBe(50);
    });
  });
});

export default {};