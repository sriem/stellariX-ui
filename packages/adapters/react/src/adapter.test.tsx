import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { reactAdapter } from './adapter';

describe('React Adapter', () => {
  it('should create a valid React component', () => {
    // Mock component logic
    const mockLogic = {
      getButtonProps: vi.fn().mockReturnValue({
        type: 'button',
        role: 'button',
        'aria-disabled': false,
        onClick: vi.fn(),
        disabled: false,
      })
    };
    
    // Create a component using the adapter
    const TestButton = reactAdapter.createComponent(mockLogic);
    
    // Render the component
    render(<TestButton data-testid="test-button">Test Button</TestButton>);
    
    // Check if the component is rendered
    const button = screen.getByTestId('test-button');
    expect(button).toBeInTheDocument();
    expect(button.textContent).toBe('Test Button');
    
    // Verify props are passed correctly
    expect(button.getAttribute('type')).toBe('button');
    expect(button.getAttribute('role')).toBe('button');
    expect(button.hasAttribute('disabled')).toBe(false);
    
    // Verify logic.getButtonProps was called
    expect(mockLogic.getButtonProps).toHaveBeenCalledTimes(1);
  });
  
  it('should handle click events', () => {
    const mockOnClick = vi.fn();
    
    const mockLogic = {
      getButtonProps: vi.fn().mockImplementation((props = {}) => ({
        ...props,
        type: 'button',
        role: 'button',
        'aria-disabled': false,
        onClick: mockOnClick,
        disabled: false,
      }))
    };
    
    const TestButton = reactAdapter.createComponent(mockLogic);
    
    render(<TestButton data-testid="test-button">Click Me</TestButton>);
    
    const button = screen.getByTestId('test-button');
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
  
  it('should handle disabled state', () => {
    const mockOnClick = vi.fn();
    
    const mockLogic = {
      getButtonProps: vi.fn().mockImplementation((props = {}) => ({
        ...props,
        type: 'button',
        role: 'button',
        'aria-disabled': true,
        onClick: mockOnClick,
        disabled: true,
      }))
    };
    
    const TestButton = reactAdapter.createComponent(mockLogic);
    
    render(<TestButton data-testid="test-button">Disabled Button</TestButton>);
    
    const button = screen.getByTestId('test-button');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(mockOnClick).not.toHaveBeenCalled();
  });
  
  it('should merge className prop correctly', () => {
    const mockLogic = {
      getButtonProps: vi.fn().mockImplementation((props = {}) => ({
        ...props,
        type: 'button',
        className: 'logic-class',
      }))
    };
    
    const TestButton = reactAdapter.createComponent(mockLogic);
    
    render(<TestButton data-testid="test-button" className="custom-class">Test Button</TestButton>);
    
    const button = screen.getByTestId('test-button');
    expect(button.className).toBe('logic-class custom-class');
  });
}); 