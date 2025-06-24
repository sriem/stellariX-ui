/**
 * Breadcrumb Accessibility Tests
 * WCAG 2.1 AA compliance testing
 */

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createBreadcrumb } from '../src';
// Mock React adapter for testing
const reactAdapter = {
    name: 'react',
    version: '19.0.0',
    createComponent: (core: any) => {
        return function BreadcrumbComponent(props: any) {
            // Get options from core or use props as fallback
            const options = core.options || props;
            const state = core.state.getState();
            const { items = [], separator = '/', disabled = false, showHomeIcon = false, maxItems } = state;
            const displayedItems = getDisplayedItems({ items, maxItems });
            
            const rootA11y = core.logic.getA11yProps('root', state);
            const listA11y = core.logic.getA11yProps('list', state);
            
            return React.createElement('nav', {
                ...rootA11y,
                'aria-label': props.ariaLabel || rootA11y['aria-label'] || 'Breadcrumb',
            }, [
                React.createElement('ol', { 
                    key: 'list',
                    ...listA11y,
                },
                    displayedItems.map((item, index) => {
                        const isLast = index === displayedItems.length - 1;
                        const isEllipsis = item.id === '...';
                        const showAsLink = !item.current && !disabled && !item.disabled && item.href;
                        
                        const itemA11y = core.logic.getA11yProps('item', state, { index });
                        const linkA11y = core.logic.getA11yProps('link', state, { index });
                        const interactionHandlers = core.logic.getInteractionHandlers('link', state);
                        
                        return React.createElement('li', {
                            key: item.id,
                            ...itemA11y,
                        }, [
                            showAsLink
                                ? React.createElement('a', {
                                    key: 'link',
                                    ...linkA11y,
                                    onClick: (e: any) => {
                                        e.index = index;
                                        interactionHandlers.onClick?.(e);
                                    },
                                    onKeyDown: (e: any) => {
                                        e.index = index;
                                        interactionHandlers.onKeyDown?.(e);
                                    },
                                    onFocus: (e: any) => {
                                        e.index = index;
                                        interactionHandlers.onFocus?.(e);
                                    },
                                    onBlur: interactionHandlers.onBlur,
                                }, showHomeIcon && index === 0 ? `🏠 ${item.label}` : item.label)
                                : React.createElement('span', {
                                    key: 'text',
                                    ...linkA11y,
                                    onClick: !disabled && !item.disabled && !isEllipsis ? (e: any) => {
                                        e.index = index;
                                        interactionHandlers.onClick?.(e);
                                    } : undefined,
                                    onKeyDown: !disabled && !item.disabled && !isEllipsis ? (e: any) => {
                                        e.index = index;
                                        interactionHandlers.onKeyDown?.(e);
                                    } : undefined,
                                    onFocus: !disabled && !item.disabled && !isEllipsis ? (e: any) => {
                                        e.index = index;
                                        interactionHandlers.onFocus?.(e);
                                    } : undefined,
                                    onBlur: !disabled && !item.disabled && !isEllipsis ? interactionHandlers.onBlur : undefined,
                                }, showHomeIcon && index === 0 ? `🏠 ${item.label}` : item.label),
                            !isLast && React.createElement('span', {
                                key: 'separator',
                                'aria-hidden': 'true',
                                style: { margin: '0 8px' },
                            }, separator)
                        ]);
                    })
                )
            ]);
            
            function getDisplayedItems(state: any) {
                if (!state.maxItems || state.items.length <= state.maxItems) {
                    return state.items;
                }
                
                const firstCount = Math.floor((state.maxItems - 1) / 2);
                const lastCount = state.maxItems - 1 - firstCount;
                
                const firstItems = state.items.slice(0, firstCount);
                const lastItems = state.items.slice(-lastCount);
                
                return [
                    ...firstItems,
                    { id: '...', label: '...', disabled: true },
                    ...lastItems
                ];
            }
        };
    }
};
import type { BreadcrumbItem } from '../src/types';

expect.extend(toHaveNoViolations);

