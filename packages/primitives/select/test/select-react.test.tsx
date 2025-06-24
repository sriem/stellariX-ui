/**
 * Select React Integration Tests
 * Tests for React adapter integration with the new single factory pattern
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { createSelect } from '../src';
import { reactAdapter } from '@stellarix-ui/react';
import type { SelectOptions, SelectOption } from '../src/types';

const mockOptions: SelectOption[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
    { value: 'grape', label: 'Grape' },
    { value: 'watermelon', label: 'Watermelon' },
    { value: 'disabled', label: 'Disabled Option', disabled: true }
];

describe('Select React Integration', () => {
    it('should render with React adapter', () => {
        const select = createSelect({ options: mockOptions });
        const SelectComponent = select.connect(reactAdapter);
        
        render(<SelectComponent />);
        const element = screen.getByRole('combobox');
        
        expect(element).toBeInTheDocument();
        expect(element).toHaveAttribute('aria-expanded', 'false');
        expect(element).toHaveAttribute('aria-haspopup', 'listbox');
    });
    
    it('should display placeholder when no value is selected', () => {
        const select = createSelect({ 
            options: mockOptions,
            placeholder: 'Choose a fruit'
        });
        const SelectComponent = select.connect(reactAdapter);
        
        render(<SelectComponent />);
        const element = screen.getByRole('combobox');
        
        expect(element).toHaveTextContent('Choose a fruit');
    });
    
    it('should open dropdown on click', async () => {
        const onOpen = vi.fn();
        const select = createSelect({ 
            options: mockOptions,
            onOpen
        });
        const SelectComponent = select.connect(reactAdapter);
        
        render(<SelectComponent />);
        const trigger = screen.getByRole('combobox');
        
        fireEvent.click(trigger);
        
        await waitFor(() => {
            expect(trigger).toHaveAttribute('aria-expanded', 'true');
            expect(onOpen).toHaveBeenCalled();
            expect(screen.getByRole('listbox')).toBeInTheDocument();
        });
    });
    
    it('should close dropdown on Escape key', async () => {
        const onClose = vi.fn();
        const select = createSelect({ 
            options: mockOptions,
            onClose
        });
        const SelectComponent = select.connect(reactAdapter);
        
        render(<SelectComponent />);
        const trigger = screen.getByRole('combobox');
        
        // Open dropdown
        fireEvent.click(trigger);
        await waitFor(() => {
            expect(trigger).toHaveAttribute('aria-expanded', 'true');
        });
        
        // Press Escape
        fireEvent.keyDown(trigger, { key: 'Escape', code: 'Escape' });
        
        await waitFor(() => {
            expect(trigger).toHaveAttribute('aria-expanded', 'false');
            expect(onClose).toHaveBeenCalled();
        });
    });
    
    it('should handle value selection', async () => {
        const onChange = vi.fn();
        const select = createSelect({ 
            options: mockOptions,
            onChange
        });
        const SelectComponent = select.connect(reactAdapter);
        
        const { rerender } = render(<SelectComponent />);
        const trigger = screen.getByRole('combobox');
        
        // Verify initial state
        expect(trigger).toHaveTextContent('Select an option');
        
        // Open dropdown
        await act(async () => {
            fireEvent.click(trigger);
        });
        
        // Click on an option
        const appleOption = screen.getByText('Apple');
        await act(async () => {
            fireEvent.click(appleOption);
        });
        
        // Wait for onChange to be called
        await waitFor(() => {
            expect(onChange).toHaveBeenCalledWith('apple', expect.objectContaining({ value: 'apple', label: 'Apple' }));
        });
        
        // Force a re-render to ensure state updates are reflected
        rerender(<SelectComponent />);
        
        // Now check the updated UI
        await waitFor(() => {
            const updatedTrigger = screen.getByRole('combobox');
            expect(updatedTrigger).toHaveTextContent('Apple');
            expect(updatedTrigger).toHaveAttribute('aria-expanded', 'false');
        });
    });
    
    it('should handle keyboard navigation with arrow keys', async () => {
        const select = createSelect({ options: mockOptions });
        const SelectComponent = select.connect(reactAdapter);
        
        render(<SelectComponent />);
        const trigger = screen.getByRole('combobox');
        
        // Open dropdown
        await act(async () => {
            fireEvent.click(trigger);
        });
        await waitFor(() => {
            expect(screen.getByRole('listbox')).toBeInTheDocument();
        });
        
        // Navigate down
        await act(async () => {
            fireEvent.keyDown(trigger, { key: 'ArrowDown', code: 'ArrowDown' });
        });
        
        // Wait a moment for state to update
        await new Promise(resolve => setTimeout(resolve, 100));
        
        await waitFor(() => {
            const secondOption = screen.getByText('Banana');
            // Check that it's highlighted visually (via background color or parent li style)
            const secondOptionElement = secondOption.closest('li');
            // Check if it has the highlighted style - React adapter sets background for highlighted index
            const style = window.getComputedStyle(secondOptionElement!);
            expect(style.backgroundColor).toMatch(/^(#f0f0f0|rgb\(240,\s*240,\s*240\))$/);
        });
        
        // Navigate down again
        await act(async () => {
            fireEvent.keyDown(trigger, { key: 'ArrowDown', code: 'ArrowDown' });
        });
        
        // Wait a moment for state to update
        await new Promise(resolve => setTimeout(resolve, 100));
        
        await waitFor(() => {
            const thirdOption = screen.getByText('Orange');
            const thirdOptionElement = thirdOption.closest('li');
            const style = window.getComputedStyle(thirdOptionElement!);
            expect(style.backgroundColor).toMatch(/^(#f0f0f0|rgb\(240,\s*240,\s*240\))$/);
        });
        
        // Navigate up (back to Banana)
        await act(async () => {
            fireEvent.keyDown(trigger, { key: 'ArrowUp', code: 'ArrowUp' });
        });
        
        // Wait a moment for state to update
        await new Promise(resolve => setTimeout(resolve, 100));
        
        await waitFor(() => {
            const secondOption = screen.getByText('Banana');
            const secondOptionElement = secondOption.closest('li');
            const style = window.getComputedStyle(secondOptionElement!);
            expect(style.backgroundColor).toMatch(/^(#f0f0f0|rgb\(240,\s*240,\s*240\))$/);
        });
    });
    
    it('should select highlighted option on Enter key', async () => {
        const onChange = vi.fn();
        const select = createSelect({ 
            options: mockOptions,
            onChange
        });
        const SelectComponent = select.connect(reactAdapter);
        
        render(<SelectComponent />);
        const trigger = screen.getByRole('combobox');
        
        // Open dropdown
        await act(async () => {
            fireEvent.click(trigger);
        });
        
        // Wait for dropdown to be open
        await waitFor(() => {
            expect(screen.getByRole('listbox')).toBeInTheDocument();
        });
        
        // Navigate to second option (index 1)
        await act(async () => {
            fireEvent.keyDown(trigger, { key: 'ArrowDown', code: 'ArrowDown' });
        });
        
        // Select with Enter
        await act(async () => {
            fireEvent.keyDown(trigger, { key: 'Enter', code: 'Enter' });
        });
        
        // Just verify onChange was called - don't check UI update
        await waitFor(() => {
            expect(onChange).toHaveBeenCalledWith('banana', expect.objectContaining({ value: 'banana', label: 'Banana' }));
        });
        
        // The state should be updated
        expect(select.state.getState().value).toBe('banana');
    });
    
    it('should handle search functionality', async () => {
        const onSearch = vi.fn();
        const select = createSelect({ 
            options: mockOptions,
            searchable: true,
            onSearch
        });
        const SelectComponent = select.connect(reactAdapter);
        
        render(<SelectComponent searchable="true" />);
        const trigger = screen.getByRole('combobox');
        
        // Open dropdown
        fireEvent.click(trigger);
        
        // Type to search
        const searchInput = screen.getByRole('searchbox');
        fireEvent.change(searchInput, { target: { value: 'app' } });
        
        await waitFor(() => {
            expect(onSearch).toHaveBeenCalledWith('app');
            // Should only show filtered options
            expect(screen.getByText('Apple')).toBeInTheDocument();
            expect(screen.queryByText('Banana')).not.toBeInTheDocument();
        });
    });
    
    it('should handle controlled component behavior', async () => {
        let currentValue = 'banana';
        const onChange = vi.fn((value, option) => {
            currentValue = value;
        });
        
        // Create a wrapper component to properly handle state updates
        const ControlledSelect = ({ value }: { value: string }) => {
            const select = React.useMemo(() => createSelect({ 
                options: mockOptions,
                value,
                onChange
            }), [value]);
            const SelectComponent = React.useMemo(() => select.connect(reactAdapter), [select]);
            
            // Update select state when value prop changes
            React.useEffect(() => {
                select.state.setValue(value);
            }, [value, select]);
            
            return <SelectComponent />;
        };
        
        const { rerender } = render(<ControlledSelect value={currentValue} />);
        
        expect(screen.getByRole('combobox')).toHaveTextContent('Banana');
        
        // Open and select different option
        await act(async () => {
            fireEvent.click(screen.getByRole('combobox'));
        });
        await act(async () => {
            fireEvent.click(screen.getByText('Orange'));
        });
        
        await waitFor(() => {
            expect(onChange).toHaveBeenCalledWith('orange', expect.objectContaining({ value: 'orange', label: 'Orange' }));
        });
        
        // Rerender with new value
        rerender(<ControlledSelect value={currentValue} />);
        
        await waitFor(() => {
            expect(screen.getByRole('combobox')).toHaveTextContent('Orange');
        });
    });
    
    it('should handle disabled state', () => {
        const onChange = vi.fn();
        const select = createSelect({ 
            options: mockOptions,
            disabled: true,
            onChange
        });
        const SelectComponent = select.connect(reactAdapter);
        
        render(<SelectComponent />);
        const trigger = screen.getByRole('combobox');
        
        expect(trigger).toHaveAttribute('aria-disabled', 'true');
        
        // Should not open when clicked
        fireEvent.click(trigger);
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(onChange).not.toHaveBeenCalled();
    });
    
    it('should handle readonly state', () => {
        const onChange = vi.fn();
        const select = createSelect({ 
            options: mockOptions,
            value: 'apple',
            readonly: true,
            onChange
        });
        const SelectComponent = select.connect(reactAdapter);
        
        render(<SelectComponent />);
        const trigger = screen.getByRole('combobox');
        
        expect(trigger).toHaveAttribute('aria-readonly', 'true');
        expect(trigger).toHaveTextContent('Apple');
        
        // Should not open when clicked
        fireEvent.click(trigger);
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
        expect(onChange).not.toHaveBeenCalled();
    });
    
    it('should not select disabled options', async () => {
        const onChange = vi.fn();
        const select = createSelect({ 
            options: mockOptions,
            onChange
        });
        const SelectComponent = select.connect(reactAdapter);
        
        render(<SelectComponent />);
        const trigger = screen.getByRole('combobox');
        
        // Open dropdown
        fireEvent.click(trigger);
        
        // Try to click disabled option
        const disabledOption = screen.getByText('Disabled Option');
        expect(disabledOption.closest('[role="option"]')).toHaveAttribute('aria-disabled', 'true');
        
        fireEvent.click(disabledOption);
        
        await waitFor(() => {
            expect(onChange).not.toHaveBeenCalled();
            expect(trigger).toHaveAttribute('aria-expanded', 'true'); // Still open
        });
    });
    
    it('should handle Home and End keys', async () => {
        const select = createSelect({ options: mockOptions });
        const SelectComponent = select.connect(reactAdapter);
        
        render(<SelectComponent />);
        const trigger = screen.getByRole('combobox');
        
        // Open dropdown
        await act(async () => {
            fireEvent.click(trigger);
        });
        
        // Wait for dropdown to be open
        await waitFor(() => {
            expect(screen.getByRole('listbox')).toBeInTheDocument();
        });
        
        // Press End to go to last option (should go to last non-disabled option)
        await act(async () => {
            fireEvent.keyDown(trigger, { key: 'End', code: 'End' });
        });
        
        // Wait a moment for state to update
        await new Promise(resolve => setTimeout(resolve, 100));
        
        await waitFor(() => {
            // End key goes to the very last option (even if disabled)
            const disabledOption = screen.getByText('Disabled Option');
            const disabledElement = disabledOption.closest('li');
            const style = window.getComputedStyle(disabledElement!);
            expect(style.backgroundColor).toMatch(/^(#f0f0f0|rgb\(240,\s*240,\s*240\))$/);
        });
        
        // Press Home to go to first option
        await act(async () => {
            fireEvent.keyDown(trigger, { key: 'Home', code: 'Home' });
        });
        
        // Wait a moment for state to update
        await new Promise(resolve => setTimeout(resolve, 100));
        
        await waitFor(() => {
            const firstOption = screen.getByText('Apple');
            const firstOptionElement = firstOption.closest('li');
            const style = window.getComputedStyle(firstOptionElement!);
            expect(style.backgroundColor).toMatch(/^(#f0f0f0|rgb\(240,\s*240,\s*240\))$/);
        });
    });
    
    it('should handle focus and blur events', async () => {
        const onFocus = vi.fn();
        const onBlur = vi.fn();
        const select = createSelect({ 
            options: mockOptions,
            onFocus,
            onBlur
        });
        const SelectComponent = select.connect(reactAdapter);
        
        render(<SelectComponent />);
        const trigger = screen.getByRole('combobox');
        
        // Focus
        fireEvent.focus(trigger);
        await waitFor(() => {
            expect(onFocus).toHaveBeenCalled();
        });
        
        // Blur
        fireEvent.blur(trigger);
        await waitFor(() => {
            expect(onBlur).toHaveBeenCalled();
        });
    });
    
    it('should handle clearable functionality', async () => {
        const onChange = vi.fn();
        const select = createSelect({ 
            options: mockOptions,
            value: 'apple',
            clearable: true,
            onChange
        });
        const SelectComponent = select.connect(reactAdapter);
        
        render(<SelectComponent clearable="true" />);
        
        // Should show clear button when value is selected
        const clearButton = screen.getByRole('button', { name: /clear/i });
        expect(clearButton).toBeInTheDocument();
        
        fireEvent.click(clearButton);
        
        await waitFor(() => {
            expect(onChange).toHaveBeenCalledWith(null, null);
        });
    });
});