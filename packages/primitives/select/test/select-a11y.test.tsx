/**
 * Select Accessibility Tests
 * Tests for WCAG compliance with the new single factory pattern
 */

import React from 'react';
import { render, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import '@testing-library/jest-dom';
import { createSelect } from '../src';
import { reactAdapter } from '@stellarix-ui/react';
import type { SelectOption } from '../src/types';

expect.extend(toHaveNoViolations);

const mockOptions: SelectOption[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
    { value: 'disabled', label: 'Disabled Option', disabled: true }
];

describe('Select Accessibility', () => {
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
    
    it('should meet WCAG 2.1 AA standards', async () => {
        const select = createSelect({ options: mockOptions });
        const SelectComponent = select.connect(reactAdapter);
        
        const { container } = render(
            <form>
                <label htmlFor="test-select">Select a fruit</label>
                <SelectComponent id="test-select" />
            </form>
        );
        
        const results = await axe(container, {
            rules: {
                // Run specific WCAG 2.1 AA rules
                'color-contrast': { enabled: true },
                'label': { enabled: true },
                'aria-valid-attr': { enabled: true },
                'aria-valid-attr-value': { enabled: true },
                'aria-required-children': { enabled: true },
                'aria-required-parent': { enabled: true },
            },
        });
        
        expect(results).toHaveNoViolations();
    }, 30000);
    
    it('should have proper ARIA attributes for combobox pattern', () => {
        const select = createSelect({
            options: mockOptions,
            value: 'apple',
            placeholder: 'Choose a fruit'
        });
        const SelectComponent = select.connect(reactAdapter);
        
        const { getByRole } = render(<SelectComponent />);
        const combobox = getByRole('combobox');
        
        // Combobox ARIA attributes
        expect(combobox).toHaveAttribute('role', 'combobox');
        expect(combobox).toHaveAttribute('aria-expanded', 'false');
        expect(combobox).toHaveAttribute('aria-haspopup', 'listbox');
        expect(combobox).toHaveAttribute('aria-controls');
        expect(combobox).toHaveTextContent('Apple');
    });
    
    it('should have proper ARIA attributes when open', async () => {
        const select = createSelect({ options: mockOptions });
        const SelectComponent = select.connect(reactAdapter);
        
        const { getByRole } = render(<SelectComponent />);
        const combobox = getByRole('combobox');
        
        // Open the dropdown
        await act(async () => {
            combobox.click();
        });
        
        expect(combobox).toHaveAttribute('aria-expanded', 'true');
        
        // Check listbox
        const listbox = getByRole('listbox');
        expect(listbox).toBeInTheDocument();
        expect(listbox).toHaveAttribute('role', 'listbox');
        
        // Check options
        const options = listbox.querySelectorAll('[role="option"]');
        expect(options).toHaveLength(4);
        
        // Check disabled option
        const disabledOption = Array.from(options).find(opt => 
            opt.textContent === 'Disabled Option'
        );
        expect(disabledOption).toHaveAttribute('aria-disabled', 'true');
    });
    
    it('should support keyboard navigation', async () => {
        const select = createSelect({ options: mockOptions });
        const SelectComponent = select.connect(reactAdapter);
        
        const { getByRole } = render(<SelectComponent />);
        const combobox = getByRole('combobox');
        
        // Component should be keyboard focusable
        await act(async () => {
            combobox.focus();
        });
        expect(document.activeElement).toBe(combobox);
        
        // Should have tabindex
        expect(combobox).toHaveAttribute('tabindex', '0');
    });
    
    it('should announce selected value to screen readers', async () => {
        const select = createSelect({
            options: mockOptions,
            value: 'banana'
        });
        const SelectComponent = select.connect(reactAdapter);
        
        const { getByRole } = render(<SelectComponent />);
        const combobox = getByRole('combobox');
        
        // Should display selected value
        expect(combobox).toHaveTextContent('Banana');
        
        // When opened, selected option should have aria-selected
        await act(async () => {
            combobox.click();
        });
        const selectedOption = getByRole('option', { name: 'Banana' });
        expect(selectedOption).toHaveAttribute('aria-selected', 'true');
    });
    
    it('should have proper ARIA attributes for disabled state', () => {
        const select = createSelect({
            options: mockOptions,
            disabled: true
        });
        const SelectComponent = select.connect(reactAdapter);
        
        const { getByRole } = render(<SelectComponent />);
        const combobox = getByRole('combobox');
        
        expect(combobox).toHaveAttribute('aria-disabled', 'true');
        expect(combobox).toHaveAttribute('tabindex', '-1');
    });
    
    it('should have proper ARIA attributes for readonly state', () => {
        const select = createSelect({
            options: mockOptions,
            value: 'orange',
            readonly: true
        });
        const SelectComponent = select.connect(reactAdapter);
        
        const { getByRole } = render(<SelectComponent />);
        const combobox = getByRole('combobox');
        
        expect(combobox).toHaveAttribute('aria-readonly', 'true');
        expect(combobox).toHaveTextContent('Orange');
    });
    
    it('should support aria-label', async () => {
        const select = createSelect({ options: mockOptions });
        const SelectComponent = select.connect(reactAdapter);
        
        const { container } = render(
            <SelectComponent aria-label="Select your favorite fruit" />
        );
        
        const combobox = container.querySelector('[role="combobox"]');
        expect(combobox).toHaveAttribute('aria-label', 'Select your favorite fruit');
        
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    }, 30000);
    
    it('should support aria-labelledby', async () => {
        const select = createSelect({ options: mockOptions });
        const SelectComponent = select.connect(reactAdapter);
        
        const { container } = render(
            <div>
                <span id="select-label">Choose a fruit:</span>
                <SelectComponent aria-labelledby="select-label" />
            </div>
        );
        
        const combobox = container.querySelector('[role="combobox"]');
        expect(combobox).toHaveAttribute('aria-labelledby', 'select-label');
        
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    }, 30000);
    
    it('should support aria-describedby', async () => {
        const select = createSelect({
            options: mockOptions,
            required: true
        });
        const SelectComponent = select.connect(reactAdapter);
        
        const { container } = render(
            <div>
                <label htmlFor="fruit-select">Fruit Selection</label>
                <SelectComponent id="fruit-select" aria-describedby="fruit-help" />
                <span id="fruit-help">Please select your favorite fruit from the list</span>
            </div>
        );
        
        const combobox = container.querySelector('[role="combobox"]');
        expect(combobox).toHaveAttribute('aria-describedby', 'fruit-help');
        
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    }, 30000);
    
    it('should properly handle aria-activedescendant for keyboard navigation', async () => {
        const select = createSelect({ options: mockOptions });
        const SelectComponent = select.connect(reactAdapter);
        
        const { getByRole } = render(<SelectComponent />);
        const combobox = getByRole('combobox');
        
        // Open dropdown
        await act(async () => {
            combobox.click();
        });
        
        // Navigate with keyboard
        await act(async () => {
            const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
            combobox.dispatchEvent(event);
        });
        
        // Should have aria-activedescendant pointing to highlighted option
        expect(combobox).toHaveAttribute('aria-activedescendant');
    });
    
    it('should support searchable select accessibility', async () => {
        const select = createSelect({
            options: mockOptions,
            searchable: true
        });
        const SelectComponent = select.connect(reactAdapter);
        
        const { container, getByRole } = render(
            <form>
                <label htmlFor="searchable-select">Searchable Fruit Select</label>
                <SelectComponent id="searchable-select" searchable="true" />
            </form>
        );
        
        const combobox = getByRole('combobox');
        await act(async () => {
            combobox.click();
        });
        
        // Should have search input
        const searchBox = getByRole('searchbox');
        expect(searchBox).toBeInTheDocument();
        expect(searchBox).toHaveAttribute('type', 'search');
        
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    }, 30000);
    
    it('should handle high contrast mode', () => {
        const select = createSelect({ options: mockOptions });
        const SelectComponent = select.connect(reactAdapter);
        
        const { getByRole } = render(<SelectComponent />);
        const combobox = getByRole('combobox');
        
        // Component should not rely on color alone for state
        expect(combobox).toHaveAttribute('role', 'combobox');
        // Actual high contrast testing would be done with visual regression tests
    });
    
    it('should properly handle focus management', async () => {
        const select = createSelect({ options: mockOptions });
        const SelectComponent = select.connect(reactAdapter);
        
        const { getByRole } = render(<SelectComponent />);
        const combobox = getByRole('combobox');
        
        // Focus the combobox
        await act(async () => {
            combobox.focus();
        });
        expect(document.activeElement).toBe(combobox);
        
        // Open dropdown
        await act(async () => {
            combobox.click();
        });
        
        // Focus should remain on combobox while navigating options
        await act(async () => {
            const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
            combobox.dispatchEvent(event);
        });
        
        expect(document.activeElement).toBe(combobox);
    });
    
    it('should have no accessibility violations with clearable button', async () => {
        const select = createSelect({
            options: mockOptions,
            value: 'apple',
            clearable: true
        });
        const SelectComponent = select.connect(reactAdapter);
        
        const { container } = render(
            <form>
                <label htmlFor="clearable-select">Clearable Select</label>
                <SelectComponent id="clearable-select" clearable="true" />
            </form>
        );
        
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    }, 30000);
});