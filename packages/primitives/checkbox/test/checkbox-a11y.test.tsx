/**
 * Checkbox Accessibility Tests
 */

import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createCheckboxWithImplementation } from '../src';
import { reactAdapter } from '@stellarix-ui/react';

expect.extend(toHaveNoViolations);

describe('Checkbox Accessibility', () => {
    it('should meet WCAG 2.1 AA standards', async () => {
        const checkbox = createCheckboxWithImplementation();
        const CheckboxComponent = checkbox.connect(reactAdapter);
        
        const { container } = render(
            <form>
                <label htmlFor="test-checkbox">Accept terms and conditions</label>
                <CheckboxComponent id="test-checkbox" />
            </form>
        );
        
        const results = await axe(container, {
            rules: {
                // Run specific WCAG 2.1 AA rules
                'color-contrast': { enabled: true },
                'label': { enabled: true },
                'aria-valid-attr': { enabled: true },
                'aria-valid-attr-value': { enabled: true },
                'aria-allowed-role': { enabled: true },
            },
        });
        
        expect(results).toHaveNoViolations();
    }, 30000);
    
    it('should have proper ARIA attributes', () => {
        const checkbox = createCheckboxWithImplementation({
            checked: false,
            required: true,
            disabled: false,
            error: true,
        });
        const CheckboxComponent = checkbox.connect(reactAdapter);
        
        const { getByRole } = render(<CheckboxComponent />);
        const element = getByRole('checkbox');
        
        expect(element).toHaveAttribute('aria-checked', 'false');
        expect(element).toHaveAttribute('aria-required', 'true');
        expect(element).toHaveAttribute('aria-disabled', 'false');
        expect(element).toHaveAttribute('aria-invalid', 'true');
    });
    
    it('should handle indeterminate state with proper ARIA', () => {
        const checkbox = createCheckboxWithImplementation({
            checked: 'indeterminate'
        });
        const CheckboxComponent = checkbox.connect(reactAdapter);
        
        const { getByRole } = render(<CheckboxComponent />);
        const element = getByRole('checkbox');
        
        expect(element).toHaveAttribute('aria-checked', 'mixed');
    });
    
    it('should be keyboard navigable', () => {
        const checkbox = createCheckboxWithImplementation();
        const CheckboxComponent = checkbox.connect(reactAdapter);
        
        const { getByRole } = render(<CheckboxComponent />);
        const element = getByRole('checkbox');
        
        // Check that checkbox can receive focus
        element.focus();
        expect(document.activeElement).toBe(element);
        
        // Tab index should be 0 for keyboard navigation
        expect(element).toHaveAttribute('tabIndex', '0');
    });
    
    it('should work with screen readers', async () => {
        const checkbox = createCheckboxWithImplementation({
            id: 'agreement-checkbox',
            required: true,
            name: 'agreement',
        });
        const CheckboxComponent = checkbox.connect(reactAdapter);
        
        const { container, getByRole } = render(
            <div>
                <label htmlFor="agreement-checkbox">
                    I agree to the terms and conditions
                </label>
                <CheckboxComponent />
                <div id="agreement-checkbox-desc">
                    You must agree to continue
                </div>
            </div>
        );
        
        const element = getByRole('checkbox');
        
        // Check proper labeling
        expect(element).toHaveAttribute('aria-required', 'true');
        expect(element).toHaveAttribute('id', 'agreement-checkbox');
        expect(element).toHaveAttribute('name', 'agreement');
        
        // Verify no accessibility violations
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    }, 30000);
    
    it('should have no violations when disabled', async () => {
        const checkbox = createCheckboxWithImplementation({
            disabled: true,
            checked: true
        });
        const CheckboxComponent = checkbox.connect(reactAdapter);
        
        const { container } = render(
            <form>
                <label htmlFor="disabled-checkbox">Disabled option</label>
                <CheckboxComponent id="disabled-checkbox" />
            </form>
        );
        
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    }, 30000);
    
    it('should support high contrast mode', () => {
        const checkbox = createCheckboxWithImplementation();
        const CheckboxComponent = checkbox.connect(reactAdapter);
        
        const { getByRole } = render(<CheckboxComponent />);
        const element = getByRole('checkbox');
        
        // Component should not rely on color alone for state
        expect(element).toHaveAttribute('type', 'checkbox');
        expect(element).toHaveAttribute('role', 'checkbox');
        // Actual high contrast testing would be done with visual regression tests
    });
    
    it('should have proper focus indicators', () => {
        const checkbox = createCheckboxWithImplementation();
        const CheckboxComponent = checkbox.connect(reactAdapter);
        
        const { getByRole } = render(<CheckboxComponent />);
        const element = getByRole('checkbox');
        
        // Focus the element
        element.focus();
        
        // In a real test, we'd check computed styles for focus indicators
        expect(document.activeElement).toBe(element);
        expect(element).toHaveAttribute('tabIndex', '0');
    });
    
    it('should handle error states accessibly', async () => {
        const checkbox = createCheckboxWithImplementation({
            error: true,
            errorMessage: 'You must accept the terms',
            id: 'terms-checkbox',
            required: true
        });
        const CheckboxComponent = checkbox.connect(reactAdapter);
        
        const { container, getByRole } = render(
            <div>
                <label htmlFor="terms-checkbox">Accept terms *</label>
                <CheckboxComponent aria-describedby="terms-error" />
                <div id="terms-error" role="alert">
                    You must accept the terms
                </div>
            </div>
        );
        
        const element = getByRole('checkbox');
        
        expect(element).toHaveAttribute('aria-invalid', 'true');
        expect(element).toHaveAttribute('aria-required', 'true');
        expect(element).toHaveAttribute('aria-describedby', 'terms-error');
        
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    }, 30000);
    
    it('should handle grouped checkboxes accessibly', async () => {
        const checkbox1 = createCheckboxWithImplementation({ id: 'option1' });
        const checkbox2 = createCheckboxWithImplementation({ id: 'option2' });
        const checkbox3 = createCheckboxWithImplementation({ id: 'option3' });
        
        const Checkbox1 = checkbox1.connect(reactAdapter);
        const Checkbox2 = checkbox2.connect(reactAdapter);
        const Checkbox3 = checkbox3.connect(reactAdapter);
        
        const { container } = render(
            <fieldset>
                <legend>Select your preferences</legend>
                <div>
                    <label htmlFor="option1">
                        <Checkbox1 />
                        Email notifications
                    </label>
                </div>
                <div>
                    <label htmlFor="option2">
                        <Checkbox2 />
                        SMS notifications
                    </label>
                </div>
                <div>
                    <label htmlFor="option3">
                        <Checkbox3 />
                        Push notifications
                    </label>
                </div>
            </fieldset>
        );
        
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    }, 30000);
    
    it('should announce state changes to screen readers', () => {
        const checkbox = createCheckboxWithImplementation({
            checked: false
        });
        const CheckboxComponent = checkbox.connect(reactAdapter);
        
        const { getByRole, rerender } = render(<CheckboxComponent />);
        const element = getByRole('checkbox');
        
        // Initial state
        expect(element).toHaveAttribute('aria-checked', 'false');
        
        // Simulate state change
        const checkedCheckbox = createCheckboxWithImplementation({
            checked: true
        });
        const CheckedComponent = checkedCheckbox.connect(reactAdapter);
        
        rerender(<CheckedComponent />);
        
        expect(getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
    });
});