/**
 * Breadcrumb Component Unit Tests
 * Testing state management, logic, and component behavior
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createBreadcrumb } from './index';
import { createBreadcrumbState } from './state';
import { createBreadcrumbLogic } from './logic';
import type { BreadcrumbItem } from './types';

describe('Breadcrumb Component', () => {
  describe('State Management', () => {
    it('should initialize with default state', () => {
      const state = createBreadcrumbState();
      const currentState = state.getState();
      
      expect(currentState.items).toEqual([]);
      expect(currentState.separator).toBe('/');
      expect(currentState.maxItems).toBeUndefined();
      expect(currentState.disabled).toBe(false);
      expect(currentState.focusedIndex).toBe(-1);
      expect(currentState.showHomeIcon).toBe(false);
    });
    
    it('should initialize with provided options', () => {
      const items: BreadcrumbItem[] = [
        { id: 'home', label: 'Home', href: '/' },
        { id: 'about', label: 'About', href: '/about' },
      ];
      
      const state = createBreadcrumbState({
        items,
        separator: '>',
        maxItems: 5,
        disabled: true,
        showHomeIcon: true,
      });
      
      const currentState = state.getState();
      expect(currentState.items).toEqual(items);
      expect(currentState.separator).toBe('>');
      expect(currentState.maxItems).toBe(5);
      expect(currentState.disabled).toBe(true);
      expect(currentState.showHomeIcon).toBe(true);
    });
    
    it('should update items', () => {
      const state = createBreadcrumbState();
      const items: BreadcrumbItem[] = [
        { id: 'home', label: 'Home', href: '/' },
        { id: 'products', label: 'Products', href: '/products' },
      ];
      
      state.setItems(items);
      expect(state.getState().items).toEqual(items);
    });
    
    it('should add item', () => {
      const state = createBreadcrumbState({
        items: [{ id: 'home', label: 'Home', href: '/' }],
      });
      
      const newItem: BreadcrumbItem = { id: 'about', label: 'About', href: '/about' };
      state.addItem(newItem);
      
      expect(state.getState().items).toHaveLength(2);
      expect(state.getState().items[1]).toEqual(newItem);
    });
    
    it('should remove item by id', () => {
      const state = createBreadcrumbState({
        items: [
          { id: 'home', label: 'Home', href: '/' },
          { id: 'about', label: 'About', href: '/about' },
          { id: 'contact', label: 'Contact', href: '/contact' },
        ],
      });
      
      state.removeItem('about');
      
      const items = state.getState().items;
      expect(items).toHaveLength(2);
      expect(items.find(item => item.id === 'about')).toBeUndefined();
    });
    
    it('should update item by id', () => {
      const state = createBreadcrumbState({
        items: [
          { id: 'home', label: 'Home', href: '/' },
          { id: 'about', label: 'About', href: '/about' },
        ],
      });
      
      state.updateItem('about', { label: 'About Us', current: true });
      
      const updatedItem = state.getState().items.find(item => item.id === 'about');
      expect(updatedItem?.label).toBe('About Us');
      expect(updatedItem?.current).toBe(true);
      expect(updatedItem?.href).toBe('/about');
    });
    
    it('should set current item by id', () => {
      const state = createBreadcrumbState({
        items: [
          { id: 'home', label: 'Home', href: '/' },
          { id: 'about', label: 'About', href: '/about' },
          { id: 'contact', label: 'Contact', href: '/contact' },
        ],
      });
      
      state.setCurrentItem('about');
      
      const items = state.getState().items;
      expect(items[0].current).toBe(false);
      expect(items[1].current).toBe(true);
      expect(items[2].current).toBe(false);
    });
    
    it('should clear all items', () => {
      const state = createBreadcrumbState({
        items: [
          { id: 'home', label: 'Home', href: '/' },
          { id: 'about', label: 'About', href: '/about' },
        ],
      });
      
      state.clearItems();
      expect(state.getState().items).toEqual([]);
    });
    
    it('should update other state properties', () => {
      const state = createBreadcrumbState();
      
      state.setDisabled(true);
      expect(state.getState().disabled).toBe(true);
      
      state.setSeparator('|');
      expect(state.getState().separator).toBe('|');
      
      state.setMaxItems(3);
      expect(state.getState().maxItems).toBe(3);
      
      state.setShowHomeIcon(true);
      expect(state.getState().showHomeIcon).toBe(true);
      
      state.setFocusedIndex(2);
      expect(state.getState().focusedIndex).toBe(2);
    });
    
    it('should handle state subscriptions', () => {
      const state = createBreadcrumbState();
      const listener = vi.fn();
      
      const unsubscribe = state.subscribe(listener);
      
      state.setItems([{ id: 'home', label: 'Home', href: '/' }]);
      expect(listener).toHaveBeenCalledWith(state.getState());
      
      unsubscribe();
      state.setDisabled(true);
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('Logic Layer', () => {
    let state: ReturnType<typeof createBreadcrumbState>;
    let logic: ReturnType<typeof createBreadcrumbLogic>;
    
    beforeEach(() => {
      state = createBreadcrumbState({
        items: [
          { id: 'home', label: 'Home', href: '/' },
          { id: 'products', label: 'Products', href: '/products' },
          { id: 'phones', label: 'Phones', href: '/products/phones' },
          { id: 'iphone', label: 'iPhone', current: true },
        ],
      });
      logic = createBreadcrumbLogic(state);
    });
    
    describe('A11y Properties', () => {
      it('should provide correct root a11y props', () => {
        const props = logic.getA11yProps('root', state.getState());
        
        expect(props.role).toBe('navigation');
        expect(props['aria-label']).toBe('Breadcrumb');
        expect(props['aria-disabled']).toBeUndefined();
        
        state.setDisabled(true);
        const disabledProps = logic.getA11yProps('root', state.getState());
        expect(disabledProps['aria-disabled']).toBe('true');
      });
      
      it('should provide correct list a11y props', () => {
        const props = logic.getA11yProps('list', state.getState());
        expect(props.role).toBe('list');
      });
      
      it('should provide correct item a11y props', () => {
        const props = logic.getA11yProps('item', state.getState(), { index: 3 });
        
        expect(props.role).toBe('listitem');
        expect(props['aria-current']).toBe('page');
        expect(props['aria-disabled']).toBeUndefined();
        
        // Non-current item
        const nonCurrentProps = logic.getA11yProps('item', state.getState(), { index: 0 });
        expect(nonCurrentProps['aria-current']).toBeUndefined();
      });
      
      it('should provide correct link a11y props', () => {
        const props = logic.getA11yProps('link', state.getState(), { index: 0 });
        
        expect(props.tabIndex).toBe(0);
        expect(props['aria-disabled']).toBeUndefined();
        expect(props['aria-current']).toBeUndefined();
        expect(props.href).toBe('/');
        expect(props.role).toBeUndefined(); // Has href, so no button role
        
        // Current item
        const currentProps = logic.getA11yProps('link', state.getState(), { index: 3 });
        expect(currentProps['aria-current']).toBe('page');
        expect(currentProps.href).toBeUndefined(); // No href for current item
        expect(currentProps.role).toBe('button'); // No href, so button role
        
        // Disabled breadcrumb
        state.setDisabled(true);
        const disabledProps = logic.getA11yProps('link', state.getState(), { index: 0 });
        expect(disabledProps.tabIndex).toBe(-1);
        expect(disabledProps['aria-disabled']).toBe('true');
        expect(disabledProps.href).toBeUndefined(); // No href when disabled
      });
    });
    
    describe('Click Interactions', () => {
      it('should handle item click', () => {
        const onItemClick = vi.fn();
        const logicWithCallback = createBreadcrumbLogic(state, { onItemClick });
        
        const event = new MouseEvent('click') as any;
        event.index = 1;
        event.preventDefault = vi.fn();
        
        const handlers = logicWithCallback.getInteractionHandlers('link', state.getState());
        handlers.onClick(event);
        
        expect(onItemClick).toHaveBeenCalledWith(state.getState().items[1], 1);
        expect(event.preventDefault).not.toHaveBeenCalled(); // Has href
      });
      
      it('should prevent default for items without href', () => {
        const onItemClick = vi.fn();
        const logicWithCallback = createBreadcrumbLogic(state, { onItemClick });
        
        const event = new MouseEvent('click') as any;
        event.index = 3; // Current item has no href
        event.preventDefault = vi.fn();
        
        const handlers = logicWithCallback.getInteractionHandlers('link', state.getState());
        handlers.onClick(event);
        
        expect(event.preventDefault).toHaveBeenCalled();
        expect(onItemClick).toHaveBeenCalledWith(state.getState().items[3], 3);
      });
      
      it('should not handle click when disabled', () => {
        state.setDisabled(true);
        const onItemClick = vi.fn();
        const logicWithCallback = createBreadcrumbLogic(state, { onItemClick });
        
        const event = new MouseEvent('click') as any;
        event.index = 0;
        event.preventDefault = vi.fn();
        
        const handlers = logicWithCallback.getInteractionHandlers('link', state.getState());
        handlers.onClick(event);
        
        expect(event.preventDefault).toHaveBeenCalled();
        expect(onItemClick).not.toHaveBeenCalled();
      });
      
      it('should not handle click on disabled items', () => {
        state.updateItem('products', { disabled: true });
        const onItemClick = vi.fn();
        const logicWithCallback = createBreadcrumbLogic(state, { onItemClick });
        
        const event = new MouseEvent('click') as any;
        event.index = 1;
        event.preventDefault = vi.fn();
        
        const handlers = logicWithCallback.getInteractionHandlers('link', state.getState());
        handlers.onClick(event);
        
        expect(event.preventDefault).toHaveBeenCalled();
        expect(onItemClick).not.toHaveBeenCalled();
      });
    });
    
    describe('Keyboard Navigation', () => {
      it('should navigate with arrow keys', () => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' }) as any;
        event.index = 0;
        event.preventDefault = vi.fn();
        event.target = {
          closest: vi.fn().mockReturnValue({
            querySelectorAll: vi.fn().mockReturnValue([
              { focus: vi.fn() },
              { focus: vi.fn() },
              { focus: vi.fn() },
              { focus: vi.fn() },
            ]),
          }),
        };
        
        const handlers = logic.getInteractionHandlers('link', state.getState());
        handlers.onKeyDown(event);
        
        expect(event.preventDefault).toHaveBeenCalled();
        expect(state.getState().focusedIndex).toBe(1);
        
        // Arrow left
        const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' }) as any;
        leftEvent.index = 2;
        leftEvent.preventDefault = vi.fn();
        leftEvent.target = event.target;
        
        handlers.onKeyDown(leftEvent);
        expect(leftEvent.preventDefault).toHaveBeenCalled();
        expect(state.getState().focusedIndex).toBe(1);
      });
      
      it('should navigate to first/last with Home/End keys', () => {
        const event = new KeyboardEvent('keydown', { key: 'End' }) as any;
        event.index = 0;
        event.preventDefault = vi.fn();
        event.target = {
          closest: vi.fn().mockReturnValue({
            querySelectorAll: vi.fn().mockReturnValue([
              { focus: vi.fn() },
              { focus: vi.fn() },
              { focus: vi.fn() },
              { focus: vi.fn() },
            ]),
          }),
        };
        
        const handlers = logic.getInteractionHandlers('link', state.getState());
        handlers.onKeyDown(event);
        
        expect(event.preventDefault).toHaveBeenCalled();
        expect(state.getState().focusedIndex).toBe(3);
        
        // Home key
        const homeEvent = new KeyboardEvent('keydown', { key: 'Home' }) as any;
        homeEvent.index = 3;
        homeEvent.preventDefault = vi.fn();
        homeEvent.target = event.target;
        
        handlers.onKeyDown(homeEvent);
        expect(homeEvent.preventDefault).toHaveBeenCalled();
        expect(state.getState().focusedIndex).toBe(0);
      });
      
      it('should activate items with Enter/Space', () => {
        const onItemClick = vi.fn();
        const logicWithCallback = createBreadcrumbLogic(state, { onItemClick });
        
        // Test Space key on item without href
        const spaceEvent = new KeyboardEvent('keydown', { key: ' ' }) as any;
        spaceEvent.index = 3; // Current item has no href
        spaceEvent.preventDefault = vi.fn();
        
        const handlers = logicWithCallback.getInteractionHandlers('link', state.getState());
        handlers.onKeyDown(spaceEvent);
        
        expect(spaceEvent.preventDefault).toHaveBeenCalled();
        expect(onItemClick).toHaveBeenCalledWith(state.getState().items[3], 3);
        
        // Test Enter key
        onItemClick.mockClear();
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' }) as any;
        enterEvent.index = 3;
        enterEvent.preventDefault = vi.fn();
        
        handlers.onKeyDown(enterEvent);
        expect(enterEvent.preventDefault).toHaveBeenCalled();
        expect(onItemClick).toHaveBeenCalledWith(state.getState().items[3], 3);
      });
      
      it('should skip disabled items during navigation', () => {
        state.updateItem('products', { disabled: true });
        
        const event = new KeyboardEvent('keydown', { key: 'ArrowRight' }) as any;
        event.index = 0;
        event.preventDefault = vi.fn();
        event.target = {
          closest: vi.fn().mockReturnValue({
            querySelectorAll: vi.fn().mockReturnValue([
              { focus: vi.fn() },
              { focus: vi.fn() },
              { focus: vi.fn() },
              { focus: vi.fn() },
            ]),
          }),
        };
        
        const handlers = logic.getInteractionHandlers('link', state.getState());
        handlers.onKeyDown(event);
        
        // Should skip index 1 (disabled) and go to index 2
        expect(state.getState().focusedIndex).toBe(2);
      });
    });
    
    describe('Focus Management', () => {
      it('should handle focus events', () => {
        const focusEvent = new FocusEvent('focus') as any;
        focusEvent.index = 2;
        
        const handlers = logic.getInteractionHandlers('link', state.getState());
        handlers.onFocus(focusEvent);
        
        expect(state.getState().focusedIndex).toBe(2);
      });
      
      it('should handle blur events', () => {
        state.setFocusedIndex(2);
        
        const blurEvent = new FocusEvent('blur') as any;
        blurEvent.relatedTarget = null;
        blurEvent.target = {
          closest: vi.fn().mockReturnValue({
            contains: vi.fn().mockReturnValue(false),
          }),
        };
        
        const handlers = logic.getInteractionHandlers('link', state.getState());
        handlers.onBlur(blurEvent);
        
        expect(state.getState().focusedIndex).toBe(-1);
      });
      
      it('should not clear focus when moving within breadcrumb', () => {
        state.setFocusedIndex(2);
        
        const relatedTarget = document.createElement('a');
        const breadcrumbNav = document.createElement('nav');
        breadcrumbNav.appendChild(relatedTarget);
        
        const blurEvent = new FocusEvent('blur') as any;
        blurEvent.relatedTarget = relatedTarget;
        blurEvent.target = {
          closest: vi.fn().mockReturnValue(breadcrumbNav),
        };
        
        const handlers = logic.getInteractionHandlers('link', state.getState());
        handlers.onBlur(blurEvent);
        
        expect(state.getState().focusedIndex).toBe(2); // Not cleared
      });
    });
    
    describe('Truncation', () => {
      it('should handle truncation in logic', () => {
        // Create a breadcrumb with many items
        const manyItems = Array.from({ length: 10 }, (_, i) => ({
          id: `item-${i}`,
          label: `Item ${i + 1}`,
          href: `/item-${i + 1}`,
        }));
        
        const truncatedState = createBreadcrumbState({
          items: manyItems,
          maxItems: 5,
        });
        
        const truncatedLogic = createBreadcrumbLogic(truncatedState);
        
        // The truncation logic is implemented in the UI layer
        // Logic layer should handle all items correctly
        const props = truncatedLogic.getA11yProps('item', truncatedState.getState(), { index: 0 });
        expect(props.role).toBe('listitem');
      });
    });
  });
  
  describe('Component Integration', () => {
    it('should create component with default options', () => {
      const component = createBreadcrumb();
      
      expect(component).toBeDefined();
      expect(component.id).toBe('breadcrumb');
      expect(component.state).toBeDefined();
      expect(component.logic).toBeDefined();
    });
    
    it('should create component with custom options', () => {
      const items: BreadcrumbItem[] = [
        { id: 'home', label: 'Home', href: '/' },
        { id: 'about', label: 'About', href: '/about' },
      ];
      
      const onChange = vi.fn();
      const onItemClick = vi.fn();
      
      const component = createBreadcrumb({
        id: 'custom-breadcrumb',
        items,
        separator: '>',
        maxItems: 3,
        disabled: false,
        showHomeIcon: true,
        onChange,
        onItemClick,
      });
      
      expect(component.id).toBe('custom-breadcrumb');
      
      const state = component.state.getState();
      expect(state.items).toEqual(items);
      expect(state.separator).toBe('>');
      expect(state.maxItems).toBe(3);
      expect(state.showHomeIcon).toBe(true);
    });
    
    it('should handle component lifecycle', () => {
      const component = createBreadcrumb();
      
      // Test state updates
      component.state.setItems([
        { id: 'home', label: 'Home', href: '/' },
        { id: 'about', label: 'About', href: '/about' },
      ]);
      
      expect(component.state.getState().items).toHaveLength(2);
      
      // Test cleanup
      component.destroy();
      expect(() => component.state.getState()).not.toThrow();
    });
  });
});