describe('Breadcrumb Accessibility', () => {
  const sampleItems: BreadcrumbItem[] = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'products', label: 'Products', href: '/products' },
    { id: 'phones', label: 'Phones', href: '/products/phones' },
    { id: 'current', label: 'iPhone 15', current: true },
  ];
  
  it('should have no accessibility violations with default props', async () => {
    const breadcrumb = createBreadcrumb({ items: sampleItems });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    const { container } = render(<BreadcrumbComponent />);
    const results = await axe(container);
    
    expect(results).toHaveNoViolations();
  });
  
  it('should have proper ARIA roles', () => {
    const breadcrumb = createBreadcrumb({ items: sampleItems });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    render(<BreadcrumbComponent />);
    
    // Navigation landmark
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute('aria-label', 'Breadcrumb');
    
    // List structure
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(4);
  });
  
  it('should mark current page with aria-current', () => {
    const breadcrumb = createBreadcrumb({ items: sampleItems });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    render(<BreadcrumbComponent />);
    
    const currentItem = screen.getByText('iPhone 15');
    expect(currentItem).toHaveAttribute('aria-current', 'page');
    
    // Other items should not have aria-current
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).not.toHaveAttribute('aria-current');
  });
  
  it('should have proper keyboard navigation', () => {
    const breadcrumb = createBreadcrumb({ items: sampleItems });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    render(<BreadcrumbComponent />);
    
    // All interactive elements should be keyboard accessible
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('tabindex', '0');
    });
    
    // Current item should also be focusable
    const currentItem = screen.getByText('iPhone 15');
    expect(currentItem).toHaveAttribute('tabindex', '0');
  });
  
  it('should handle disabled state accessibly', async () => {
    const breadcrumb = createBreadcrumb({ 
      items: sampleItems,
      disabled: true,
    });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    const { container } = render(<BreadcrumbComponent />);
    
    // Should have aria-disabled
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-disabled', 'true');
    
    // Items should not be focusable
    const items = container.querySelectorAll('[tabindex]');
    items.forEach(item => {
      expect(item).toHaveAttribute('tabindex', '-1');
    });
    
    // Should still be accessible
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should handle disabled items accessibly', async () => {
    const itemsWithDisabled: BreadcrumbItem[] = [
      { id: 'home', label: 'Home', href: '/' },
      { id: 'admin', label: 'Admin', href: '/admin', disabled: true },
      { id: 'settings', label: 'Settings', href: '/settings' },
    ];
    
    const breadcrumb = createBreadcrumb({ items: itemsWithDisabled });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    const { container } = render(<BreadcrumbComponent />);
    
    const adminItem = screen.getByText('Admin');
    expect(adminItem).toHaveAttribute('aria-disabled', 'true');
    expect(adminItem).toHaveAttribute('tabindex', '-1');
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should have accessible labels', () => {
    const breadcrumb = createBreadcrumb({ 
      items: sampleItems,
      ariaLabel: 'Site navigation breadcrumb',
    });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    render(<BreadcrumbComponent />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Site navigation breadcrumb');
  });
  
  it('should handle items without href accessibly', async () => {
    const items: BreadcrumbItem[] = [
      { id: 'step1', label: 'Step 1' },
      { id: 'step2', label: 'Step 2' },
      { id: 'step3', label: 'Step 3', current: true },
    ];
    
    const breadcrumb = createBreadcrumb({ items });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    const { container } = render(<BreadcrumbComponent />);
    
    // Non-link items should have button role
    const step1 = screen.getByText('Step 1');
    expect(step1).toHaveAttribute('role', 'button');
    expect(step1).toHaveAttribute('tabindex', '0');
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should have accessible separators', () => {
    const breadcrumb = createBreadcrumb({ 
      items: sampleItems,
      separator: '›',
    });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    const { container } = render(<BreadcrumbComponent />);
    
    // Separators should be hidden from screen readers
    const separators = container.querySelectorAll('[aria-hidden="true"]');
    expect(separators.length).toBeGreaterThan(0);
    separators.forEach(separator => {
      expect(separator).toHaveTextContent('›');
    });
  });
  
  it('should maintain focus visibility', () => {
    const breadcrumb = createBreadcrumb({ items: sampleItems });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    render(<BreadcrumbComponent />);
    
    const firstLink = screen.getByRole('link', { name: 'Home' });
    
    // Focus should be visible
    firstLink.focus();
    expect(document.activeElement).toBe(firstLink);
    
    // CSS should handle focus visibility (tested in Storybook)
  });
  
  it('should handle empty breadcrumb accessibly', async () => {
    const breadcrumb = createBreadcrumb({ items: [] });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    const { container } = render(<BreadcrumbComponent />);
    
    // Should still have proper structure
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should handle truncated breadcrumb accessibly', async () => {
    const manyItems = Array.from({ length: 10 }, (_, i) => ({
      id: `item-${i}`,
      label: `Item ${i + 1}`,
      href: `/item-${i + 1}`,
    }));
    
    const breadcrumb = createBreadcrumb({ 
      items: manyItems,
      maxItems: 5,
    });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    const { container } = render(<BreadcrumbComponent />);
    
    // Ellipsis should be marked as disabled
    const ellipsis = screen.getByText('...');
    expect(ellipsis).toHaveAttribute('aria-disabled', 'true');
    expect(ellipsis).toHaveAttribute('tabindex', '-1');
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should provide context for screen reader users', () => {
    const breadcrumb = createBreadcrumb({ items: sampleItems });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    render(<BreadcrumbComponent />);
    
    // Navigation context
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav).toBeInTheDocument();
    
    // List structure provides order context
    const list = within(nav).getByRole('list');
    expect(list).toBeInTheDocument();
    
    // Current page is announced
    const currentPage = screen.getByRole('button', { current: 'page' });
    expect(currentPage).toHaveTextContent('iPhone 15');
  });
  
  it('should handle high contrast mode', () => {
    const breadcrumb = createBreadcrumb({ items: sampleItems });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    render(<BreadcrumbComponent />);
    
    // Structure should work without CSS
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    
    // Links should be distinguishable
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('href');
    });
  });
  
  it('should handle RTL languages', async () => {
    const arabicItems: BreadcrumbItem[] = [
      { id: 'home', label: 'الرئيسية', href: '/' },
      { id: 'products', label: 'المنتجات', href: '/products' },
      { id: 'current', label: 'الهاتف', current: true },
    ];
    
    const breadcrumb = createBreadcrumb({ items: arabicItems });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    const { container } = render(
      <div dir="rtl">
        <BreadcrumbComponent />
      </div>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// Import within helper for proper typing
import { within } from '@testing-library/react';