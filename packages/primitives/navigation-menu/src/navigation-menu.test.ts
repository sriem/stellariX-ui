import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createNavigationMenu, createNavigationMenuCore } from './index';
import { getMenuItemA11yProps, createMenuItemHandlers } from './logic';
import type { NavigationMenuItem } from './types';

describe('NavigationMenu', () => {
    const sampleItems: NavigationMenuItem[] = [
        {
            id: 'home',
            label: 'Home',
            href: '/',
            active: true,
        },
        {
            id: 'products',
            label: 'Products',
            children: [
                { id: 'electronics', label: 'Electronics', href: '/products/electronics' },
                { id: 'clothing', label: 'Clothing', href: '/products/clothing' },
            ],
        },
        {
            id: 'about',
            label: 'About',
            href: '/about',
            disabled: true,
        },
    ];
    
    describe('State Management', () => {
        it('should initialize with default state', () => {
            const menu = createNavigationMenu();
            const state = menu.state.getState();
            
            expect(state.items).toEqual([]);
            expect(state.orientation).toBe('horizontal');
            expect(state.collapsed).toBe(false);
            expect(state.disabled).toBe(false);
            expect(state.focusedItemId).toBe(null);
            expect(state.activeItemId).toBe(null);
            expect(state.expandedItemIds).toEqual([]);
            expect(state.trigger).toBe('click');
            expect(state.showMobileMenu).toBe(true);
            expect(state.mobileBreakpoint).toBe(768);
        });
        
        it('should initialize with custom options', () => {
            const menu = createNavigationMenu({
                items: sampleItems,
                orientation: 'vertical',
                collapsed: true,
                disabled: true,
                activeItemId: 'home',
                expandedItemIds: ['products'],
                trigger: 'hover',
                showMobileMenu: false,
                mobileBreakpoint: 1024,
            });
            
            const state = menu.state.getState();
            
            expect(state.items).toEqual(sampleItems);
            expect(state.orientation).toBe('vertical');
            expect(state.collapsed).toBe(true);
            expect(state.disabled).toBe(true);
            expect(state.activeItemId).toBe('home');
            expect(state.expandedItemIds).toEqual(['products']);
            expect(state.trigger).toBe('hover');
            expect(state.showMobileMenu).toBe(false);
            expect(state.mobileBreakpoint).toBe(1024);
        });
        
        it('should update items', () => {
            const menu = createNavigationMenu();
            const listener = vi.fn();
            menu.state.subscribe(listener);
            
            menu.state.setItems(sampleItems);
            
            expect(menu.state.getState().items).toEqual(sampleItems);
            expect(listener).toHaveBeenCalled();
        });
        
        it('should update focused item', () => {
            const menu = createNavigationMenu({ items: sampleItems });
            
            menu.state.setFocusedItemId('products');
            expect(menu.state.getState().focusedItemId).toBe('products');
            
            menu.state.setFocusedItemId(null);
            expect(menu.state.getState().focusedItemId).toBe(null);
        });
        
        it('should update active item', () => {
            const menu = createNavigationMenu({ items: sampleItems });
            
            menu.state.setActiveItemId('about');
            expect(menu.state.getState().activeItemId).toBe('about');
        });
        
        it('should toggle expanded items', () => {
            const menu = createNavigationMenu({ items: sampleItems });
            
            menu.state.toggleExpanded('products');
            expect(menu.state.getState().expandedItemIds).toContain('products');
            
            menu.state.toggleExpanded('products');
            expect(menu.state.getState().expandedItemIds).not.toContain('products');
        });
        
        it('should expand and collapse items', () => {
            const menu = createNavigationMenu({ items: sampleItems });
            
            menu.state.expandItem('products');
            expect(menu.state.getState().expandedItemIds).toContain('products');
            
            // Expanding again should not duplicate
            menu.state.expandItem('products');
            expect(menu.state.getState().expandedItemIds).toEqual(['products']);
            
            menu.state.collapseItem('products');
            expect(menu.state.getState().expandedItemIds).not.toContain('products');
        });
        
        it('should toggle collapsed state', () => {
            const menu = createNavigationMenu();
            
            menu.state.toggleCollapsed();
            expect(menu.state.getState().collapsed).toBe(true);
            
            menu.state.toggleCollapsed();
            expect(menu.state.getState().collapsed).toBe(false);
        });
        
        it('should update disabled state', () => {
            const menu = createNavigationMenu();
            
            menu.state.setDisabled(true);
            expect(menu.state.getState().disabled).toBe(true);
            
            menu.state.setDisabled(false);
            expect(menu.state.getState().disabled).toBe(false);
        });
        
        it('should update item in nested structure', () => {
            const menu = createNavigationMenu({ items: sampleItems });
            
            menu.state.updateItem('electronics', { label: 'Updated Electronics' });
            
            const state = menu.state.getState();
            const products = state.items.find(item => item.id === 'products');
            const electronics = products?.children?.find(child => child.id === 'electronics');
            
            expect(electronics?.label).toBe('Updated Electronics');
        });
        
        it('should reset to initial state', () => {
            const menu = createNavigationMenu({ items: sampleItems, activeItemId: 'home' });
            
            menu.state.setActiveItemId('about');
            menu.state.toggleExpanded('products');
            menu.state.setDisabled(true);
            
            menu.state.reset();
            
            const state = menu.state.getState();
            expect(state.activeItemId).toBe('home');
            expect(state.expandedItemIds).toEqual([]);
            expect(state.disabled).toBe(false);
        });
    });
    
    describe('Logic Layer', () => {
        it('should provide correct a11y attributes for root', () => {
            const menu = createNavigationMenu({
                orientation: 'vertical',
                disabled: true,
                collapsed: true,
                ariaLabel: 'Custom navigation'
            });
            
            const rootProps = menu.logic.getA11yProps('root');
            
            expect(rootProps.role).toBe('navigation');
            expect(rootProps['aria-label']).toBe('Custom navigation');
            expect(rootProps['aria-orientation']).toBe('vertical');
            expect(rootProps['aria-disabled']).toBe('true');
            expect(rootProps['data-collapsed']).toBe('true');
        });
        
        it('should provide correct a11y attributes for mobile menu button', () => {
            const menu = createNavigationMenu({ collapsed: false });
            
            const buttonProps = menu.logic.getA11yProps('mobileMenuButton');
            
            expect(buttonProps.role).toBe('button');
            expect(buttonProps['aria-label']).toBe('Close navigation menu');
            expect(buttonProps['aria-expanded']).toBe('true');
            expect(buttonProps.tabIndex).toBe(0);
        });
        
        it('should provide correct a11y attributes for menu items', () => {
            const menu = createNavigationMenu({
                items: sampleItems,
                expandedItemIds: ['products']
            });
            
            const state = menu.state.getState();
            
            // Parent item with children
            const parentProps = getMenuItemA11yProps(state, 'products', true);
            expect(parentProps.role).toBe('menuitem');
            expect(parentProps['aria-haspopup']).toBe('menu');
            expect(parentProps['aria-expanded']).toBe('true');
            
            // Regular item
            const itemProps = getMenuItemA11yProps(state, 'home', false);
            expect(itemProps['aria-current']).toBe('page');
            expect(itemProps['aria-haspopup']).toBeUndefined();
            expect(itemProps.href).toBe('/');
            
            // Disabled item
            const disabledProps = getMenuItemA11yProps(state, 'about', false);
            expect(disabledProps['aria-disabled']).toBe('true');
            expect(disabledProps.href).toBeUndefined();
        });
        
        it('should handle mobile menu button click', () => {
            const onCollapsedChange = vi.fn();
            const menu = createNavigationMenu({
                collapsed: false,
                onCollapsedChange
            });
            
            const interactions = menu.logic.getInteractionHandlers('mobileMenuButton');
            const event = new MouseEvent('click');
            Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
            
            interactions.onClick(event);
            
            expect(menu.state.getState().collapsed).toBe(true);
            expect(onCollapsedChange).toHaveBeenCalledWith(true);
        });
        
        it('should handle menu item click', () => {
            const onItemClick = vi.fn();
            const onActiveChange = vi.fn();
            const menu = createNavigationMenu({
                items: sampleItems,
                onItemClick,
                onActiveChange
            });
            
            const handlers = createMenuItemHandlers(menu.state, menu.options, 'home');
            const event = new MouseEvent('click');
            Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
            
            handlers.onClick(event);
            
            expect(onItemClick).toHaveBeenCalledWith(sampleItems[0], event);
            expect(onActiveChange).toHaveBeenCalledWith('home');
        });
        
        it('should toggle expansion for items with children', () => {
            const onExpandedChange = vi.fn();
            const menu = createNavigationMenu({
                items: sampleItems,
                onExpandedChange
            });
            
            const handlers = createMenuItemHandlers(menu.state, menu.options, 'products');
            const event = new MouseEvent('click');
            const preventDefault = vi.fn();
            Object.defineProperty(event, 'preventDefault', { value: preventDefault });
            
            handlers.onClick(event);
            
            expect(preventDefault).toHaveBeenCalled();
            expect(menu.state.getState().expandedItemIds).toContain('products');
            expect(onExpandedChange).toHaveBeenCalledWith(['products']);
        });
        
        it('should not interact when disabled', () => {
            const onItemClick = vi.fn();
            const menu = createNavigationMenu({
                items: sampleItems,
                disabled: true,
                onItemClick
            });
            
            const handlers = createMenuItemHandlers(menu.state, menu.options, 'home');
            const event = new MouseEvent('click');
            const preventDefault = vi.fn();
            Object.defineProperty(event, 'preventDefault', { value: preventDefault });
            
            handlers.onClick(event);
            
            expect(preventDefault).toHaveBeenCalled();
            expect(onItemClick).not.toHaveBeenCalled();
        });
        
        it('should handle keyboard navigation', () => {
            const menu = createNavigationMenu({
                items: sampleItems,
                orientation: 'vertical'
            });
            
            // Focus first item
            menu.state.setFocusedItemId('home');
            
            const handlers = createMenuItemHandlers(menu.state, menu.options, 'home');
            const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
            const preventDefault = vi.fn();
            Object.defineProperty(event, 'preventDefault', { value: preventDefault });
            Object.defineProperty(event, 'target', {
                value: {
                    closest: vi.fn().mockReturnValue({
                        querySelector: vi.fn().mockReturnValue({ focus: vi.fn() })
                    })
                }
            });
            
            handlers.onKeyDown(event);
            
            expect(preventDefault).toHaveBeenCalled();
            expect(menu.state.getState().focusedItemId).toBe('products');
        });
        
        it('should handle focus and blur events', () => {
            const menu = createNavigationMenu({ items: sampleItems });
            
            const handlers = createMenuItemHandlers(menu.state, menu.options, 'products');
            
            // Focus event
            const focusEvent = new FocusEvent('focus');
            handlers.onFocus(focusEvent);
            expect(menu.state.getState().focusedItemId).toBe('products');
            
            // Blur event (leaving navigation)
            const blurEvent = new FocusEvent('blur');
            Object.defineProperty(blurEvent, 'target', {
                value: { closest: vi.fn().mockReturnValue(null) }
            });
            Object.defineProperty(blurEvent, 'relatedTarget', { value: null });
            handlers.onBlur(blurEvent);
            expect(menu.state.getState().focusedItemId).toBe(null);
        });
    });
    
    describe('Component Core', () => {
        it('should create component core for advanced usage', () => {
            const core = createNavigationMenuCore({ items: sampleItems });
            
            expect(core.metadata).toBeDefined();
            expect(core.metadata.name).toBe('NavigationMenu');
            expect(core.metadata.accessibility.role).toBe('navigation');
            expect(core.metadata.accessibility.wcagLevel).toBe('AA');
        });
    });
});