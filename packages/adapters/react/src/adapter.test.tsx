import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { reactAdapter } from './adapter';

describe('React Adapter', () => {
  it('should create a valid React component', () => {
    // Mock component core
    const mockCore = {
      state: {
        getState: vi.fn().mockReturnValue({ pressed: false, disabled: false }),
        setState: vi.fn(),
        subscribe: vi.fn().mockReturnValue(() => {})
      },
      logic: {
        handleEvent: vi.fn(),
        getA11yProps: vi.fn().mockReturnValue({
          'aria-disabled': false,
          role: 'button'
        }),
        getInteractionHandlers: vi.fn().mockReturnValue({
          onClick: vi.fn()
        }),
        initialize: vi.fn(),
        cleanup: vi.fn(),
        connect: vi.fn()
      },
      metadata: {
        name: 'TestButton',
        version: '1.0.0',
        accessibility: {
          role: 'button',
          wcagLevel: 'AA',
          patterns: []
        },
        events: {
          supported: ['click'],
          required: [],
          custom: {}
        },
        structure: {
          elements: {
            root: {
              type: 'button',
              role: 'button'
            }
          }
        }
      },
      connect: vi.fn(),
      destroy: vi.fn()
    };
    
    // Create a component using the adapter
    const TestButton = reactAdapter.createComponent(mockCore);
    
    // Render the component
    render(<TestButton data-testid="test-button">Test Button</TestButton>);
    
    // Check if the component is rendered
    const button = screen.getByTestId('test-button');
    expect(button).toBeInTheDocument();
    expect(button.textContent).toBe('Test Button');
    
    // Verify props are passed correctly
    expect(button.tagName.toLowerCase()).toBe('button');
    expect(button.getAttribute('role')).toBe('button');
    expect(button.hasAttribute('disabled')).toBe(false);
    
    // Verify logic methods were called
    expect(mockCore.logic.getA11yProps).toHaveBeenCalledWith('root');
    expect(mockCore.logic.getInteractionHandlers).toHaveBeenCalledWith('root');
  });
  
  it('should handle click events', () => {
    const mockOnClick = vi.fn();
    
    const mockCore = {
      state: {
        getState: vi.fn().mockReturnValue({ pressed: false, disabled: false }),
        setState: vi.fn(),
        subscribe: vi.fn().mockReturnValue(() => {})
      },
      logic: {
        handleEvent: vi.fn(),
        getA11yProps: vi.fn().mockReturnValue({
          'aria-disabled': false,
          role: 'button'
        }),
        getInteractionHandlers: vi.fn().mockReturnValue({
          onClick: mockOnClick
        }),
        initialize: vi.fn(),
        cleanup: vi.fn(),
        connect: vi.fn()
      },
      metadata: {
        name: 'TestButton',
        version: '1.0.0',
        accessibility: {
          role: 'button',
          wcagLevel: 'AA',
          patterns: []
        },
        events: {
          supported: ['click'],
          required: [],
          custom: {}
        },
        structure: {
          elements: {
            root: {
              type: 'button',
              role: 'button'
            }
          }
        }
      },
      connect: vi.fn(),
      destroy: vi.fn()
    };
    
    const TestButton = reactAdapter.createComponent(mockCore);
    
    render(<TestButton data-testid="test-button">Click Me</TestButton>);
    
    const button = screen.getByTestId('test-button');
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
  
  it('should handle disabled state', () => {
    const mockOnClick = vi.fn();
    
    const mockCore = {
      state: {
        getState: vi.fn().mockReturnValue({ pressed: false, disabled: true }),
        setState: vi.fn(),
        subscribe: vi.fn().mockReturnValue(() => {})
      },
      logic: {
        handleEvent: vi.fn(),
        getA11yProps: vi.fn().mockReturnValue({
          'aria-disabled': true,
          role: 'button',
          disabled: true
        }),
        getInteractionHandlers: vi.fn().mockReturnValue({
          onClick: mockOnClick
        }),
        initialize: vi.fn(),
        cleanup: vi.fn(),
        connect: vi.fn()
      },
      metadata: {
        name: 'TestButton',
        version: '1.0.0',
        accessibility: {
          role: 'button',
          wcagLevel: 'AA',
          patterns: []
        },
        events: {
          supported: ['click'],
          required: [],
          custom: {}
        },
        structure: {
          elements: {
            root: {
              type: 'button',
              role: 'button'
            }
          }
        }
      },
      connect: vi.fn(),
      destroy: vi.fn()
    };
    
    const TestButton = reactAdapter.createComponent(mockCore);
    
    render(<TestButton data-testid="test-button">Disabled Button</TestButton>);
    
    const button = screen.getByTestId('test-button');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(mockOnClick).not.toHaveBeenCalled();
  });
  
  it('should merge className prop correctly', () => {
    const mockCore = {
      state: {
        getState: vi.fn().mockReturnValue({ pressed: false, disabled: false }),
        setState: vi.fn(),
        subscribe: vi.fn().mockReturnValue(() => {})
      },
      logic: {
        handleEvent: vi.fn(),
        getA11yProps: vi.fn().mockReturnValue({
          'aria-disabled': false,
          role: 'button'
        }),
        getInteractionHandlers: vi.fn().mockReturnValue({}),
        initialize: vi.fn(),
        cleanup: vi.fn(),
        connect: vi.fn()
      },
      metadata: {
        name: 'TestButton',
        version: '1.0.0',
        accessibility: {
          role: 'button',
          wcagLevel: 'AA',
          patterns: []
        },
        events: {
          supported: ['click'],
          required: [],
          custom: {}
        },
        structure: {
          elements: {
            root: {
              type: 'button',
              role: 'button'
            }
          }
        }
      },
      connect: vi.fn(),
      destroy: vi.fn()
    };
    
    const TestButton = reactAdapter.createComponent(mockCore);
    
    render(<TestButton data-testid="test-button" className="custom-class">Test Button</TestButton>);
    
    const button = screen.getByTestId('test-button');
    expect(button.className).toBe('custom-class');
  });
}); 