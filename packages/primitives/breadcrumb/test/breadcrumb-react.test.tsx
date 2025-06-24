/**
 * Breadcrumb React Integration Tests
 * Testing the breadcrumb component with React adapter
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createBreadcrumb } from '../src';
// Mock React adapter for testing
const reactAdapter = {
    name: 'react',
    version: '19.0.0',
    createComponent: (core: any) => {
        return function BreadcrumbComponent(props: any) {
            // Get options from core or use props as fallback
            const options = core.options || props;
            const { items = [], separator = '/', disabled = false, showHomeIcon = false, maxItems } = core.state.getState();
            const displayedItems = getDisplayedItems({ items, maxItems });
            
            return React.createElement('nav', {
                role: 'navigation',
                'aria-label': options.ariaLabel || props.ariaLabel || 'Breadcrumb',
                'aria-disabled': disabled ? 'true' : undefined,
            }, [
                React.createElement('ol', { key: 'list', role: 'list' },
                    displayedItems.map((item, index) => {
                        const isLast = index === displayedItems.length - 1;
                        const isEllipsis = item.id === '...';
                        const showAsLink = !item.current && !disabled && !item.disabled && item.href;
                        
                        return React.createElement('li', {
                            key: item.id,
                            role: 'listitem',
                            'aria-current': item.current ? 'page' : undefined,
                        }, [
                            showAsLink
                                ? React.createElement('a', {
                                    key: 'link',
                                    href: item.href,
                                    role: 'link',
                                    onClick: (e) => {
                                        if (options.onItemClick) {
                                            options.onItemClick(item, index);
                                        }
                                    },
                                    onKeyDown: (e) => handleKeyDown(e, index),
                                    onFocus: () => core.state.setFocusedIndex(index),
                                    onBlur: (e) => handleBlur(e),
                                    tabIndex: 0,
                                    'aria-disabled': item.disabled ? 'true' : undefined,
                                }, showHomeIcon && index === 0 ? `🏠 ${item.label}` : item.label)
                                : React.createElement('span', {
                                    key: 'text',
                                    role: !item.href && !item.current ? 'button' : undefined,
                                    'aria-current': item.current ? 'page' : undefined,
                                    'aria-disabled': item.disabled || disabled ? 'true' : undefined,
                                    onClick: !disabled && !item.disabled && !isEllipsis ? (e) => {
                                        e.preventDefault();
                                        if (options.onItemClick) {
                                            options.onItemClick(item, index);
                                        }
                                    } : undefined,
                                    onKeyDown: !disabled && !item.disabled && !isEllipsis ? (e) => handleKeyDown(e, index) : undefined,
                                    onFocus: !disabled && !item.disabled && !isEllipsis ? () => core.state.setFocusedIndex(index) : undefined,
                                    onBlur: !disabled && !item.disabled && !isEllipsis ? (e) => handleBlur(e) : undefined,
                                    tabIndex: disabled || item.disabled || isEllipsis ? -1 : 0,
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
            
            function handleKeyDown(e: any, index: number) {
                const items = displayedItems;
                let newIndex = index;
                
                switch (e.key) {
                    case 'ArrowRight':
                        e.preventDefault();
                        for (let i = index + 1; i < items.length; i++) {
                            if (!items[i].disabled && items[i].id !== '...') {
                                newIndex = i;
                                break;
                            }
                        }
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        for (let i = index - 1; i >= 0; i--) {
                            if (!items[i].disabled && items[i].id !== '...') {
                                newIndex = i;
                                break;
                            }
                        }
                        break;
                    case 'Home':
                        e.preventDefault();
                        for (let i = 0; i < items.length; i++) {
                            if (!items[i].disabled && items[i].id !== '...') {
                                newIndex = i;
                                break;
                            }
                        }
                        break;
                    case 'End':
                        e.preventDefault();
                        for (let i = items.length - 1; i >= 0; i--) {
                            if (!items[i].disabled && items[i].id !== '...') {
                                newIndex = i;
                                break;
                            }
                        }
                        break;
                    case 'Enter':
                    case ' ':
                        if (!items[index].href) {
                            e.preventDefault();
                            if (options.onItemClick) {
                                options.onItemClick(items[index], index);
                            }
                        }
                        break;
                }
                
                if (newIndex !== index) {
                    core.state.setFocusedIndex(newIndex);
                    // In test environment, we need to find the navigation differently
                    const nav = document.querySelector('[role="navigation"]');
                    if (nav) {
                        const links = nav.querySelectorAll('[role="listitem"] a, [role="listitem"] [role="button"], [role="listitem"] span[tabindex]');
                        if (links[newIndex]) {
                            (links[newIndex] as HTMLElement).focus();
                        }
                    }
                }
            }
            
            function handleBlur(e: any) {
                const relatedTarget = e.relatedTarget;
                const nav = e.target.closest('[role="navigation"]');
                if (!nav?.contains(relatedTarget)) {
                    core.state.setFocusedIndex(-1);
                }
            }
            
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

describe('Breadcrumb React Integration', () => {
  const sampleItems: BreadcrumbItem[] = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'products', label: 'Products', href: '/products' },
    { id: 'phones', label: 'Phones', href: '/products/phones' },
    { id: 'current', label: 'iPhone 15', current: true },
  ];
  
  it('should render with React adapter', () => {
    const breadcrumb = createBreadcrumb({ items: sampleItems });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    render(<BreadcrumbComponent />);
    
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
  });
  
  it('should display breadcrumb items correctly', () => {
    const breadcrumb = createBreadcrumb({ items: sampleItems });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    render(<BreadcrumbComponent />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Phones')).toBeInTheDocument();
    expect(screen.getByText('iPhone 15')).toBeInTheDocument();
  });
  
  it('should render links and current item correctly', () => {
    const breadcrumb = createBreadcrumb({ items: sampleItems });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    render(<BreadcrumbComponent />);
    
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveAttribute('href', '/');
    
    const currentItem = screen.getByText('iPhone 15');
    expect(currentItem).toHaveAttribute('aria-current', 'page');
    expect(currentItem.tagName).toBe('SPAN'); // Not a link
  });
  
  it('should handle click events', async () => {
    const onItemClick = vi.fn();
    const breadcrumb = createBreadcrumb({ 
      items: sampleItems,
      onItemClick,
    });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    const { debug } = render(<BreadcrumbComponent />);
    
    // Debug output to see what's rendered
    // debug();
    
    // Try getting link by text first to see if it exists
    const productsLink = screen.getByText('Products');
    await userEvent.click(productsLink);
    
    expect(onItemClick).toHaveBeenCalledWith(sampleItems[1], 1);
  });
  
  it('should handle keyboard navigation', async () => {
    const breadcrumb = createBreadcrumb({ items: sampleItems });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    render(<BreadcrumbComponent />);
    
    const firstLink = screen.getByText('Home');
    firstLink.focus();
    
    // Navigate right
    fireEvent.keyDown(firstLink, { key: 'ArrowRight' });
    expect(document.activeElement).toHaveTextContent('Products');
    
    // Navigate to end
    fireEvent.keyDown(document.activeElement!, { key: 'End' });
    expect(document.activeElement).toHaveTextContent('iPhone 15');
    
    // Navigate to home
    fireEvent.keyDown(document.activeElement!, { key: 'Home' });
    expect(document.activeElement).toHaveTextContent('Home');
  });
  
  it('should handle disabled state', () => {
    const breadcrumb = createBreadcrumb({ 
      items: sampleItems,
      disabled: true,
    });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    render(<BreadcrumbComponent />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-disabled', 'true');
    
    // Links should not be clickable
    const links = screen.queryAllByRole('link');
    expect(links).toHaveLength(0); // No links when disabled
  });
  
  it('should handle custom separator', () => {
    const breadcrumb = createBreadcrumb({ 
      items: sampleItems,
      separator: '>',
    });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    const { container } = render(<BreadcrumbComponent />);
    
    const separators = container.querySelectorAll('[aria-hidden="true"]');
    expect(separators).toHaveLength(3); // 3 separators for 4 items
    expect(separators[0]).toHaveTextContent('>');
  });
  
  it('should show home icon when enabled', () => {
    const breadcrumb = createBreadcrumb({ 
      items: sampleItems,
      showHomeIcon: true,
    });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    render(<BreadcrumbComponent />);
    
    const homeLink = screen.getByRole('link', { name: /🏠.*Home/ });
    expect(homeLink).toBeInTheDocument();
  });
  
  it('should handle truncation', () => {
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
    
    render(<BreadcrumbComponent />);
    
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(5); // Truncated to maxItems
    
    // Should show ellipsis
    expect(screen.getByText('...')).toBeInTheDocument();
  });
  
  it('should handle dynamic updates', () => {
    const breadcrumb = createBreadcrumb({ items: sampleItems });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    const { rerender } = render(<BreadcrumbComponent />);
    
    // Add new item
    const newItem: BreadcrumbItem = { 
      id: 'details', 
      label: 'Details', 
      href: '/products/phones/iphone/details',
    };
    act(() => {
      breadcrumb.state.addItem(newItem);
    });
    
    rerender(<BreadcrumbComponent />);
    expect(screen.getByText('Details')).toBeInTheDocument();
    
    // Remove item
    act(() => {
      breadcrumb.state.removeItem('products');
    });
    rerender(<BreadcrumbComponent />);
    expect(screen.queryByText('Products')).not.toBeInTheDocument();
    
    // Update item
    act(() => {
      breadcrumb.state.updateItem('phones', { label: 'Mobile Phones' });
    });
    rerender(<BreadcrumbComponent />);
    expect(screen.getByText('Mobile Phones')).toBeInTheDocument();
  });
  
  it('should handle items without href', () => {
    const items: BreadcrumbItem[] = [
      { id: 'step1', label: 'Step 1' },
      { id: 'step2', label: 'Step 2' },
      { id: 'step3', label: 'Step 3', current: true },
    ];
    
    const onItemClick = vi.fn();
    const breadcrumb = createBreadcrumb({ items, onItemClick });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    render(<BreadcrumbComponent />);
    
    const step1 = screen.getByText('Step 1');
    expect(step1).toHaveAttribute('role', 'button');
    expect(step1.tagName).toBe('SPAN');
    
    // Should handle click
    fireEvent.click(step1);
    expect(onItemClick).toHaveBeenCalledWith(items[0], 0);
  });
  
  it('should handle disabled items', async () => {
    const itemsWithDisabled: BreadcrumbItem[] = [
      { id: 'home', label: 'Home', href: '/' },
      { id: 'admin', label: 'Admin', href: '/admin', disabled: true },
      { id: 'settings', label: 'Settings', href: '/settings' },
    ];
    
    const onItemClick = vi.fn();
    const breadcrumb = createBreadcrumb({ 
      items: itemsWithDisabled,
      onItemClick,
    });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    render(<BreadcrumbComponent />);
    
    const adminItem = screen.getByText('Admin');
    expect(adminItem).toHaveAttribute('aria-disabled', 'true');
    
    // Should not handle click on disabled item
    await userEvent.click(adminItem);
    expect(onItemClick).not.toHaveBeenCalled();
  });
  
  it('should handle focus management', () => {
    const breadcrumb = createBreadcrumb({ items: sampleItems });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    render(<BreadcrumbComponent />);
    
    const firstLink = screen.getByRole('link', { name: 'Home' });
    const secondLink = screen.getByRole('link', { name: 'Products' });
    
    // Focus first item
    fireEvent.focus(firstLink);
    expect(breadcrumb.state.getState().focusedIndex).toBe(0);
    
    // Focus second item
    fireEvent.focus(secondLink);
    expect(breadcrumb.state.getState().focusedIndex).toBe(1);
    
    // Blur outside breadcrumb
    fireEvent.blur(secondLink, { relatedTarget: document.body });
    expect(breadcrumb.state.getState().focusedIndex).toBe(-1);
  });
  
  it('should handle empty breadcrumb', () => {
    const breadcrumb = createBreadcrumb({ items: [] });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    render(<BreadcrumbComponent />);
    
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
  
  it('should update aria-label', () => {
    const breadcrumb = createBreadcrumb({ 
      items: sampleItems,
      ariaLabel: 'Product navigation',
    });
    // console.log('breadcrumb.options:', breadcrumb.options); // Debug
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    render(<BreadcrumbComponent />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Product navigation');
  });
  
  it('should handle rapid state changes', () => {
    const breadcrumb = createBreadcrumb({ items: [] });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    const { rerender } = render(<BreadcrumbComponent />);
    
    // Rapid additions
    act(() => {
      for (let i = 0; i < 5; i++) {
        breadcrumb.state.addItem({
          id: `item-${i}`,
          label: `Item ${i}`,
          href: `/item-${i}`,
        });
      }
    });
    
    rerender(<BreadcrumbComponent />);
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
    
    // Rapid removals
    act(() => {
      for (let i = 0; i < 3; i++) {
        breadcrumb.state.removeItem(`item-${i}`);
      }
    });
    
    rerender(<BreadcrumbComponent />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});