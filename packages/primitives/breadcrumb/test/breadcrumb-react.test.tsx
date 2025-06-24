/**
 * Breadcrumb React Integration Tests
 * Testing the breadcrumb component with React adapter
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createBreadcrumb } from '../src';
import { reactAdapter } from '@stellarix-ui/react';
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
    
    render(<BreadcrumbComponent />);
    
    const productsLink = screen.getByRole('link', { name: 'Products' });
    await userEvent.click(productsLink);
    
    expect(onItemClick).toHaveBeenCalledWith(sampleItems[1], 1);
  });
  
  it('should handle keyboard navigation', async () => {
    const breadcrumb = createBreadcrumb({ items: sampleItems });
    const BreadcrumbComponent = breadcrumb.connect(reactAdapter);
    
    render(<BreadcrumbComponent />);
    
    const firstLink = screen.getByRole('link', { name: 'Home' });
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
    breadcrumb.state.addItem(newItem);
    
    rerender(<BreadcrumbComponent />);
    expect(screen.getByText('Details')).toBeInTheDocument();
    
    // Remove item
    breadcrumb.state.removeItem('products');
    rerender(<BreadcrumbComponent />);
    expect(screen.queryByText('Products')).not.toBeInTheDocument();
    
    // Update item
    breadcrumb.state.updateItem('phones', { label: 'Mobile Phones' });
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
    for (let i = 0; i < 5; i++) {
      breadcrumb.state.addItem({
        id: `item-${i}`,
        label: `Item ${i}`,
        href: `/item-${i}`,
      });
    }
    
    rerender(<BreadcrumbComponent />);
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
    
    // Rapid removals
    for (let i = 0; i < 3; i++) {
      breadcrumb.state.removeItem(`item-${i}`);
    }
    
    rerender(<BreadcrumbComponent />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});