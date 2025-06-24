import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createNavigationMenu, getMenuItemA11yProps, getSubmenuA11yProps, createMenuItemHandlers } from '../src/index';
import { reactAdapter } from '@stellarix-ui/react';
import type { NavigationMenuItem } from '../src/types';

describe('NavigationMenu React Integration', () => {
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
    
    const createReactNavigationMenu = (options = {}) => {
        const menu = createNavigationMenu({ items: sampleItems, ...options });
        return reactAdapter.createComponent({
            state: menu.state,
            logic: menu.logic,
            metadata: menu.metadata,
            render: ({ state, a11y, interactions }) => {
                const renderMenuItem = (item: NavigationMenuItem, level: number = 0) => {
                    const hasChildren = item.children && item.children.length > 0;
                    const isExpanded = state.expandedItemIds.includes(item.id);
                    
                    return (
                        <li key={item.id} data-testid={`menu-item-${item.id}`}>
                            {hasChildren ? (
                                <button
                                    {...getMenuItemA11yProps(state, item.id, hasChildren)}
                                    {...createMenuItemHandlers(menu.state, menu.options, item.id)}
                                    data-testid={`menu-button-${item.id}`}
                                >
                                    {item.label}
                                    <span>{isExpanded ? ' ▼' : ' ►'}</span>
                                </button>
                            ) : (
                                <a
                                    {...getMenuItemA11yProps(state, item.id, hasChildren)}
                                    {...createMenuItemHandlers(menu.state, menu.options, item.id)}
                                    data-testid={`menu-link-${item.id}`}
                                >
                                    {item.label}
                                </a>
                            )}
                            
                            {hasChildren && isExpanded && (
                                <ul
                                    {...getSubmenuA11yProps(state, item.id)}
                                    data-testid={`submenu-${item.id}`}
                                >
                                    {item.children.map((child) => renderMenuItem(child, level + 1))}
                                </ul>
                            )}
                        </li>
                    );
                };
                
                return (
                    <nav {...a11y.root} data-testid="navigation-menu">
                        {state.showMobileMenu && (
                            <button
                                {...a11y.mobileMenuButton}
                                {...interactions.mobileMenuButton}
                                data-testid="mobile-menu-button"
                                style={{ display: 'none' }}
                                className="mobile-menu-button"
                            >
                                Menu
                            </button>
                        )}
                        
                        <ul
                            {...a11y.menuList}
                            data-testid="menu-list"
                            style={{ display: state.collapsed ? 'none' : 'block' }}
                        >
                            {state.items.map((item) => renderMenuItem(item))}
                        </ul>
                    </nav>
                );
            }
        });
    };
    
    it('should render navigation menu with items', () => {
        const NavigationMenuComponent = createReactNavigationMenu();
        render(<NavigationMenuComponent />);
        
        expect(screen.getByTestId('navigation-menu')).toBeInTheDocument();
        expect(screen.getByTestId('menu-list')).toBeInTheDocument();
        expect(screen.getByTestId('menu-link-home')).toHaveTextContent('Home');
        expect(screen.getByTestId('menu-button-products')).toHaveTextContent('Products');
        expect(screen.getByTestId('menu-link-about')).toHaveTextContent('About');
    });
    
    it('should have correct ARIA attributes', () => {
        const NavigationMenuComponent = createReactNavigationMenu();
        render(<NavigationMenuComponent />);
        
        const nav = screen.getByTestId('navigation-menu');
        expect(nav).toHaveAttribute('role', 'navigation');
        expect(nav).toHaveAttribute('aria-label', 'Main navigation');
        expect(nav).toHaveAttribute('aria-orientation', 'horizontal');
        
        const menuList = screen.getByTestId('menu-list');
        expect(menuList).toHaveAttribute('role', 'menubar');
        
        const productsButton = screen.getByTestId('menu-button-products');
        expect(productsButton).toHaveAttribute('aria-haspopup', 'menu');
        expect(productsButton).toHaveAttribute('aria-expanded', 'false');
        
        const homeLink = screen.getByTestId('menu-link-home');
        expect(homeLink).toHaveAttribute('aria-current', 'page');
    });
    
    it('should expand and collapse submenus on click', async () => {
        const NavigationMenuComponent = createReactNavigationMenu();
        render(<NavigationMenuComponent />);
        
        const productsButton = screen.getByTestId('menu-button-products');
        
        // Initially collapsed
        expect(productsButton).toHaveAttribute('aria-expanded', 'false');
        expect(screen.queryByTestId('submenu-products')).not.toBeInTheDocument();
        
        // Click to expand
        await userEvent.click(productsButton);
        
        expect(productsButton).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByTestId('submenu-products')).toBeInTheDocument();
        expect(screen.getByTestId('menu-link-electronics')).toBeInTheDocument();
        expect(screen.getByTestId('menu-link-clothing')).toBeInTheDocument();
        
        // Click to collapse
        await userEvent.click(productsButton);
        
        expect(productsButton).toHaveAttribute('aria-expanded', 'false');
        expect(screen.queryByTestId('submenu-products')).not.toBeInTheDocument();
    });
    
    it('should handle hover trigger', async () => {
        const NavigationMenuComponent = createReactNavigationMenu({ trigger: 'hover' });
        render(<NavigationMenuComponent />);
        
        const productsButton = screen.getByTestId('menu-button-products');
        
        // Hover to expand
        fireEvent.mouseEnter(productsButton);
        
        // Wait for hover delay
        await new Promise(resolve => setTimeout(resolve, 200));
        
        expect(screen.getByTestId('submenu-products')).toBeInTheDocument();
        
        // Mouse leave to collapse
        fireEvent.mouseLeave(productsButton);
        
        // Wait for leave delay
        await new Promise(resolve => setTimeout(resolve, 350));
        
        expect(screen.queryByTestId('submenu-products')).not.toBeInTheDocument();
    });
    
    it('should handle keyboard navigation', async () => {
        const NavigationMenuComponent = createReactNavigationMenu({ orientation: 'vertical' });
        render(<NavigationMenuComponent />);
        
        const homeLink = screen.getByTestId('menu-link-home');
        const productsButton = screen.getByTestId('menu-button-products');
        
        // Focus first item
        homeLink.focus();
        expect(homeLink).toHaveFocus();
        
        // Arrow down to next item
        fireEvent.keyDown(homeLink, { key: 'ArrowDown' });
        expect(productsButton).toHaveFocus();
        
        // Enter to expand submenu
        fireEvent.keyDown(productsButton, { key: 'Enter' });
        expect(screen.getByTestId('submenu-products')).toBeInTheDocument();
        
        // Arrow right to enter submenu
        fireEvent.keyDown(productsButton, { key: 'ArrowRight' });
        const electronicsLink = screen.getByTestId('menu-link-electronics');
        expect(electronicsLink).toHaveFocus();
        
        // Escape to go back
        fireEvent.keyDown(electronicsLink, { key: 'Escape' });
        expect(productsButton).toHaveFocus();
    });
    
    it('should handle disabled items', async () => {
        const onItemClick = vi.fn();
        const NavigationMenuComponent = createReactNavigationMenu({ onItemClick });
        render(<NavigationMenuComponent />);
        
        const contactLink = screen.getByTestId('menu-link-contact');
        
        expect(contactLink).toHaveAttribute('aria-disabled', 'true');
        
        await userEvent.click(contactLink);
        
        expect(onItemClick).not.toHaveBeenCalled();
    });
    
    it('should handle mobile menu toggle', async () => {
        const NavigationMenuComponent = createReactNavigationMenu({ showMobileMenu: true });
        const { container } = render(<NavigationMenuComponent />);
        
        // Add CSS to show mobile button
        const style = document.createElement('style');
        style.innerHTML = '.mobile-menu-button { display: block !important; }';
        container.appendChild(style);
        
        const mobileButton = screen.getByTestId('mobile-menu-button');
        const menuList = screen.getByTestId('menu-list');
        
        // Initially expanded
        expect(mobileButton).toHaveAttribute('aria-expanded', 'true');
        expect(menuList).toHaveStyle({ display: 'block' });
        
        // Click to collapse
        await userEvent.click(mobileButton);
        
        expect(mobileButton).toHaveAttribute('aria-expanded', 'false');
        expect(menuList).toHaveStyle({ display: 'none' });
    });
    
    it('should call callbacks correctly', async () => {
        const onItemClick = vi.fn();
        const onActiveChange = vi.fn();
        const onExpandedChange = vi.fn();
        
        const NavigationMenuComponent = createReactNavigationMenu({
            onItemClick,
            onActiveChange,
            onExpandedChange
        });
        
        render(<NavigationMenuComponent />);
        
        // Click regular item
        await userEvent.click(screen.getByTestId('menu-link-about'));
        
        expect(onItemClick).toHaveBeenCalledWith(
            expect.objectContaining({ id: 'about', label: 'About' }),
            expect.any(Object)
        );
        expect(onActiveChange).toHaveBeenCalledWith('about');
        
        // Click parent item
        await userEvent.click(screen.getByTestId('menu-button-products'));
        
        expect(onExpandedChange).toHaveBeenCalledWith(['products']);
    });
    
    it('should render with vertical orientation', () => {
        const NavigationMenuComponent = createReactNavigationMenu({ orientation: 'vertical' });
        render(<NavigationMenuComponent />);
        
        const nav = screen.getByTestId('navigation-menu');
        expect(nav).toHaveAttribute('aria-orientation', 'vertical');
        
        const menuList = screen.getByTestId('menu-list');
        expect(menuList).toHaveAttribute('aria-orientation', 'vertical');
    });
    
    it('should handle disabled state', () => {
        const NavigationMenuComponent = createReactNavigationMenu({ disabled: true });
        render(<NavigationMenuComponent />);
        
        const nav = screen.getByTestId('navigation-menu');
        expect(nav).toHaveAttribute('aria-disabled', 'true');
        
        const homeLink = screen.getByTestId('menu-link-home');
        expect(homeLink).toHaveAttribute('aria-disabled', 'true');
    });
});