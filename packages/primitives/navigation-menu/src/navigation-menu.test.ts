import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createNavigationMenu } from './index';
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
            
            // Get state directly since subscribe doesn't call immediately
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
            
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                items: sampleItems
            }));
        });
        
        it('should update focused item', () => {
            const menu = createNavigationMenu({ items: sampleItems });
            
            const listener = vi.fn();
            menu.state.subscribe(listener);
            listener.mockClear();
            
            menu.state.setFocusedItemId('products');
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                focusedItemId: 'products'
            }));
            
            listener.mockClear();
            menu.state.setFocusedItemId(null);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                focusedItemId: null
            }));
        });
        
        it('should update active item', () => {
            const menu = createNavigationMenu({ items: sampleItems });
            
            const listener = vi.fn();
            menu.state.subscribe(listener);
            listener.mockClear();
            
            menu.state.setActiveItemId('about');
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                activeItemId: 'about'
            }));
        });
        
        it('should toggle expanded items', () => {
            const menu = createNavigationMenu({ items: sampleItems });
            
            const listener = vi.fn();
            menu.state.subscribe(listener);
            listener.mockClear();
            
            menu.state.toggleExpanded('products');
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                expandedItemIds: expect.arrayContaining(['products'])
            }));
            
            listener.mockClear();
            menu.state.toggleExpanded('products');
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                expandedItemIds: expect.not.arrayContaining(['products'])
            }));
        });
        
        it('should expand and collapse items', () => {
            const menu = createNavigationMenu({ items: sampleItems });
            
            const listener = vi.fn();
            menu.state.subscribe(listener);
            listener.mockClear();
            
            menu.state.expandItem('products');
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                expandedItemIds: ['products']
            }));
            
            // Expanding again should not duplicate
            listener.mockClear();
            menu.state.expandItem('products');
            // expandItem returns same state if already expanded, which means setState
            // is called but with the same state object, so listener may or may not be called
            // depending on implementation details. Let's just check the state is correct.
            expect(menu.state.getState().expandedItemIds).toEqual(['products']);
            
            listener.mockClear();
            menu.state.collapseItem('products');
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                expandedItemIds: []
            }));
        });
        
        it('should toggle collapsed state', () => {
            const menu = createNavigationMenu();
            
            const listener = vi.fn();
            menu.state.subscribe(listener);
            listener.mockClear();
            
            menu.state.toggleCollapsed();
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                collapsed: true
            }));
            
            listener.mockClear();
            menu.state.toggleCollapsed();
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                collapsed: false
            }));
        });
        
        it('should update disabled state', () => {
            const menu = createNavigationMenu();
            
            const listener = vi.fn();
            menu.state.subscribe(listener);
            listener.mockClear();
            
            menu.state.setDisabled(true);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                disabled: true
            }));
            
            listener.mockClear();
            menu.state.setDisabled(false);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                disabled: false
            }));
        });
        
        it('should update item in nested structure', () => {
            const menu = createNavigationMenu({ items: sampleItems });
            
            const listener = vi.fn();
            menu.state.subscribe(listener);
            listener.mockClear();
            
            menu.state.updateItem('electronics', { label: 'Updated Electronics' });
            
            const lastCall = listener.mock.calls[listener.mock.calls.length - 1][0];
            const products = lastCall.items.find((item: NavigationMenuItem) => item.id === 'products');
            const electronics = products?.children?.find((child: NavigationMenuItem) => child.id === 'electronics');
            
            expect(electronics?.label).toBe('Updated Electronics');
        });
        
        it('should reset to initial state', () => {
            const menu = createNavigationMenu({ items: sampleItems, activeItemId: 'home' });
            
            menu.state.setActiveItemId('about');
            menu.state.toggleExpanded('products');
            menu.state.setDisabled(true);
            
            const listener = vi.fn();
            menu.state.subscribe(listener);
            listener.mockClear();
            
            menu.state.reset();
            
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                activeItemId: 'home',
                expandedItemIds: [],
                disabled: false
            }));
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
            expect(rootProps['data-orientation']).toBe('vertical'); // Changed from aria-orientation
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
            
            // Get state directly
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
            
            // Verify state change
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
            
            const handlers = createMenuItemHandlers(menu.state, { onItemClick, onActiveChange }, 'home');
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
            
            const handlers = createMenuItemHandlers(menu.state, { onExpandedChange }, 'products');
            const event = new MouseEvent('click');
            const preventDefault = vi.fn();
            Object.defineProperty(event, 'preventDefault', { value: preventDefault });
            
            handlers.onClick(event);
            
            expect(preventDefault).toHaveBeenCalled();
            // Verify state change
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
            
            const handlers = createMenuItemHandlers(menu.state, { onItemClick }, 'home');
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
            
            const handlers = createMenuItemHandlers(menu.state, {}, 'home');
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
            
            // Verify focus change
            expect(menu.state.getState().focusedItemId).toBe('products');
        });
        
        it('should handle focus and blur events', () => {
            const menu = createNavigationMenu({ items: sampleItems });
            
            const handlers = createMenuItemHandlers(menu.state, {}, 'products');
            
            const listener = vi.fn();
            menu.state.subscribe(listener);
            listener.mockClear();
            
            // Focus event
            const focusEvent = new FocusEvent('focus');
            handlers.onFocus(focusEvent);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                focusedItemId: 'products'
            }));
            
            // Blur event (leaving navigation)
            listener.mockClear();
            const blurEvent = new FocusEvent('blur');
            Object.defineProperty(blurEvent, 'target', {
                value: { closest: vi.fn().mockReturnValue(null) }
            });
            Object.defineProperty(blurEvent, 'relatedTarget', { value: null });
            handlers.onBlur(blurEvent);
            expect(listener).toHaveBeenCalledWith(expect.objectContaining({
                focusedItemId: null
            }));
        });
    });
    
    describe('Component Core', () => {
        it('should create component with metadata', () => {
            const menu = createNavigationMenu({ items: sampleItems });
            
            expect(menu.metadata).toBeDefined();
            expect(menu.metadata.name).toBe('NavigationMenu');
            expect(menu.metadata.accessibility.role).toBe('navigation');
            expect(menu.metadata.accessibility.wcagLevel).toBe('AA');
            expect(menu.connect).toBeDefined();
        });
    });
});