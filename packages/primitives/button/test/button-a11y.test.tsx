import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createButton } from '../src';
import { reactAdapter } from '@stellarix-ui/react';

expect.extend(toHaveNoViolations);

describe('Button Accessibility', () => {
  beforeEach(() => {
    // Silence console warnings for testing
    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      // Skip axe-core warnings
      if (args[0] && typeof args[0] === 'string' && args[0].includes('axe')) {
        return;
      }
      originalConsoleWarn(...args);
    };
  });

  it('should have no accessibility violations', async () => {
    const button = createButton({});
    const Button = button.connect(reactAdapter);
    
    const { container } = render(<Button>Accessible Button</Button>);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should have no accessibility violations when disabled', async () => {
    const button = createButton({
      defaultDisabled: true
    });
    const Button = button.connect(reactAdapter);
    
    const { container } = render(<Button>Disabled Button</Button>);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should have no accessibility violations with aria-label', async () => {
    const button = createButton({});
    const Button = button.connect(reactAdapter);
    
    const { container } = render(
      <Button aria-label="Custom Accessible Label">
        <span>♥</span>
      </Button>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should have no accessibility violations when used as a link', async () => {
    const button = createButton({});
    const Button = button.connect(reactAdapter);
    
    const { container } = render(
      <Button as="a" href="https://example.com" target="_blank" rel="noopener noreferrer">
        Link Button
      </Button>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
}); 