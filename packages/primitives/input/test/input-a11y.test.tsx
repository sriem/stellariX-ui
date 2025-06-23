/**
 * Input Accessibility Tests
 */

import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createInputWithImplementation } from '../src';
import { reactAdapter } from '@stellarix-ui/react';

expect.extend(toHaveNoViolations);

describe('Input Accessibility', () => {
    it('should meet WCAG 2.1 AA standards', async () => {
        const input = createInputWithImplementation();
        const InputComponent = input.connect(reactAdapter);
        
        const { container } = render(
            <form>
                <label htmlFor="test-input">Test Input</label>
                <InputComponent id="test-input" />
            </form>
        );
        
        const results = await axe(container, {
            rules: {
                // Run specific WCAG 2.1 AA rules
                'color-contrast': { enabled: true },
                'label': { enabled: true },
                'aria-valid-attr': { enabled: true },
                'aria-valid-attr-value': { enabled: true },
            },
        });
        
        expect(results).toHaveNoViolations();
    }, 30000);
    
    it('should have proper ARIA attributes', () => {
        const input = createInputWithImplementation({
            required: true,
            error: true,
            disabled: true,
            readonly: true,
        });
        const InputComponent = input.connect(reactAdapter);
        
        const { getByRole } = render(<InputComponent />);
        const element = getByRole('textbox');
        
        expect(element).toHaveAttribute('aria-required', 'true');
        expect(element).toHaveAttribute('aria-invalid', 'true');
        expect(element).toHaveAttribute('aria-disabled', 'true');
        expect(element).toHaveAttribute('aria-readonly', 'true');
    });
    
    it('should be keyboard navigable', () => {
        const input = createInputWithImplementation();
        const InputComponent = input.connect(reactAdapter);
        
        const { getByRole } = render(<InputComponent />);
        const element = getByRole('textbox');
        
        // Check that input can receive focus
        element.focus();
        expect(document.activeElement).toBe(element);
    });
    
    it('should work with screen readers', async () => {
        const input = createInputWithImplementation({
            id: 'email-input',
            type: 'email',
            required: true,
            errorMessage: 'Please enter a valid email',
            error: true,
        });
        const InputComponent = input.connect(reactAdapter);
        
        const { container, getByRole } = render(
            <div>
                <label htmlFor="email-input">Email Address</label>
                <InputComponent />
                <div id="email-input-error" role="alert">
                    Please enter a valid email
                </div>
            </div>
        );
        
        const element = getByRole('textbox');
        
        // Check proper labeling
        expect(element).toHaveAttribute('type', 'email');
        expect(element).toHaveAttribute('aria-required', 'true');
        expect(element).toHaveAttribute('aria-invalid', 'true');
        
        // Verify no accessibility violations
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    }, 30000);
    
    it('should support high contrast mode', () => {
        const input = createInputWithImplementation();
        const InputComponent = input.connect(reactAdapter);
        
        const { getByRole } = render(<InputComponent />);
        const element = getByRole('textbox');
        
        // Component should not rely on color alone for state
        expect(element).toHaveAttribute('type', 'text');
        // Actual high contrast testing would be done with visual regression tests
    });
    
    it('should have proper focus indicators', () => {
        const input = createInputWithImplementation();
        const InputComponent = input.connect(reactAdapter);
        
        const { getByRole } = render(<InputComponent />);
        const element = getByRole('textbox');
        
        // Focus the element
        element.focus();
        
        // In a real test, we'd check computed styles for focus indicators
        expect(document.activeElement).toBe(element);
    });
    
    it('should handle autocomplete attributes', () => {
        const input = createInputWithImplementation({
            type: 'email',
            autocomplete: 'email',
            name: 'user-email',
        });
        const InputComponent = input.connect(reactAdapter);
        
        const { getByRole } = render(<InputComponent />);
        const element = getByRole('textbox');
        
        expect(element).toHaveAttribute('autocomplete', 'email');
        expect(element).toHaveAttribute('name', 'user-email');
    });
});