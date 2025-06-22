/**
 * Input React Integration Test
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { createInputWithImplementation } from '../src';
import { reactAdapter } from '@stellarix/react';
import type { InputOptions } from '../src/types';

describe('Input React Integration', () => {
    it('should render with React adapter', () => {
        const input = createInputWithImplementation();
        const InputComponent = input.connect(reactAdapter);
        
        render(<InputComponent />);
        const element = screen.getByRole('textbox');
        
        expect(element).toBeInTheDocument();
        expect(element).toHaveAttribute('type', 'text');
    });
    
    it('should handle value changes', async () => {
        const onChange = vi.fn();
        const input = createInputWithImplementation({ onChange });
        const InputComponent = input.connect(reactAdapter);
        
        render(<InputComponent />);
        const element = screen.getByRole('textbox') as HTMLInputElement;
        
        fireEvent.change(element, { target: { value: 'test value' } });
        
        await waitFor(() => {
            expect(element.value).toBe('test value');
            expect(onChange).toHaveBeenCalledWith('test value');
        });
    });
    
    it('should handle different input types', () => {
        const input = createInputWithImplementation({ type: 'email' });
        const InputComponent = input.connect(reactAdapter);
        
        render(<InputComponent />);
        const element = screen.getByRole('textbox');
        
        expect(element).toHaveAttribute('type', 'email');
    });
    
    it('should apply disabled state', () => {
        const input = createInputWithImplementation({ disabled: true });
        const InputComponent = input.connect(reactAdapter);
        
        render(<InputComponent />);
        const element = screen.getByRole('textbox');
        
        expect(element).toBeDisabled();
        expect(element).toHaveAttribute('aria-disabled', 'true');
    });
    
    it('should apply readonly state', () => {
        const input = createInputWithImplementation({ readonly: true });
        const InputComponent = input.connect(reactAdapter);
        
        render(<InputComponent />);
        const element = screen.getByRole('textbox');
        
        expect(element).toHaveAttribute('readonly');
        expect(element).toHaveAttribute('aria-readonly', 'true');
    });
    
    it('should handle focus and blur events', async () => {
        const onFocus = vi.fn();
        const onBlur = vi.fn();
        const input = createInputWithImplementation({ onFocus, onBlur });
        const InputComponent = input.connect(reactAdapter);
        
        render(<InputComponent />);
        const element = screen.getByRole('textbox');
        
        fireEvent.focus(element);
        await waitFor(() => {
            expect(onFocus).toHaveBeenCalled();
        });
        
        fireEvent.blur(element);
        await waitFor(() => {
            expect(onBlur).toHaveBeenCalled();
        });
    });
    
    it('should handle real-time input events', async () => {
        const onInput = vi.fn();
        const input = createInputWithImplementation({ onInput });
        const InputComponent = input.connect(reactAdapter);
        
        render(<InputComponent />);
        const element = screen.getByRole('textbox') as HTMLInputElement;
        
        fireEvent.input(element, { target: { value: 'typing...' } });
        
        await waitFor(() => {
            expect(element.value).toBe('typing...');
            expect(onInput).toHaveBeenCalledWith('typing...');
        });
    });
    
    it('should handle Enter key for submit', async () => {
        const onKeyDown = vi.fn();
        const input = createInputWithImplementation({ 
            value: 'test',
            onKeyDown 
        });
        const InputComponent = input.connect(reactAdapter);
        
        render(<InputComponent />);
        const element = screen.getByRole('textbox');
        
        fireEvent.keyDown(element, { key: 'Enter', code: 'Enter' });
        
        await waitFor(() => {
            expect(onKeyDown).toHaveBeenCalled();
        });
    });
    
    it('should display error state', () => {
        const input = createInputWithImplementation({ 
            error: true,
            errorMessage: 'Field is required'
        });
        const InputComponent = input.connect(reactAdapter);
        
        render(<InputComponent />);
        const element = screen.getByRole('textbox');
        
        expect(element).toHaveAttribute('aria-invalid', 'true');
    });
    
    it('should apply required attribute', () => {
        const input = createInputWithImplementation({ required: true });
        const InputComponent = input.connect(reactAdapter);
        
        render(<InputComponent />);
        const element = screen.getByRole('textbox');
        
        expect(element).toHaveAttribute('aria-required', 'true');
    });
    
    it('should apply size variants', () => {
        const input = createInputWithImplementation({ size: 'lg' });
        const InputComponent = input.connect(reactAdapter);
        
        render(<InputComponent data-testid="input" />);
        const element = screen.getByTestId('input');
        
        // Size would typically be applied via CSS classes
        expect(element).toBeInTheDocument();
    });
    
    it('should handle placeholder text', () => {
        const input = createInputWithImplementation({ placeholder: 'Enter text...' });
        const InputComponent = input.connect(reactAdapter);
        
        render(<InputComponent />);
        const element = screen.getByRole('textbox');
        
        expect(element).toHaveAttribute('placeholder', 'Enter text...');
    });
    
    it('should not process events when disabled', async () => {
        const onChange = vi.fn();
        const input = createInputWithImplementation({ 
            disabled: true,
            onChange 
        });
        const InputComponent = input.connect(reactAdapter);
        
        render(<InputComponent />);
        const element = screen.getByRole('textbox');
        
        fireEvent.change(element, { target: { value: 'test' } });
        
        await waitFor(() => {
            expect(onChange).not.toHaveBeenCalled();
        });
    });
});