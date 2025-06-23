import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createButton } from '../src';
import { reactAdapter } from '@stellarix-ui/react';

describe('Button with React Adapter Integration', () => {
  it('should render a button with default props', () => {
    // Create a button with default options
    const button = createButton({});
    const Button = button.connect(reactAdapter);
    
    render(<Button data-testid="test-button">Click Me</Button>);
    
    const buttonElement = screen.getByTestId('test-button');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement.textContent).toBe('Click Me');
    expect(buttonElement.tagName).toBe('BUTTON');
    expect(buttonElement.getAttribute('type')).toBe('button');
    expect(buttonElement).not.toBeDisabled();
  });
  
  it('should render a disabled button', () => {
    const button = createButton({
      defaultDisabled: true
    });
    const Button = button.connect(reactAdapter);
    
    render(<Button data-testid="test-button">Disabled Button</Button>);
    
    const buttonElement = screen.getByTestId('test-button');
    expect(buttonElement).toBeDisabled();
    expect(buttonElement.getAttribute('aria-disabled')).toBe('true');
  });
  
  it('should handle click events', () => {
    const handleClick = vi.fn();
    const button = createButton({
      onClick: handleClick
    });
    const Button = button.connect(reactAdapter);
    
    render(<Button data-testid="test-button">Click Me</Button>);
    
    const buttonElement = screen.getByTestId('test-button');
    fireEvent.click(buttonElement);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('should not trigger click event when disabled', () => {
    const handleClick = vi.fn();
    const button = createButton({
      onClick: handleClick,
      defaultDisabled: true
    });
    const Button = button.connect(reactAdapter);
    
    render(<Button data-testid="test-button">Disabled Button</Button>);
    
    const buttonElement = screen.getByTestId('test-button');
    fireEvent.click(buttonElement);
    
    expect(handleClick).not.toHaveBeenCalled();
  });
  
  it('should render with different variants and sizes', () => {
    const button = createButton({
      variant: 'secondary',
      size: 'lg'
    });
    const Button = button.connect(reactAdapter);
    
    const { rerender } = render(
      <Button data-testid="test-button" className="custom">
        Large Secondary Button
      </Button>
    );
    
    const buttonElement = screen.getByTestId('test-button');
    expect(buttonElement).toHaveClass('custom');
    
    // Test changing props
    const button2 = createButton({
      variant: 'primary',
      size: 'sm'
    });
    const Button2 = button2.connect(reactAdapter);
    
    rerender(
      <Button2 data-testid="test-button" className="custom">
        Small Primary Button
      </Button2>
    );
    
    expect(screen.getByTestId('test-button')).toHaveClass('custom');
    expect(screen.getByTestId('test-button').textContent).toBe('Small Primary Button');
  });
}); 