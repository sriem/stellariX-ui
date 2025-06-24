import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createNavigationMenu, getMenuItemA11yProps, getSubmenuA11yProps, createMenuItemHandlers } from '../src/index';
import { reactAdapter } from '@stellarix-ui/react';
import type { NavigationMenuItem } from '../src/types';

expect.extend(toHaveNoViolations);

describe('NavigationMenu Accessibility', () => {
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
        },
        {
            id: 'contact',
            label: 'Contact',
            href: '/contact',
            disabled: true,
        },
    ];
    
    const createAccessibleNavigationMenu = (options = {}) => {
        const menu = createNavigationMenu({ items: sampleItems, ...options });
        // Store options in menu for handlers
        (menu as any).options = { items: sampleItems, ...options };
        
        return reactAdapter.createComponent({
            state: menu.state,
            logic: menu.logic,
            metadata: menu.metadata,
            render: ({ state, a11y, interactions }) => {
                const renderMenuItem = (item: NavigationMenuItem, level: number = 0) => {
                    const hasChildren = item.children && item.children.length > 0;
                    const isExpanded = state.expandedItemIds.includes(item.id);
                    
                    return (
                        <React.Fragment key={item.id}>
                            {hasChildren ? (
                                <button
                                    {...getMenuItemA11yProps(state, item.id, hasChildren)}
                                    {...createMenuItemHandlers(menu.state, (menu as any).options, item.id)}
                                    data-item-id={item.id}
                                    style={{
                                        padding: '8px 16px',
                                        border: 'none',
                                        background: item.active ? '#e0e0e0' : 'transparent',
                                        cursor: item.disabled ? 'not-allowed' : 'pointer',
                                        opacity: item.disabled ? 0.5 : 1,
                                    }}
                                >
                                    {item.label}
                                    <span aria-hidden="true">{isExpanded ? ' ▼' : ' ►'}</span>
                                </button>
                            ) : (
                                <a
                                    {...getMenuItemA11yProps(state, item.id, hasChildren)}
                                    {...createMenuItemHandlers(menu.state, (menu as any).options, item.id)}
                                    data-item-id={item.id}
                                    href={item.href}
                                    style={{
                                        padding: '8px 16px',
                                        textDecoration: 'none',
                                        color: item.active ? '#0066cc' : 'inherit',
                                        background: item.active ? '#e0e0e0' : 'transparent',
                                        display: 'inline-block',
                                        cursor: item.disabled ? 'not-allowed' : 'pointer',
                                        opacity: item.disabled ? 0.5 : 1,
                                    }}
                                >
                                    {item.label}
                                </a>
                            )}
                            
                            {hasChildren && isExpanded && (
                                <div
                                    {...getSubmenuA11yProps(state, item.id)}
                                    style={{
                                        position: 'absolute',
                                        background: 'white',
                                        border: '1px solid #ccc',
                                        padding: '4px 0',
                                        margin: '0 0 0 16px',
                                    }}
                                >
                                    {item.children.map((child) => renderMenuItem(child, level + 1))}
                                </div>
                            )}
                        </React.Fragment>
                    );
                };
                
                return (
                    <nav {...a11y.root} style={{ background: '#f5f5f5', padding: '8px' }}>
                        {state.showMobileMenu && (
                            <button
                                {...a11y.mobileMenuButton}
                                {...interactions.mobileMenuButton}
                                style={{
                                    display: state.collapsed ? 'block' : 'none',
                                    padding: '8px 16px',
                                    border: '1px solid #ccc',
                                    background: 'white',
                                    cursor: 'pointer',
                                }}
                            >
                                Menu
                            </button>
                        )}
                        
                        <div
                            {...a11y.menuList}
                            style={{
                                display: state.collapsed ? 'none' : 'flex',
                                flexDirection: state.orientation === 'horizontal' ? 'row' : 'column',
                                padding: 0,
                                margin: 0,
                                gap: state.orientation === 'horizontal' ? '8px' : '0',
                            }}
                        >
                            {state.items.map((item) => renderMenuItem(item))}
                        </div>
                    </nav>
                );
            }
        });
    };
    
    it('should have no accessibility violations in default state', async () => {
        const NavigationMenuComponent = createAccessibleNavigationMenu();
        const { container } = render(<NavigationMenuComponent />);
        
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    
    it('should have no violations with vertical orientation', async () => {
        const NavigationMenuComponent = createAccessibleNavigationMenu({ orientation: 'vertical' });
        const { container } = render(<NavigationMenuComponent />);
        
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    
    it('should have no violations with expanded submenus', async () => {
        const NavigationMenuComponent = createAccessibleNavigationMenu({
            expandedItemIds: ['products']
        });
        const { container } = render(<NavigationMenuComponent />);
        
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    
    it('should have no violations when disabled', async () => {
        const NavigationMenuComponent = createAccessibleNavigationMenu({ disabled: true });
        const { container } = render(<NavigationMenuComponent />);
        
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    
    it('should have no violations in collapsed mobile state', async () => {
        const NavigationMenuComponent = createAccessibleNavigationMenu({
            collapsed: true,
            showMobileMenu: true
        });
        const { container } = render(<NavigationMenuComponent />);
        
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    
    it('should have proper navigation landmark', () => {
        const NavigationMenuComponent = createAccessibleNavigationMenu();
        const { container } = render(<NavigationMenuComponent />);
        
        const nav = container.querySelector('nav');
        expect(nav).toBeTruthy();
        expect(nav).toHaveAttribute('role', 'navigation');
        expect(nav).toHaveAttribute('aria-label', 'Main navigation');
    });
    
    it('should have proper menu structure', () => {
        const NavigationMenuComponent = createAccessibleNavigationMenu();
        const { container } = render(<NavigationMenuComponent />);
        
        const menubar = container.querySelector('[role="menubar"]');
        expect(menubar).toBeTruthy();
        expect(menubar?.tagName).toBe('DIV');
        
        const menuitems = container.querySelectorAll('[role="menuitem"]');
        expect(menuitems.length).toBeGreaterThan(0);
    });
    
    it('should properly indicate active item', () => {
        const NavigationMenuComponent = createAccessibleNavigationMenu();
        const { container } = render(<NavigationMenuComponent />);
        
        const activeItem = container.querySelector('[aria-current="page"]');
        expect(activeItem).toBeTruthy();
        expect(activeItem).toHaveTextContent('Home');
    });
    
    it('should properly indicate expandable items', () => {
        const NavigationMenuComponent = createAccessibleNavigationMenu();
        const { container } = render(<NavigationMenuComponent />);
        
        const expandableItem = container.querySelector('[aria-haspopup="menu"]');
        expect(expandableItem).toBeTruthy();
        expect(expandableItem).toHaveAttribute('aria-expanded', 'false');
    });
    
    it('should properly indicate disabled items', () => {
        const NavigationMenuComponent = createAccessibleNavigationMenu();
        const { container } = render(<NavigationMenuComponent />);
        
        const disabledItems = container.querySelectorAll('[aria-disabled="true"]');
        expect(disabledItems.length).toBeGreaterThan(0);
        
        // Check that disabled items have appropriate styling
        disabledItems.forEach(item => {
            const styles = window.getComputedStyle(item as Element);
            expect(styles.opacity).toBe('0.5');
            expect(styles.cursor).toBe('not-allowed');
        });
    });
    
    it('should have proper focus management', () => {
        const NavigationMenuComponent = createAccessibleNavigationMenu();
        const { container } = render(<NavigationMenuComponent />);
        
        const firstMenuItem = container.querySelector('[role="menuitem"]');
        expect(firstMenuItem).toHaveAttribute('tabIndex', '0');
        
        const otherMenuItems = container.querySelectorAll('[role="menuitem"]:not(:first-child)');
        otherMenuItems.forEach(item => {
            expect(item).toHaveAttribute('tabIndex', '-1');
        });
    });
    
    it('should have proper mobile menu button', () => {
        const NavigationMenuComponent = createAccessibleNavigationMenu({
            collapsed: true,
            showMobileMenu: true
        });
        const { container } = render(<NavigationMenuComponent />);
        
        const mobileButton = container.querySelector('[aria-expanded]');
        expect(mobileButton).toBeTruthy();
        expect(mobileButton).toHaveAttribute('aria-label');
        expect(mobileButton).toHaveAttribute('role', 'button');
    });
    
    it('should hide decorative icons from screen readers', () => {
        const NavigationMenuComponent = createAccessibleNavigationMenu({
            expandedItemIds: ['products']
        });
        const { container } = render(<NavigationMenuComponent />);
        
        const decorativeSpans = container.querySelectorAll('span[aria-hidden="true"]');
        expect(decorativeSpans.length).toBeGreaterThan(0);
    });
    
    it('should maintain contrast ratios', () => {
        const NavigationMenuComponent = createAccessibleNavigationMenu();
        const { container } = render(<NavigationMenuComponent />);
        
        const activeLink = container.querySelector('[aria-current="page"]');
        expect(activeLink).toBeTruthy();
        
        // Verify styles are applied
        const element = activeLink as HTMLElement;
        expect(element.style.color).toBe('#0066cc');
        expect(element.style.background).toContain('#e0e0e0');
    });
});