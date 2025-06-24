/**
 * Checkbox React Integration Test
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { createCheckboxWithImplementation } from '../src';
import { reactAdapter } from '@stellarix-ui/react';
import type { CheckboxOptions } from '../src/types';

describe('Checkbox React Integration', () => {
    it('should render with React adapter', () => {
        const checkbox = createCheckboxWithImplementation();
        const CheckboxComponent = checkbox.connect(reactAdapter);
        
        render(<CheckboxComponent data-testid="test-checkbox" />);
        const element = screen.getByTestId('test-checkbox');
        
        expect(element).toBeInTheDocument();
        expect(element).toHaveAttribute('type', 'checkbox');
        expect(element).toHaveAttribute('role', 'checkbox');
    });
    
    it('should handle checked state changes', async () => {
        const onChange = vi.fn();
        const checkbox = createCheckboxWithImplementation({ onChange });
        const CheckboxComponent = checkbox.connect(reactAdapter);
        
        render(<CheckboxComponent data-testid="test-checkbox" />);
        const element = screen.getByTestId('test-checkbox') as HTMLInputElement;
        
        // Initially unchecked
        expect(element.checked).toBe(false);
        expect(element).toHaveAttribute('aria-checked', 'false');
        
        // Click to check
        act(() => {
            fireEvent.click(element);
        });
        
        await waitFor(() => {
            expect(element.checked).toBe(true);
            expect(element).toHaveAttribute('aria-checked', 'true');
            expect(onChange).toHaveBeenCalledWith(true);
        });
        
        // Click to uncheck
        act(() => {
            fireEvent.click(element);
        });
        
        await waitFor(() => {
            expect(element.checked).toBe(false);
            expect(element).toHaveAttribute('aria-checked', 'false');
            expect(onChange).toHaveBeenCalledWith(false);
        });
    });
    
    it('should handle indeterminate state', async () => {
        const checkbox = createCheckboxWithImplementation({ checked: 'indeterminate' });
        const CheckboxComponent = checkbox.connect(reactAdapter);
        
        render(<CheckboxComponent data-testid="test-checkbox" />);
        const element = screen.getByTestId('test-checkbox') as HTMLInputElement;
        
        expect(element.indeterminate).toBe(true);
        expect(element).toHaveAttribute('aria-checked', 'mixed');
    });
    
    it('should handle disabled state', () => {
        const onChange = vi.fn();
        const checkbox = createCheckboxWithImplementation({ 
            disabled: true,
            onChange 
        });
        const CheckboxComponent = checkbox.connect(reactAdapter);
        
        render(<CheckboxComponent data-testid="test-checkbox" />);
        const element = screen.getByTestId('test-checkbox');
        
        expect(element).toBeDisabled();
        expect(element).toHaveAttribute('aria-disabled', 'true');
        
        // Should not trigger onChange when disabled
        act(() => {
            fireEvent.click(element);
        });
        expect(onChange).not.toHaveBeenCalled();
    });
    
    it('should handle keyboard interactions (Space key)', async () => {
        const onChange = vi.fn();
        const checkbox = createCheckboxWithImplementation({ onChange });
        const CheckboxComponent = checkbox.connect(reactAdapter);
        
        render(<CheckboxComponent data-testid="test-checkbox" />);
        const element = screen.getByTestId('test-checkbox');
        
        // Focus the checkbox
        element.focus();
        expect(document.activeElement).toBe(element);
        
        // Press Space to toggle
        act(() => {
            fireEvent.keyDown(element, { key: ' ', code: 'Space' });
        });
        
        await waitFor(() => {
            expect(onChange).toHaveBeenCalledWith(true);
        });
        
        // Press Space again to toggle back
        act(() => {
            fireEvent.keyDown(element, { key: ' ', code: 'Space' });
        });
        
        await waitFor(() => {
            expect(onChange).toHaveBeenCalledWith(false);
        });
    });
    
    it('should handle focus and blur events', async () => {
        const onFocus = vi.fn();
        const onBlur = vi.fn();
        const checkbox = createCheckboxWithImplementation({ onFocus, onBlur });
        const CheckboxComponent = checkbox.connect(reactAdapter);
        
        render(<CheckboxComponent data-testid="test-checkbox" />);
        const element = screen.getByTestId('test-checkbox');
        
        // Focus event
        act(() => {
            fireEvent.focus(element);
        });
        await waitFor(() => {
            expect(onFocus).toHaveBeenCalled();
        });
        
        // Blur event
        act(() => {
            fireEvent.blur(element);
        });
        await waitFor(() => {
            expect(onBlur).toHaveBeenCalled();
        });
    });
    
    it('should handle controlled vs uncontrolled behavior', async () => {
        // Uncontrolled - internal state management
        const uncontrolledCheckbox = createCheckboxWithImplementation();
        const UncontrolledComponent = uncontrolledCheckbox.connect(reactAdapter);
        
        const { rerender: rerenderUncontrolled } = render(
            <UncontrolledComponent data-testid="uncontrolled" />
        );
        const uncontrolledElement = screen.getByTestId('uncontrolled') as HTMLInputElement;
        
        // Should manage its own state
        act(() => {
            fireEvent.click(uncontrolledElement);
        });
        await waitFor(() => {
            expect(uncontrolledElement.checked).toBe(true);
        });
        
        // Controlled - external state management
        const ControlledWrapper = () => {
            const [checked, setChecked] = React.useState(false);
            const controlledCheckbox = createCheckboxWithImplementation({
                checked,
                onChange: setChecked
            });
            const ControlledComponent = controlledCheckbox.connect(reactAdapter);
            
            return <ControlledComponent data-testid="controlled" />;
        };
        
        render(<ControlledWrapper />);
        const controlledElement = screen.getByTestId('controlled') as HTMLInputElement;
        
        // Should sync with external state
        act(() => {
            fireEvent.click(controlledElement);
        });
        await waitFor(() => {
            expect(controlledElement.checked).toBe(true);
        });
    });
    
    it('should apply required attribute', () => {
        const checkbox = createCheckboxWithImplementation({ required: true });
        const CheckboxComponent = checkbox.connect(reactAdapter);
        
        render(<CheckboxComponent data-testid="test-checkbox" />);
        const element = screen.getByTestId('test-checkbox');
        
        expect(element).toHaveAttribute('aria-required', 'true');
    });
    
    it('should display error state', () => {
        const checkbox = createCheckboxWithImplementation({ 
            error: true,
            errorMessage: 'Please check this box'
        });
        const CheckboxComponent = checkbox.connect(reactAdapter);
        
        render(<CheckboxComponent data-testid="test-checkbox" />);
        const element = screen.getByTestId('test-checkbox');
        
        expect(element).toHaveAttribute('aria-invalid', 'true');
    });
    
    it('should handle form attributes', () => {
        const checkbox = createCheckboxWithImplementation({ 
            name: 'terms',
            value: 'accepted',
            id: 'terms-checkbox'
        });
        const CheckboxComponent = checkbox.connect(reactAdapter);
        
        render(<CheckboxComponent />);
        const element = screen.getByRole('checkbox');
        
        expect(element).toHaveAttribute('name', 'terms');
        expect(element).toHaveAttribute('value', 'accepted');
        expect(element).toHaveAttribute('id', 'terms-checkbox');
    });
    
    it('should start with initial checked state', () => {
        const checkbox = createCheckboxWithImplementation({ checked: true });
        const CheckboxComponent = checkbox.connect(reactAdapter);
        
        render(<CheckboxComponent data-testid="test-checkbox" />);
        const element = screen.getByTestId('test-checkbox') as HTMLInputElement;
        
        expect(element.checked).toBe(true);
        expect(element).toHaveAttribute('aria-checked', 'true');
    });
    
    it('should not respond to keyboard when disabled', async () => {
        const onChange = vi.fn();
        const checkbox = createCheckboxWithImplementation({ 
            disabled: true,
            onChange 
        });
        const CheckboxComponent = checkbox.connect(reactAdapter);
        
        render(<CheckboxComponent data-testid="test-checkbox" />);
        const element = screen.getByTestId('test-checkbox');
        
        act(() => {
            fireEvent.keyDown(element, { key: ' ', code: 'Space' });
        });
        
        // Should not trigger change
        await waitFor(() => {
            expect(onChange).not.toHaveBeenCalled();
        });
    });
});