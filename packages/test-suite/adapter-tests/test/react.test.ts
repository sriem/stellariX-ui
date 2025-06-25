import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { reactAdapter } from '@stellarix-ui/react';
import { COMPONENTS, type ComponentName } from '../src/test-matrix';
import { loadComponent } from '../src/component-loader';

describe('React Adapter Specific Tests', () => {
  afterEach(() => {
    cleanup();
  });
  
  describe('React 19 Features', () => {
    it('supports ref as prop pattern', async () => {
      const { createButtonFactory } = await import('@stellarix-ui/button');
      const buttonCore = createButtonFactory();
      const Button = reactAdapter.createComponent(buttonCore);
      
      const ref = React.createRef<HTMLButtonElement>();
      const { container } = render(
        React.createElement(Button, { ref, children: 'Click me' })
      );
      
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current?.tagName).toBe('BUTTON');
    });
    
    it('handles state updates correctly', async () => {
      const { createCheckboxFactory } = await import('@stellarix-ui/checkbox');
      const checkboxCore = createCheckboxFactory();
      const Checkbox = reactAdapter.createComponent(checkboxCore);
      
      const onChange = vi.fn();
      const { container } = render(
        React.createElement(Checkbox, { onChange })
      );
      
      const checkbox = container.querySelector('input[type="checkbox"]');
      expect(checkbox).toBeTruthy();
      
      fireEvent.click(checkbox!);
      
      await waitFor(() => {
        expect(checkbox).toHaveProperty('checked', true);
      });
    });
  });
  
  describe('Compound Components', () => {
    it('renders Select component with options', async () => {
      const { createSelectFactory } = await import('@stellarix-ui/select');
      const selectCore = createSelectFactory({
        options: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
          { value: '3', label: 'Option 3' }
        ]
      });
      const Select = reactAdapter.createComponent(selectCore);
      
      const { container, getByRole } = render(
        React.createElement(Select, { placeholder: 'Choose an option' })
      );
      
      const trigger = getByRole('button');
      expect(trigger).toBeTruthy();
      expect(trigger.textContent).toContain('Choose an option');
      
      fireEvent.click(trigger);
      
      await waitFor(() => {
        const listbox = container.querySelector('[role="listbox"]');
        expect(listbox).toBeTruthy();
        
        const options = container.querySelectorAll('[role="option"]');
        expect(options).toHaveLength(3);
      });
    });
    
    it('renders Dialog with portal behavior', async () => {
      const { createDialogFactory } = await import('@stellarix-ui/dialog');
      const dialogCore = createDialogFactory({ open: true });
      const Dialog = reactAdapter.createComponent(dialogCore);
      
      const { container } = render(
        React.createElement(Dialog, { 
          children: 'Dialog content',
          open: true 
        })
      );
      
      const dialog = container.querySelector('[role="dialog"]');
      expect(dialog).toBeTruthy();
      
      const backdrop = container.querySelector('[data-part="backdrop"]');
      expect(backdrop).toBeTruthy();
    });
    
    it('renders Tabs component correctly', async () => {
      const { createTabsFactory } = await import('@stellarix-ui/tabs');
      const tabsCore = createTabsFactory({
        tabs: [
          { id: 'tab1', label: 'Tab 1', content: 'Content 1' },
          { id: 'tab2', label: 'Tab 2', content: 'Content 2' },
          { id: 'tab3', label: 'Tab 3', content: 'Content 3' }
        ]
      });
      const Tabs = reactAdapter.createComponent(tabsCore);
      
      const { container, getAllByRole } = render(
        React.createElement(Tabs)
      );
      
      const tabs = getAllByRole('tab');
      expect(tabs).toHaveLength(3);
      
      const panels = container.querySelectorAll('[role="tabpanel"]');
      expect(panels).toHaveLength(1);
      
      fireEvent.click(tabs[1]);
      
      await waitFor(() => {
        expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
      });
    });
  });
  
  describe('Accessibility', () => {
    it('applies ARIA attributes correctly', async () => {
      const { createInputFactory } = await import('@stellarix-ui/input');
      const inputCore = createInputFactory({
        required: true,
        placeholder: 'Enter text'
      });
      const Input = reactAdapter.createComponent(inputCore);
      
      const { container } = render(
        React.createElement(Input, { 
          'aria-label': 'Text input',
          'aria-describedby': 'help-text'
        })
      );
      
      const input = container.querySelector('input');
      expect(input).toHaveAttribute('aria-label', 'Text input');
      expect(input).toHaveAttribute('aria-describedby', 'help-text');
      expect(input).toHaveAttribute('required');
    });
  });
  
  describe('Event Handling', () => {
    it('handles all standard events', async () => {
      const { createButtonFactory } = await import('@stellarix-ui/button');
      const buttonCore = createButtonFactory();
      const Button = reactAdapter.createComponent(buttonCore);
      
      const handlers = {
        onClick: vi.fn(),
        onFocus: vi.fn(),
        onBlur: vi.fn(),
        onMouseEnter: vi.fn(),
        onMouseLeave: vi.fn()
      };
      
      const { container } = render(
        React.createElement(Button, { ...handlers, children: 'Test' })
      );
      
      const button = container.querySelector('button');
      
      fireEvent.click(button!);
      expect(handlers.onClick).toHaveBeenCalled();
      
      fireEvent.focus(button!);
      expect(handlers.onFocus).toHaveBeenCalled();
      
      fireEvent.blur(button!);
      expect(handlers.onBlur).toHaveBeenCalled();
      
      fireEvent.mouseEnter(button!);
      expect(handlers.onMouseEnter).toHaveBeenCalled();
      
      fireEvent.mouseLeave(button!);
      expect(handlers.onMouseLeave).toHaveBeenCalled();
    });
  });
  
  describe('Component Lifecycle', () => {
    it('cleans up properly on unmount', async () => {
      const { createTooltipFactory } = await import('@stellarix-ui/tooltip');
      const tooltipCore = createTooltipFactory();
      const Tooltip = reactAdapter.createComponent(tooltipCore);
      
      const cleanupSpy = vi.spyOn(tooltipCore.logic, 'cleanup');
      
      const { unmount } = render(
        React.createElement(Tooltip, { content: 'Tooltip text' })
      );
      
      unmount();
      
      if (tooltipCore.logic.cleanup) {
        expect(cleanupSpy).toHaveBeenCalled();
      }
    });
  });
});

export default {};